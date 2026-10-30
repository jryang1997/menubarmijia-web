import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Mic,
  Search,
  Download,
  Star,
  Sparkles,
  Power,
  Wind,
  Thermometer,
  Coffee,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  WifiOff,
  RefreshCw,
  SlidersHorizontal,
  Disc,
  Play,
} from 'lucide-react';
import {
  SmartDevice,
  RoomLightingSummary,
  LightMode,
  filterDevices,
  getLightModePreset,
  kelvinToRgb,
  rgbToHex,
} from '../utils/mijiaEngine';

interface InteractiveMenuBarHeroProps {
  devices: SmartDevice[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  onToggleDevice: (id: string) => void;
  onUpdateLight: (
    id: string,
    updates: { brightness?: number; colorTemp?: number; lightMode?: LightMode; on?: boolean }
  ) => void;
  onUpdateClimate: (id: string, targetTemp: number) => void;
  onAllLightsOff: () => void;
  onAllLightsOn: () => void;
  onExecuteCommand: (cmd: string) => void;
  lighting: RoomLightingSummary;
  undoState: {
    visible: boolean;
    messageZh: string;
    messageEn: string;
    remainingSec: number;
  };
  onUndo: () => void;
  onPauseUndo: (paused: boolean) => void;
  lastFeedback: string | null;
}

interface FloatingBubbleProps {
  badge: string;
  keySymbol: string;
  title: string;
  subtitle: string;
  animClass: string;
  positionClass: string;
  isActive?: boolean;
  anyLightOn: boolean;
  ariaLabel: string;
  onClick: () => void;
  accentTint?: string;
  darkAccentTint?: string;
  orbColor?: string;
}

const FloatingLiquidBubble: React.FC<FloatingBubbleProps> = ({
  badge,
  keySymbol,
  title,
  subtitle,
  animClass,
  positionClass,
  isActive = false,
  anyLightOn,
  ariaLabel,
  onClick,
  accentTint = 'rgba(125, 211, 252, 0.24)',
  darkAccentTint = 'rgba(56, 189, 248, 0.16)',
  orbColor = 'rgba(56, 189, 248, 0.32)',
}) => {
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number; glareX: number; glareY: number }>({
    x: 0,
    y: 0,
    glareX: 30,
    glareY: 24,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = bubbleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    const gx = Math.max(16, Math.min(84, ((e.clientX - rect.left) / rect.width) * 100));
    const gy = Math.max(16, Math.min(84, ((e.clientY - rect.top) / rect.height) * 100));
    setOffset({ x: dx, y: dy, glareX: gx, glareY: gy });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0, glareX: 30, glareY: 24 });
  };

  return (
    <div className={`hidden lg:block absolute z-20 ${positionClass} ${animClass}`}>
      {/* Soft ambient light aura behind the sphere */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-full blur-2xl transition-all duration-500"
        style={{
          background: orbColor,
          opacity: anyLightOn ? 0.55 : 0.28,
        }}
      />

      {/* Companion circular micro-droplets 🫧 positioned cleanly outside the sphere rim */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-2 z-20 w-5 h-5 rounded-full liquid-bubble"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 -left-3.5 z-20 w-3.5 h-3.5 rounded-full liquid-bubble"
      />

      <button
        ref={bubbleRef}
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0) scale(${
            isActive ? 0.94 : offset.x !== 0 || offset.y !== 0 ? 1.06 : 1
          })`,
          backgroundImage: anyLightOn
            ? `radial-gradient(circle at ${offset.glareX.toFixed(0)}% ${offset.glareY.toFixed(
                0
              )}%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.42) 34%, ${accentTint} 74%, rgba(255,255,255,0.72) 100%)`
            : `radial-gradient(circle at ${offset.glareX.toFixed(0)}% ${offset.glareY.toFixed(
                0
              )}%, rgba(255,255,255,0.22) 0%, rgba(30,41,59,0.78) 44%, ${darkAccentTint} 78%, rgba(15,23,42,0.88) 100%)`,
        }}
        className="liquid-bubble group relative z-10 w-44 h-44 xl:w-48 xl:h-48 rounded-full p-5 flex flex-col items-center justify-center text-center cursor-pointer select-none overflow-hidden"
      >
        {/* Soft 360-degree elliptical specular highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-7 w-14 h-7 rounded-full -rotate-25"
          style={{
            background: anyLightOn
              ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.20) 48%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 48%, transparent 75%)',
          }}
        />

        {/* Key / Badge Pill */}
        <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/75 dark:bg-white/12 border border-white/90 dark:border-white/20 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-2xs">
          <span>{keySymbol}</span>
        </span>

        {/* Main Action Title */}
        <div className="relative z-10 mt-2.5 font-display font-bold text-[15px] xl:text-base text-slate-900 dark:text-white leading-tight">
          {title}
        </div>

        {/* Subtitle */}
        <div className="relative z-10 mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug max-w-[136px]">
          {subtitle}
        </div>

        {/* Micro English Tag */}
        <div className="relative z-10 mt-1.5 text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400">
          {badge}
        </div>
      </button>
    </div>
  );
};

export const InteractiveMenuBarHero: React.FC<InteractiveMenuBarHeroProps> = ({
  devices,
  selectedDeviceId,
  onToggleDevice,
  onUpdateLight,
  onAllLightsOff,
  onAllLightsOn,
  onExecuteCommand,
  lighting,
  undoState,
  onUndo,
  onPauseUndo,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<string>('全部');
  const [activeBubble, setActiveBubble] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [latencyBadge, setLatencyBadge] = useState<string | null>('⚡ 本地 · 12ms');
  const [coffeeOn, setCoffeeOn] = useState<boolean>(false);
  const [vacuumOn, setVacuumOn] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const studyLamp =
    devices.find((d) => d.id === selectedDeviceId && d.category === 'light') ||
    devices.find((d) => d.id === 'study-desk-lamp') ||
    devices[0];

  const lampRgb = kelvinToRgb(studyLamp.colorTemp ?? 4600);
  const lampHex = rgbToHex(lampRgb);

  const activeDeviceCount =
    devices.filter((d) => d.on).length + (coffeeOn ? 1 : 0) + (vacuumOn ? 1 : 0);

  const pulseBubble = (id: string) => {
    setActiveBubble(id);
    setTimeout(() => {
      setActiveBubble((prev) => (prev === id ? null : prev));
    }, 300);
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.altKey && e.code === 'KeyM') {
        e.preventDefault();
        pulseBubble('opt-m');
        setShowSearchBar(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
        return;
      }

      if (isInput) {
        if (e.key === 'Escape') {
          setSearchQuery('');
          setShowSearchBar(false);
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        pulseBubble('sftd');
        setShowSearchBar(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        pulseBubble('enter');
        onToggleDevice(studyLamp.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyLamp, onToggleDevice]);

  // 7-Second Automated Demo Story
  const runSevenSecondStory = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    onUpdateLight(studyLamp.id, { on: false });
    setShowSearchBar(true);
    setSearchQuery('');

    setTimeout(() => {
      pulseBubble('opt-m');
      searchInputRef.current?.focus();
    }, 500);

    setTimeout(() => {
      pulseBubble('sftd');
      setSearchQuery('sftd');
    }, 1300);

    setTimeout(() => {
      pulseBubble('enter');
      onUpdateLight(studyLamp.id, {
        on: true,
        brightness: 100,
        colorTemp: 4600,
        lightMode: 'daylight',
      });
      setLatencyBadge('⚡ 本地 · 9ms');
    }, 2300);

    setTimeout(() => {
      setShowSearchBar(false);
      setSearchQuery('');
      setIsAutoPlaying(false);
    }, 4000);
  };

  const triggerVoicePTT = () => {
    pulseBubble('voice');
    setIsVoiceListening(true);
    setShowSearchBar(true);
    setSearchQuery('把书房吸顶灯切到柔和夜灯...');
    setTimeout(() => {
      setIsVoiceListening(false);
      setSearchQuery('');
      if (studyLamp.on && studyLamp.lightMode === 'moonlight') {
        onExecuteCommand('日光模式');
        setLatencyBadge('⚡ 本地 · 11ms');
      } else {
        onExecuteCommand('书房吸顶灯月光模式');
        setLatencyBadge('⚡ 本地 · 12ms');
      }
    }, 650);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onToggleDevice(studyLamp.id);
      return;
    }
    const matches = filterDevices(devices, searchQuery, 'all');
    if (matches.length === 1) {
      onToggleDevice(matches[0].id);
      setLatencyBadge('⚡ 拼音直达 · 8ms');
      return;
    }
    onExecuteCommand(searchQuery);
    setLatencyBadge('⚡ 本地 · 12ms');
  };

  return (
    <section
      id="hero"
      className="relative pt-10 pb-20 md:pt-14 md:pb-24 overflow-hidden select-none"
    >
      {/* Dynamic Ambient Sunlight & Sky-Glass Refraction Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-500"
        style={{
          background: lighting.anyLightOn
            ? `radial-gradient(56% 50% at 50% 52%, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, ${(0.22 + (lighting.averageBrightness / 100) * 0.34).toFixed(3)}) 0%, rgba(135, 206, 250, 0.16) 54%, transparent 84%)`
            : 'radial-gradient(50% 45% at 50% 50%, rgba(30, 58, 138, 0.25) 0%, transparent 78%)',
        }}
      />

      <div className="relative max-w-[1140px] mx-auto px-6">
        {/* TOP ASYMMETRIC HEADER: Minimalist, Harmonious Apple Glass Aesthetic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono tracking-tight text-slate-500 dark:text-slate-400 mb-3">
              macOS 14+ 原生菜单栏 · Windows 11 托盘 · v1.1.4
            </div>
            <h1 className="font-display font-extrabold tracking-tight text-slate-900 dark:text-white text-[clamp(2.5rem,4.7vw,4.15rem)] leading-[1.07] text-balance">
              在电脑上，
              <span className="block">顺手控制整个家。</span>
            </h1>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:pb-1">
            <p className="text-[15px] md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              写代码或开会时，不必特意拿起手机。按 <code className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15">⌥M</code> 呼出面板，敲拼音找灯、按住说话、锁屏离席自动关灯。
            </p>

            {/* Harmonious Liquid Glass Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#007AFF] hover:bg-[#006AE6] text-white shadow-[0_8px_20px_-4px_rgba(0,122,255,0.45)] transition-all whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>下载 v1.1.4</span>
              </a>

              <a
                href="https://github.com/jryang1997/MenuBarMijia"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-surface group inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-800 dark:text-white hover:scale-[1.02] transition-all whitespace-nowrap shrink-0"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Star on GitHub</span>
              </a>

              <button
                type="button"
                onClick={runSevenSecondStory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAutoPlaying ? '正在演示...' : '演示 7 秒盲操'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTERPIECE STAGE: 4 Large Circular Liquid Frosted Glass Bubbles 🫧 + Translucent Liquid Glass App Panel */}
        <div className="relative pt-2 pb-8 flex flex-col items-center">
          {/* Background Ambient Light Orbs directly behind the panel so the frosted glass refracts real light! */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 w-[520px] h-[540px] z-10"
          >
            {/* Sky-Cyan Top Orb */}
            <div
              className="absolute -top-6 -left-10 w-72 h-72 rounded-full blur-3xl transition-all duration-500"
              style={{
                background: lighting.anyLightOn
                  ? 'radial-gradient(circle, rgba(56, 189, 248, 0.48) 0%, rgba(125, 211, 252, 0.15) 70%, transparent 100%)'
                  : 'radial-gradient(circle, rgba(30, 64, 175, 0.32) 0%, transparent 75%)',
              }}
            />
            {/* Dynamic Lamp Kelvin Glow Orb right behind the study lamp card */}
            <div
              className="absolute top-28 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl transition-all duration-300"
              style={{
                background: lighting.anyLightOn
                  ? `radial-gradient(circle, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, ${(0.35 + (lighting.averageBrightness / 100) * 0.45).toFixed(2)}) 0%, rgba(251, 191, 36, 0.18) 65%, transparent 100%)`
                  : 'radial-gradient(circle, rgba(15, 23, 42, 0.35) 0%, transparent 75%)',
              }}
            />
            {/* Bottom Iridescent Blue-Aqua Orb */}
            <div
              className="absolute bottom-2 -right-8 w-72 h-72 rounded-full blur-3xl transition-all duration-500"
              style={{
                background: lighting.anyLightOn
                  ? 'radial-gradient(circle, rgba(14, 165, 233, 0.42) 0%, rgba(186, 230, 253, 0.18) 70%, transparent 100%)'
                  : 'radial-gradient(circle, rgba(17, 24, 39, 0.4) 0%, transparent 75%)',
              }}
            />
          </div>

          {/* Circular Bubble 1 (Top-Left): ⌥ M 呼出面板 */}
          <FloatingLiquidBubble
            badge="GLOBAL HOTKEY"
            keySymbol="⌥ M"
            title="一键呼出面板"
            subtitle="手不离键盘 · 即刻响应"
            animClass="animate-bubble-1"
            positionClass="left-2 xl:left-10 top-6"
            isActive={activeBubble === 'opt-m'}
            anyLightOn={lighting.anyLightOn && lighting.averageBrightness >= 22}
            ariaLabel="快捷键 Option M 呼出面板"
            accentTint="rgba(125, 211, 252, 0.30)"
            darkAccentTint="rgba(56, 189, 248, 0.18)"
            orbColor="rgba(56, 189, 248, 0.36)"
            onClick={() => {
              pulseBubble('opt-m');
              setShowSearchBar((prev) => !prev);
            }}
          />

          {/* Circular Bubble 2 (Bottom-Left): sftd 拼音找灯 */}
          <FloatingLiquidBubble
            badge="PINYIN SEARCH"
            keySymbol="sftd"
            title="拼音盲搜找灯"
            subtitle="免切输入法直达书房灯"
            animClass="animate-bubble-2"
            positionClass="left-5 xl:left-14 bottom-28"
            isActive={activeBubble === 'sftd'}
            anyLightOn={lighting.anyLightOn && lighting.averageBrightness >= 22}
            ariaLabel="拼音首字母 sftd 搜索书房台灯"
            accentTint="rgba(253, 186, 116, 0.30)"
            darkAccentTint="rgba(251, 146, 60, 0.18)"
            orbColor="rgba(251, 146, 60, 0.32)"
            onClick={() => {
              pulseBubble('sftd');
              setShowSearchBar(true);
              setSearchQuery((prev) => (prev === 'sftd' ? '' : 'sftd'));
              setLatencyBadge('⚡ 拼音匹配 · 6ms');
            }}
          />

          {/* Circular Bubble 3 (Top-Right): 按住说话 */}
          <FloatingLiquidBubble
            badge="PUSH TO TALK"
            keySymbol="🎙️ Hold"
            title={isVoiceListening ? '正在聆听...' : '按住说话'}
            subtitle="「切到柔和夜灯」· 12ms"
            animClass="animate-bubble-3"
            positionClass="right-2 xl:right-10 top-8"
            isActive={activeBubble === 'voice' || isVoiceListening}
            anyLightOn={lighting.anyLightOn && lighting.averageBrightness >= 22}
            ariaLabel="按住说话切换月光模式"
            accentTint="rgba(110, 231, 183, 0.28)"
            darkAccentTint="rgba(52, 211, 153, 0.18)"
            orbColor="rgba(52, 211, 153, 0.32)"
            onClick={triggerVoicePTT}
          />

          {/* Circular Bubble 4 (Bottom-Right): 回车开关 / 点亮背景 */}
          <FloatingLiquidBubble
            badge="INSTANT TOGGLE"
            keySymbol="Return ↵"
            title={studyLamp.on ? '回车关灯变暗' : '回车开灯点亮'}
            subtitle="点击试试 · 全页光场联动"
            animClass="animate-bubble-4"
            positionClass="right-5 xl:right-14 bottom-28"
            isActive={activeBubble === 'enter'}
            anyLightOn={lighting.anyLightOn && lighting.averageBrightness >= 22}
            ariaLabel="回车键开关书房台灯"
            accentTint="rgba(251, 191, 36, 0.32)"
            darkAccentTint="rgba(250, 204, 21, 0.18)"
            orbColor="rgba(250, 204, 21, 0.36)"
            onClick={() => {
              pulseBubble('enter');
              onToggleDevice(studyLamp.id);
            }}
          />

          {/* =====================================================================
              AUTHENTIC MENUBARMIJIA APP PANEL IN TRANSLUCENT LIQUID FROSTED GLASS
              Refracts the ambient light orbs behind it like real macOS Liquid Glass!
             ===================================================================== */}
          <div
            data-testid="menubarmijia-panel"
            className="relative z-30 w-full max-w-[420px] rounded-[32px] overflow-hidden border border-white/80 dark:border-white/20 transition-all duration-500"
            style={{
              background:
                lighting.anyLightOn && lighting.averageBrightness >= 22
                  ? `linear-gradient(155deg, rgba(255, 255, 255, 0.44) 0%, rgba(186, 230, 253, 0.28) 42%, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, 0.20) 78%, rgba(255, 255, 255, 0.38) 100%)`
                  : 'linear-gradient(155deg, rgba(30, 41, 59, 0.56) 0%, rgba(15, 23, 42, 0.48) 100%)',
              backdropFilter: 'blur(42px) saturate(210%)',
              WebkitBackdropFilter: 'blur(42px) saturate(210%)',
              boxShadow:
                lighting.anyLightOn && lighting.averageBrightness >= 22
                  ? `0 28px 68px -14px rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, 0.28), 0 18px 40px -12px rgba(14, 42, 86, 0.14), 0 2px 4px rgba(255,255,255,0.92) inset, 0 -2px 6px rgba(255,255,255,0.45) inset`
                  : '0 28px 68px -12px rgba(0, 0, 0, 0.65), 0 1.5px 3px rgba(255,255,255,0.22) inset',
            }}
          >
            {/* Top Specular Glass Rim Reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent"
            />

            {/* Top Inner Content Area */}
            <div className="p-4 pb-3 space-y-3">
              {/* Row 1: Home Title ("我的小窝") + Mic + AI Sparkle + Orange "全关 (3)" */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#EA6A12] font-bold text-base">🏠</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200 stroke-[2.5]" />
                    <span className="font-display font-extrabold text-[17px] tracking-tight text-slate-900 dark:text-white">
                      我的小窝
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 tabular-nums">
                    {activeDeviceCount} 台设备开启， 8 台在线
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Circular Frosted Mic Button */}
                  <button
                    type="button"
                    onClick={triggerVoicePTT}
                    aria-label="语音按住说话"
                    className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/75 dark:border-white/20 backdrop-blur-md transition-all cursor-pointer ${
                      isVoiceListening
                        ? 'bg-amber-400 text-slate-950 scale-95'
                        : 'bg-white/45 dark:bg-white/12 hover:bg-white/65 text-slate-700 dark:text-slate-100'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Circular Frosted Sparkle Button */}
                  <button
                    type="button"
                    onClick={runSevenSecondStory}
                    aria-label="智能助手与盲操演示"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/45 dark:bg-white/12 hover:bg-white/65 border border-white/75 dark:border-white/20 backdrop-blur-md text-slate-700 dark:text-slate-100 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* Orange All-Off Pill ("⏻ 全关 (3)") */}
                  <button
                    type="button"
                    onClick={onAllLightsOff}
                    aria-label="全关当前房间灯具"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EA6A12]/90 hover:bg-[#EA6A12] text-white font-semibold text-xs shadow-[0_4px_12px_rgba(234,106,18,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Power className="w-3.5 h-3.5 stroke-[2.4]" />
                    <span>全关 ({activeDeviceCount})</span>
                  </button>
                </div>
              </div>

              {/* Optional Pinyin Search Bar */}
              {showSearchBar && (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入 sftd 或「月光模式」回车..."
                    aria-label="搜索设备或输入控制指令"
                    className="w-full pl-8 pr-28 py-2 text-xs rounded-full bg-white/60 dark:bg-white/12 backdrop-blur-md border border-white/80 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 outline-none"
                  />
                  {latencyBadge && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-semibold">
                      {latencyBadge}
                    </span>
                  )}
                </form>
              )}

              {/* Row 2: Frosted Sensor Capsules ("🌡️ 阳台 28.1° 79%", "🌡️ 主卧 23.7° 65%") */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/42 dark:bg-white/10 backdrop-blur-md border border-white/75 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] text-xs font-medium text-slate-800 dark:text-slate-100 tabular-nums">
                  <Thermometer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>阳台</span>
                  <span className="font-bold">28.1°</span>
                  <span className="text-slate-600 dark:text-slate-300">79%</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/42 dark:bg-white/10 backdrop-blur-md border border-white/75 dark:border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] text-xs font-medium text-slate-800 dark:text-slate-100 tabular-nums">
                  <Thermometer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>主卧</span>
                  <span className="font-bold">23.7°</span>
                  <span className="text-slate-600 dark:text-slate-300">65%</span>
                </div>
              </div>

              {/* Row 3: Quick Scene Capsules ("💡 全屋关灯", "🌙 柔和夜灯", "💨 关温控风扇") */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => (lighting.anyLightOn ? onAllLightsOff() : onAllLightsOn())}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/52 dark:bg-white/12 hover:bg-white/72 backdrop-blur-md border border-white/80 dark:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] text-xs font-semibold text-slate-800 dark:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#EA6A12]" />
                  <span>{lighting.anyLightOn ? '全屋关灯' : '全屋开灯'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateLight(studyLamp.id, {
                      on: true,
                      brightness: 14,
                      colorTemp: 2700,
                      lightMode: 'moonlight',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/52 dark:bg-white/12 hover:bg-white/72 backdrop-blur-md border border-white/80 dark:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] text-xs font-semibold text-slate-800 dark:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <Moon className="w-3.5 h-3.5 text-[#EA6A12] fill-[#EA6A12]" />
                  <span>柔和夜灯</span>
                </button>

                <button
                  type="button"
                  onClick={() => onExecuteCommand('把空调调到 24 度')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/52 dark:bg-white/12 hover:bg-white/72 backdrop-blur-md border border-white/80 dark:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] text-xs font-semibold text-slate-800 dark:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <Wind className="w-3.5 h-3.5 text-[#EA6A12]" />
                  <span>关温控风扇</span>
                </button>
              </div>

              {/* Row 4: Room Filter Strip + Blue Grid Toggle */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {['全部', '书房', '办公室', '卧室', '厨房'].map((room) => (
                    <button
                      key={room}
                      type="button"
                      onClick={() => setActiveRoom(room)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border backdrop-blur-md ${
                        activeRoom === room
                          ? 'bg-slate-900/15 dark:bg-white/25 border-white/80 text-slate-900 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                          : 'bg-white/42 dark:bg-white/8 border-white/70 dark:border-white/12 text-slate-700 dark:text-slate-200 hover:bg-white/65'
                      }`}
                    >
                      {room}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-7 h-7 rounded-full bg-[#0A84FF] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(10,132,255,0.4)]">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white/48 dark:bg-white/12 border border-white/75 dark:border-white/15 text-slate-700 dark:text-slate-200 flex items-center justify-center backdrop-blur-md">
                    <WifiOff className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Glass Divider */}
            <div className="h-px bg-white/55 dark:bg-white/10" />

            {/* Middle Device Cards Section ("⌄ 常用控制 4") */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>常用控制 4</span>
              </div>

              {/* Card 1: 咖啡机 (Translucent Frosted Glass Card) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCoffeeOn((prev) => !prev)}
                  className="p-3 rounded-[22px] bg-white/58 dark:bg-white/10 backdrop-blur-xl border border-white/85 dark:border-white/15 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-between text-left transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        coffeeOn
                          ? 'bg-amber-400/30 text-[#EA6A12]'
                          : 'bg-white/65 dark:bg-white/12 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Coffee className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
                        咖啡机
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        {coffeeOn ? '热水中 · 92°C' : '已关闭'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                </button>
              </div>

              {/* Card 2: 书房吸顶灯 (Translucent Frosted Liquid Glass Card that lets the lamp's warm glow shine through!) */}
              <div
                className="p-4 rounded-[24px] backdrop-blur-2xl border border-white/90 dark:border-white/15 space-y-3.5 transition-all duration-300"
                style={{
                  background:
                    lighting.anyLightOn && lighting.averageBrightness >= 22
                      ? `linear-gradient(145deg, rgba(255, 255, 255, 0.68) 0%, rgba(${lampRgb.r}, ${lampRgb.g}, ${lampRgb.b}, 0.22) 100%)`
                      : studyLamp.on
                      ? `linear-gradient(145deg, rgba(255, 255, 255, 0.14) 0%, rgba(${lampRgb.r}, ${lampRgb.g}, ${lampRgb.b}, 0.16) 100%)`
                      : 'rgba(255, 255, 255, 0.08)',
                  boxShadow:
                    lighting.anyLightOn && lighting.averageBrightness >= 22
                      ? '0 8px 24px -6px rgba(15, 23, 42, 0.08), 0 1.5px 2px rgba(255, 255, 255, 0.95) inset'
                      : '0 8px 24px -6px rgba(0, 0, 0, 0.35), 0 1px 1.5px rgba(255, 255, 255, 0.16) inset',
                }}
              >
                {/* Card Top Header */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={studyLamp.on}
                    aria-label="开关书房台灯"
                    onClick={() => onToggleDevice(studyLamp.id)}
                    className="flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
                      style={{
                        backgroundColor: studyLamp.on ? lampHex : 'rgba(255, 255, 255, 0.15)',
                        color: studyLamp.on ? '#7C2D12' : '#94A3B8',
                      }}
                    >
                      <Lightbulb className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                          书房吸顶灯
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/65 dark:bg-white/15 border border-white/80 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                          书房
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {studyLamp.on
                          ? `已开启 · ${studyLamp.brightness}% · ${studyLamp.colorTemp}K (点击关灯)`
                          : '已关闭 (点击开灯点亮整页)'}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-slate-500 fill-slate-500/80" />
                    <button
                      type="button"
                      onClick={() => onToggleDevice(studyLamp.id)}
                      className="w-7 h-7 rounded-full bg-white/65 dark:bg-white/15 border border-white/80 flex items-center justify-center text-slate-600 dark:text-slate-200 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/60 dark:bg-white/12" />

                {/* Thick Pill Slider 1: Brightness (1% - 100%) */}
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                  <div className="relative flex-1 h-8 rounded-full bg-white/55 dark:bg-slate-800/70 border border-white/75 overflow-hidden flex items-center">
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 rounded-full transition-all duration-75"
                      style={{
                        width: `${studyLamp.on ? studyLamp.brightness ?? 100 : 0}%`,
                        background: 'linear-gradient(90deg, #E28743 0%, #EE9B59 100%)',
                      }}
                    />
                    <input
                      id="hero-brightness-slider"
                      type="range"
                      min={1}
                      max={100}
                      value={studyLamp.brightness ?? 100}
                      aria-label="灯具亮度滑块"
                      onChange={(e) =>
                        onUpdateLight(studyLamp.id, {
                          brightness: Number(e.target.value),
                          on: true,
                        })
                      }
                      className="mijia-pill-slider relative z-10 w-full h-8 px-1"
                    />
                  </div>
                  <span
                    data-testid="hero-brightness-value"
                    className="w-11 text-right font-mono font-bold text-xs text-slate-800 dark:text-slate-100 tabular-nums"
                  >
                    {studyLamp.on ? `${studyLamp.brightness}%` : 'OFF'}
                  </span>
                </div>

                {/* Thick Pill Slider 2: Color Temperature (2700K - 6500K) */}
                <div className="flex items-center gap-3">
                  <Thermometer className="w-4 h-4 text-[#EA6A12] shrink-0" />
                  <div
                    className="relative flex-1 h-8 rounded-full border border-white/75 overflow-hidden flex items-center"
                    style={{
                      background:
                        'linear-gradient(90deg, #F09C4E 0%, #F8DFB6 48%, #9AD0F5 100%)',
                    }}
                  >
                    <input
                      id="hero-colortemp-slider"
                      type="range"
                      min={2700}
                      max={6500}
                      step={50}
                      value={studyLamp.colorTemp ?? 4600}
                      aria-label="灯具色温滑块"
                      onChange={(e) =>
                        onUpdateLight(studyLamp.id, {
                          colorTemp: Number(e.target.value),
                          on: true,
                        })
                      }
                      className="mijia-pill-slider relative z-10 w-full h-8 px-1"
                    />
                  </div>
                  <span
                    data-testid="hero-colortemp-value"
                    className="w-11 text-right font-mono font-bold text-xs text-slate-800 dark:text-slate-100 tabular-nums"
                  >
                    {studyLamp.colorTemp ?? 4600}K
                  </span>
                </div>

                {/* Mode Capsules ("日光", "月光") */}
                <div className="flex items-center gap-2 pt-0.5">
                  {(['daylight', 'moonlight'] as LightMode[]).map((mode) => {
                    const preset = getLightModePreset(mode);
                    const isActive = studyLamp.on && studyLamp.lightMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          onUpdateLight(studyLamp.id, {
                            brightness: preset.brightness,
                            colorTemp: preset.colorTemp,
                            lightMode: mode,
                            on: true,
                          })
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-white/90 dark:bg-white text-slate-900 border-white shadow-xs'
                            : 'bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-white/70 hover:bg-white/75'
                        }`}
                      >
                        {preset.labelZh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: 次卧吸顶灯 (Offline) + 扫地机器人 (Charging 100%) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-[22px] bg-white/36 dark:bg-white/6 backdrop-blur-md border border-white/65 dark:border-white/10 flex items-center justify-between opacity-85">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center text-slate-500 shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-slate-700 dark:text-slate-300 truncate">
                        次卧吸顶灯
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        离线，未通电
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <button
                  type="button"
                  onClick={() => setVacuumOn((prev) => !prev)}
                  className="p-3 rounded-[22px] bg-white/58 dark:bg-white/10 backdrop-blur-xl border border-white/85 dark:border-white/15 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-white/65 dark:bg-white/12 flex items-center justify-center text-slate-600 dark:text-slate-200 shrink-0">
                      <Disc className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
                        扫地机器人
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                        {vacuumOn ? '清扫中 · 全关保护' : '充电待机，100%'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                </button>
              </div>

              {/* More Devices Collapsed Header */}
              <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>更多设备 14</span>
              </div>
            </div>

            {/* Bottom Translucent Liquid Glass Status / Undo Bar */}
            <div className="px-4 py-2.5 bg-sky-400/24 dark:bg-sky-950/45 backdrop-blur-xl border-t border-white/60 dark:border-white/15 flex items-center justify-between text-xs">
              {undoState.visible ? (
                <div
                  onMouseEnter={() => onPauseUndo(true)}
                  onMouseLeave={() => onPauseUndo(false)}
                  data-testid="undo-banner"
                  className="w-full flex items-center justify-between gap-2"
                >
                  <span className="font-semibold text-slate-800 dark:text-white truncate">
                    {undoState.messageZh}
                  </span>
                  <button
                    type="button"
                    onClick={onUndo}
                    aria-label="撤销上一步操作"
                    className="px-3 py-1 rounded-full bg-[#EA6A12] text-white font-bold text-[11px] cursor-pointer shrink-0"
                  >
                    撤销 ({undoState.remainingSec}s)
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span>米家云端 (11****58)，Miot 直连</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSearchBar((prev) => !prev);
                        setTimeout(() => searchInputRef.current?.focus(), 50);
                      }}
                      aria-label="展开拼音搜索框"
                      className="hover:opacity-75 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={onAllLightsOn}
                      aria-label="刷新并恢复默认灯光"
                      className="hover:opacity-75 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <SlidersHorizontal className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* GIANT SCULPTURAL WORDMARK AT BOTTOM OF HERO */}
          <div className="relative z-10 -mt-5 sm:-mt-8 text-center pointer-events-none">
            <div
              className="font-display font-extrabold tracking-tighter leading-none text-[clamp(3.6rem,12.2vw,10rem)] transition-all duration-500"
              style={{
                backgroundImage: lighting.anyLightOn
                  ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.22) 0%, rgba(56, 189, 248, 0.14) 100%)'
                  : 'linear-gradient(180deg, rgba(148, 163, 184, 0.22) 0%, rgba(30, 41, 59, 0.08) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MenuBarMijia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
