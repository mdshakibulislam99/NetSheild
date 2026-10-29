import React, { useState } from 'react';
import { 
  Activity, 
  Trash2, 
  Globe, 
  ShieldCheck, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { ActivityEvent } from '../../types';

interface ActivityScreenProps {
  activityLogs: ActivityEvent[];
  stats: {
    blockedToday: number;
    blockedThisWeek: number;
    totalBlocked: number;
  };
  onClearHistory: () => void;
  onOpenTester: () => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  activityLogs,
  stats,
  onClearHistory,
  onOpenTester,
}) => {
  const [filter, setFilter] = useState<'all' | 'blocked' | 'allowed'>('all');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const filteredLogs = activityLogs.filter((log) => {
    if (filter === 'blocked') return log.status === 'BLOCKED';
    if (filter === 'allowed') return log.status === 'ALLOWED';
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Top Header matching reference screen 11 */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-[#17365D] tracking-tight">
            Activity
          </h1>
          <p className="text-xs text-[#64748B]">
            Real locally observed network & DNS events
          </p>
        </div>

        {activityLogs.length > 0 && (
          <button
            onClick={() => {
              if (isConfirmingClear) {
                onClearHistory();
                setIsConfirmingClear(false);
              } else {
                setIsConfirmingClear(true);
                setTimeout(() => setIsConfirmingClear(false), 3000);
              }
            }}
            className={`min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              isConfirmingClear
                ? 'bg-[#E5484D] text-white border-[#E5484D]'
                : 'bg-white text-[#64748B] hover:text-[#E5484D] border-[#DCE7F5]'
            }`}
            title={isConfirmingClear ? "Click again to confirm clearing all history" : "Clear history"}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isConfirmingClear ? 'Confirm Clear' : 'Clear'}</span>
          </button>
        )}
      </div>

      {/* Filter Chips matching screen 11: All, Blocked, Allowed */}
      <div className="flex items-center gap-1.5 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`min-h-[36px] px-4 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#1677FF] text-white font-semibold'
              : 'bg-white text-[#64748B] hover:text-[#17365D] border border-[#DCE7F5]'
          }`}
        >
          All ({activityLogs.length})
        </button>
        <button
          onClick={() => setFilter('blocked')}
          className={`min-h-[36px] px-4 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'blocked'
              ? 'bg-[#E5484D] text-white font-semibold'
              : 'bg-white text-[#64748B] hover:text-[#17365D] border border-[#DCE7F5]'
          }`}
        >
          Blocked ({activityLogs.filter((l) => l.status === 'BLOCKED').length})
        </button>
        <button
          onClick={() => setFilter('allowed')}
          className={`min-h-[36px] px-4 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'allowed'
              ? 'bg-[#14B88A] text-white font-semibold'
              : 'bg-white text-[#64748B] hover:text-[#17365D] border border-[#DCE7F5]'
          }`}
        >
          Allowed ({activityLogs.filter((l) => l.status === 'ALLOWED').length})
        </button>
      </div>

      {/* Metric Cards matching screen 11: Today vs This week */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#DCE7F5] rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B]">Today</span>
          <div className="text-2xl font-bold text-[#17365D] font-mono tabular-nums mt-0.5">
            {stats.blockedToday}
          </div>
          <span className="text-[11px] text-[#64748B]">Blocked attempts</span>
        </div>

        <div className="bg-white border border-[#DCE7F5] rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B]">This week</span>
          <div className="text-2xl font-bold text-[#17365D] font-mono tabular-nums mt-0.5">
            {stats.blockedThisWeek}
          </div>
          <span className="text-[11px] text-[#64748B]">Blocked attempts</span>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-1">
          Recent activity
        </h3>

        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-[#DCE7F5] rounded-3xl p-8 text-center space-y-3 shadow-2xs my-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#17365D]">
                No activity recorded yet
              </h3>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                Real connection events appear here when browsers or apps attempt to resolve websites on your device.
              </p>
            </div>
            <button
              onClick={onOpenTester}
              className="min-h-[44px] px-4 py-2 bg-[#F0F6FF] hover:bg-[#E5F0FF] text-[#1677FF] font-semibold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors border border-[#DCE7F5]"
            >
              <Globe className="w-4 h-4" />
              <span>Test a website request now</span>
            </button>
          </div>
        ) : (
          <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-2xs">
            {filteredLogs.map((log) => {
              const isBlocked = log.status === 'BLOCKED';
              const dateObj = new Date(log.timestamp);
              const timeStr = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const dateStr = dateObj.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={log.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F0F6FF]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isBlocked
                          ? 'bg-[#FEE2E2] text-[#E5484D] border-[#FCA5A5]'
                          : 'bg-[#E6F9F4] text-[#14B88A] border-[#A7F3D0]'
                      }`}
                    >
                      {isBlocked ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#17365D] font-mono truncate">
                          {log.domain}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                        <span>{dateStr} · {timeStr}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{log.connectionType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill matching screen 11 */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${
                      isBlocked
                        ? 'bg-[#FEE2E2] text-[#E5484D] border border-[#FCA5A5]'
                        : 'bg-[#E6F9F4] text-[#14B88A] border border-[#A7F3D0]'
                    }`}
                  >
                    {isBlocked ? 'Blocked' : 'Allowed'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
