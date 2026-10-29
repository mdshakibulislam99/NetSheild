import React from 'react';
import { ArrowLeft, Shield, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white border border-[#DCE7F5] rounded-3xl p-6 shadow-2xl text-[#17365D] max-h-[88vh] overflow-y-auto space-y-4"
        role="dialog"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-[#F0F6FF]">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-[#17365D]">
              ShieldNet Privacy Policy
            </h2>
            <p className="text-xs text-[#64748B]">
              Google Play VPN Service & Data Safety Compliant
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#64748B]">
          <div className="bg-[#E6F9F4] p-3 rounded-2xl border border-[#14B88A]/30 text-[#14B88A] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>100% On-Device Processing. No Remote Telemetry or Tracking.</span>
          </div>

          <h3 className="text-sm font-bold text-[#17365D] pt-1">
            1. Overview of Core Functionality
          </h3>
          <p>
            ShieldNet is a device-level website restriction firewall for Android. Its sole function is to drop network and DNS connection attempts to domains you explicitly designate in your blocklist or active categories.
          </p>

          <h3 className="text-sm font-bold text-[#17365D] pt-1">
            2. Android VpnService Disclosure & Prominent Consent
          </h3>
          <p>
            In accordance with the Google Play Developer Policy on the VpnService:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[#17365D]">
            <li>
              ShieldNet utilizes the Android <code>VpnService</code> strictly as a local loopback packet sinkhole.
            </li>
            <li>
              <strong>No Remote Proxy or Server:</strong> Your internet traffic is NOT routed to an external proxy or company server.
            </li>
            <li>
              <strong>No Traffic Inspection:</strong> The application does not inspect, read, or alter unencrypted payload contents, messages, passwords, or personal data.
            </li>
          </ul>

          <h3 className="text-sm font-bold text-[#17365D] pt-1">
            3. Data Collection and Retention
          </h3>
          <p>
            ShieldNet does not collect, transmit, sell, or share any personal data or browsing activity. All custom rules and locally recorded activity logs reside exclusively in private local app storage on your device. You can erase all activity history at any time using the "Clear activity history" button in Settings.
          </p>

          <h3 className="text-sm font-bold text-[#17365D] pt-1">
            4. Permissions Required
          </h3>
          <p>
            • <code>android.permission.BIND_VPN_SERVICE</code>: To establish the local loopback interface for DNS interception.<br />
            • <code>android.permission.FOREGROUND_SERVICE</code>: To keep the filtering active when your screen is locked or while switching apps.
          </p>
        </div>

        <div className="pt-3 border-t border-[#F0F6FF] flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
