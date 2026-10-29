package com.shieldnet.android

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SwitchCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class MainActivity : AppCompatActivity() {

    private val VPN_REQUEST_CODE = 1001

    private lateinit var protectionSwitch: SwitchCompat
    private lateinit var statusText: TextView
    private lateinit var domainInput: EditText
    private lateinit var addWebsiteBtn: Button
    private lateinit var domainsRecyclerView: RecyclerView
    private lateinit var adapter: BlockedDomainAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        protectionSwitch = findViewById(R.id.protectionSwitch)
        statusText = findViewById(R.id.statusText)
        domainInput = findViewById(R.id.domainInput)
        addWebsiteBtn = findViewById(R.id.addWebsiteBtn)
        domainsRecyclerView = findViewById(R.id.domainsRecyclerView)

        adapter = BlockedDomainAdapter { domainToRemove ->
            BlocklistManager.removeDomain(this, domainToRemove)
            refreshList()
            Toast.makeText(this, "Removed $domainToRemove", Toast.LENGTH_SHORT).show()
        }

        domainsRecyclerView.layoutManager = LinearLayoutManager(this)
        domainsRecyclerView.adapter = adapter

        val isEnabled = BlocklistManager.isProtectionEnabled(this)
        protectionSwitch.isChecked = isEnabled
        updateStatusDisplay(isEnabled)

        protectionSwitch.setOnCheckedChangeListener { _, isChecked ->
            BlocklistManager.setProtectionEnabled(this, isChecked)
            updateStatusDisplay(isChecked)

            if (isChecked) {
                val prepareIntent = VpnService.prepare(this)
                if (prepareIntent != null) {
                    startActivityForResult(prepareIntent, VPN_REQUEST_CODE)
                } else {
                    onActivityResult(VPN_REQUEST_CODE, Activity.RESULT_OK, null)
                }
            } else {
                val stopIntent = Intent(this, ShieldNetVpnService::class.java).apply {
                    action = ShieldNetVpnService.ACTION_STOP
                }
                startService(stopIntent)
                Toast.makeText(this, "Protection Paused", Toast.LENGTH_SHORT).show()
            }
        }

        addWebsiteBtn.setOnClickListener {
            val text = domainInput.text.toString().trim()
            if (text.isNotEmpty()) {
                BlocklistManager.addDomain(this, text)
                domainInput.text.clear()
                refreshList()
                Toast.makeText(this, "Website restricted device-wide", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Please enter a valid website domain", Toast.LENGTH_SHORT).show()
            }
        }

        refreshList()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == VPN_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            val startIntent = Intent(this, ShieldNetVpnService::class.java).apply {
                action = ShieldNetVpnService.ACTION_START
            }
            startService(startIntent)
            Toast.makeText(this, "ShieldNet Firewall Active", Toast.LENGTH_LONG).show()
        } else {
            protectionSwitch.isChecked = false
            updateStatusDisplay(false)
        }
    }

    private fun updateStatusDisplay(isActive: Boolean) {
        if (isActive) {
            statusText.text = "Protection is Active\nAll listed websites are being restricted"
            statusText.setTextColor(getColor(R.color.colorSuccess))
        } else {
            statusText.text = "Protection is Disabled\nWebsite restrictions are paused"
            statusText.setTextColor(getColor(R.color.colorSecondaryText))
        }
    }

    private fun refreshList() {
        val domains = BlocklistManager.getBlockedDomains(this).sorted()
        adapter.submitList(domains)
    }

    class BlockedDomainAdapter(private val onDeleteClick: (String) -> Unit) :
        RecyclerView.Adapter<BlockedDomainAdapter.ViewHolder>() {

        private val items = mutableListOf<String>()

        fun submitList(newItems: List<String>) {
            items.clear()
            items.addAll(newItems)
            notifyDataSetChanged()
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_blocked_domain, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val domain = items[position]
            holder.domainText.text = domain
            holder.deleteBtn.setOnClickListener { onDeleteClick(domain) }
        }

        override fun getItemCount(): Int = items.size

        class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
            val domainText: TextView = itemView.findViewById(R.id.domainText)
            val deleteBtn: View = itemView.findViewById(R.id.deleteBtn)
        }
    }
}
