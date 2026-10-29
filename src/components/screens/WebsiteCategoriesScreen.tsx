import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Gamepad2, 
  Dice5, 
  Video, 
  ShieldAlert, 
  ChevronRight,
  Check,
  Globe
} from 'lucide-react';
import { WebsiteCategory } from '../../types';

interface WebsiteCategoriesScreenProps {
  categories: WebsiteCategory[];
  onToggleCategory: (id: string) => void;
  onToggleDomain: (categoryId: string, domain: string) => void;
  onBack: () => void;
}

export const WebsiteCategoriesScreen: React.FC<WebsiteCategoriesScreenProps> = ({
  categories,
  onToggleCategory,
  onToggleDomain,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WebsiteCategory | null>(null);

  const getCategoryIcon = (iconName: WebsiteCategory['iconName']) => {
    switch (iconName) {
      case 'users':
        return <Users className="w-5 h-5 text-[#1677FF]" />;
      case 'gamepad':
        return <Gamepad2 className="w-5 h-5 text-[#14B88A]" />;
      case 'dice':
        return <Dice5 className="w-5 h-5 text-[#F59E0B]" />;
      case 'video':
        return <Video className="w-5 h-5 text-[#E5484D]" />;
      case 'shield-alert':
        return <ShieldAlert className="w-5 h-5 text-[#E5484D]" />;
      default:
        return <Globe className="w-5 h-5 text-[#1677FF]" />;
    }
  };

  // If user clicked into a category, show Screen 10 Category Details
  if (selectedCategory) {
    const liveCat = categories.find((c) => c.id === selectedCategory.id) || selectedCategory;

    return (
      <div className="space-y-4 animate-fade-in pb-4">
        {/* Top Header matching screen 10 */}
        <div className="flex items-center gap-3 pt-1 pb-2 border-b border-[#F0F6FF]">
          <button
            onClick={() => setSelectedCategory(null)}
            className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center">
              {getCategoryIcon(liveCat.iconName)}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17365D] leading-tight">
                {liveCat.name}
              </h2>
              <p className="text-[11px] text-[#64748B]">
                {liveCat.description}
              </p>
            </div>
          </div>
        </div>

        {/* Master Category Enable Card matching screen 10 */}
        <div className="bg-white border border-[#DCE7F5] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-[#17365D] block">
              Enable category
            </span>
            <span className="text-[11px] text-[#64748B]">
              Block all included websites device-wide
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={liveCat.isEnabled}
            onClick={() => onToggleCategory(liveCat.id)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              liveCat.isEnabled ? 'bg-[#1677FF]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                liveCat.isEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Domain List matching screen 10: "Includes (12)" */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Includes ({liveCat.domains.length})
            </span>
            <span className="text-[11px] text-[#64748B]">
              Tap to include/exclude
            </span>
          </div>

          <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-2xs">
            {liveCat.domains.map((domain) => (
              <div
                key={domain}
                className="p-3.5 flex items-center justify-between hover:bg-[#F0F6FF]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center font-mono text-xs font-bold">
                    {domain.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#17365D] font-mono">
                    {domain}
                  </span>
                </div>

                <div className="w-5 h-5 rounded-full bg-[#14B88A]/15 text-[#14B88A] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#17365D] bg-white border border-[#DCE7F5] rounded-xl transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setSelectedCategory(null)}
            className="min-h-[44px] px-6 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Screen 9 Category Overview List
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Top Header matching screen 9 */}
      <div className="flex items-center gap-3 pt-1 pb-2 border-b border-[#F0F6FF]">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#17365D]">
            Website Categories
          </h1>
          <p className="text-xs text-[#64748B]">
            Turn on curated blocklists by content type
          </p>
        </div>
      </div>

      {/* Category Cards matching screen 9 */}
      <div className="space-y-2.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className="bg-white border border-[#DCE7F5] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1677FF]/50 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#17365D]">
                    {cat.name}
                  </span>
                  {cat.isEnabled && (
                    <span className="text-[10px] bg-[#E6F9F4] text-[#14B88A] px-2 py-0.5 rounded-full font-semibold border border-[#14B88A]/30">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  {cat.description}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>

      <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-xl p-3 text-xs text-[#64748B]">
        <strong>Transparency note:</strong> These categories include curated popular domains. No automated list covers every single website on the internet; you can always add custom domains directly from the Blocklist screen.
      </div>
    </div>
  );
};
