import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Layers, 
  ChevronRight,
  ExternalLink,
  FileQuestion
} from 'lucide-react';
import { WebsiteRule, WebsiteCategory } from '../../types';

interface BlocklistScreenProps {
  customRules: WebsiteRule[];
  categories: WebsiteCategory[];
  onToggleRule: (id: string) => void;
  onRemoveRule: (id: string) => void;
  onEditRule: (rule: WebsiteRule) => void;
  onOpenAddModal: () => void;
  onOpenCategories: () => void;
  onTestDomain: (domain: string) => void;
}

export const BlocklistScreen: React.FC<BlocklistScreenProps> = ({
  customRules,
  categories,
  onToggleRule,
  onRemoveRule,
  onEditRule,
  onOpenAddModal,
  onOpenCategories,
  onTestDomain,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'custom' | 'categories'>('all');
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  const activeCategories = categories.filter((c) => c.isEnabled);

  // Filter custom rules
  const filteredRules = customRules.filter((rule) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      rule.domain.toLowerCase().includes(q) ||
      (rule.category && rule.category.toLowerCase().includes(q))
    );
  });

  const totalActiveDomains =
    customRules.filter((r) => r.isEnabled).length +
    activeCategories.reduce((acc, c) => acc + c.domains.length, 0);

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Top Header matching reference screen 7 */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-[#17365D] tracking-tight">
            Blocklist
          </h1>
          <p className="text-xs text-[#64748B]">
            {totalActiveDomains} domains restricted device-wide
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="min-h-[44px] px-3.5 py-2 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          title="Add website to restrict"
        >
          <Plus className="w-4 h-4" />
          <span>Add website</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search websites..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] placeholder-[#64748B] focus:outline-none focus:border-[#1677FF] transition-colors shadow-2xs"
        />
      </div>

      {/* Filter Chips matching screen 7: All (n), Custom (n), Categories (n) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterTab('all')}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filterTab === 'all'
              ? 'bg-[#1677FF] text-white font-semibold'
              : 'bg-white text-[#64748B] hover:text-[#17365D] border border-[#DCE7F5]'
          }`}
        >
          All ({customRules.length + activeCategories.length})
        </button>
        <button
          onClick={() => setFilterTab('custom')}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filterTab === 'custom'
              ? 'bg-[#1677FF] text-white font-semibold'
              : 'bg-white text-[#64748B] hover:text-[#17365D] border border-[#DCE7F5]'
          }`}
        >
          Custom ({customRules.length})
        </button>
        <button
          onClick={() => setFilterTab('categories')}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filterTab === 'categories'
              ? 'bg-[#1677FF] text-white font-semibold'
              : 'bg-white text-[#64748B] hover:text-[#17365D] border border-[#DCE7F5]'
          }`}
        >
          Categories ({activeCategories.length})
        </button>
      </div>

      {/* Website Categories Banner Card */}
      <div
        onClick={onOpenCategories}
        className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#E5F0FF] transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-[#1677FF] border border-[#DCE7F5] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#17365D] block">
              Website Categories ({activeCategories.length} active)
            </span>
            <span className="text-[11px] text-[#64748B]">
              Social media, Gaming, Gambling, Streaming & more
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#1677FF]" />
      </div>

      {/* Custom Rules List */}
      {filterTab !== 'categories' && (
        <div className="space-y-2">
          {filteredRules.length === 0 ? (
            /* Empty State matching reference screen 18 */
            <div className="bg-white border border-[#DCE7F5] rounded-3xl p-8 text-center space-y-3 shadow-2xs my-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center mx-auto">
                <FileQuestion className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#17365D]">
                  {searchQuery ? 'No websites match your search' : 'No websites blocked yet'}
                </h3>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                  {searchQuery
                    ? 'Check spelling or try adding it as a new rule.'
                    : 'Add your first website to get started with protection across all browsers.'}
                </p>
              </div>

              {!searchQuery && (
                <button
                  onClick={onOpenAddModal}
                  className="min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add website</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#DCE7F5] rounded-2xl divide-y divide-[#F0F6FF] overflow-hidden shadow-sm">
              {filteredRules.map((rule) => {
                return (
                  <div
                    key={rule.id}
                    className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                      rule.isEnabled ? 'bg-white' : 'bg-slate-50/70 opacity-75'
                    }`}
                  >
                    {/* Left: Favicon / Globe + Domain details */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0 border border-[#DCE7F5]">
                        <Globe className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[#17365D] truncate">
                            {rule.domain}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                          <span>
                            {rule.includeSubdomains
                              ? 'Includes subdomains (*.' + rule.domain + ')'
                              : 'Exact domain'}
                          </span>
                          {rule.category && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="capitalize">{rule.category}</span>
                            </>
                          )}
                          {rule.blockedCount > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#14B88A] font-semibold font-mono tabular-nums">
                                {rule.blockedCount} blocked
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Switch Toggle matching screen 7 */}
                    <div className="flex items-center gap-2 shrink-0">
                      
                      {/* Test trigger */}
                      <button
                        onClick={() => onTestDomain(rule.domain)}
                        className="p-1.5 text-[#64748B] hover:text-[#1677FF] hover:bg-[#F0F6FF] rounded-lg transition-colors"
                        title="Test in browser"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditRule(rule)}
                        className="p-1.5 text-[#64748B] hover:text-[#17365D] hover:bg-[#F0F6FF] rounded-lg transition-colors"
                        title="Edit rule"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (deletingRuleId === rule.id) {
                            onRemoveRule(rule.id);
                            setDeletingRuleId(null);
                          } else {
                            setDeletingRuleId(rule.id);
                            setTimeout(() => setDeletingRuleId(null), 3000);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          deletingRuleId === rule.id
                            ? 'bg-[#E5484D] text-white'
                            : 'text-[#64748B] hover:text-[#E5484D] hover:bg-red-50'
                        }`}
                        title={deletingRuleId === rule.id ? "Click again to confirm delete" : "Delete rule"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* iOS/Android style toggle switch matching reference */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={rule.isEnabled}
                        onClick={() => onToggleRule(rule.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                          rule.isEnabled ? 'bg-[#1677FF]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                            rule.isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Categories View when Categories tab selected */}
      {filterTab === 'categories' && (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#DCE7F5] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div>
                <span className="text-xs font-bold text-[#17365D] block">
                  {cat.name}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  {cat.domains.length} domains · {cat.description}
                </span>
              </div>
              <button
                onClick={onOpenCategories}
                className="text-xs text-[#1677FF] font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Inspect</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
