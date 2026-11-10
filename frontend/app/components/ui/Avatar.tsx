type AvatarProps = {
  initials: string;
  color: string; // background colour, e.g. "#f4cd6b"
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline";
  className?: string;
};

const sizes = {
  xs: "h-8 w-8 text-[11px]",
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-[72px] w-[72px] text-xl",
  xl: "h-32 w-32 text-4xl",
};

const dotSizes = {
  xs: "h-2.5 w-2.5",
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
  xl: "h-6 w-6",
};

// Dark backgrounds get white initials automatically
function isDark(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 110;
}

type PersonLike = { initials: string; color: string; online?: boolean };

// Shortcut: <PersonAvatar person={people.lena} showStatus />
export function PersonAvatar({
  person,
  showStatus = false,
  ...rest
}: { person: PersonLike; showStatus?: boolean } & Omit<AvatarProps, "initials" | "color" | "status">) {
  return (
    <Avatar
      initials={person.initials}
      color={person.color}
      status={showStatus ? (person.online ? "online" : "offline") : undefined}
      {...rest}
    />
  );
}

export default function Avatar({ initials, color, size = "md", status, className = "" }: AvatarProps) {
  return (
    <span
      className={`${className.includes("absolute") ? "" : "relative"} inline-grid shrink-0 place-items-center rounded-full font-extrabold ${sizes[size]} ${className}`}
      style={{ background: color, color: isDark(color) ? "#fff" : "#0e0e12" }}
    >
      {initials}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${dotSizes[size]} ${
            status === "online" ? "bg-online" : "bg-[#c4c7d2]"
          }`}
        >
          <span className="sr-only">{status}</span>
        </span>
      )}
    </span>
  );
}
