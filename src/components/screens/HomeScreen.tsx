import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  ChevronRight, 
  Calendar, 
  Activity, 
  Globe, 
  Bell, 
  AlertTriangle,
  RotateCw,
  Plus
} from 'lucide-react';
import { ProtectionState } from '../../types';

interface HomeScreenProps {
  protectionState: ProtectionState;
  stats: {
    blockedToday: number;
    blockedThisWeek: number;
    totalBlocked: number;
    activeRulesCount: number;
  };
  onNavigateTab: (tab: 'blocklist' | 'activity' | 'settings') => void;
  onOpenAddModal: () => void;
  onOpenSchedules: () => void;
  onOpenTester: () => void;
  onGrantPermission: () => void;
  onReconnectVpn: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  protectionState,
  stats,
  onNavigateTab,
  onOpenAddModal,
  onOpenSchedules,
  onOpenTester,
  onGrantPermission,
  onReconnectVpn,
}) => {
  return (
    <div className="space-y-5 animate-fade-in pb-4">
      
      {/* Top Header matching reference screen 6 */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1677FF] text-white flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#17365D] tracking-tight leading-tight">
              ShieldNet
            </h1>
            <p className="text-[11px] font-medium text-[#64748B]">
              Website Firewall
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTester}
          className="p-2 text-[#64748B] hover:text-[#1677FF] hover:bg-[#F0F6FF] rounded-full transition-colors relative"
          title="Test website access in browser"
          aria-label="Test website filtering"
        >
          <Bell className="w-5 h-5" />
          {stats.activeRulesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#1677FF] absolute top-1.5 right-1.5" />
          )}
        </button>
      </div>

      {/* Main Protection Card matching screen 6 circular visual */}
      <div className="bg-white border border-[#DCE7F5] rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(23,54,93,0.03)] space-y-4">
        
        {protectionState === 'ACTIVE' && (
          <>
            {/* Active Green Circular Graphic */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#14B88A]/10 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-[#14B88A] text-white flex items-center justify-center shadow-lg shadow-[#14B88A]/25">
                <ShieldCheck className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#17365D]">
                Protection is active
              </h2>
              <p className="text-xs text-[#64748B]">
                {stats.activeRulesCount > 0
                  ? `${stats.activeRulesCount} websites are actively being filtered`
                  : 'Ready to filter websites on this device'}
              </p>
            </div>

            {/* Connected pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F9F4] text-[#14B88A] text-xs font-semibold border border-[#14B88A]/30">
              <span className="w-2 h-2 rounded-full bg-[#14B88A]" />
              <span>Connected</span>
            </div>
          </>
        )}

        {protectionState === 'CONFIG_INCOMPLETE' && (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F0F6FF] border-2 border-[#1677FF]/40 text-[#1677FF] flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#17365D]">
                Filtering configuration incomplete
              </h2>
              <p className="text-xs text-[#64748B]">
                Your device firewall is ready, but your blocklist has no active rules.
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Website</span>
            </button>
          </>
        )}

        {protectionState === 'PERMISSION_REQUIRED' && (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FEF3C7] border-2 border-[#F59E0B] text-[#F59E0B] flex items-center justify-center">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#17365D]">
                VPN permission required
              </h2>
              <p className="text-xs text-[#64748B]">
                Android needs your consent to route DNS through the local loopback sinkhole.
              </p>
            </div>

            <button
              onClick={onGrantPermission}
              className="min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Grant Permission</span>
            </button>
          </>
        )}

        {(protectionState === 'INTERRUPTED' || protectionState === 'SETUP_REQUIRED') && (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FEE2E2] border-2 border-[#E5484D] text-[#E5484D] flex items-center justify-center">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#17365D]">
                Protection interrupted
              </h2>
              <p className="text-xs text-[#64748B]">
                The VPN service was paused. Website filtering is not currently active.
              </p>
            </div>

            <button
              onClick={onReconnectVpn}
              className="min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <RotateCw className="w-4 h-4" />
              <span>Reconnect Now</span>
            </button>
          </>
        )}

        {/* 2-Column Statistics (REAL DATA ONLY - Never fabricated) */}
        <div className="pt-2 grid grid-cols-2 gap-3 border-t border-[#F0F6FF]">
          <div className="bg-[#F0F6FF] rounded-2xl p-3 text-left">
            <span className="text-[11px] font-medium text-[#64748B]">
              Blocked today
            </span>
            <div className="text-2xl font-bold text-[#17365D] font-mono tabular-nums mt-0.5">
              {stats.blockedToday}
            </div>
          </div>

          <div className="bg-[#F0F6FF] rounded-2xl p-3 text-left">
            <span className="text-[11px] font-medium text-[#64748B]">
              Total blocked
            </span>
            <div className="text-2xl font-bold text-[#17365D] font-mono tabular-nums mt-0.5">
              {stats.totalBlocked}
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions List matching screen 6 */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
          Quick actions
        </h3>

        <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-sm">
          
          <button
            onClick={() => onNavigateTab('blocklist')}
            className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Manage blocklist
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Add or remove restricted websites
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          <button
            onClick={onOpenSchedules}
            className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Set schedule
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Choose when to enforce blocking
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          <button
            onClick={() => onNavigateTab('activity')}
            className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  View activity
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Inspect live intercepted connection logs
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          <button
            onClick={onOpenTester}
            className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between text-left hover:bg-[#F0F6FF]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#14B88A] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  Test website in browser
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Verify device-level blocking across all browsers
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

        </div>
      </div>

    </div>
  );
};
