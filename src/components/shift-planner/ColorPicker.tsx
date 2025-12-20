'use client';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const predefinedColors = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
  '#EF4444', '#14B8A6', '#F97316', '#84CC16',
];

export default function ColorPicker({ color, onChange, label = 'Color' }: ColorPickerProps) {
  const isCustomColor = !predefinedColors.includes(color);

  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex flex-wrap items-center gap-2">
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
            <div className="relative">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    title="Elige un color personalizado"
                />
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${isCustomColor ? 'ring-2 ring-offset-2 ring-purple-500' : 'ring-1 ring-gray-300'}`}
                    style={{ backgroundColor: isCustomColor ? color : '#e5e7eb' }}
                >
                    {!isCustomColor && (
                        <span className="text-gray-500 text-xs font-bold">+</span>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
