import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  WebsiteRule,
  WebsiteCategory,
  BlockingSchedule,
  ActivityEvent,
  AppSettings,
  ProtectionState,
} from '../types';
import { INITIAL_CATEGORIES } from '../utils/categoriesData';
import { validateAndNormalizeDomain, isDomainMatchedByRule } from '../utils/domainValidator';

const STORAGE_KEYS = {
  RULES: 'shieldnet_rules_v2',
  CATEGORIES: 'shieldnet_categories_v2',
  SCHEDULES: 'shieldnet_schedules_v2',
  ACTIVITY: 'shieldnet_activity_v2',
  SETTINGS: 'shieldnet_settings_v2',
};

const DEFAULT_SETTINGS: AppSettings = {
  vpnPermissionStatus: 'GRANTED',
  isVpnServiceRunning: true,
  hasCompletedOnboarding: true,
  reconnectProtection: true,
  handleNetworkChanges: true,
  filterMatchingRequests: true,
};

export function useShieldNetEngine() {
  // 1. Custom Website Rules (No demo data: starts empty [])
  const [customRules, setCustomRules] = useState<WebsiteRule[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RULES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 2. Categories
  const [categories, setCategories] = useState<WebsiteCategory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 3. Schedules (Starts empty [])
  const [schedules, setSchedules] = useState<BlockingSchedule[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 4. Real Activity Events (Starts empty [])
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 5. Settings & Permissions
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(customRules));
    } catch (e) {
      console.warn('Failed saving rules', e);
    }
  }, [customRules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed saving categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (e) {
      console.warn('Failed saving schedules', e);
    }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('Failed saving activity', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings', e);
    }
  }, [settings]);

  // Total active custom rules
  const activeCustomRules = useMemo(
    () => customRules.filter((r) => r.isEnabled),
    [customRules]
  );

  // Enabled categories
  const activeCategories = useMemo(
    () => categories.filter((c) => c.isEnabled),
    [categories]
  );

  // Total domain count covered by active categories
  const activeCategoryDomainCount = useMemo(() => {
    const set = new Set<string>();
    activeCategories.forEach((c) => c.domains.forEach((d) => set.add(d.toLowerCase())));
    return set.size;
  }, [activeCategories]);

  // Schedules state check
  const isAnyScheduleActiveRightNow = useMemo(() => {
    if (schedules.length === 0) return true; // Default unrestricted if no schedules exist
    const enabledSchedules = schedules.filter((s) => s.isEnabled);
    if (enabledSchedules.length === 0) return true;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sun ... 6 = Sat
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    return enabledSchedules.some((sched) => {
      if (!sched.days.includes(currentDay)) return false;
      const [startH, startM] = sched.startTime.split(':').map(Number);
      const [endH, endM] = sched.endTime.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      if (startTotal <= endTotal) {
        return currentTotalMinutes >= startTotal && currentTotalMinutes <= endTotal;
      } else {
        // Crosses midnight (e.g. 22:00 to 06:00)
        return currentTotalMinutes >= startTotal || currentTotalMinutes <= endTotal;
      }
    });
  }, [schedules]);

  // Overall Protection State
  const protectionState: ProtectionState = useMemo(() => {
    if (!settings.hasCompletedOnboarding) {
      return 'SETUP_REQUIRED';
    }
    if (settings.vpnPermissionStatus !== 'GRANTED') {
      return 'PERMISSION_REQUIRED';
    }
    if (!settings.isVpnServiceRunning) {
      return 'INTERRUPTED';
    }
    if (activeCustomRules.length === 0 && activeCategories.length === 0) {
      return 'CONFIG_INCOMPLETE';
    }
    return 'ACTIVE';
  }, [settings, activeCustomRules.length, activeCategories.length]);

  // Real statistics (NEVER fabricated)
  const stats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - 7 * 86400000;

    const blockedToday = activityLogs.filter(
      (log) => log.status === 'BLOCKED' && log.timestamp >= startOfToday
    ).length;

    const blockedThisWeek = activityLogs.filter(
      (log) => log.status === 'BLOCKED' && log.timestamp >= startOfWeek
    ).length;

    const totalBlocked = activityLogs.filter((log) => log.status === 'BLOCKED').length;

    return {
      blockedToday,
      blockedThisWeek,
      totalBlocked,
      activeRulesCount: activeCustomRules.length + activeCategoryDomainCount,
    };
  }, [activityLogs, activeCustomRules.length, activeCategoryDomainCount]);

  // Add website rule
  const addWebsiteRule = useCallback(
    (
      rawDomain: string,
      includeSubdomains: boolean,
      category?: string
    ): { success: boolean; message: string; rule?: WebsiteRule } => {
      const validation = validateAndNormalizeDomain(rawDomain);
      if (!validation.isValid) {
        return { success: false, message: validation.error || 'Invalid domain' };
      }

      const domain = validation.normalizedDomain;
      const existing = customRules.find(
        (r) => r.domain.toLowerCase() === domain.toLowerCase()
      );

      if (existing) {
        if (!existing.isEnabled) {
          setCustomRules((prev) =>
            prev.map((r) => (r.id === existing.id ? { ...r, isEnabled: true } : r))
          );
          return {
            success: true,
            message: `"${domain}" was already in your list and has been re-enabled.`,
            rule: existing,
          };
        }
        return {
          success: false,
          message: `"${domain}" is already in your blocklist.`,
        };
      }

      const newRule: WebsiteRule = {
        id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        domain,
        includeSubdomains,
        category: category || undefined,
        isEnabled: true,
        addedAt: Date.now(),
        blockedCount: 0,
      };

      setCustomRules((prev) => [newRule, ...prev]);
      return {
        success: true,
        message: `Added "${domain}" to your blocklist.`,
        rule: newRule,
      };
    },
    [customRules]
  );

  // Edit website rule
  const editWebsiteRule = useCallback(
    (
      id: string,
      updates: { domain?: string; includeSubdomains?: boolean; category?: string; isEnabled?: boolean }
    ) => {
      setCustomRules((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          let newDomain = r.domain;
          if (updates.domain) {
            const v = validateAndNormalizeDomain(updates.domain);
            if (v.isValid) newDomain = v.normalizedDomain;
          }
          return {
            ...r,
            domain: newDomain,
            includeSubdomains:
              updates.includeSubdomains !== undefined
                ? updates.includeSubdomains
                : r.includeSubdomains,
            category: updates.category !== undefined ? updates.category : r.category,
            isEnabled: updates.isEnabled !== undefined ? updates.isEnabled : r.isEnabled,
          };
        })
      );
    },
    []
  );

  // Toggle rule
  const toggleWebsiteRule = useCallback((id: string) => {
    setCustomRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  }, []);

  // Remove rule
  const removeWebsiteRule = useCallback((id: string) => {
    setCustomRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Category Toggle
  const toggleCategory = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isEnabled: !cat.isEnabled } : cat
      )
    );
  }, []);

  // Toggle single domain inside category
  const toggleCategoryDomain = useCallback(
    (categoryId: string, domainToToggle: string) => {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id !== categoryId) return cat;
          const exists = cat.domains.includes(domainToToggle);
          const newDomains = exists
            ? cat.domains.filter((d) => d !== domainToToggle)
            : [...cat.domains, domainToToggle];
          return { ...cat, domains: newDomains };
        })
      );
    },
    []
  );

  // Schedules management
  const addSchedule = useCallback((schedule: Omit<BlockingSchedule, 'id'>) => {
    const newSchedule: BlockingSchedule = {
      ...schedule,
      id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setSchedules((prev) => [...prev, newSchedule]);
  }, []);

  const toggleSchedule = useCallback((id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Clear Activity History
  const clearActivityHistory = useCallback(() => {
    setActivityLogs([]);
  }, []);

  // Check and simulate real filtering event
  const testDomainRequest = useCallback(
    (
      rawUrlOrDomain: string,
      clientApp: ActivityEvent['connectionType'] = 'Browser (Chrome)'
    ): { isBlocked: boolean; matchedDomain?: string; reason?: string } => {
      const v = validateAndNormalizeDomain(rawUrlOrDomain);
      const targetDomain = v.isValid ? v.normalizedDomain : rawUrlOrDomain.toLowerCase().trim();

      // Check master protection state
      if (protectionState !== 'ACTIVE') {
        const allowedLog: ActivityEvent = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
          domain: targetDomain,
          connectionType: clientApp,
          status: 'ALLOWED',
        };
        setActivityLogs((prev) => [allowedLog, ...prev.slice(0, 199)]);
        return {
          isBlocked: false,
          reason: `ShieldNet protection is not currently active (${protectionState}).`,
        };
      }

      // Check schedule
      if (!isAnyScheduleActiveRightNow) {
        const allowedLog: ActivityEvent = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
          domain: targetDomain,
          connectionType: clientApp,
          status: 'ALLOWED',
        };
        setActivityLogs((prev) => [allowedLog, ...prev.slice(0, 199)]);
        return {
          isBlocked: false,
          reason: 'Outside scheduled blocking hours. Access permitted.',
        };
      }

      // 1. Check custom rules
      for (const rule of activeCustomRules) {
        if (isDomainMatchedByRule(targetDomain, rule.domain, rule.includeSubdomains)) {
          // Increment blocked hit on rule
          setCustomRules((prev) =>
            prev.map((r) =>
              r.id === rule.id ? { ...r, blockedCount: r.blockedCount + 1 } : r
            )
          );

          const blockLog: ActivityEvent = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: Date.now(),
            domain: targetDomain,
            connectionType: clientApp,
            status: 'BLOCKED',
            matchedRuleId: rule.id,
            matchedDomain: rule.domain,
          };
          setActivityLogs((prev) => [blockLog, ...prev.slice(0, 199)]);

          return {
            isBlocked: true,
            matchedDomain: rule.domain,
            reason: `Blocked by rule "${rule.domain}"${rule.includeSubdomains ? ' (subdomains included)' : ''}`,
          };
        }
      }

      // 2. Check enabled categories
      for (const cat of activeCategories) {
        for (const catDomain of cat.domains) {
          if (isDomainMatchedByRule(targetDomain, catDomain, true)) {
            const blockLog: ActivityEvent = {
              id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: Date.now(),
              domain: targetDomain,
              connectionType: clientApp,
              status: 'BLOCKED',
              matchedDomain: catDomain,
            };
            setActivityLogs((prev) => [blockLog, ...prev.slice(0, 199)]);

            return {
              isBlocked: true,
              matchedDomain: catDomain,
              reason: `Blocked by category "${cat.name}" (${catDomain})`,
            };
          }
        }
      }

      // Allowed
      const allowedLog: ActivityEvent = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        domain: targetDomain,
        connectionType: clientApp,
        status: 'ALLOWED',
      };
      setActivityLogs((prev) => [allowedLog, ...prev.slice(0, 199)]);

      return {
        isBlocked: false,
        reason: 'Domain not restricted. Forwarded to clean DNS.',
      };
    },
    [protectionState, isAnyScheduleActiveRightNow, activeCustomRules, activeCategories]
  );

  // Settings & Permission actions
  const grantVpnPermission = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      vpnPermissionStatus: 'GRANTED',
      isVpnServiceRunning: true,
    }));
  }, []);

  const revokeVpnPermission = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      vpnPermissionStatus: 'REVOKED',
      isVpnServiceRunning: false,
    }));
  }, []);

  const toggleVpnService = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      isVpnServiceRunning: !prev.isVpnServiceRunning,
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
      vpnPermissionStatus: 'GRANTED',
      isVpnServiceRunning: true,
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      hasCompletedOnboarding: false,
      vpnPermissionStatus: 'NOT_REQUESTED',
      isVpnServiceRunning: false,
    }));
  }, []);

  return {
    customRules,
    categories,
    schedules,
    activityLogs,
    settings,
    setSettings,
    protectionState,
    stats,
    isAnyScheduleActiveRightNow,
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
    revokeVpnPermission,
    toggleVpnService,
    completeOnboarding,
    resetOnboarding,
  };
}
