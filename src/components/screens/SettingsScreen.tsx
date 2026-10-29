import React, { useState } from 'react';
import { 
  Shield, 
  RotateCw, 
  Wifi, 
  Lock, 
  FileText, 
  Trash2, 
  Info, 
  ChevronRight,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onClearHistory: () => void;
  onOpenNativeCode: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenPlayChecklist: () => void;
  onResetOnboarding: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  onOpenNativeCode,
  onOpenPrivacyPolicy,
  onOpenPlayChecklist,
  onResetOnboarding,
}) => {
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    onClearHistory();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-6">
      
      {/* Top Header matching reference screen 13 */}
      <div className="pt-1">
        <h1 className="text-xl font-bold text-[#17365D] tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-[#64748B]">
          Firewall configuration, privacy, and device integration
        </p>
      </div>

      {/* Section 1: Protection matching screen 13 */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
          Protection
        </h3>

        <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-2xs">
          
          {/* Website Filtering */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Website filtering
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Filter matching domain requests on device
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.filterMatchingRequests}
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  filterMatchingRequests: !prev.filterMatchingRequests,
                }))
              }
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                settings.filterMatchingRequests ? 'bg-[#1677FF]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                  settings.filterMatchingRequests ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reconnect Protection */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <RotateCw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Reconnect protection
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Try to recover after network interruption
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.reconnectProtection}
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  reconnectProtection: !prev.reconnectProtection,
                }))
              }
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                settings.reconnectProtection ? 'bg-[#1677FF]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                  settings.reconnectProtection ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Network changes */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Network changes
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Seamless handover between Wi-Fi and mobile data
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.handleNetworkChanges}
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  handleNetworkChanges: !prev.handleNetworkChanges,
                }))
              }
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                settings.handleNetworkChanges ? 'bg-[#1677FF]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                  settings.handleNetworkChanges ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Section 2: Privacy matching screen 13 */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
          Privacy & Data
        </h3>

        <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-2xs">
          
          {/* Local Data */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Local data storage
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Rules and history remain 100% on this phone
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#14B88A] bg-[#E6F9F4] px-2 py-0.5 rounded-full border border-[#14B88A]/30">
              No Cloud Sync
            </span>
          </div>

          {/* Privacy Policy */}
          <button
            onClick={onOpenPrivacyPolicy}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Privacy policy
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Learn what data we collect (Google Play compliant)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          {/* Clear activity history */}
          <button
            onClick={handleClear}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FEE2E2]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E5484D] flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#E5484D] block">
                  Clear activity history
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Delete all locally saved DNS audit records
                </span>
              </div>
            </div>
            {clearedNotice && (
              <span className="text-xs text-[#14B88A] font-semibold">Cleared!</span>
            )}
          </button>

        </div>
      </div>

      {/* Section 3: Android Development & Google Play Preparation */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
          Android APK & Google Play
        </h3>

        <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-2xs">
          
          {/* Native Code Export */}
          <button
            onClick={onOpenNativeCode}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Native Android Kotlin Source
                </span>
                <span className="text-[11px] text-[#64748B]">
                  View VpnService & build APK in Android Studio
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          {/* Google Play Submission Checklist */}
          <button
            onClick={onOpenPlayChecklist}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#14B88A] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Google Play Publication Checklist
                </span>
                <span className="text-[11px] text-[#64748B]">
                  VpnService policy, disclosures, and test matrix
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          {/* Re-run Onboarding */}
          <button
            onClick={onResetOnboarding}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Revisit Onboarding Flow
                </span>
                <span className="text-[11px] text-[#64748B]">
                  View welcome screens and permission guide
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

        </div>
      </div>

      {/* Honest Limitation Callout */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 text-xs text-[#92400E] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          <span>Honest Android System Limitation Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#78350F]">
          Under standard Android security architecture, any regular user can turn off a VPN or uninstall an app from Android Settings unless the device is enrolled in an Android Enterprise / Device Owner (MDM) profile. ShieldNet provides reliable, leak-free device-wide blocking during normal operation without falsifying un-bypassable claims.
        </p>
      </div>

      {/* App Version matching screen 13 */}
      <div className="text-center text-[11px] text-[#64748B] pt-2 space-y-1">
        <div className="font-semibold text-[#17365D]">ShieldNet for Android · Version 1.0.0</div>
        <div>Compliant with Google Play VPN Service Policy</div>
      </div>

    </div>
  );
};
