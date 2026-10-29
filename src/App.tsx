/**
 * ShieldNet — Complete Android Website-Blocking Firewall Application
 * Full-width responsive layout in pure light theme
 */

import React, { useState } from 'react';
import { useShieldNetEngine } from './hooks/useShieldNetEngine';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { HomeScreen } from './components/screens/HomeScreen';
import { BlocklistScreen } from './components/screens/BlocklistScreen';
import { ActivityScreen } from './components/screens/ActivityScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AddEditWebsiteModal } from './components/screens/AddEditWebsiteModal';
import { WebsiteCategoriesScreen } from './components/screens/WebsiteCategoriesScreen';
import { SchedulesScreen } from './components/screens/SchedulesScreen';
import { DeviceTesterModal } from './components/screens/DeviceTesterModal';
import { PrivacyPolicyModal } from './components/screens/PrivacyPolicyModal';
import { GooglePlayChecklistModal } from './components/screens/GooglePlayChecklistModal';
import { NativeCodeView } from './components/NativeCodeView';
import { OnboardingFlow } from './components/screens/OnboardingFlow';
import { WebsiteRule } from './types';
import { Check, X } from 'lucide-react';

export default function App() {
  const {
    customRules,
    categories,
    schedules,
    activityLogs,
    settings,
    setSettings,
    protectionState,
    stats,
    addWebsiteRule,
    editWebsiteRule,
    toggleWebsiteRule,
    removeWebsiteRule,
    toggleCategory,
    toggleCategoryDomain,
    addSchedule,
    toggleSchedule,
    deleteSchedule,
    clearActivityHistory,
    testDomainRequest,
    grantVpnPermission,
    toggleVpnService,
    completeOnboarding,
    resetOnboarding,
  } = useShieldNetEngine();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [subView, setSubView] = useState<'none' | 'categories' | 'schedules' | 'native-code' | 'onboarding'>('none');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<WebsiteRule | null>(null);
  const [isTesterOpen, setIsTesterOpen] = useState(false);
  const [testerDomain, setTesterDomain] = useState('youtube.com');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isPlayChecklistOpen, setIsPlayChecklistOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditRule = (rule: WebsiteRule) => {
    setEditingRule(rule);
    setIsAddEditModalOpen(true);
  };

  const handleSaveRule = (domain: string, includeSubdomains: boolean, category?: string) => {
    const res = addWebsiteRule(domain, includeSubdomains, category);
    if (res.success) {
      showToast(res.message);
    }
    return res;
  };

  const handleUpdateRule = (
    id: string,
    updates: { domain: string; includeSubdomains: boolean; category?: string }
  ) => {
    editWebsiteRule(id, updates);
    showToast(`Updated rule for "${updates.domain}"`);
  };

  const handleToggleRule = (id: string) => {
    const r = customRules.find((x) => x.id === id);
    toggleWebsiteRule(id);
    if (r) {
      showToast(r.isEnabled ? `Disabled ${r.domain}` : `Enabled ${r.domain}`);
    }
  };

  const handleRemoveRule = (id: string) => {
    const r = customRules.find((x) => x.id === id);
    removeWebsiteRule(id);
    if (r) {
      showToast(`Removed "${r.domain}" from blocklist.`);
    }
  };

  const handleTestDomain = (domain: string) => {
    setTesterDomain(domain);
    setIsTesterOpen(true);
  };

  const handleQuickAddFromTester = (domain: string) => {
    const res = addWebsiteRule(domain, true, 'custom');
    if (res.success) {
      showToast(`Added "${domain}" to blocklist`);
    } else {
      showToast(res.message);
    }
  };

  // Render subviews (Categories, Schedules, Native Source, Onboarding) or main 4 persistent tabs
  const renderMainContent = () => {
    if (subView === 'onboarding') {
      return (
        <div className="relative">
          <button
            onClick={() => setSubView('none')}
            className="absolute top-2 right-2 p-2 rounded-xl text-[#64748B] hover:text-[#17365D] hover:bg-[#F0F6FF] transition-colors z-20 flex items-center gap-1 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
          <OnboardingFlow
            onComplete={() => {
              completeOnboarding();
              setSubView('none');
            }}
            onGrantPermission={grantVpnPermission}
          />
        </div>
      );
    }

    if (subView === 'categories') {
      return (
        <WebsiteCategoriesScreen
          categories={categories}
          onToggleCategory={(id) => {
            toggleCategory(id);
            const c = categories.find((x) => x.id === id);
            if (c) showToast(!c.isEnabled ? `Enabled ${c.name}` : `Disabled ${c.name}`);
          }}
          onToggleDomain={toggleCategoryDomain}
          onBack={() => setSubView('none')}
        />
      );
    }

    if (subView === 'schedules') {
      return (
        <SchedulesScreen
          schedules={schedules}
          onAddSchedule={(sched) => {
            addSchedule(sched);
            showToast(`Added schedule "${sched.name}"`);
          }}
          onToggleSchedule={toggleSchedule}
          onDeleteSchedule={deleteSchedule}
          onBack={() => setSubView('none')}
        />
      );
    }

    if (subView === 'native-code') {
      return <NativeCodeView onBack={() => setSubView('none')} />;
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            protectionState={protectionState}
            stats={stats}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              setSubView('none');
            }}
            onOpenAddModal={handleOpenAddModal}
            onOpenSchedules={() => setSubView('schedules')}
            onOpenTester={() => setIsTesterOpen(true)}
            onGrantPermission={grantVpnPermission}
            onReconnectVpn={toggleVpnService}
          />
        );
      case 'blocklist':
        return (
          <BlocklistScreen
            customRules={customRules}
            categories={categories}
            onToggleRule={handleToggleRule}
            onRemoveRule={handleRemoveRule}
            onEditRule={handleEditRule}
            onOpenAddModal={handleOpenAddModal}
            onOpenCategories={() => setSubView('categories')}
            onTestDomain={handleTestDomain}
          />
        );
      case 'activity':
        return (
          <ActivityScreen
            activityLogs={activityLogs}
            stats={stats}
            onClearHistory={clearActivityHistory}
            onOpenTester={() => setIsTesterOpen(true)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={setSettings}
            onClearHistory={clearActivityHistory}
            onOpenNativeCode={() => setSubView('native-code')}
            onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
            onOpenPlayChecklist={() => setIsPlayChecklistOpen(true)}
            onResetOnboarding={() => setSubView('onboarding')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#17365D] flex flex-col selection:bg-[#1677FF]/20 font-sans">
      
      {/* Responsive Full-Width Main Content Canvas */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {renderMainContent()}
      </main>

      {/* Persistent 4-Tab Bottom Navigation matching prompt requirement */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSubView('none'); // Reset any open detail sub-view to return to top-level tab cleanly
        }}
        activeRulesCount={stats.activeRulesCount}
      />

      {/* Add / Edit Website Modal */}
      <AddEditWebsiteModal
        isOpen={isAddEditModalOpen}
        editingRule={editingRule}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveRule}
        onUpdate={handleUpdateRule}
      />

      {/* Interactive Device Connection / Browser Test Bench */}
      {isTesterOpen && (
        <DeviceTesterModal
          isOpen={isTesterOpen}
          initialDomain={testerDomain}
          onClose={() => setIsTesterOpen(false)}
          onTestDomain={testDomainRequest}
          onNavigateToBlocklist={() => {
            setCurrentTab('blocklist');
            setSubView('none');
          }}
          onQuickAddRule={handleQuickAddFromTester}
        />
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Google Play Checklist Modal */}
      <GooglePlayChecklistModal
        isOpen={isPlayChecklistOpen}
        onClose={() => setIsPlayChecklistOpen(false)}
      />

      {/* Clean Light-Themed Toast Notification */}
      {toastMessage && (
        <aside
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-[#DCE7F5] text-[#17365D] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in whitespace-nowrap"
        >
          <div className="w-5 h-5 rounded-full bg-[#E6F9F4] text-[#14B88A] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
        </aside>
      )}

    </div>
  );
}
