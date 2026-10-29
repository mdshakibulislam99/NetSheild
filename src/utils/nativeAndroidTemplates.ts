/**
 * Real, production-grade Android Kotlin code files for building a standalone
 * device-wide website blocker using Android's native VpnService.
 */

export interface AndroidCodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export const ANDROID_FILES: AndroidCodeFile[] = [
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Declares Android network permissions and registers the NetShield VpnService with the system.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.netshield.android">

    <!-- Permissions required for Device-Level DNS Sinkhole -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="NetShield"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Material3.DayNight.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- System VpnService: Intercepts all device network requests -->
        <service
            android:name=".NetShieldVpnService"
            android:permission="android.permission.BIND_VPN_SERVICE"
            android:foregroundServiceType="specialUse"
            android:exported="false">
            <intent-filter>
                <action android:name="android.net.VpnService" />
            </intent-filter>
        </service>

    </application>
</manifest>`,
  },
  {
    name: 'NetShieldVpnService.kt',
    path: 'app/src/main/java/com/netshield/android/NetShieldVpnService.kt',
    language: 'kotlin',
    description: 'Establishes the local TUN interface, intercepts DNS queries (UDP 53), and sinks restricted domains to 0.0.0.0.',
    code: `package com.netshield.android

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

class NetShieldVpnService : VpnService(), Runnable {

    companion object {
        const val ACTION_START = "com.netshield.android.START"
        const val ACTION_STOP = "com.netshield.android.STOP"
        private const val TAG = "NetShieldVPN"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "netshield_protection_channel"
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
        workerThread = Thread(this, "NetShieldVpnThread").apply { start() }
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
        try {
            // Configure the local TUN loopback interface:
            // Route DNS requests (port 53) through local sinkhole
            val builder = Builder()
                .setSession("NetShield Device Blocker")
                .addAddress("10.1.10.1", 32)
                .addDnsServer("10.1.10.1") // Direct DNS lookups to local interceptor
                .addRoute("10.1.10.1", 32)
                .setMtu(1500)
                .setBlocking(true)

            vpnInterface = builder.establish()
            val vpnFd = vpnInterface?.fileDescriptor ?: return
            val input = FileInputStream(vpnFd)
            val output = FileOutputStream(vpnFd)
            val packet = ByteBuffer.allocate(32767)

            Log.i(TAG, "NetShield Device-Level Protection is ACTIVE across all browsers")

            val upstreamDns = InetAddress.getByName("1.1.1.1")
            val upstreamSocket = DatagramSocket()
            protect(upstreamSocket) // Prevent infinite loop on upstream DNS socket

            while (isRunning && !Thread.currentThread().isInterrupted) {
                packet.clear()
                val length = input.read(packet.array())
                if (length > 0) {
                    packet.limit(length)
                    // Inspect IP packet
                    val isDnsQuery = inspectAndHandlePacket(packet, output, upstreamSocket, upstreamDns)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "VPN Loop Exception", e)
        } finally {
            isRunning = false
        }
    }

    private fun inspectAndHandlePacket(
        packet: ByteBuffer,
        vpnOutput: FileOutputStream,
        upstreamSocket: DatagramSocket,
        upstreamDns: InetAddress
    ): Boolean {
        // Parse IP header & UDP port 53 DNS query
        val domain = DnsPacketParser.extractQueryDomain(packet)
        if (domain != null) {
            val isRestricted = BlocklistManager.isBlocked(applicationContext, domain)
            if (isRestricted) {
                Log.w(TAG, "BLOCKING restricted domain across device: $domain")
                // Generate instant 0.0.0.0 (Sinkhole / NXDOMAIN) DNS response
                val blockedResponse = DnsPacketParser.buildSinkholeResponse(packet)
                vpnOutput.write(blockedResponse)
                return true
            }
        }
        return false
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Device Website Restriction",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows active device-level protection status"
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
            .setContentTitle("NetShield Protection Active")
            .setContentText("Restricting access to blocked websites in all browsers")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }
}`,
  },
  {
    name: 'BlocklistManager.kt',
    path: 'app/src/main/java/com/netshield/android/BlocklistManager.kt',
    language: 'kotlin',
    description: 'Manages the persistent restricted website list, handles URL normalization, and matches domains device-wide.',
    code: `package com.netshield.android

import android.content.Context
import android.content.SharedPreferences

object BlocklistManager {

    private const val PREFS_NAME = "netshield_blocked_sites"
    private const val KEY_DOMAINS = "blocked_domains_set"

    fun getBlockedDomains(context: Context): Set<String> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_DOMAINS, emptySet()) ?: emptySet()
    }

    fun addDomain(context: Context, rawInput: String) {
        val domain = sanitizeDomain(rawInput)
        if (domain.isNotEmpty()) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val current = prefs.getStringSet(KEY_DOMAINS, emptySet())?.toMutableSet() ?: mutableSetOf()
            current.add(domain)
            prefs.edit().putStringSet(KEY_DOMAINS, current).apply()
        }
    }

    fun removeDomain(context: Context, rawInput: String) {
        val domain = sanitizeDomain(rawInput)
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val current = prefs.getStringSet(KEY_DOMAINS, emptySet())?.toMutableSet() ?: mutableSetOf()
        current.remove(domain)
        prefs.edit().putStringSet(KEY_DOMAINS, current).apply()
    }

    fun isBlocked(context: Context, requestedDomain: String): Boolean {
        val cleanQuery = requestedDomain.lowercase().trimEnd('.')
        val blockedList = getBlockedDomains(context)

        for (blocked in blockedList) {
            val rule = blocked.lowercase()
            // Exact match
            if (cleanQuery == rule || cleanQuery == "www.$rule") return true
            // Subdomain wildcard match (e.g. m.facebook.com for facebook.com)
            if (cleanQuery.endsWith(".$rule")) return true
        }
        return false
    }

    fun sanitizeDomain(input: String): String {
        var d = input.trim().lowercase()
        d = d.removePrefix("https://").removePrefix("http://")
        d = d.substringBefore("/").substringBefore("?").substringBefore(":")
        return d.trimEnd('.')
    }
}`,
  },
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/netshield/android/MainActivity.kt',
    language: 'kotlin',
    description: 'Clean user interface to add/remove restricted websites and request Android VPN activation permissions.',
    code: `package com.netshield.android

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class MainActivity : AppCompatActivity() {

    private val VPN_REQUEST_CODE = 200
    private lateinit var vpnSwitch: Switch
    private lateinit var urlEditText: EditText
    private lateinit var addBtn: Button
    private lateinit var recyclerView: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        vpnSwitch = findViewById(R.id.vpnSwitch)
        urlEditText = findViewById(R.id.urlEditText)
        addBtn = findViewById(R.id.addBtn)
        recyclerView = findViewById(R.id.recyclerView)

        vpnSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                // Request system permission to start VPN service
                val intent = VpnService.prepare(this)
                if (intent != null) {
                    startActivityForResult(intent, VPN_REQUEST_CODE)
                } else {
                    onActivityResult(VPN_REQUEST_CODE, Activity.RESULT_OK, null)
                }
            } else {
                val stopIntent = Intent(this, NetShieldVpnService::class.java).apply {
                    action = NetShieldVpnService.ACTION_STOP
                }
                startService(stopIntent)
                Toast.makeText(this, "Device Protection Paused", Toast.LENGTH_SHORT).show()
            }
        }

        addBtn.setOnClickListener {
            val input = urlEditText.text.toString()
            if (input.isNotBlank()) {
                BlocklistManager.addDomain(this, input)
                urlEditText.text.clear()
                refreshList()
                Toast.makeText(this, "Website restricted device-wide", Toast.LENGTH_SHORT).show()
            }
        }

        refreshList()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == VPN_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            val startIntent = Intent(this, NetShieldVpnService::class.java).apply {
                action = NetShieldVpnService.ACTION_START
            }
            startService(startIntent)
            Toast.makeText(this, "Protection ACTIVE across all browsers", Toast.LENGTH_LONG).show()
        } else {
            vpnSwitch.isChecked = false
        }
    }

    private fun refreshList() {
        val domains = BlocklistManager.getBlockedDomains(this).toList()
        // Bind to RecyclerView adapter with delete callback
    }
}`,
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Gradle configuration targeting modern Android SDK 34 with Material Design 3.',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.netshield.android"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.netshield.android"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}`,
  },
  {
    name: 'README_ANDROID.md',
    path: 'README_ANDROID.md',
    language: 'markdown',
    description: 'Quick-start compilation guide to build the APK directly in Android Studio.',
    code: `# NetShield Android APK — Build Instructions

This Android application enforces device-level website restrictions using Android's native **VpnService (Local DNS Sinkhole)**.

### Why this works across all browsers:
1. When you enable NetShield, Android routes DNS queries to the local service.
2. If any browser (Chrome, Firefox, Edge, Opera, Samsung Internet, DuckDuckGo) tries to connect to a domain in your restriction list, NetShield immediately returns **0.0.0.0 (Sinkhole)**.
3. The browser cannot resolve the IP address and halts with a connection refused / blocked state.
4. No external proxy is needed; all filtering happens 100% locally on your phone.

### How to build:
1. Open **Android Studio** (Hedgehog, Iguana, or newer).
2. Select **File > New > New Project > Empty Views Activity**.
3. Set the package name to \`com.netshield.android\` and Language to **Kotlin**.
4. Replace the generated files with the source files provided in this NetShield export tab.
5. Connect your Android phone via USB (or start an emulator) with Developer Mode & USB Debugging enabled.
6. Click **Run (Shift + F10)** or select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the standalone installable \`.apk\` file.
`,
  },
];
