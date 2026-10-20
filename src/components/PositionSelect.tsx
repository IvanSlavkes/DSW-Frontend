import { POSITIONS } from '../constants/positions';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PositionSelect({ value, onChange, className = '' }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className={className}
    >
      <option value="" disabled>
        Seleccionar posición
      </option>
      {POSITIONS.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
}