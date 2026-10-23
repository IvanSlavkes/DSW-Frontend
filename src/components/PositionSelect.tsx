import { POSITIONS } from '../constants/positions';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  wildcardLabel?: string;
}

export default function PositionSelect({
  value,
  onChange,
  className = '',
  required = true,
  wildcardLabel,
}: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      className={`${className} bg-white text-gray-900`}
    >
      {wildcardLabel ? (
        <option value="">{wildcardLabel}</option>
      ) : (
        <option value="" disabled>
          Seleccionar posición
        </option>
      )}
      {POSITIONS.map((position) => (
        <option key={position.value} value={position.value}>
          {position.label}
        </option>
      ))}
    </select>
  );
}
