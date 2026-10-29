package com.shieldnet.android

import java.nio.ByteBuffer

/**
 * Parses raw IPv4 UDP packets on port 53 and builds instant 0.0.0.0 sinkhole DNS responses.
 */
object DnsPacketParser {

    /**
     * Extracts the requested domain name from an IP/UDP DNS packet buffer.
     * Returns null if packet is not a valid standard DNS query.
     */
    fun extractQueryDomain(packet: ByteBuffer): String? {
        try {
            if (packet.remaining() < 28) return null

            val originalPos = packet.position()
            val versionAndIHL = packet.get(originalPos).toInt() and 0xFF
            val ipHeaderLength = (versionAndIHL and 0x0F) * 4
            val protocol = packet.get(originalPos + 9).toInt() and 0xFF

            // Protocol 17 = UDP
            if (protocol != 17) return null

            val udpHeaderPos = originalPos + ipHeaderLength
            val destPort = packet.getShort(udpHeaderPos + 2).toInt() and 0xFFFF

            // DNS standard query destination port = 53
            if (destPort != 53) return null

            val dnsHeaderPos = udpHeaderPos + 8
            val qdCount = packet.getShort(dnsHeaderPos + 4).toInt() and 0xFFFF
            if (qdCount < 1) return null

            // Read QNAME labels starting right after the 12-byte DNS header
            var currentPos = dnsHeaderPos + 12
            val domainBuilder = StringBuilder()

            while (currentPos < packet.limit()) {
                val labelLength = packet.get(currentPos).toInt() and 0xFF
                currentPos++

                if (labelLength == 0) break // End of QNAME
                if (labelLength > 63) return null // Compressed pointer in question not standard

                if (domainBuilder.isNotEmpty()) {
                    domainBuilder.append('.')
                }

                val labelBytes = ByteArray(labelLength)
                for (i in 0 until labelLength) {
                    if (currentPos < packet.limit()) {
                        labelBytes[i] = packet.get(currentPos)
                        currentPos++
                    }
                }
                domainBuilder.append(String(labelBytes, Charsets.US_ASCII))
            }

            return if (domainBuilder.isNotEmpty()) domainBuilder.toString().lowercase() else null
        } catch (e: Exception) {
            return null
        }
    }

    /**
     * Constructs a valid DNS sinkhole response answering with 0.0.0.0 (TTL 300).
     */
    fun buildSinkholeResponse(queryPacket: ByteBuffer): ByteArray {
        val originalPos = queryPacket.position()
        val versionAndIHL = queryPacket.get(originalPos).toInt() and 0xFF
        val ipHeaderLength = (versionAndIHL and 0x0F) * 4
        val udpHeaderPos = originalPos + ipHeaderLength
        val dnsHeaderPos = udpHeaderPos + 8

        val queryLength = queryPacket.limit() - originalPos
        val response = ByteArray(queryLength + 16) // Answer RR takes 16 bytes for A record

        // Copy original query packet
        System.arraycopy(queryPacket.array(), originalPos, response, 0, queryLength)

        // Swap IP addresses (Src <-> Dst)
        for (i in 0 until 4) {
            val srcByte = response[12 + i]
            response[12 + i] = response[16 + i]
            response[16 + i] = srcByte
        }

        // Swap UDP ports (Src Port <-> Dst Port)
        val srcPort = queryPacket.getShort(udpHeaderPos)
        val dstPort = queryPacket.getShort(udpHeaderPos + 2)
        response[ipHeaderLength] = (dstPort.toInt() shr 8).toByte()
        response[ipHeaderLength + 1] = dstPort.toByte()
        response[ipHeaderLength + 2] = (srcPort.toInt() shr 8).toByte()
        response[ipHeaderLength + 3] = srcPort.toByte()

        // Set DNS Flags: 0x8180 (Response, Opcode 0, Authoritative 0, Recursion Desired/Available, No error)
        val dnsOffset = dnsHeaderPos - originalPos
        response[dnsOffset + 2] = 0x81.toByte()
        response[dnsOffset + 3] = 0x80.toByte()

        // Set ANCOUNT = 1 (1 Answer Record)
        response[dnsOffset + 6] = 0x00.toByte()
        response[dnsOffset + 7] = 0x01.toByte()

        // Append Answer RR:
        // Name pointer 0xC00C (points to QNAME at DNS header + 12)
        var ansPos = queryLength
        response[ansPos++] = 0xC0.toByte()
        response[ansPos++] = 0x0C.toByte()

        // Type 1 (A record)
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x01.toByte()

        // Class 1 (IN)
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x01.toByte()

        // TTL (300 seconds)
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x01.toByte()
        response[ansPos++] = 0x2C.toByte()

        // Data Length (4 bytes for IPv4)
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x04.toByte()

        // RDATA = 0.0.0.0 (Sinkhole Address)
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x00.toByte()
        response[ansPos++] = 0x00.toByte()

        // Update Total Length in IP header
        val totalLength = ansPos
        response[2] = (totalLength shr 8).toByte()
        response[3] = totalLength.toByte()

        // Update UDP Length
        val udpLength = totalLength - ipHeaderLength
        response[ipHeaderLength + 4] = (udpLength shr 8).toByte()
        response[ipHeaderLength + 5] = udpLength.toByte()

        // Reset UDP Checksum to 0 (optional for IPv4 UDP)
        response[ipHeaderLength + 6] = 0.toByte()
        response[ipHeaderLength + 7] = 0.toByte()

        return response.copyOf(ansPos)
    }
}
