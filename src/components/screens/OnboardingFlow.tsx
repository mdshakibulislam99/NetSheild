import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Smartphone,
  EyeOff
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onGrantPermission: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onGrantPermission,
}) => {
  const [step, setStep] = useState<number>(0); // 0: Splash, 1: Rule, 2: Safe, 3: Simple, 4: VPN Permission, 5: All Set

  const handleGrant = () => {
    onGrantPermission();
    setStep(5);
  };

  return (
    <div className="min-h-[640px] flex flex-col justify-between p-6 bg-white animate-fade-in text-center text-[#17365D]">
      
      {/* Top skip affordance (available on steps 1-4) */}
      <div className="flex items-center justify-between h-8">
        {step > 0 && step < 5 ? (
          <button
            onClick={() => setStep(4)}
            className="text-xs text-[#64748B] hover:text-[#17365D] font-medium ml-auto"
          >
            Skip
          </button>
        ) : <div />}
      </div>

      {/* Screen 1: Splash Screen */}
      {step === 0 && (
        <div className="space-y-6 my-auto">
          <div className="w-24 h-24 rounded-3xl bg-[#1677FF] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#1677FF]/20">
            <Shield className="w-12 h-12 fill-current" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#17365D]">
              ShieldNet
            </h1>
            <p className="text-xs font-semibold text-[#1677FF] tracking-wide uppercase">
              Block distractions. Stay focused.
            </p>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed pt-2">
              Control which websites can be accessed on your device. Keep your focus, productivity, and safety across every browser.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setStep(1)}
              className="w-full min-h-[48px] px-6 py-3 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-2xl text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Onboarding 1 */}
      {step === 1 && (
        <div className="space-y-6 my-auto">
          <div className="w-24 h-24 rounded-3xl bg-[#F0F6FF] text-[#1677FF] border border-[#DCE7F5] flex items-center justify-center mx-auto">
            <Smartphone className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#17365D]">
              Your device. Your rules.
            </h2>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Block unwanted websites across all browsers (Chrome, Firefox, Brave, Samsung Internet) and background apps on your device.
            </p>
          </div>
        </div>
      )}

      {/* Screen 3: Onboarding 2 */}
      {step === 2 && (
        <div className="space-y-6 my-auto">
          <div className="w-24 h-24 rounded-3xl bg-[#F0F6FF] text-[#14B88A] border border-[#DCE7F5] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#17365D]">
              Stay safe online.
            </h2>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Protect yourself from harmful, addictive, and distracting websites with 1-tap custom domain restriction and categories.
            </p>
          </div>
        </div>
      )}

      {/* Screen 4: Onboarding 3 */}
      {step === 3 && (
        <div className="space-y-6 my-auto">
          <div className="w-24 h-24 rounded-3xl bg-[#F0F6FF] text-[#1677FF] border border-[#DCE7F5] flex items-center justify-center mx-auto">
            <Layers className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#17365D]">
              Simple. Powerful.
            </h2>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              Add websites, set automated schedules, track activity, and manage everything directly from a single clean dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Screen 5: Enable VPN permission matching reference screen 5 */}
      {step === 4 && (
        <div className="space-y-5 my-auto text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F6FF] text-[#1677FF] border border-[#DCE7F5] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-[#17365D]">
              Enable VPN permission
            </h2>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              ShieldNet needs VPN permission to filter website requests on your device. Your traffic is not logged or monitored.
            </p>
          </div>

          {/* 3 Privacy & Trust Bullet Cards matching screen 5 */}
          <div className="space-y-2 pt-2">
            <div className="p-3 bg-[#F0F6FF] rounded-xl flex items-center gap-3 border border-[#DCE7F5]">
              <Filter className="w-4 h-4 text-[#1677FF] shrink-0" />
              <div className="text-xs font-semibold text-[#17365D]">
                Filters website requests locally
              </div>
            </div>

            <div className="p-3 bg-[#F0F6FF] rounded-xl flex items-center gap-3 border border-[#DCE7F5]">
              <Smartphone className="w-4 h-4 text-[#1677FF] shrink-0" />
              <div className="text-xs font-semibold text-[#17365D]">
                Works across all browsers and apps
              </div>
            </div>

            <div className="p-3 bg-[#F0F6FF] rounded-xl flex items-center gap-3 border border-[#DCE7F5]">
              <EyeOff className="w-4 h-4 text-[#14B88A] shrink-0" />
              <div className="text-xs font-semibold text-[#17365D]">
                Zero data collected or sent to remote servers
              </div>
            </div>
          </div>

          <div className="pt-3 space-y-2">
            <button
              onClick={handleGrant}
              className="w-full min-h-[48px] py-3 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-2xl text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Grant Permission
            </button>
            <button
              onClick={() => setStep(5)}
              className="w-full py-2 text-xs text-[#64748B] hover:text-[#17365D] font-medium"
            >
              Configure Later in Settings
            </button>
          </div>
        </div>
      )}

      {/* Screen 20: You're all set! matching reference screen 20 */}
      {step === 5 && (
        <div className="space-y-6 my-auto">
          <div className="w-24 h-24 rounded-3xl bg-[#E6F9F4] text-[#14B88A] border-2 border-[#14B88A]/30 flex items-center justify-center mx-auto shadow-lg shadow-[#14B88A]/15">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#17365D]">
              You're all set!
            </h2>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
              ShieldNet is now protecting your device. Add your first website to the blocklist or enable a category to start filtering.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onComplete}
              className="w-full min-h-[48px] px-6 py-3 bg-[#14B88A] hover:bg-[#0EA279] text-white font-semibold rounded-2xl text-xs shadow-md shadow-[#14B88A]/20 transition-all active:scale-[0.98]"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Bottom Step Dots and Next button for steps 1-3 */}
      {step > 0 && step < 4 && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === dot ? 'w-5 bg-[#1677FF]' : 'bg-[#DCE7F5]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStep(step + 1)}
            className="w-full min-h-[48px] px-6 py-3 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-2xl text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{step === 3 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
