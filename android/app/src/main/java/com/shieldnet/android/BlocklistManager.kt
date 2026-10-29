package com.shieldnet.android

import android.content.Context
import android.content.SharedPreferences

object BlocklistManager {

    private const val PREFS_NAME = "shieldnet_blocklist_prefs"
    private const val KEY_CUSTOM_DOMAINS = "key_custom_domains"
    private const val KEY_ENABLE_SUBDOMAINS = "key_enable_subdomains"
    private const val KEY_PROTECTION_ENABLED = "key_protection_enabled"

    fun isProtectionEnabled(context: Context): Boolean {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getBoolean(KEY_PROTECTION_ENABLED, true)
    }

    fun setProtectionEnabled(context: Context, enabled: Boolean) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putBoolean(KEY_PROTECTION_ENABLED, enabled).apply()
    }

    fun getBlockedDomains(context: Context): Set<String> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_CUSTOM_DOMAINS, emptySet()) ?: emptySet()
    }

    fun addDomain(context: Context, rawInput: String) {
        val domain = sanitizeDomain(rawInput)
        if (domain.isNotEmpty()) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val current = prefs.getStringSet(KEY_CUSTOM_DOMAINS, emptySet())?.toMutableSet() ?: mutableSetOf()
            current.add(domain)
            prefs.edit().putStringSet(KEY_CUSTOM_DOMAINS, current).apply()
        }
    }

    fun removeDomain(context: Context, rawInput: String) {
        val domain = sanitizeDomain(rawInput)
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val current = prefs.getStringSet(KEY_CUSTOM_DOMAINS, emptySet())?.toMutableSet() ?: mutableSetOf()
        current.remove(domain)
        prefs.edit().putStringSet(KEY_CUSTOM_DOMAINS, current).apply()
    }

    fun isDomainBlocked(context: Context, queryDomain: String): Boolean {
        if (!isProtectionEnabled(context)) return false

        val cleanQuery = queryDomain.lowercase().trimEnd('.')
        val blockedList = getBlockedDomains(context)

        for (rule in blockedList) {
            val cleanRule = rule.lowercase().trimEnd('.')
            // Exact match
            if (cleanQuery == cleanRule || cleanQuery == "www.$cleanRule" || cleanRule == "www.$cleanQuery") {
                return true
            }
            // Subdomain match (e.g. m.facebook.com matches facebook.com)
            if (cleanQuery.endsWith(".$cleanRule")) {
                return true
            }
        }

        return false
    }

    fun sanitizeDomain(input: String): String {
        var d = input.trim().lowercase()
        d = d.removePrefix("https://").removePrefix("http://")
        d = d.substringBefore("/").substringBefore("?").substringBefore(":")
        return d.trimEnd('.')
    }
}
