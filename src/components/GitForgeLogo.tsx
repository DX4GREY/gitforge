import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface GitForgeLogoProps {
  className?: string;
  size?: number;
}

export const GitForgeLogo: React.FC<GitForgeLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  const { activeTheme } = useTheme();

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} select-none shrink-0`}
      style={{ width: size, height: size }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients using the theme's primary color for a consistent, seamless branding feel */}
        <linearGradient id="anvilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={activeTheme.primary} />
          <stop offset="100%" stopColor="#22d3ee" /> {/* Glowing cyan accent */}
        </linearGradient>
        <linearGradient id="innerBranchGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" /> {/* Molten metal red/orange */}
          <stop offset="100%" stopColor="#eab308" /> {/* Spark gold */}
        </linearGradient>
        {/* Drop shadow for visual depth in modern, non-flat layouts */}
        <filter id="forgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. THE ANVIL (The Foundation): Representing raw creation, solid craftsmanship, and durability */}
      {/* 
        This custom path draws a sleek, balanced, minimalist cyber-anvil:
        M 18 30 -> Top-Left horn curve
        H 82 -> Top flat anvil surface (working table)
        V 42 -> Thick flat anvil block
        Q 68 44 62 58 -> Smooth inner ergonomic neck curves
        L 68 76 -> Base feet (right)
        H 32 -> Base feet (left)
        L 38 58 -> Smooth neck curve (left)
        Q 32 44 18 30 -> Taper back to left horn curve
      */}
      <path
        d="M 18 30 H 82 V 42 Q 68 44 62 58 L 68 76 H 32 L 38 58 Q 32 44 18 30 Z"
        fill="url(#anvilGradient)"
        className="transition-all duration-300"
      />

      {/* 2. THE GIT CONNECTIVITY SYSTEM: Commits and merge branches seamlessly carved into the anvil */}
      {/* Left Input Node & Branch Line */}
      <line
        x1="32"
        y1="76"
        x2="50"
        y2="54"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      
      {/* Right Output Node & Branch Line */}
      <line
        x1="68"
        y1="76"
        x2="50"
        y2="54"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Main Release Line pointing to the working surface */}
      <line
        x1="50"
        y1="54"
        x2="50"
        y2="30"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Branch Commit Node (Left Source) */}
      <circle cx="32" cy="76" r="6.5" fill="#ffffff" />
      <circle cx="32" cy="76" r="3" fill={activeTheme.primary} />

      {/* Branch Commit Node (Right Target) */}
      <circle cx="68" cy="76" r="6.5" fill="#ffffff" />
      <circle cx="68" cy="76" r="3" fill="#22d3ee" />

      {/* The Central Forging Node (Merge Commit): Central point where ideas are shaped */}
      <circle cx="50" cy="54" r="9" fill="url(#innerBranchGradient)" filter="url(#forgeGlow)" />
      <circle cx="50" cy="54" r="4.5" fill="#ffffff" />

      {/* The Release/Deploy Node: Sits at the flat working table, denoting complete and crafted solutions */}
      <circle cx="50" cy="30" r="7" fill="#ffffff" className="animate-pulse" />
      <circle cx="50" cy="30" r="3" fill="#ef4444" />

      {/* 3. THE SPARK OF IDEA (Creative Flare): Sits right above the anvil representing continuous inspiration */}
      <path
        d="M 50 11 L 52.5 18 L 59.5 15.5 L 54.5 21 L 58.5 27 L 50 23.5 L 41.5 27 L 45.5 21 L 40.5 15.5 L 47.5 18 Z"
        fill="#fbbf24" /* Golden yellow spark */
      />
    </svg>
  );
};
