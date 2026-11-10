import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

// Small circle with a number, used for unread counts.
export function Badge({ count, inverted = false }: { count: number; inverted?: boolean }) {
  return (
    <span
      className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold ${
        inverted ? "bg-white text-ink" : "bg-ink text-white"
      }`}
    >
      {count}
    </span>
  );
}

type IconButtonProps = {
  icon: IconName;
  label: string; // for screen readers
  variant?: "outline" | "solid";
  count?: number; // red notification bubble
  className?: string;
};

export function IconButton({ icon, label, variant = "outline", count, className = "" }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition ${
        variant === "solid" ? "bg-ink text-white hover:bg-ink/85" : "border border-ink bg-white text-ink hover:bg-field"
      } ${className}`}
    >
      <Icon name={icon} />
      {count !== undefined && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-alert px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export function NotificationBell() {
  return <IconButton icon="bell" label="Notifications, 3 unread" count={3} />;
}

type ButtonProps = {
  children: ReactNode;
  variant?: "solid" | "outline" | "soft" | "pink";
  icon?: IconName;
  className?: string;
  type?: "button" | "submit";
};

export function Button({ children, variant = "solid", icon, className = "", type = "button" }: ButtonProps) {
  const styles = {
    solid: "bg-ink text-white hover:bg-ink/85",
    outline: "border border-ink bg-transparent text-ink hover:bg-ink/5",
    soft: "bg-field text-link hover:bg-[#e9ecf3]",
    pink: "bg-rose text-ink hover:bg-rose/85",
  };
  return (
    <button
      type={type}
      className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition ${styles[variant]} ${className}`}
    >
      {icon && <Icon name={icon} className="h-[18px] w-[18px]" />}
      {children}
    </button>
  );
}

// Rounded filter chip. `active` is only a visual state for now.
export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`h-11 shrink-0 rounded-full px-5 text-sm font-bold transition ${
        active ? "bg-ink text-white" : "border border-ink/80 bg-white text-ink hover:bg-field"
      }`}
    >
      {children}
    </button>
  );
}

// Grey track with one dark selected segment (Posts / Photos / About).
export function Segmented({ items, active, className = "" }: { items: string[]; active: string; className?: string }) {
  return (
    <div className={`inline-flex gap-1 rounded-full bg-field p-1.5 ${className}`}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={item === active}
          className={`h-10 rounded-full px-5 text-sm font-bold transition ${
            item === active ? "bg-ink text-white" : "text-ink hover:bg-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// Small label chip used on forum cards.
export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${dark ? "bg-ink text-white" : "bg-white text-ink"}`}>
      {children}
    </span>
  );
}

// Big page heading ("Feeds", "Forums", ...)
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-extrabold text-ink">{children}</h1>;
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-2xl font-extrabold text-ink ${className}`}>{children}</h2>;
}
