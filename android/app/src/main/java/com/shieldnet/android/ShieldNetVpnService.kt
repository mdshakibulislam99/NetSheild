package com.shieldnet.android

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import android.util.Log
import androidx.core.app.NotificationCompat
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import java.nio.ByteBuffer

class ShieldNetVpnService : VpnService(), Runnable {

    companion object {
        const val ACTION_START = "com.shieldnet.android.START"
        const val ACTION_STOP = "com.shieldnet.android.STOP"
        private const val TAG = "ShieldNetVPN"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "shieldnet_protection_channel"
        private const val VPN_DNS_LOCAL_IP = "10.1.10.1"
    }

    private var vpnInterface: ParcelFileDescriptor? = null
    private var workerThread: Thread? = null
    @Volatile private var isRunning = false

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> stopVpn()
            else -> startVpn()
        }
        return START_STICKY
    }

    private fun startVpn() {
        if (isRunning) return
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildForegroundNotification())

        isRunning = true
        workerThread = Thread(this, "ShieldNetVpnWorker").apply { start() }
    }

    private fun stopVpn() {
        isRunning = false
        workerThread?.interrupt()
        workerThread = null
        try {
            vpnInterface?.close()
        } catch (e: Exception) {
            Log.e(TAG, "Error closing VPN interface", e)
        }
        vpnInterface = null
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun run() {
        var upstreamSocket: DatagramSocket? = null
        try {
            // Establish local loopback TUN interface catching DNS traffic
            val builder = Builder()
                .setSession("ShieldNet Device Firewall")
                .addAddress(VPN_DNS_LOCAL_IP, 32)
                .addDnsServer(VPN_DNS_LOCAL_IP) // Direct system DNS lookups to local interface
                .addRoute(VPN_DNS_LOCAL_IP, 32)
                .setMtu(1500)
                .setBlocking(true)

            vpnInterface = builder.establish()
            val vpnFd = vpnInterface?.fileDescriptor ?: return
            val input = FileInputStream(vpnFd)
            val output = FileOutputStream(vpnFd)
            val packet = ByteBuffer.allocate(32767)

            Log.i(TAG, "ShieldNet Protection is ACTIVE. Intercepting device DNS queries.")

            // Protect upstream socket to resolve non-restricted domains via Cloudflare clean DNS
            val upstreamDns = InetAddress.getByName("1.1.1.1")
            upstreamSocket = DatagramSocket()
            protect(upstreamSocket)

            while (isRunning && !Thread.currentThread().isInterrupted) {
                packet.clear()
                val length = input.read(packet.array())
                if (length > 0) {
                    packet.limit(length)
                    handlePacket(packet, output, upstreamSocket, upstreamDns)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "VPN service loop encountered exception", e)
        } finally {
            upstreamSocket?.close()
            isRunning = false
        }
    }

    private fun handlePacket(
        packet: ByteBuffer,
        vpnOutput: FileOutputStream,
        upstreamSocket: DatagramSocket,
        upstreamDns: InetAddress
    ) {
        val domain = DnsPacketParser.extractQueryDomain(packet)
        if (domain != null) {
            val isBlocked = BlocklistManager.isDomainBlocked(applicationContext, domain)
            if (isBlocked) {
                Log.w(TAG, "SINKHOLE: Blocking domain across device -> $domain")
                // Return immediate 0.0.0.0 sinkhole DNS answer
                val sinkholeResponse = DnsPacketParser.buildSinkholeResponse(packet)
                vpnOutput.write(sinkholeResponse)
                return
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "ShieldNet Firewall Status",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows active device-level website restriction status"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun buildForegroundNotification(): Notification {
        val launchIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("ShieldNet Protection Active")
            .setContentText("Restricting unwanted websites across all browsers")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }
}
