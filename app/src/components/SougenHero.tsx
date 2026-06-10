import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';

interface SougenHeroProps {
  greeting: string;
  firstName: string;
  dateLabel: string;
}

interface EyeOffset {
  x: number;
  y: number;
}

// SVG viewBox is 200 x 280
const LEFT_EYE_CENTER  = { x: 80,  y: 110 };
const RIGHT_EYE_CENTER = { x: 120, y: 110 };
const MAX_OFFSET = 5;

function calcOffset(
  eyeSvgX: number,
  eyeSvgY: number,
  cursor: { x: number; y: number },
  svgRect: DOMRect,
  viewBoxW: number,
  viewBoxH: number,
): EyeOffset {
  // Map cursor to SVG coordinate space
  const scaleX = viewBoxW / svgRect.width;
  const scaleY = viewBoxH / svgRect.height;
  const cursorSvgX = (cursor.x - svgRect.left) * scaleX;
  const cursorSvgY = (cursor.y - svgRect.top)  * scaleY;

  const dx = cursorSvgX - eyeSvgX;
  const dy = cursorSvgY - eyeSvgY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const clamp = Math.min(dist, MAX_OFFSET) / dist;
  return { x: dx * clamp, y: dy * clamp };
}

export default function SougenHero({ greeting, firstName, dateLabel }: SougenHeroProps) {
  const { acseScore } = useAppStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [leftOffset,  setLeftOffset]  = useState<EyeOffset>({ x: 0, y: 0 });
  const [rightOffset, setRightOffset] = useState<EyeOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const cursor = { x: e.clientX, y: e.clientY };
      setLeftOffset(calcOffset(LEFT_EYE_CENTER.x, LEFT_EYE_CENTER.y, cursor, rect, 200, 280));
      setRightOffset(calcOffset(RIGHT_EYE_CENTER.x, RIGHT_EYE_CENTER.y, cursor, rect, 200, 280));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="sougen-hero">
      <div className="sougen-hero__figure">
        <svg
          ref={svgRef}
          viewBox="0 0 200 280"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Head fill — very dark gray with subtle gradient */}
            <radialGradient id="headGrad" cx="42%" cy="38%" r="58%">
              <stop offset="0%"   stopColor="#2a2030" />
              <stop offset="100%" stopColor="#0f0c18" />
            </radialGradient>

            {/* Ambient halo */}
            <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(201,165,100,0.18)" />
              <stop offset="60%"  stopColor="rgba(168,150,216,0.07)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Neck/shoulder fill */}
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#1a1520" />
              <stop offset="100%" stopColor="#0b0910" />
            </linearGradient>

            {/* Sclera gradient */}
            <radialGradient id="scleraGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%"   stopColor="#e8dfcc" />
              <stop offset="100%" stopColor="#c8bfa8" />
            </radialGradient>

            {/* Gold glow filter */}
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Soft drop shadow for head */}
            <filter id="headShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.7)" />
            </filter>
          </defs>

          {/* ── Ambient halo ── */}
          <ellipse cx="100" cy="120" rx="90" ry="85"
            fill="url(#haloGrad)" opacity="0.9" />

          {/* ── Decorative geometric lines (editorial feel) ── */}
          {/* Horizontal rule left */}
          <line x1="10" y1="115" x2="50" y2="115"
            stroke="rgba(201,165,100,0.22)" strokeWidth="0.5" />
          {/* Horizontal rule right */}
          <line x1="150" y1="115" x2="190" y2="115"
            stroke="rgba(201,165,100,0.22)" strokeWidth="0.5" />
          {/* Left triangle accent */}
          <polygon points="22,95 32,108 12,108"
            fill="none" stroke="rgba(201,165,100,0.18)" strokeWidth="0.6" />
          {/* Right triangle accent */}
          <polygon points="178,95 168,108 188,108"
            fill="none" stroke="rgba(201,165,100,0.18)" strokeWidth="0.6" />
          {/* Top arc decorative */}
          <path d="M 60 48 Q 100 30 140 48"
            fill="none" stroke="rgba(168,150,216,0.20)" strokeWidth="0.7"
            strokeDasharray="3 4" />
          {/* Small cross marks */}
          <line x1="38" y1="75" x2="38" y2="85"
            stroke="rgba(201,165,100,0.25)" strokeWidth="0.6" />
          <line x1="33" y1="80" x2="43" y2="80"
            stroke="rgba(201,165,100,0.25)" strokeWidth="0.6" />
          <line x1="162" y1="75" x2="162" y2="85"
            stroke="rgba(201,165,100,0.25)" strokeWidth="0.6" />
          <line x1="157" y1="80" x2="167" y2="80"
            stroke="rgba(201,165,100,0.25)" strokeWidth="0.6" />

          {/* ── Shoulders / body silhouette ── */}
          <path
            d="M 60 175 Q 55 210 30 230 L 170 230 Q 145 210 140 175 Q 120 185 100 185 Q 80 185 60 175 Z"
            fill="url(#bodyGrad)"
            opacity="0.85"
          />
          {/* Neck */}
          <rect x="88" y="163" width="24" height="20" rx="8"
            fill="url(#bodyGrad)" opacity="0.9" />

          {/* ── Head circle ── */}
          <circle cx="100" cy="110" r="62"
            fill="url(#headGrad)" filter="url(#headShadow)" />

          {/* Head border — faint gold ring */}
          <circle cx="100" cy="110" r="62"
            fill="none"
            stroke="rgba(201,165,100,0.20)" strokeWidth="0.8" />

          {/* Inner head detail ring */}
          <circle cx="100" cy="110" r="56"
            fill="none"
            stroke="rgba(232,223,204,0.05)" strokeWidth="0.5" />

          {/* ── Left eye ── */}
          {/* Sclera */}
          <ellipse cx={LEFT_EYE_CENTER.x} cy={LEFT_EYE_CENTER.y} rx="13" ry="9"
            fill="url(#scleraGrad)" />
          {/* Iris */}
          <ellipse
            cx={LEFT_EYE_CENTER.x  + leftOffset.x}
            cy={LEFT_EYE_CENTER.y  + leftOffset.y}
            rx="7" ry="7"
            fill="#1c1428"
            className="sougen-hero__eye"
          />
          {/* Pupil */}
          <ellipse
            cx={LEFT_EYE_CENTER.x  + leftOffset.x}
            cy={LEFT_EYE_CENTER.y  + leftOffset.y}
            rx="3.5" ry="3.5"
            fill="#050408"
            className="sougen-hero__eye"
          />
          {/* Eye highlight */}
          <ellipse
            cx={LEFT_EYE_CENTER.x  + leftOffset.x - 1.5}
            cy={LEFT_EYE_CENTER.y  + leftOffset.y - 2}
            rx="1.5" ry="1"
            fill="rgba(232,223,204,0.7)"
            className="sougen-hero__eye"
          />
          {/* Eyelid crease */}
          <path
            d={`M ${LEFT_EYE_CENTER.x - 13} ${LEFT_EYE_CENTER.y}
                Q ${LEFT_EYE_CENTER.x} ${LEFT_EYE_CENTER.y - 11}
                  ${LEFT_EYE_CENTER.x + 13} ${LEFT_EYE_CENTER.y}`}
            fill="none"
            stroke="rgba(20,15,30,0.7)" strokeWidth="1.2"
          />

          {/* ── Right eye ── */}
          {/* Sclera */}
          <ellipse cx={RIGHT_EYE_CENTER.x} cy={RIGHT_EYE_CENTER.y} rx="13" ry="9"
            fill="url(#scleraGrad)" />
          {/* Iris */}
          <ellipse
            cx={RIGHT_EYE_CENTER.x + rightOffset.x}
            cy={RIGHT_EYE_CENTER.y + rightOffset.y}
            rx="7" ry="7"
            fill="#1c1428"
            className="sougen-hero__eye"
          />
          {/* Pupil */}
          <ellipse
            cx={RIGHT_EYE_CENTER.x + rightOffset.x}
            cy={RIGHT_EYE_CENTER.y + rightOffset.y}
            rx="3.5" ry="3.5"
            fill="#050408"
            className="sougen-hero__eye"
          />
          {/* Eye highlight */}
          <ellipse
            cx={RIGHT_EYE_CENTER.x + rightOffset.x - 1.5}
            cy={RIGHT_EYE_CENTER.y + rightOffset.y - 2}
            rx="1.5" ry="1"
            fill="rgba(232,223,204,0.7)"
            className="sougen-hero__eye"
          />
          {/* Eyelid crease */}
          <path
            d={`M ${RIGHT_EYE_CENTER.x - 13} ${RIGHT_EYE_CENTER.y}
                Q ${RIGHT_EYE_CENTER.x} ${RIGHT_EYE_CENTER.y - 11}
                  ${RIGHT_EYE_CENTER.x + 13} ${RIGHT_EYE_CENTER.y}`}
            fill="none"
            stroke="rgba(20,15,30,0.7)" strokeWidth="1.2"
          />

          {/* ── Subtle nose bridge ── */}
          <path d="M 97 118 Q 95 128 97 133 Q 100 136 103 133 Q 105 128 103 118"
            fill="none"
            stroke="rgba(20,15,30,0.55)" strokeWidth="1"
            strokeLinecap="round"
          />

          {/* ── Mouth — closed calm line ── */}
          <path d="M 90 148 Q 100 153 110 148"
            fill="none"
            stroke="rgba(100,80,60,0.55)" strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* ── ACSE score as tiny label inside head ── */}
          <text
            x="100" y="168"
            textAnchor="middle"
            fontSize="7"
            letterSpacing="0.2em"
            fill="rgba(201,165,100,0.45)"
            fontFamily="system-ui, sans-serif"
          >
            {acseScore}
          </text>

          {/* ── Gold glow dots along head rim ── */}
          <circle cx="100" cy="48"  r="1.5"
            fill="#C9A564" opacity="0.55" filter="url(#goldGlow)" />
          <circle cx="162" cy="110" r="1"
            fill="#C9A564" opacity="0.40" />
          <circle cx="38"  cy="110" r="1"
            fill="#C9A564" opacity="0.40" />
        </svg>
      </div>

      <div className="sougen-hero__text">
        <p className="sougen-hero__date">{dateLabel}</p>
        <p className="sougen-hero__greeting">{greeting}, {firstName}</p>
      </div>
    </div>
  );
}
