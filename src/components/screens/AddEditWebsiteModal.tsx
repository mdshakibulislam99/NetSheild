import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, Check, AlertCircle } from 'lucide-react';
import { WebsiteRule } from '../../types';
import { validateAndNormalizeDomain } from '../../utils/domainValidator';

interface AddEditWebsiteModalProps {
  isOpen: boolean;
  editingRule?: WebsiteRule | null;
  onClose: () => void;
  onSave: (domain: string, includeSubdomains: boolean, category?: string) => { success: boolean; message: string };
  onUpdate: (id: string, updates: { domain: string; includeSubdomains: boolean; category?: string }) => void;
}

export const AddEditWebsiteModal: React.FC<AddEditWebsiteModalProps> = ({
  isOpen,
  editingRule,
  onClose,
  onSave,
  onUpdate,
}) => {
  const [domainInput, setDomainInput] = useState('');
  const [includeSubdomains, setIncludeSubdomains] = useState(true);
  const [category, setCategory] = useState<string>('social');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [warningText, setWarningText] = useState<string | null>(null);

  useEffect(() => {
    if (editingRule) {
      setDomainInput(editingRule.domain);
      setIncludeSubdomains(editingRule.includeSubdomains);
      setCategory(editingRule.category || 'social');
    } else {
      setDomainInput('');
      setIncludeSubdomains(true);
      setCategory('social');
    }
    setErrorText(null);
    setWarningText(null);
  }, [editingRule, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (val: string) => {
    setDomainInput(val);
    setErrorText(null);
    setWarningText(null);

    if (val.trim()) {
      const v = validateAndNormalizeDomain(val);
      if (v.warning) {
        setWarningText(v.warning);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateAndNormalizeDomain(domainInput);

    if (!v.isValid) {
      setErrorText(v.error || 'Please enter a valid domain.');
      return;
    }

    if (editingRule) {
      onUpdate(editingRule.id, {
        domain: v.normalizedDomain,
        includeSubdomains,
        category,
      });
      onClose();
    } else {
      const res = onSave(v.normalizedDomain, includeSubdomains, category);
      if (!res.success) {
        setErrorText(res.message);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div 
        className="w-full sm:max-w-md bg-white border border-[#DCE7F5] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 text-[#17365D] max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header matching screen 8: "← Add website" */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#F0F6FF]">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-[#17365D]">
            {editingRule ? 'Edit website' : 'Add website'}
          </h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Domain name field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#17365D]">
              Domain name
            </label>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="example.com"
              className="w-full px-3.5 py-2.5 bg-[#F0F6FF]/60 border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] placeholder-[#64748B] focus:outline-none focus:border-[#1677FF] focus:bg-white transition-all font-mono"
              autoFocus
            />

            {errorText && (
              <div className="text-xs text-[#E5484D] flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorText}</span>
              </div>
            )}
          </div>

          {/* Scope Radio Group matching screen 8 */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-[#17365D]">
              Scope
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-white border border-[#DCE7F5] rounded-xl cursor-pointer hover:bg-[#F0F6FF]/40 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  checked={!includeSubdomains}
                  onChange={() => setIncludeSubdomains(false)}
                  className="w-4 h-4 text-[#1677FF] border-[#DCE7F5] focus:ring-[#1677FF]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#17365D]">
                    Exact domain
                  </span>
                  <span className="text-[#64748B] ml-1">
                    ({domainInput.trim() || 'example.com'})
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white border border-[#DCE7F5] rounded-xl cursor-pointer hover:bg-[#F0F6FF]/40 transition-colors">
                <input
                  type="radio"
                  name="scope"
                  checked={includeSubdomains}
                  onChange={() => setIncludeSubdomains(true)}
                  className="w-4 h-4 text-[#1677FF] border-[#DCE7F5] focus:ring-[#1677FF]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#17365D]">
                    Include subdomains
                  </span>
                  <span className="text-[#64748B] ml-1">
                    (*.{domainInput.trim() || 'example.com'})
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Category Dropdown matching screen 8 */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-[#17365D]">
              Category (optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] focus:outline-none focus:border-[#1677FF] transition-all"
            >
              <option value="social">Social media</option>
              <option value="gaming">Gaming</option>
              <option value="gambling">Gambling</option>
              <option value="streaming">Video & streaming</option>
              <option value="productivity">Work / Focus</option>
              <option value="custom">Custom category</option>
            </select>
          </div>

          {/* Informational Callout matching screen 8 */}
          <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#17365D]">
            <Info className="w-4 h-4 text-[#1677FF] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-[#64748B]">
              This blocks a domain, not a specific URL path (e.g. /page), because DNS-level filtering inspects domain queries before HTTPS payload encryption.
            </p>
          </div>

          {/* Action Buttons matching screen 8: [Cancel] [Save] */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#17365D] bg-white border border-[#DCE7F5] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
