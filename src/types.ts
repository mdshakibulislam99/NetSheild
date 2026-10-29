/**
 * ShieldNet Android Firewall & Website Restrictor Types
 */

export type ProtectionState =
  | 'ACTIVE'
  | 'SETUP_REQUIRED'
  | 'PERMISSION_REQUIRED'
  | 'INTERRUPTED'
  | 'CONFIG_INCOMPLETE';

export type VpnPermissionStatus = 'NOT_REQUESTED' | 'GRANTED' | 'DENIED' | 'REVOKED';

export interface WebsiteRule {
  id: string;
  domain: string;
  includeSubdomains: boolean;
  category?: string;
  isEnabled: boolean;
  addedAt: number;
  blockedCount: number;
  isCategoryManaged?: boolean;
}

export interface WebsiteCategory {
  id: string;
  name: string;
  description: string;
  iconName: 'users' | 'gamepad' | 'dice' | 'video' | 'shield-alert';
  domains: string[];
  isEnabled: boolean;
}

export interface BlockingSchedule {
  id: string;
  name: string;
  isEnabled: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  days: number[];    // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export interface ActivityEvent {
  id: string;
  timestamp: number;
  domain: string;
  connectionType: 'Browser (Chrome)' | 'Browser (Firefox)' | 'Browser (Samsung)' | 'App connection';
  status: 'BLOCKED' | 'ALLOWED';
  matchedRuleId?: string;
  matchedDomain?: string;
}

export interface AppSettings {
  vpnPermissionStatus: VpnPermissionStatus;
  isVpnServiceRunning: boolean;
  hasCompletedOnboarding: boolean;
  reconnectProtection: boolean;
  handleNetworkChanges: boolean;
  filterMatchingRequests: boolean;
}
