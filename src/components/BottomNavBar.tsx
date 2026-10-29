import React from 'react';
import { Home, Shield, Activity, Settings } from 'lucide-react';

export type NavTab = 'home' | 'blocklist' | 'activity' | 'settings';

interface BottomNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeRulesCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  activeRulesCount,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'blocklist' as NavTab, label: 'Blocklist', icon: Shield, badge: activeRulesCount > 0 ? activeRulesCount : undefined },
    { id: 'activity' as NavTab, label: 'Activity', icon: Activity },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full bg-white border-t border-[#DCE7F5] shadow-[0_-2px_10px_rgba(23,54,93,0.04)]"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-4 h-16 items-center px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors relative ${
                isActive ? 'text-[#1677FF]' : 'text-[#64748B] hover:text-[#17365D]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#1677FF] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  isActive ? 'font-semibold text-[#1677FF]' : 'font-normal text-[#64748B]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
