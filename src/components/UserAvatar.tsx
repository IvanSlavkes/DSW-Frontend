interface UserAvatarProps {
  name?: string | null;
  lastName?: string | null;
  size?: "sm" | "md" | "lg";
  colorIndex?: number;
  className?: string;
}

const colors = ["bg-[#55708D]", "bg-[#01AB48]", "bg-[#6B668C]"];
const sizes = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-2xl",
};

export default function UserAvatar({
  name,
  lastName,
  size = "md",
  colorIndex = 0,
  className = "",
}: UserAvatarProps) {
  const initials = [name, lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => part.trim()[0]?.toLocaleUpperCase())
    .join("") || "?";

  return (
    <span
      aria-label={name ? `Foto de perfil de ${[name, lastName].filter(Boolean).join(" ")}` : "Foto de perfil"}
      className={`grid shrink-0 place-items-center rounded-full border-2 border-[#09241B] font-black text-white ${sizes[size]} ${colors[colorIndex % colors.length]} ${className}`}
    >
      {initials}
    </span>
  );
}
