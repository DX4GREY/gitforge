import React, { useState } from 'react';
import { 
  UserCheck, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Laptop, 
  Sparkles, 
  Smile, 
  Sliders, 
  Layers,
  Flame,
  Wand2,
  Cpu
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AvatarPreset {
  name: string;
  bgColor: string;
  bgColorSecondary: string;
  bgType: 'solid' | 'gradient' | 'circuit' | 'binary';
  skinColor: string;
  hairStyle: 'none' | 'shaggy' | 'spike' | 'comb' | 'dreadlocks' | 'beanie';
  hairColor: string;
  beardStyle: 'none' | 'stubble' | 'full' | 'goatee' | 'mustache';
  beardColor: string;
  eyewear: 'none' | 'glasses' | 'visor' | 'pixel';
  eyewearColor: string;
  gear: 'none' | 'headset' | 'airbuds';
  clothing: 'hoodie' | 'highcollar' | 'tshirt' | 'polo';
  clothingColor: string;
  expression: 'happy' | 'neutral' | 'focused' | 'smirk';
  overlayFrame: boolean;
}

const PRESETS: AvatarPreset[] = [
  {
    name: "Cyber Hacker",
    bgColor: "#040a12",
    bgColorSecondary: "#0d1e33",
    bgType: "gradient",
    skinColor: "#fca5a5",
    hairStyle: "spike",
    hairColor: "#00ffff",
    beardStyle: "goatee",
    beardColor: "#00ffff",
    eyewear: "visor",
    eyewearColor: "#00ffff",
    gear: "headset",
    clothing: "highcollar",
    clothingColor: "#091321",
    expression: "focused",
    overlayFrame: true,
  },
  {
    name: "Minimalist Coder",
    bgColor: "#1e293b",
    bgColorSecondary: "#0f172a",
    bgType: "solid",
    skinColor: "#fee2e2",
    hairStyle: "comb",
    hairColor: "#ec4899",
    beardStyle: "none",
    beardColor: "#ec4899",
    eyewear: "glasses",
    eyewearColor: "#1e293b",
    gear: "airbuds",
    clothing: "polo",
    clothingColor: "#475569",
    expression: "happy",
    overlayFrame: false,
  },
  {
    name: "AI Researcher",
    bgColor: "#111827",
    bgColorSecondary: "#1f2937",
    bgType: "gradient",
    skinColor: "#fed7aa",
    hairStyle: "shaggy",
    hairColor: "#f59e0b",
    beardStyle: "stubble",
    beardColor: "#3f3f46",
    eyewear: "glasses",
    eyewearColor: "#f59e0b",
    gear: "none",
    clothing: "hoodie",
    clothingColor: "#111827",
    expression: "smirk",
    overlayFrame: true,
  },
  {
    name: "Retro Game Dev",
    bgColor: "#0c0a09",
    bgColorSecondary: "#1c1917",
    bgType: "binary",
    skinColor: "#ffedd5",
    hairStyle: "beanie",
    hairColor: "#f43f5e",
    beardStyle: "full",
    beardColor: "#78716c",
    eyewear: "pixel",
    eyewearColor: "#000000",
    gear: "headset",
    clothing: "tshirt",
    clothingColor: "#292524",
    expression: "neutral",
    overlayFrame: true,
  }
];

// Color pallets
const BG_PALETTE = ['#040a12', '#0f172a', '#1e1b4b', '#022c22', '#1c1917', '#111827', '#311021'];
const BG_SEC_PALETTE = ['#000000', '#0f172a', '#3b0764', '#115e59', '#450a0a', '#1f2937', '#581c87'];
const SKIN_PALETTE = ['#fee2e2', '#fca5a5', '#fed7aa', '#fde047', '#d97706', '#b45309', '#78350f'];
const HAIR_PALETTE = ['#00ffff', '#f43f5e', '#ec4899', '#a3e635', '#f59e0b', '#10b981', '#18181b', '#e4e4e7'];
const GEAR_PALETTE = ['#00ffff', '#f43f5e', '#ffffff', '#18181b', '#f59e0b', '#10b981'];

export const AvatarGeneratorPage: React.FC = () => {
  const { activeTheme } = useTheme();
  
  // Custom states
  const [presetName, setPresetName] = useState<string>("Cyber Hacker");
  const [bgColor, setBgColor] = useState('#040a12');
  const [bgColorSecondary, setBgColorSecondary] = useState('#0d1e33');
  const [bgType, setBgType] = useState<'solid' | 'gradient' | 'circuit' | 'binary'>('gradient');
  
  const [skinColor, setSkinColor] = useState('#fca5a5');
  const [hairStyle, setHairStyle] = useState<'none' | 'shaggy' | 'spike' | 'comb' | 'dreadlocks' | 'beanie'>('spike');
  const [hairColor, setHairColor] = useState('#00ffff');
  
  const [beardStyle, setBeardStyle] = useState<'none' | 'stubble' | 'full' | 'goatee' | 'mustache'>('goatee');
  const [beardColor, setBeardColor] = useState('#00ffff');
  
  const [eyewear, setEyewear] = useState<'none' | 'glasses' | 'visor' | 'pixel'>('visor');
  const [eyewearColor, setEyewearColor] = useState('#00ffff');
  
  const [gear, setGear] = useState<'none' | 'headset' | 'airbuds'>('headset');
  
  const [clothing, setClothing] = useState<'hoodie' | 'highcollar' | 'tshirt' | 'polo'>('highcollar');
  const [clothingColor, setClothingColor] = useState('#091321');
  
  const [expression, setExpression] = useState<'happy' | 'neutral' | 'focused' | 'smirk'>('focused');
  const [overlayFrame, setOverlayFrame] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'preset' | 'backdrop' | 'head' | 'gear'>('preset');
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000));

  const applyPreset = (p: AvatarPreset) => {
    setBgColor(p.bgColor);
    setBgColorSecondary(p.bgColorSecondary);
    setBgType(p.bgType);
    setSkinColor(p.skinColor);
    setHairStyle(p.hairStyle);
    setHairColor(p.hairColor);
    setBeardStyle(p.beardStyle);
    setBeardColor(p.beardColor);
    setEyewear(p.eyewear);
    setEyewearColor(p.eyewearColor);
    setGear(p.gear);
    setClothing(p.clothing);
    setClothingColor(p.clothingColor);
    setExpression(p.expression);
    setOverlayFrame(p.overlayFrame);
  };

  const randomize = () => {
    setSeed(Math.floor(Math.random() * 10000));
    setBgColor(BG_PALETTE[Math.floor(Math.random() * BG_PALETTE.length)]);
    setBgColorSecondary(BG_SEC_PALETTE[Math.floor(Math.random() * BG_SEC_PALETTE.length)]);
    setBgType(['solid', 'gradient', 'circuit', 'binary'][Math.floor(Math.random() * 4)] as any);
    
    setSkinColor(SKIN_PALETTE[Math.floor(Math.random() * SKIN_PALETTE.length)]);
    setHairStyle(['none', 'shaggy', 'spike', 'comb', 'dreadlocks', 'beanie'][Math.floor(Math.random() * 6)] as any);
    setHairColor(HAIR_PALETTE[Math.floor(Math.random() * HAIR_PALETTE.length)]);
    
    setBeardStyle(['none', 'stubble', 'full', 'goatee', 'mustache'][Math.floor(Math.random() * 5)] as any);
    setBeardColor(HAIR_PALETTE[Math.floor(Math.random() * HAIR_PALETTE.length)]);
    
    setEyewear(['none', 'glasses', 'visor', 'pixel'][Math.floor(Math.random() * 4)] as any);
    setEyewearColor(GEAR_PALETTE[Math.floor(Math.random() * GEAR_PALETTE.length)]);
    
    setGear(['none', 'headset', 'airbuds'][Math.floor(Math.random() * 3)] as any);
    setClothing(['hoodie', 'highcollar', 'tshirt', 'polo'][Math.floor(Math.random() * 4)] as any);
    setClothingColor(BG_PALETTE[Math.floor(Math.random() * BG_PALETTE.length)]);
    setExpression(['happy', 'neutral', 'focused', 'smirk'][Math.floor(Math.random() * 4)] as any);
    setOverlayFrame(Math.random() > 0.4);
  };

  // SVGs logic
  const getBackgroundSvg = () => {
    if (bgType === 'solid') {
      return `<rect width="200" height="200" rx="30" fill="${bgColor}"/>`;
    }
    
    return `<defs>
      <linearGradient id="avatarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="${bgColorSecondary}" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="30" fill="url(#avatarBgGrad)"/>`;
  };

  const getBackgroundOverlays = () => {
    if (bgType === 'circuit') {
      return `
      <g opacity="0.14" stroke="${eyewearColor}" stroke-linecap="round">
        <path d="M 10 20 H 45 V 75 H 20" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="75" r="3" fill="${eyewearColor}"/>
        <path d="M 190 30 H 155 V 85 H 180" stroke-width="1.5" fill="none"/>
        <circle cx="180" cy="85" r="3" fill="${eyewearColor}"/>
        <path d="M 25 180 V 135 H 55" stroke-width="1.5" fill="none"/>
        <circle cx="55" cy="135" r="3" fill="${eyewearColor}"/>
        <path d="M 175 170 V 125 H 145" stroke-width="1.5" fill="none"/>
        <circle cx="145" cy="125" r="3" fill="${eyewearColor}"/>
      </g>`;
    }
    if (bgType === 'binary') {
      return `
      <g opacity="0.12" font-family="monospace" font-size="8.5" font-weight="bold" fill="${hairColor}">
        <text x="15" y="32">01</text>
        <text x="15" y="52">10</text>
        <text x="15" y="72">11</text>
        <text x="15" y="92">00</text>
        <text x="172" y="32">10</text>
        <text x="172" y="52">01</text>
        <text x="172" y="72">00</text>
        <text x="172" y="92">11</text>
      </g>`;
    }
    return '';
  };

  const getEars = () => {
    return `
    <circle cx="52" cy="95" r="9" fill="${skinColor}"/>
    <circle cx="148" cy="95" r="9" fill="${skinColor}"/>`;
  };

  const getFacialHair = () => {
    if (beardStyle === 'none') return '';
    if (beardStyle === 'stubble') {
      return `<path d="M 54 95 C 54 144, 146 144, 146 95 C 134 108, 66 108, 54 95 Z" fill="${beardColor}" fill-opacity="0.25"/>`;
    }
    if (beardStyle === 'full') {
      return `
      <path d="M 54 95 C 54 146, 146 146, 146 95 C 134 110, 66 110, 54 95 Z" fill="${beardColor}"/>
      <path d="M 82 108 Q 100 118 118 108" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    if (beardStyle === 'goatee') {
      return `<path d="M 84 106 C 84 140, 116 140, 116 106 Q 100 126 84 106" fill="${beardColor}"/>`;
    }
    if (beardStyle === 'mustache') {
      return `<path d="M 80 108 Q 100 115 120 108 Q 100 100 80 108 Z" fill="${beardColor}"/>`;
    }
    return '';
  };

  const getEyesAndMouth = () => {
    let eyesSvg = '';
    let browsSvg = '';
    let mouthSvg = '';

    if (expression === 'happy') {
      eyesSvg = `
        <path d="M 78 96 Q 84 88 90 96" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <path d="M 110 96 Q 116 88 122 96" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>`;
      browsSvg = `
        <path d="M 74 83 Q 84 76 92 81" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <path d="M 108 81 Q 116 76 126 83" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>`;
      mouthSvg = `<path d="M 86 110 Q 100 125 114 110" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>`;
    } else if (expression === 'focused') {
      eyesSvg = `
        <circle cx="84" cy="94" r="5.5" fill="#0f172a"/>
        <circle cx="116" cy="94" r="5.5" fill="#0f172a"/>`;
      browsSvg = `
        <path d="M 74 85 Q 84 81 92 86" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 108 86 Q 116 81 126 85" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>`;
      mouthSvg = `<path d="M 92 114 Q 100 111 108 114" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>`;
    } else if (expression === 'smirk') {
      eyesSvg = `
        <circle cx="84" cy="94" r="5" fill="#0f172a"/>
        <circle cx="116" cy="94" r="5" fill="#0f172a"/>`;
      browsSvg = `
        <path d="M 74 83 Q 84 78 92 82" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <path d="M 108 82 Q 116 75 126 81" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>`;
      mouthSvg = `<path d="M 90 114 Q 102 118 114 110" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>`;
    } else { // neutral
      eyesSvg = `
        <circle cx="84" cy="94" r="5" fill="#0f172a"/>
        <circle cx="116" cy="94" r="5" fill="#0f172a"/>`;
      browsSvg = `
        <path d="M 74 83 Q 84 78 92 83" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
        <path d="M 108 83 Q 116 78 126 83" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>`;
      mouthSvg = `<line x1="90" y1="114" x2="110" y2="114" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>`;
    }

    return `
    ${browsSvg}
    ${eyesSvg}
    ${mouthSvg}`;
  };

  const getHair = () => {
    if (hairStyle === 'none') {
      return `<path d="M 75 72 Q 100 58 125 72" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3.5" stroke-linecap="round"/>`;
    }
    if (hairStyle === 'shaggy') {
      return `
      <path d="M 53 90 C 53 45, 147 45, 147 90 C 130 65, 70 65, 53 90 Z" fill="${hairColor}"/>
      <path d="M 70 65 C 80 55, 110 50, 115 65 C 105 65, 85 70, 70 65 Z" fill="${hairColor}" opacity="0.9"/>`;
    }
    if (hairStyle === 'spike') {
      return `<path d="M 52 90 L 58 50 L 73 58 L 90 35 L 107 48 L 125 35 L 140 52 L 148 90 C 135 70, 65 70, 52 90 Z" fill="${hairColor}"/>`;
    }
    if (hairStyle === 'comb') {
      return `<path d="M 53 90 C 53 45, 147 45, 147 90 C 132 72, 105 72, 95 76 C 85 72, 68 72, 53 90 Z" fill="${hairColor}"/>`;
    }
    if (hairStyle === 'dreadlocks') {
      return `
      <path d="M 53 90 C 53 45, 147 45, 147 90 C 130 65, 70 65, 53 90 Z" fill="${hairColor}"/>
      <rect x="42" y="85" width="10" height="40" rx="5" fill="${hairColor}"/>
      <circle cx="47" cy="130" r="5" fill="${hairColor}"/>
      <rect x="148" y="85" width="10" height="40" rx="5" fill="${hairColor}"/>
      <circle cx="153" cy="130" r="5" fill="${hairColor}"/>`;
    }
    if (hairStyle === 'beanie') {
      return `
      <path d="M 53 82 C 53 40, 147 40, 147 82 Z" fill="${hairColor}"/>
      <rect x="46" y="74" width="108" height="14" rx="7" fill="${hairColor}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
      <rect x="91" y="38" width="18" height="8" rx="2" fill="${hairColor}" opacity="0.8"/>`;
    }
    return '';
  };

  const getEyewear = () => {
    if (eyewear === 'none') return '';
    if (eyewear === 'glasses') {
      return `
      <rect x="70" y="84" width="28" height="18" rx="4" fill="none" stroke="${eyewearColor}" stroke-width="3"/>
      <rect x="102" y="84" width="28" height="18" rx="4" fill="none" stroke="${eyewearColor}" stroke-width="3"/>
      <line x1="98" y1="93" x2="102" y2="93" stroke="${eyewearColor}" stroke-width="3" stroke-linecap="round"/>
      <line x1="52" y1="91" x2="70" y2="91" stroke="${eyewearColor}" stroke-width="2"/>
      <line x1="130" y1="91" x2="148" y2="91" stroke="${eyewearColor}" stroke-width="2"/>`;
    }
    if (eyewear === 'visor') {
      return `
      <polygon points="56,82 144,82 138,104 62,104" fill="${eyewearColor}" fill-opacity="0.4" stroke="${eyewearColor}" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="56" y1="93" x2="144" y2="93" stroke="#ffffff" stroke-width="1.5" opacity="0.85" stroke-dasharray="4 4"/>
      <rect x="59" y="85" width="82" height="3" fill="#ffffff" opacity="0.5"/>`;
    }
    if (eyewear === 'pixel') {
      return `
      <path d="M 58 84 H 142 V 92 H 134 V 98 H 120 V 92 H 112 V 98 H 88 V 92 H 80 V 98 H 58 Z" fill="${eyewearColor}"/>
      <rect x="64" y="86" width="6" height="4" fill="#ffffff" opacity="0.8"/>
      <rect x="108" y="86" width="6" height="4" fill="#ffffff" opacity="0.8"/>`;
    }
    return '';
  };

  const getGear = () => {
    if (gear === 'none') return '';
    if (gear === 'headset') {
      return `
      <path d="M 50 98 C 50 42, 150 42, 150 98" fill="none" stroke="#27272a" stroke-width="6.5" stroke-linecap="round"/>
      <rect x="42" y="84" width="12" height="32" rx="5" fill="#18181b" stroke="#27272a" stroke-width="2"/>
      <rect x="146" y="84" width="12" height="32" rx="5" fill="#18181b" stroke="#27272a" stroke-width="2"/>
      <path d="M 50 108 Q 66 122 80 114" fill="none" stroke="#27272a" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="80" cy="114" r="3.5" fill="#3f3f46"/>`;
    }
    if (gear === 'airbuds') {
      return `
      <rect x="48" y="94" width="6" height="10" rx="3" fill="#ffffff" stroke="#e4e4e7" stroke-width="1"/>
      <path d="M 51 101 L 51 112" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <rect x="146" y="94" width="6" height="10" rx="3" fill="#ffffff" stroke="#e4e4e7" stroke-width="1"/>
      <path d="M 149 101 L 149 112" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>`;
    }
    return '';
  };

  const getClothing = () => {
    if (clothing === 'hoodie') {
      return `
      <path d="M 45 148 C 45 132, 155 132, 155 148 L 185 200 H 15 Z" fill="${clothingColor}"/>
      <path d="M 72 145 C 72 134, 128 134, 128 145 L 115 174 C 100 184, 100 184, 85 174 Z" fill="#0f172a" opacity="0.8"/>
      <line x1="88" y1="168" x2="88" y2="188" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="112" y1="168" x2="112" y2="191" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <circle cx="88" cy="189" r="2.5" fill="${eyewearColor}"/>
      <circle cx="112" cy="192" r="2.5" fill="${eyewearColor}"/>`;
    }
    if (clothing === 'highcollar') {
      return `
      <path d="M 45 148 C 45 132, 155 132, 155 148 L 185 200 H 15 Z" fill="${clothingColor}"/>
      <polygon points="60,126 78,162 55,162" fill="${clothingColor}" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/>
      <polygon points="140,126 122,162 145,162" fill="${clothingColor}" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/>
      <path d="M 60 126 L 78 162 L 82 200" fill="none" stroke="${eyewearColor}" stroke-width="2"/>
      <path d="M 140 126 L 122 162 L 118 200" fill="none" stroke="${eyewearColor}" stroke-width="2"/>`;
    }
    if (clothing === 'tshirt') {
      return `
      <path d="M 45 148 C 45 132, 155 132, 155 148 L 185 200 H 15 Z" fill="${clothingColor}"/>
      <path d="M 76 142 C 76 158, 124 158, 124 142 Z" fill="${skinColor}"/>
      <path d="M 76 142 C 76 158, 124 158, 124 142" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
      <text x="100" y="178" font-family="monospace" font-size="13" font-weight="900" fill="#ffffff" opacity="0.75" text-anchor="middle">&lt;/&gt;</text>`;
    }
    if (clothing === 'polo') {
      return `
      <path d="M 45 148 C 45 132, 155 132, 155 148 L 185 200 H 15 Z" fill="${clothingColor}"/>
      <polygon points="76,142 124,142 100,165" fill="${skinColor}"/>
      <polygon points="76,142 100,160 92,142" fill="#ffffff" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
      <polygon points="124,142 100,160 108,142" fill="#ffffff" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
      <circle cx="100" cy="170" r="2" fill="#18181b"/>
      <circle cx="100" cy="178" r="2" fill="#18181b"/>`;
    }
    return '';
  };

  const getOverlayFrameSvg = () => {
    if (!overlayFrame) return '';
    return `
    <rect x="6" y="6" width="188" height="188" rx="24" fill="none" stroke="${eyewearColor}" stroke-width="1.8" stroke-opacity="0.45"/>
    <g opacity="0.5" fill="${eyewearColor}" font-family="monospace" font-size="7" font-weight="bold">
      <text x="12" y="18">SYS_INIT</text>
      <text x="156" y="18">v1.3.4</text>
      <text x="12" y="188">DEV_MODE</text>
      <text x="160" y="188">ONLINE</text>
    </g>
    <path d="M 6 30 L 6 12 M 12 6 L 30 6" stroke="${eyewearColor}" stroke-width="2.5" fill="none"/>
    <path d="M 194 30 L 194 12 M 188 6 L 170 6" stroke="${eyewearColor}" stroke-width="2.5" fill="none"/>
    <path d="M 6 170 L 6 188 M 12 194 L 30 194" stroke="${eyewearColor}" stroke-width="2.5" fill="none"/>
    <path d="M 194 170 L 194 188 M 188 194 L 170 194" stroke="${eyewearColor}" stroke-width="2.5" fill="none"/>`;
  };

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
    ${getBackgroundSvg()}
    ${getBackgroundOverlays()}
    <g transform="translate(0, 5)">
      <!-- Neck -->
      <rect x="88" y="130" width="24" height="20" fill="${skinColor}"/>
      <!-- Ears -->
      ${getEars()}
      <!-- Head Base -->
      <circle cx="100" cy="95" r="45" fill="${skinColor}"/>
      <!-- Hair Behind / Dreadlocks base -->
      ${hairStyle === 'dreadlocks' ? getHair() : ''}
      <!-- Facial Hair -->
      ${getFacialHair()}
      <!-- Eyes & Expression -->
      ${getEyesAndMouth()}
      <!-- Hair Top -->
      ${hairStyle !== 'dreadlocks' ? getHair() : ''}
      <!-- Eyewear / Glasses -->
      ${getEyewear()}
      <!-- Tech Accessories / Headphones -->
      ${getGear()}
      <!-- Clothing -->
      ${getClothing()}
    </g>
    <!-- Overlay Branding Code & Tech Frame -->
    ${getOverlayFrameSvg()}
  </svg>`;

  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gitforge-avatar-${presetName.toLowerCase().replace(/\s+/g, '-')}-${seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(svgContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy SVG', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6" style={{ borderColor: activeTheme.border }}>
        <div className="space-y-1">
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Developer Avatar Studio
          </h1>
          <p className="text-xs max-w-xl" style={{ color: activeTheme.textMuted }}>
            Customize your professional vector avatar deterministically for GitHub profiles, portfolios, and developer assets.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={randomize}
            className="px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition hover:opacity-85 shadow-sm"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Randomize Design
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Preview & Code Export (Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <div className="p-6 rounded-2xl border flex flex-col items-center justify-center space-y-6 shadow-md" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-cyan-400" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
                PREVIEW LIVE
              </span>
              <h2 className="text-lg font-bold">{presetName} Preset</h2>
            </div>

            {/* SVG Live Preview Wrapper */}
            <div 
              className="w-60 h-60 rounded-3xl border p-4 shadow-2xl transition duration-300 hover:scale-[1.02] bg-slate-950/20 flex items-center justify-center"
              style={{ borderColor: activeTheme.border }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />

            {/* Quick Export Actions */}
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm pt-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition hover:opacity-85"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" /> Copy SVG Code
                  </>
                )}
              </button>
              
              <button
                onClick={downloadSvg}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg hover:opacity-90 text-white"
                style={{ background: activeTheme.gradient }}
              >
                <Download className="w-4 h-4" /> Export Vector (.svg)
              </button>
            </div>
          </div>

          {/* Quick Technical Summary card */}
          <div className="p-4 rounded-xl border text-xs space-y-2.5" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border, color: activeTheme.textMuted }}>
            <h4 className="font-bold text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              SVG Design Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div>• ViewBox: 200 x 200 px</div>
              <div>• Format: XML Vector</div>
              <div>• Skema: High-Contrast Cyber</div>
              <div>• Tech Frame: {overlayFrame ? 'ON' : 'OFF'}</div>
              <div>• Accessories: {gear !== 'none' ? gear : 'none'}</div>
              <div>• Hair Style: {hairStyle}</div>
            </div>
          </div>
        </div>

        {/* Right column: Customization Options & Tabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Control Tabs */}
          <div className="flex overflow-x-auto rounded-xl p-1 gap-1 border" style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}>
            <button
              onClick={() => setActiveTab('preset')}
              className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'preset' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Presets
            </button>
            <button
              onClick={() => setActiveTab('backdrop')}
              className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'backdrop' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Background
            </button>
            <button
              onClick={() => setActiveTab('head')}
              className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'head' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smile className="w-3.5 h-3.5" /> Face & Hair
            </button>
            <button
              onClick={() => setActiveTab('gear')}
              className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'gear' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Gear & Apparel
            </button>
          </div>

          {/* Tab 1: Presets Panel */}
          {activeTab === 'preset' && (
            <div className="p-6 rounded-2xl border space-y-5" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
              <div>
                <h3 className="font-black text-sm text-white">Designer Preset Themes</h3>
                <p className="text-[11px] mt-0.5" style={{ color: activeTheme.textMuted }}>
                  Quickly load a professional combination crafted by our design team.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      applyPreset(preset);
                      setPresetName(preset.name);
                    }}
                    className="p-4 rounded-xl border text-left transition hover:scale-[1.01] hover:shadow-md flex flex-col justify-between h-28 group relative overflow-hidden"
                    style={{ 
                      backgroundColor: activeTheme.surfaceSecondary, 
                      borderColor: presetName === preset.name ? 'rgba(6, 182, 212, 0.4)' : activeTheme.border 
                    }}
                  >
                    <div className="space-y-1 z-10">
                      <h4 className="font-bold text-xs text-white group-hover:text-cyan-400 transition">{preset.name}</h4>
                      <p className="text-[10px] opacity-80" style={{ color: activeTheme.textMuted }}>
                        Hair: {preset.hairStyle}, Eyewear: {preset.eyewear}
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-center z-10 pt-2 border-t border-slate-800/50 w-full text-[10px] font-mono">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: preset.bgColor }} />
                        BG
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: preset.hairColor }} />
                        Accent
                      </span>
                    </div>
                    
                    {presetName === preset.name && (
                      <span className="absolute top-3 right-3 bg-cyan-500/20 text-cyan-400 p-1 rounded-full border border-cyan-500/30">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Backdrop & Framing Panel */}
          {activeTab === 'backdrop' && (
            <div className="p-6 rounded-2xl border space-y-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
              <div>
                <h3 className="font-black text-sm text-white">Background & Frame</h3>
                <p className="text-[11px] mt-0.5" style={{ color: activeTheme.textMuted }}>
                  Configure canvas backdrops, circuit matrix overlays, and protective tech frames.
                </p>
              </div>

              {/* Backdrop Type selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold block text-slate-300">Backdrop Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'solid', label: 'Solid Matte' },
                    { id: 'gradient', label: 'Linear Gradient' },
                    { id: 'circuit', label: 'Circuit Tech' },
                    { id: 'binary', label: 'Binary Overlay' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setBgType(t.id as any);
                        setPresetName("Custom");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                        bgType === t.id ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'hover:bg-slate-800/40 border-slate-800'
                      }`}
                      style={{ backgroundColor: bgType === t.id ? undefined : activeTheme.surfaceSecondary }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold block text-slate-300">Primary Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        setPresetName("Custom");
                      }}
                      className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        setPresetName("Custom");
                      }}
                      className="px-2 py-1.5 rounded-lg border text-xs font-mono text-center w-24 bg-slate-900 text-white"
                      style={{ borderColor: activeTheme.border }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {BG_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setBgColor(c);
                          setPresetName("Custom");
                        }}
                        className={`w-6 h-6 rounded-full border transition ${bgColor === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                        style={{ backgroundColor: c, borderColor: activeTheme.border }}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Background Color (for gradients/patterns) */}
                {bgType !== 'solid' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Secondary Gradient Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColorSecondary}
                        onChange={(e) => {
                          setBgColorSecondary(e.target.value);
                          setPresetName("Custom");
                        }}
                        className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColorSecondary}
                        onChange={(e) => {
                          setBgColorSecondary(e.target.value);
                          setPresetName("Custom");
                        }}
                        className="px-2 py-1.5 rounded-lg border text-xs font-mono text-center w-24 bg-slate-900 text-white"
                        style={{ borderColor: activeTheme.border }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {BG_SEC_PALETTE.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setBgColorSecondary(c);
                            setPresetName("Custom");
                          }}
                          className={`w-6 h-6 rounded-full border transition ${bgColorSecondary === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                          style={{ backgroundColor: c, borderColor: activeTheme.border }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Branded Framing Overlay toggle */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <label htmlFor="overlayFrameCheck" className="text-xs font-bold block text-slate-200">Hacker HUD Frame (Diagnostic lines)</label>
                  <p className="text-[10px]" style={{ color: activeTheme.textMuted }}>
                    Enable cybernetic diagnostic overlay frames with version telemetry details.
                  </p>
                </div>
                <input
                  id="overlayFrameCheck"
                  type="checkbox"
                  checked={overlayFrame}
                  onChange={(e) => {
                    setOverlayFrame(e.target.checked);
                    setPresetName("Custom");
                  }}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Head, Hair & Facial Face Panel */}
          {activeTab === 'head' && (
            <div className="p-6 rounded-2xl border space-y-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
              <div>
                <h3 className="font-black text-sm text-white">Face Anatomy & Hair</h3>
                <p className="text-[11px] mt-0.5" style={{ color: activeTheme.textMuted }}>
                  Configure skin tones, modern hairstyles, facial structures, and emotional expressions.
                </p>
              </div>

              {/* Skin Tone Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold block text-slate-300">Skin Tone Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={skinColor}
                    onChange={(e) => {
                      setSkinColor(e.target.value);
                      setPresetName("Custom");
                    }}
                    className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {SKIN_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setSkinColor(c);
                          setPresetName("Custom");
                        }}
                        className={`w-6 h-6 rounded-full border transition ${skinColor === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                        style={{ backgroundColor: c, borderColor: activeTheme.border }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Hair selection & Color */}
              <div className="space-y-4 pt-2 border-t border-slate-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Hair Style</label>
                    <select
                      value={hairStyle}
                      onChange={(e) => {
                        setHairStyle(e.target.value as any);
                        setPresetName("Custom");
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-slate-900 text-white font-medium"
                      style={{ borderColor: activeTheme.border }}
                    >
                      <option value="none">Bald / Shaved Head</option>
                      <option value="shaggy">Classic Shaggy / Messy</option>
                      <option value="spike">Cyberpunk Spiky</option>
                      <option value="comb">Neat Comb Over</option>
                      <option value="dreadlocks">Dreadlocks Style</option>
                      <option value="beanie">Beanie Hacker Cap</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Hair & Highlight Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={hairColor}
                        onChange={(e) => {
                          setHairColor(e.target.value);
                          setPresetName("Custom");
                        }}
                        className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-1">
                        {HAIR_PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setHairColor(c);
                              setPresetName("Custom");
                            }}
                            className={`w-5.5 h-5.5 rounded-full border transition ${hairColor === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                            style={{ backgroundColor: c, borderColor: activeTheme.border }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facial Beard / Beard Selection */}
              <div className="space-y-4 pt-4 border-t border-slate-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Beard & Mustache</label>
                    <select
                      value={beardStyle}
                      onChange={(e) => {
                        setBeardStyle(e.target.value as any);
                        setPresetName("Custom");
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-slate-900 text-white font-medium"
                      style={{ borderColor: activeTheme.border }}
                    >
                      <option value="none">Clean Shaven</option>
                      <option value="stubble">Light Stubble</option>
                      <option value="full">Full Beard</option>
                      <option value="goatee">Goatee</option>
                      <option value="mustache">Classic Mustache</option>
                    </select>
                  </div>

                  {beardStyle !== 'none' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold block text-slate-300">Beard Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={beardColor}
                          onChange={(e) => {
                            setBeardColor(e.target.value);
                            setPresetName("Custom");
                          }}
                          className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                        />
                        <div className="flex flex-wrap gap-1">
                          {HAIR_PALETTE.map((c) => (
                            <button
                              key={c}
                              onClick={() => {
                                setBeardColor(c);
                                setPresetName("Custom");
                              }}
                              className={`w-5.5 h-5.5 rounded-full border transition ${beardColor === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                              style={{ backgroundColor: c, borderColor: activeTheme.border }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expression selection */}
              <div className="space-y-2 pt-4 border-t border-slate-800/60">
                <label className="text-xs font-bold block text-slate-300">Emotional Expression</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'focused', label: '💻 Focused' },
                    { id: 'happy', label: '😊 Happy' },
                    { id: 'smirk', label: '😏 Code Smirk' },
                    { id: 'neutral', label: '😐 Neutral' }
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        setExpression(exp.id as any);
                        setPresetName("Custom");
                      }}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold border transition text-center ${
                        expression === exp.id ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'hover:bg-slate-800/40 border-slate-800'
                      }`}
                      style={{ backgroundColor: expression === exp.id ? undefined : activeTheme.surfaceSecondary }}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Gear & Apparel Panel */}
          {activeTab === 'gear' && (
            <div className="p-6 rounded-2xl border space-y-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
              <div>
                <h3 className="font-black text-sm text-white">Gear Hardware & Apparel</h3>
                <p className="text-[11px] mt-0.5" style={{ color: activeTheme.textMuted }}>
                  Customize developer apparel and cybernetic accessories to upgrade your coding performance.
                </p>
              </div>

              {/* Eyewear Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold block text-slate-300">Glasses / Visor Style</label>
                  <select
                    value={eyewear}
                    onChange={(e) => {
                      setEyewear(e.target.value as any);
                      setPresetName("Custom");
                    }}
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-slate-900 text-white font-medium"
                    style={{ borderColor: activeTheme.border }}
                  >
                    <option value="none">None / No Glasses</option>
                    <option value="glasses">Tech Nerd Glasses / Classic</option>
                    <option value="visor">Cyber Neon Visor / Hologram</option>
                    <option value="pixel">8-Bit Pixel Sunglasses / Retro</option>
                  </select>
                </div>

                {eyewear !== 'none' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Eyewear Frame Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={eyewearColor}
                        onChange={(e) => {
                          setEyewearColor(e.target.value);
                          setPresetName("Custom");
                        }}
                        className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-1">
                        {GEAR_PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setEyewearColor(c);
                              setPresetName("Custom");
                            }}
                            className={`w-5.5 h-5.5 rounded-full border transition ${eyewearColor === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                            style={{ backgroundColor: c, borderColor: activeTheme.border }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hardware Headsets */}
              <div className="space-y-2 pt-4 border-t border-slate-800/60">
                <label className="text-xs font-bold block text-slate-300">Audio Hardware Accessories</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'No Audio' },
                    { id: 'headset', label: 'Pro Headset' },
                    { id: 'airbuds', label: 'Airbuds TWS' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setGear(g.id as any);
                        setPresetName("Custom");
                      }}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold border transition text-center ${
                        gear === g.id ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'hover:bg-slate-800/40 border-slate-800'
                      }`}
                      style={{ backgroundColor: gear === g.id ? undefined : activeTheme.surfaceSecondary }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apparel Clothing Selection & Color */}
              <div className="space-y-4 pt-4 border-t border-slate-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Outfit / Clothing Type</label>
                    <select
                      value={clothing}
                      onChange={(e) => {
                        setClothing(e.target.value as any);
                        setPresetName("Custom");
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-slate-900 text-white font-medium"
                      style={{ borderColor: activeTheme.border }}
                    >
                      <option value="hoodie">Comfy Hoodie</option>
                      <option value="highcollar">Cyber High-Collar Jacket</option>
                      <option value="tshirt">Nerd T-Shirt &lt;/&gt;</option>
                      <option value="polo">Tech Polo Shirt</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold block text-slate-300">Clothing Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={clothingColor}
                        onChange={(e) => {
                          setClothingColor(e.target.value);
                          setPresetName("Custom");
                        }}
                        className="w-9 h-9 rounded-lg border-2 border-slate-700 bg-transparent cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-1">
                        {BG_PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setClothingColor(c);
                              setPresetName("Custom");
                            }}
                            className={`w-5.5 h-5.5 rounded-full border transition ${clothingColor === c ? 'scale-110 ring-2 ring-cyan-400' : ''}`}
                            style={{ backgroundColor: c, borderColor: activeTheme.border }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
