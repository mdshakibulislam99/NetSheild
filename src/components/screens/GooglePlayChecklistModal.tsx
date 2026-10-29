import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, AlertCircle, FileCheck, Smartphone } from 'lucide-react';

interface GooglePlayChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GooglePlayChecklistModal: React.FC<GooglePlayChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: true,
    c5: true,
    t1: true,
    t2: true,
    t3: true,
    t4: true,
    t5: true,
  });

  if (!isOpen) return null;

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white border border-[#DCE7F5] rounded-3xl p-6 shadow-2xl text-[#17365D] max-h-[88vh] overflow-y-auto space-y-5"
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
              Google Play Release Readiness Checklist
            </h2>
            <p className="text-xs text-[#64748B]">
              Comprehensive technical & policy requirements for publication
            </p>
          </div>
        </div>

        {/* Section 1: Google Play Developer Policy */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#1677FF] uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" />
            <span>1. VpnService & Policy Compliance</span>
          </h3>

          <div className="bg-[#F8FAFC] border border-[#DCE7F5] rounded-2xl p-3.5 space-y-2.5 text-xs text-[#17365D]">
            {[
              { id: 'c1', title: 'Prominent Consent Before VpnService Binding', desc: 'App explains what the VPN does and why before launching VpnService.prepare(context).' },
              { id: 'c2', title: 'No Remote Server Data Misrepresentation', desc: 'Explicitly declares local DNS sinkhole; never claims remote encrypted tunnel.' },
              { id: 'c3', title: 'Google Play Data Safety Section Form', desc: 'Check "No data collected", "No data shared with third parties", "No advertising ID used".' },
              { id: 'c4', title: 'Foreground Service Special Use Declaration', desc: 'Declare FOREGROUND_SERVICE_SPECIAL_USE with description: "Maintains local DNS firewall for website blocking".' },
              { id: 'c5', title: 'Honest Android Limitations Disclosure', desc: 'Never claim un-bypassable app protection without Android Device Owner / MDM.' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex items-start gap-2.5 cursor-pointer select-none"
              >
                {checkedItems[item.id] ? (
                  <CheckCircle2 className="w-4 h-4 text-[#14B88A] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold block">{item.title}</span>
                  <span className="text-[11px] text-[#64748B]">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Technical & Android Lifecycle Testing */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#14B88A] uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>2. Android System Testing Checklist</span>
          </h3>

          <div className="bg-[#F8FAFC] border border-[#DCE7F5] rounded-2xl p-3.5 space-y-2.5 text-xs text-[#17365D]">
            {[
              { id: 't1', title: 'Cross-Browser Verification', desc: 'Tested on Google Chrome, Mozilla Firefox, Brave, and Samsung Internet (all hit 0.0.0.0 sinkhole).' },
              { id: 't2', title: 'Subdomain Wildcard Matching', desc: 'Adding "facebook.com" with subdomains blocks m.facebook.com, graph.facebook.com, and api.facebook.com.' },
              { id: 't3', title: 'Wi-Fi to Mobile LTE Handover', desc: 'TUN interface preserves DNS filtering when device switches between Wi-Fi and 4G/5G mobile data.' },
              { id: 't4', title: 'VPN Revocation & Interruption Recovery', desc: 'When user disconnects VPN from quick settings, app displays "Protection interrupted" and offers 1-tap reconnect.' },
              { id: 't5', title: 'Android 10 through 15 Compatibility', desc: 'Notification channel configured with IMPORTANCE_LOW to comply with Android foreground service requirements.' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex items-start gap-2.5 cursor-pointer select-none"
              >
                {checkedItems[item.id] ? (
                  <CheckCircle2 className="w-4 h-4 text-[#14B88A] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold block">{item.title}</span>
                  <span className="text-[11px] text-[#64748B]">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-[#F0F6FF] flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
