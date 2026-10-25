declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  type IconProps = SVGProps<SVGSVGElement> & { size?: string | number };
  export const ArrowUpDown: ComponentType<IconProps>;
  export const CalendarDays: ComponentType<IconProps>;
  export const Clock3: ComponentType<IconProps>;
  export const Eye: ComponentType<IconProps>;
  export const Goal: ComponentType<IconProps>;
  export const LockKeyhole: ComponentType<IconProps>;
  export const MapPin: ComponentType<IconProps>;
  export const RotateCcw: ComponentType<IconProps>;
  export const Shield: ComponentType<IconProps>;
  export const SlidersHorizontal: ComponentType<IconProps>;
  export const UserRound: ComponentType<IconProps>;
}
