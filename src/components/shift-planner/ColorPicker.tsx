'use client';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const predefinedColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function ColorPicker({ color, onChange, label = 'Color' }: ColorPickerProps) {
  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex items-center gap-3">
            {predefinedColors.map((c) => (
                <button
                    key={c}
                    type="button"
                    onClick={() => onChange(c)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-purple-500' : 'ring-1 ring-gray-300'}`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                />
            ))}
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 w-9 p-0 border-none rounded-full cursor-pointer bg-transparent"
                title="Elige un color personalizado"
            />
        </div>
    </div>
  );
}
