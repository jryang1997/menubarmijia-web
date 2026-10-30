import React from 'react';

interface OfficialLogoProps {
  className?: string;
  isLit?: boolean;
  glowColor?: string;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = 'w-8 h-8',
  isLit = true,
  glowColor = '#F59E0B',
}) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mbm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E2433" />
          <stop offset="0.5" stopColor="#131722" />
          <stop offset="1" stopColor="#0C0F17" />
        </linearGradient>
        <linearGradient id="mbm-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="mbm-house" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="mbm-track" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isLit ? '#FFC24D' : '#475569'} />
          <stop offset="1" stopColor={isLit ? '#F2861C' : '#334155'} />
        </linearGradient>
      </defs>
      {/* Squircle Base */}
      <rect x="64" y="64" width="896" height="896" rx="210" fill="url(#mbm-bg)" stroke="rgba(255,255,255,0.16)" strokeWidth="24" />
      {/* Dynamic Ambient Glow inside icon */}
      {isLit && (
        <ellipse cx="512" cy="690" rx="320" ry="240" fill={glowColor} fillOpacity="0.32" />
      )}
      {/* Top Menu Bar strip */}
      <path d="M64 274C64 158.02 158.02 64 274 64H750C865.98 64 960 158.02 960 274V286H64V274Z" fill="url(#mbm-bar)" />
      <rect x="436" y="144" width="152" height="64" rx="32" fill="#FFFFFF" fillOpacity="0.22" />
      {/* Small house in menu bar */}
      <path d="M512 155L550 185V200H474V185L512 155Z" fill="#FFFFFF" />
      {/* Main Popover House Silhouette */}
      <path
        d="M512 330C526 330 538 339 548 347L748 500C764 513 764 534 764 550V784C764 824 732 836 710 836H314C292 836 260 824 260 784V550C260 534 260 513 276 500L476 347C486 339 498 330 512 330Z"
        fill="url(#mbm-house)"
      />
      {/* Toggle Switch inside house */}
      <rect x="384" y="596" width="256" height="136" rx="68" fill="url(#mbm-track)" />
      <circle
        cx={isLit ? 572 : 452}
        cy="664"
        r="54"
        fill="#FFFFFF"
      />
    </svg>
  );
};
