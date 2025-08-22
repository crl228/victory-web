import React from 'react';

export default function CoachPicker({
  coaches,
  value,
  onChange,
}: {
  coaches: Array<{ id: string; name: string }>;
  value?: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-600">教练：</label>
      <select
        className="border rounded-xl px-3 py-2 bg-white"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">请选择教练</option>
        {coaches.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
