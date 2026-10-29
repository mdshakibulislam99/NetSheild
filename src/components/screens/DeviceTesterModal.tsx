import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Plus,
  Shield,
  Smartphone
} from 'lucide-react';
import { ActivityEvent } from '../../types';

interface DeviceTesterModalProps {
  isOpen: boolean;
  initialDomain?: string;
  onClose: () => void;
  onTestDomain: (
    domain: string,
    clientApp: ActivityEvent['connectionType']
  ) => { isBlocked: boolean; matchedDomain?: string; reason?: string };
  onNavigateToBlocklist: () => void;
  onQuickAddRule: (domain: string) => void;
}

export const DeviceTesterModal: React.FC<DeviceTesterModalProps> = ({
  isOpen,
  initialDomain = 'youtube.com',
  onClose,
  onTestDomain,
  onNavigateToBlocklist,
  onQuickAddRule,
}) => {
  const [addressInput, setAddressInput] = useState(initialDomain);
  const [currentDomain, setCurrentDomain] = useState(initialDomain);
  const [selectedBrowser, setSelectedBrowser] = useState<ActivityEvent['connectionType']>('Browser (Chrome)');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    isBlocked: boolean;
    matchedDomain?: string;
    reason?: string;
  } | null>(null);

  // Safely execute test when modal is open and domain is provided
  React.useEffect(() => {
    if (isOpen) {
      setAddressInput(initialDomain);
      setCurrentDomain(initialDomain);
      const res = onTestDomain(initialDomain, selectedBrowser);
      setTestResult(res);
    }
  }, [isOpen, initialDomain]);

  if (!isOpen) return null;

  const handleRunTest = (target: string) => {
    setIsLoading(true);
    setCurrentDomain(target);
    setAddressInput(target);

    setTimeout(() => {
      const res = onTestDomain(target, selectedBrowser);
      setTestResult(res);
      setIsLoading(false);
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    handleRunTest(addressInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div 
        className="w-full sm:max-w-lg bg-white border border-[#DCE7F5] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
      >
        
        {/* Android Browser Header */}
        <div className="bg-[#F0F6FF] px-4 py-3 border-b border-[#DCE7F5] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white text-[#17365D] flex items-center justify-center transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#17365D]">
                Device Connection Test Bench
              </span>
            </div>

            {/* Browser Selector */}
            <select
              value={selectedBrowser}
              onChange={(e) => {
                const b = e.target.value as ActivityEvent['connectionType'];
                setSelectedBrowser(b);
                handleRunTest(currentDomain);
              }}
              className="text-[11px] font-semibold bg-white border border-[#DCE7F5] rounded-lg px-2 py-1 text-[#17365D]"
            >
              <option value="Browser (Chrome)">Chrome on Android</option>
              <option value="Browser (Firefox)">Firefox on Android</option>
              <option value="Browser (Samsung)">Samsung Internet</option>
              <option value="App connection">Background App</option>
            </select>
          </div>

          {/* Omnibox / URL Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <div className="absolute left-3 text-[#64748B]">
                {testResult?.isBlocked ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-[#E5484D]" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-[#14B88A]" />
                )}
              </div>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter domain (e.g. reddit.com or youtube.com)"
                className="w-full pl-8 pr-16 py-2 bg-white border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] placeholder-[#64748B] focus:outline-none focus:border-[#1677FF] font-mono shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-[#1677FF] hover:bg-[#0E62DB] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Test
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleRunTest(currentDomain)}
              className={`w-9 h-9 rounded-xl bg-white border border-[#DCE7F5] text-[#64748B] hover:text-[#17365D] flex items-center justify-center transition-colors ${
                isLoading ? 'animate-spin text-[#1677FF]' : ''
              }`}
              title="Reload test"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Browser Viewport */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[380px] flex flex-col justify-center bg-[#F8FAFC]">
          
          {isLoading ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-8 h-8 border-2 border-[#1677FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#64748B] font-mono">
                Intercepting DNS lookup via local VPN interface...
              </p>
            </div>
          ) : testResult?.isBlocked ? (
            
            /* Screen 16: Website blocked confirmation state */
            <div className="max-w-sm mx-auto w-full bg-white border border-[#E5484D]/30 rounded-3xl p-6 text-center space-y-4 shadow-md animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] text-[#E5484D] border border-[#FCA5A5] flex items-center justify-center mx-auto">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#17365D]">
                  Website blocked
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  <strong className="text-[#17365D]">{currentDomain}</strong> is blocked by ShieldNet.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#DCE7F5] rounded-xl p-3 text-left text-xs space-y-1 text-[#64748B]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#17365D]">Status:</span>
                  <span className="text-[#E5484D] font-mono font-bold">ERR_NAME_NOT_RESOLVED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enforcement:</span>
                  <span className="font-mono text-[#17365D]">Local Sinkhole (0.0.0.0)</span>
                </div>
                {testResult.reason && (
                  <div className="pt-1 text-[11px] border-t border-[#DCE7F5]">
                    {testResult.reason}
                  </div>
                )}
              </div>

              {/* Action buttons matching screen 16: [Got it] [Manage blocklist] */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={onClose}
                  className="w-full min-h-[44px] py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
                >
                  Got it
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToBlocklist();
                  }}
                  className="w-full py-2 text-xs font-semibold text-[#1677FF] hover:underline"
                >
                  Manage blocklist
                </button>
              </div>
            </div>

          ) : (

            /* Allowed Webpage Preview */
            <div className="max-w-sm mx-auto w-full bg-white border border-[#DCE7F5] rounded-3xl p-6 text-center space-y-4 shadow-sm animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F9F4] text-[#14B88A] border border-[#A7F3D0] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#17365D]">
                  Website Loaded Normally
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  <strong className="text-[#17365D]">{currentDomain}</strong> is not restricted.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#DCE7F5] rounded-xl p-3 text-left text-xs space-y-1 text-[#64748B]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#17365D]">HTTP Status:</span>
                  <span className="text-[#14B88A] font-mono font-bold">200 OK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>DNS Resolution:</span>
                  <span className="font-mono text-[#17365D]">Resolved via Upstream</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onQuickAddRule(currentDomain);
                    handleRunTest(currentDomain);
                  }}
                  className="w-full min-h-[44px] py-2.5 bg-[#FEE2E2] hover:bg-[#FCA5A5]/40 text-[#E5484D] font-semibold rounded-xl text-xs border border-[#FCA5A5] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Block {currentDomain} on Device Now</span>
                </button>
              </div>
            </div>

          )}

        </div>

      </div>
    </div>
  );
};
