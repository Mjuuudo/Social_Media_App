import { useId } from "react";

// Flat placeholder illustrations used instead of real photos.
// They stretch to fill any box (like object-fit: cover).
export type SceneName =
  | "mountain"
  | "desert"
  | "flower"
  | "canyon"
  | "lake"
  | "city"
  | "latte"
  | "salad"
  | "hills";

type SceneProps = {
  name: SceneName;
  className?: string;
  label?: string; // alt text; omit for decorative images
};

export default function Scene({ name, className = "", label }: SceneProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {scenes[name](id)}
    </svg>
  );
}

const scenes: Record<SceneName, (id: string) => React.ReactNode> = {
  mountain: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb4d6" />
          <stop offset="1" stopColor="#c9d5ea" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}s)`} />
      <path d="M-10 300 L120 150 L200 60 L290 160 L410 230 L410 300 Z" fill="#5f7191" />
      <path d="M200 60 L172 92 L188 88 L198 104 L210 86 L228 96 Z" fill="#f4f7fb" />
      <path d="M40 220 L70 196 L82 208 L60 230Z" fill="#f4f7fb" opacity=".9" />
      <path d="M-10 300 L60 215 L150 260 L250 205 L410 270 L410 300 Z" fill="#44506b" />
    </>
  ),
  desert: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8c6dc" />
          <stop offset="1" stopColor="#dcdcd2" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}s)`} />
      <path d="M150 180 L215 110 L265 180Z" fill="#d79a5a" />
      <path d="M215 110 L265 180 L240 180Z" fill="#b97d45" />
      <path d="M95 180 L130 140 L160 180Z" fill="#d79a5a" />
      <path d="M130 140 L160 180 L148 180Z" fill="#b97d45" />
      <path d="M-10 185 Q120 160 230 178 T410 165 V300 H-10Z" fill="#e8b878" />
      <path d="M-10 225 Q110 205 220 222 T410 210 V300 H-10Z" fill="#d89c5e" />
      <path d="M-10 265 Q130 245 250 262 T410 255 V300 H-10Z" fill="#bf8048" />
    </>
  ),
  flower: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4b878" />
          <stop offset="1" stopColor="#e7825d" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx=".3" cy=".3" r=".45">
          <stop offset="0" stopColor="#fff2c8" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff2c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}s)`} />
      <rect width="400" height="300" fill={`url(#${id}g)`} />
      <circle cx="300" cy="45" r="16" fill="#f8cf8e" />
      <circle cx="70" cy="200" r="9" fill="#f3ad78" />
      <path d="M200 255 C196 215 204 175 200 140" stroke="#4f7a3c" strokeWidth="4" fill="none" />
      <path d="M200 95 C180 100 178 135 200 145 C222 135 220 100 200 95Z" fill="#9a7fd6" />
      <path d="M200 100 C188 108 186 132 200 145 C190 128 192 112 200 100Z" fill="#b9a2ec" />
      <path d="M200 145 C185 140 176 120 183 104 C195 112 200 130 200 145Z" fill="#8468c4" />
      <circle cx="200" cy="128" r="3.5" fill="#f2c96b" />
      <path d="M-10 255 Q200 225 410 250 V300 H-10Z" fill="#3a2a20" />
    </>
  ),
  canyon: () => (
    <>
      <rect width="400" height="300" fill="#f2d3aa" />
      <path d="M-10 300 V40 L40 20 L70 60 L110 60 L130 300Z" fill="#b5694a" />
      <path d="M290 300 L300 70 L340 60 L360 20 L410 25 V300Z" fill="#a65b3d" />
      <path d="M100 300 L110 170 L170 150 L220 165 L270 150 L305 170 L310 300Z" fill="#c9875a" />
      <path d="M-10 300 V230 Q150 210 230 240 T410 230 V300Z" fill="#7a3f28" />
      <path d="M150 300 Q180 260 215 250 Q240 245 250 230 Q245 262 200 300Z" fill="#8fb7d6" />
    </>
  ),
  lake: () => (
    <>
      <rect width="400" height="300" fill="#c8dfe6" />
      <path d="M-10 160 Q90 120 200 140 T410 110 V175 H-10Z" fill="#8fae9e" />
      <rect y="172" width="400" height="128" fill="#8fc0cd" />
      <path d="M40 230 H160 M210 250 H360 M90 270 H250" stroke="#d9eef2" strokeWidth="2" opacity=".7" />
      {[
        [40, 172, 22],
        [62, 172, 30],
        [84, 172, 20],
        [300, 172, 26],
        [325, 172, 34],
        [350, 172, 22],
      ].map(([x, y, h], i) => (
        <g key={i}>
          <path d={`M${x - 11} ${y} L${x} ${y - h * 1.6} L${x + 11} ${y}Z`} fill="#2f4f3e" />
          <path d={`M${x - 11} ${y} L${x} ${y + h * 1.3} L${x + 11} ${y}Z`} fill="#2f4f3e" opacity=".25" />
        </g>
      ))}
    </>
  ),
  city: () => (
    <>
      <rect width="400" height="300" fill="#1f2245" />
      <rect y="150" width="400" height="150" fill="#272a52" opacity=".6" />
      <circle cx="320" cy="70" r="18" fill="#f6e6bf" />
      {[
        [10, 190, 40],
        [60, 140, 45],
        [115, 210, 35],
        [155, 120, 40],
        [205, 180, 50],
        [265, 150, 38],
        [312, 200, 40],
        [360, 165, 50],
      ].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={300 - y} fill="#13162f" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={x + 8} y={y + 14 + r * 26} width="5" height="5" fill="#f2c96b" opacity={r === 1 ? 0.5 : 1} />
              <rect x={x + w - 14} y={y + 26 + r * 26} width="5" height="5" fill="#f2c96b" />
            </g>
          ))}
        </g>
      ))}
    </>
  ),
  latte: () => (
    <>
      <rect width="400" height="300" fill="#e5d4be" />
      <path d="M0 210 L400 150 V300 H0Z" fill="#dcc8ae" opacity=".5" />
      <circle cx="200" cy="150" r="110" fill="#f6f1ea" />
      <path d="M305 135 a28 28 0 0 1 0 40" stroke="#f6f1ea" strokeWidth="18" fill="none" />
      <circle cx="200" cy="150" r="82" fill="#8a5634" />
      <path d="M200 205 C150 170 150 120 180 115 C192 113 200 122 200 132 C200 122 208 113 220 115 C250 120 250 170 200 205Z" fill="#f1e2cc" />
      <circle cx="60" cy="250" r="30" fill="none" stroke="#5a3a26" strokeWidth="7" />
      <circle cx="350" cy="40" r="26" fill="none" stroke="#5a3a26" strokeWidth="7" />
    </>
  ),
  salad: () => (
    <>
      <rect width="400" height="300" fill="#ece4d8" />
      <circle cx="190" cy="150" r="120" fill="#f8f5ef" />
      <circle cx="190" cy="150" r="95" fill="#f2ede4" />
      <ellipse cx="160" cy="125" rx="34" ry="15" transform="rotate(-25 160 125)" fill="#5d9447" />
      <ellipse cx="225" cy="120" rx="30" ry="13" transform="rotate(20 225 120)" fill="#4c8139" />
      <ellipse cx="190" cy="160" rx="40" ry="17" fill="#6ea957" />
      <ellipse cx="150" cy="185" rx="26" ry="12" transform="rotate(20 150 185)" fill="#4c8139" />
      <ellipse cx="235" cy="185" rx="28" ry="12" transform="rotate(-30 235 185)" fill="#5d9447" />
      <circle cx="205" cy="145" r="9" fill="#e0573f" />
      <circle cx="170" cy="155" r="6" fill="#f0a23c" />
      <rect x="290" y="210" width="130" height="14" rx="7" transform="rotate(-38 290 210)" fill="#c58a55" />
    </>
  ),
  hills: () => (
    <>
      <rect width="400" height="300" fill="#ecbdbd" />
      <path d="M-10 300 V140 L70 90 L150 150 L240 50 L330 130 L410 90 V300Z" fill="#a97a8c" />
      <path d="M-10 300 V200 L90 150 L190 210 L290 150 L410 200 V300Z" fill="#7e5571" />
      <path d="M-10 300 V250 L120 220 L260 255 L410 235 V300Z" fill="#4f3448" />
    </>
  ),
};
