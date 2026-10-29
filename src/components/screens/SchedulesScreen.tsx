import React, { useState } from 'react';
import { ArrowLeft, Plus, Clock, Trash2, Calendar, Check } from 'lucide-react';
import { BlockingSchedule } from '../../types';

interface SchedulesScreenProps {
  schedules: BlockingSchedule[];
  onAddSchedule: (schedule: Omit<BlockingSchedule, 'id'>) => void;
  onToggleSchedule: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  onBack: () => void;
}

export const SchedulesScreen: React.FC<SchedulesScreenProps> = ({
  schedules,
  onAddSchedule,
  onToggleSchedule,
  onDeleteSchedule,
  onBack,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('Study Time');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon - Fri

  const daysMap = [
    { label: 'M', day: 1, name: 'Mon' },
    { label: 'T', day: 2, name: 'Tue' },
    { label: 'W', day: 3, name: 'Wed' },
    { label: 'T', day: 4, name: 'Thu' },
    { label: 'F', day: 5, name: 'Fri' },
    { label: 'S', day: 6, name: 'Sat' },
    { label: 'S', day: 0, name: 'Sun' },
  ];

  const handleToggleDay = (d: number) => {
    if (selectedDays.includes(d)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((x) => x !== d));
      }
    } else {
      setSelectedDays([...selectedDays, d]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSchedule({
      name: name.trim(),
      startTime,
      endTime,
      days: selectedDays,
      isEnabled: true,
    });
    setIsCreating(false);
    setName('');
  };

  const formatDaysSummary = (days: number[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Mon – Fri';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days
      .map((d) => daysMap.find((dm) => dm.day === d)?.name)
      .filter(Boolean)
      .join(', ');
  };

  // If in Add / Edit screen matching reference screen 12 & 15
  if (isCreating) {
    return (
      <div className="space-y-4 animate-fade-in pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-1 pb-2 border-b border-[#F0F6FF]">
          <button
            onClick={() => setIsCreating(false)}
            className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-[#17365D]">
            Add Blocking Schedule
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Schedule Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#17365D]">
              Schedule name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Study Time, Work Hours, Sleep"
              className="w-full px-3.5 py-2.5 bg-white border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] focus:outline-none focus:border-[#1677FF]"
              required
            />
          </div>

          {/* Repeat on Days matching screen 12 & 15 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#17365D]">
              Repeat on days
            </label>
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {daysMap.map((d, idx) => {
                const isSelected = selectedDays.includes(d.day);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleDay(d.day)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#1677FF] text-white shadow-sm'
                        : 'bg-white border border-[#DCE7F5] text-[#64748B] hover:text-[#17365D]'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start and End Times */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#17365D]">
                Start time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] font-mono focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#17365D]">
                End time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DCE7F5] rounded-xl text-xs text-[#17365D] font-mono focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-xl p-3 text-xs text-[#64748B]">
            During these scheduled hours, ShieldNet blocks all websites in your blocklist. Outside of these hours, network traffic resolves normally.
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#17365D] bg-white border border-[#DCE7F5] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
            >
              Save Schedule
            </button>
          </div>

        </form>
      </div>
    );
  }

  // Schedule list view matching reference screen 14
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#F0F6FF]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#17365D]">
              Schedule List
            </h1>
            <p className="text-xs text-[#64748B]">
              Automate website restriction by hours and days
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="min-h-[40px] px-3.5 py-2 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white border border-[#DCE7F5] rounded-3xl p-8 text-center space-y-3 shadow-2xs my-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#17365D]">
              No schedules created
            </h3>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              Protection is currently active 24/7. Create a schedule to restrict websites only during specific study or work hours.
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add schedule</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white border border-[#DCE7F5] rounded-2xl p-4 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#17365D] block">
                    {schedule.name}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {formatDaysSummary(schedule.days)} · {schedule.startTime} – {schedule.endTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onDeleteSchedule(schedule.id)}
                  className="p-1.5 text-[#64748B] hover:text-[#E5484D] rounded-lg transition-colors"
                  title="Delete schedule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={schedule.isEnabled}
                  onClick={() => onToggleSchedule(schedule.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                    schedule.isEnabled ? 'bg-[#1677FF]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                      schedule.isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-3 border border-dashed border-[#1677FF]/40 text-[#1677FF] hover:bg-[#F0F6FF] rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add schedule</span>
          </button>
        </div>
      )}
    </div>
  );
};
