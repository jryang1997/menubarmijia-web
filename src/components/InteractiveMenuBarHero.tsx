import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Mic,
  Search,
  RotateCcw,
  Download,
  Star,
  Sliders,
  Home,
  Lock,
  Zap,
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
import { OfficialLogo } from './OfficialLogo';

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

export const InteractiveMenuBarHero: React.FC<InteractiveMenuBarHeroProps> = ({
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  onToggleDevice,
  onUpdateLight,
  onUpdateClimate,
  onAllLightsOff,
  onAllLightsOn,
  onExecuteCommand,
  lighting,
  undoState,
  onUndo,
  onPauseUndo,
  lastFeedback,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeKeycap, setActiveKeycap] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [latencyBadge, setLatencyBadge] = useState<string | null>('⚡ 本地 · 12ms');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const studyLamp =
    devices.find((d) => d.id === selectedDeviceId && d.category === 'light') ||
    devices.find((d) => d.id === 'study-desk-lamp') ||
    devices[0];

  const acDevice = devices.find((d) => d.category === 'climate')!;
  const plugDevice = devices.find((d) => d.category === 'plug')!;

  const filteredDevices = filterDevices(devices, searchQuery, 'all');
  const lampRgb = kelvinToRgb(studyLamp.colorTemp ?? 4100);
  const lampHex = rgbToHex(lampRgb);

  const flashKey = (id: string) => {
    setActiveKeycap(id);
    setTimeout(() => {
      setActiveKeycap((prev) => (prev === id ? null : prev));
    }, 260);
  };

  // Global keyboard shortcuts matching GIF-01 & GIF-02
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.altKey && e.code === 'KeyM') {
        e.preventDefault();
        flashKey('opt-m');
        searchInputRef.current?.focus();
        return;
      }

      if (isInput) {
        if (e.key === 'Escape') {
          setSearchQuery('');
          searchInputRef.current?.blur();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        flashKey('sftd');
        searchInputRef.current?.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        flashKey('enter');
        onToggleDevice(studyLamp.id);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextB = Math.min(100, (studyLamp.brightness ?? 70) + 10);
        onUpdateLight(studyLamp.id, { brightness: nextB, on: true });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextB = Math.max(5, (studyLamp.brightness ?? 70) - 10);
        onUpdateLight(studyLamp.id, { brightness: nextB, on: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyLamp, onToggleDevice, onUpdateLight]);

  // GIF-01 7-second Automated Story Demo ("▶ 演示 7 秒盲操")
  const runSevenSecondStory = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    // Step 0: Turn off lamp first so turning it on is dramatic
    onUpdateLight(studyLamp.id, { on: false });
    setSearchQuery('');
    setLatencyBadge(null);

    // 0.8s: Press ⌥M
    setTimeout(() => {
      flashKey('opt-m');
      searchInputRef.current?.focus();
    }, 600);

    // 1.6s: Type sftd
    setTimeout(() => {
      flashKey('sftd');
      setSearchQuery('sftd');
    }, 1400);

    // 2.8s: Press Return ↵ -> Lamp turns ON, page lights up!
    setTimeout(() => {
      flashKey('enter');
      onUpdateLight(studyLamp.id, { on: true, brightness: 88, colorTemp: 4100, lightMode: 'reading' });
      setLatencyBadge('⚡ 本地 · 9ms');
    }, 2500);

    // 4.2s: Clear search & finish
    setTimeout(() => {
      setSearchQuery('');
      setIsAutoPlaying(false);
    }, 4200);
  };

  // GIF-02 Push-to-Talk simulation
  const triggerVoicePTT = () => {
    flashKey('voice');
    setIsVoiceListening(true);
    setSearchQuery('把书房灯切到月光模式...');
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
    }, 700);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onToggleDevice(studyLamp.id);
      return;
    }
    if (filteredDevices.length === 1) {
      onToggleDevice(filteredDevices[0].id);
      setLatencyBadge('⚡ 拼音直达 · 8ms');
      return;
    }
    onExecuteCommand(searchQuery);
    setLatencyBadge('⚡ 本地 · 12ms');
  };

  return (
    <section
      id="hero"
      className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden select-none"
    >
      {/* Physical Ambient Light Field radiating from the center lamp */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-500"
        style={{
          background: lighting.anyLightOn
            ? `radial-gradient(58% 52% at 50% 52%, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, ${(0.18 + (lighting.averageBrightness / 100) * 0.36).toFixed(3)}) 0%, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, ${(0.05 + (lighting.averageBrightness / 100) * 0.12).toFixed(3)}) 52%, transparent 82%)`
            : 'radial-gradient(50% 45% at 50% 50%, rgba(15, 23, 42, 0.45) 0%, transparent 75%)',
        }}
      />

      <div className="relative max-w-[1160px] mx-auto px-6">
        {/* KEYVIZ-STYLE MINIMALIST TOP SPLIT: Big Slogan Left, Concise Copy + 2 Buttons Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 md:mb-20">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono tracking-tight text-slate-500 dark:text-slate-400 mb-3">
              macOS 14+ 原生菜单栏 · Windows 11 系统托盘 · v1.1.4
            </div>
            <h1 className="font-display font-extrabold tracking-tight text-slate-950 dark:text-white text-[clamp(2.5rem,4.8vw,4.25rem)] leading-[1.06] text-balance">
              在电脑上，
              <span className="block">顺手控制整个家。</span>
            </h1>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:pb-1">
            <p className="text-[15px] md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              写代码或开会时，不必特意拿起手机。按 <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800">⌥M</code> 呼出面板，敲拼音找灯、按住说话、锁屏离席自动关灯。
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>下载 v1.1.4</span>
              </a>

              <a
                href="https://github.com/jryang1997/MenuBarMijia"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300/90 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 transition-all whitespace-nowrap shrink-0 shadow-xs"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 group-hover:scale-110 transition-transform" />
                <span>Star on GitHub</span>
              </a>

              <button
                type="button"
                onClick={runSevenSecondStory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAutoPlaying ? '正在演示盲操...' : '演示 7 秒键盘找灯'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SCULPTURAL CENTERPIECE: Floating 3D Keycaps + Live MenuBarMijia Popover + Giant Wordmark */}
        <div className="relative pt-4 pb-8 md:pb-12 flex flex-col items-center">
          {/* Floating 3D Keycap 1 (Top-Left, angled like Keyviz's ⌘ command keycap) */}
          <button
            type="button"
            data-pressed={activeKeycap === 'opt-m'}
            onClick={() => {
              flashKey('opt-m');
              searchInputRef.current?.focus();
            }}
            aria-label="快捷键 Option M 呼出面板"
            className="hidden lg:flex flex-col justify-between keycap-3d-light dark:keycap-3d-dark absolute left-4 xl:left-10 top-6 -rotate-6 w-44 p-4 rounded-[22px] bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 cursor-pointer z-20"
          >
            <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
              <span>global</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">⌥ M</span>
            </div>
            <div className="mt-4 text-left">
              <div className="font-display font-bold text-lg text-slate-950 dark:text-white leading-tight">
                呼出面板
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">手不离键盘</div>
            </div>
          </button>

          {/* Floating 3D Keycap 2 (Bottom-Left, angled like Keyviz's enter keycap): sftd Pinyin */}
          <button
            type="button"
            data-pressed={activeKeycap === 'sftd'}
            onClick={() => {
              flashKey('sftd');
              setSearchQuery((prev) => (prev === 'sftd' ? '' : 'sftd'));
              setLatencyBadge('⚡ 拼音匹配 · 6ms');
            }}
            aria-label="拼音首字母 sftd 搜索书房台灯"
            className="hidden lg:flex flex-col justify-between keycap-3d-light dark:keycap-3d-dark absolute left-8 xl:left-16 bottom-36 rotate-3 w-44 p-4 rounded-[22px] bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 cursor-pointer z-20"
          >
            <div className="flex items-center justify-between w-full text-xs font-mono text-amber-600 dark:text-amber-400">
              <span>pinyin</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">sftd</span>
            </div>
            <div className="mt-3 text-left">
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                拼音盲搜找灯
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">免切中文输入法</div>
            </div>
          </button>

          {/* Floating 3D Keycap 3 (Top-Right, angled): Hold to Talk */}
          <button
            type="button"
            data-pressed={activeKeycap === 'voice' || isVoiceListening}
            onClick={triggerVoicePTT}
            aria-label="按住说话切换月光模式"
            className="hidden lg:flex flex-col justify-between keycap-3d-light dark:keycap-3d-dark absolute right-4 xl:right-10 top-8 rotate-6 w-48 p-4 rounded-[22px] bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 cursor-pointer z-20"
          >
            <div className="flex items-center justify-between w-full text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span>push-to-talk</span>
              <Mic className="w-4 h-4" />
            </div>
            <div className="mt-3 text-left">
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                {isVoiceListening ? '正在聆听...' : '按住说话'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                「切到月光模式」
              </div>
            </div>
          </button>

          {/* Floating 3D Keycap 4 (Bottom-Right, angled): Return ↵ Toggle Light */}
          <button
            type="button"
            data-pressed={activeKeycap === 'enter'}
            onClick={() => {
              flashKey('enter');
              onToggleDevice(studyLamp.id);
            }}
            aria-label="回车键开关书房台灯"
            className="hidden lg:flex flex-col justify-between keycap-3d-light dark:keycap-3d-dark absolute right-8 xl:right-16 bottom-36 -rotate-3 w-44 p-4 rounded-[22px] bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 cursor-pointer z-20"
          >
            <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
              <span>return</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">↵</span>
            </div>
            <div className="mt-3 text-left">
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                {studyLamp.on ? '回车关灯变暗' : '回车开灯点亮'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">背景光场实时联动</div>
            </div>
          </button>

          {/* THE JEWEL: Minimalist macOS Menu Bar Strip + MenuBarMijia Popover */}
          <div className="relative z-30 w-full max-w-[440px]">
            {/* Minimal macOS Menu Bar Pill right above the popover */}
            <div className="mx-auto mb-2.5 inline-flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-slate-900/92 dark:bg-slate-900/95 text-white text-xs border border-white/12 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-white font-bold"></span>
                <span className="font-medium text-white">MenuBarMijia</span>
                <span className="text-[11px] font-mono text-slate-400">24.5°C · 48%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerVoicePTT}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    isVoiceListening
                      ? 'bg-emerald-400 text-slate-950 font-semibold'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <Mic className="w-3 h-3 text-amber-400" />
                  <span>{isVoiceListening ? '松手发送' : '按住说话'}</span>
                </button>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-semibold text-[11px] tabular-nums">
                  <Home className="w-3 h-3" />
                  <span>{lighting.anyLightOn ? `${lighting.activeLightCount} 开启` : '已全关'}</span>
                </span>
              </div>
            </div>

            {/* Main Popover Card */}
            <div
              data-testid="menubarmijia-panel"
              className="w-full rounded-[28px] bg-[#16181F]/94 dark:bg-[#13161F]/96 text-white border border-white/15 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300"
              style={{
                boxShadow: lighting.anyLightOn
                  ? `0 28px 70px -15px rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, ${(0.28 + (lighting.averageBrightness / 100) * 0.35).toFixed(2)}), 0 20px 40px -15px rgba(0,0,0,0.5)`
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
              }}
            >
              {/* Search / Voice Bar with ⚡ 本地 · 12ms receipt */}
              <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="敲 sftd 找台灯，或输入「月光模式」回车..."
                  aria-label="搜索设备或输入控制指令"
                  className="w-full pl-9 pr-28 py-2.5 text-xs rounded-2xl bg-white/[0.07] border border-white/12 text-white placeholder:text-slate-400 focus:border-amber-400/70 outline-none transition-colors"
                />
                {latencyBadge && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] tabular-nums">
                    {latencyBadge}
                  </span>
                )}
              </form>

              {/* HERO FEATURED CARD: 书房台灯 Pro (Interactive Switch + Brightness + Color Temp Sliders) */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-300 mb-3 ${
                  studyLamp.on
                    ? 'bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-white/[0.04] border-amber-300/40'
                    : 'bg-white/[0.04] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: studyLamp.on ? lampHex : 'rgba(255,255,255,0.08)',
                        color: studyLamp.on ? '#0F172A' : '#94A3B8',
                      }}
                    >
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-white">
                          {studyLamp.nameZh}
                        </span>
                        <span className="font-mono text-[10px] text-amber-300/80">sftd</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-300 tabular-nums">
                        {studyLamp.on
                          ? `${studyLamp.brightness}% · ${studyLamp.colorTemp}K · 实时照亮网页背景`
                          : '已关闭 · 点击右侧开关点亮背景'}
                      </div>
                    </div>
                  </div>

                  {/* Master Lamp Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={studyLamp.on}
                    aria-label="开关书房台灯"
                    onClick={() => onToggleDevice(studyLamp.id)}
                    className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      studyLamp.on ? 'bg-amber-400' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        studyLamp.on ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Tactile Brightness Slider */}
                <div className="space-y-2.5 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <label htmlFor="hero-brightness-slider" className="text-slate-300 font-medium">
                        亮度调节 (拖动改变网页明暗)
                      </label>
                      <span
                        data-testid="hero-brightness-value"
                        className="font-mono font-semibold text-white tabular-nums"
                      >
                        {studyLamp.on ? `${studyLamp.brightness}%` : 'OFF'}
                      </span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <div className="pointer-events-none absolute inset-x-0 h-2 rounded-full overflow-hidden bg-black/40">
                        <div
                          className="h-full transition-all duration-75"
                          style={{
                            width: `${studyLamp.on ? studyLamp.brightness ?? 82 : 0}%`,
                            background: `linear-gradient(90deg, #F59E0B 0%, ${lampHex} 100%)`,
                          }}
                        />
                      </div>
                      <input
                        id="hero-brightness-slider"
                        type="range"
                        min={1}
                        max={100}
                        value={studyLamp.brightness ?? 82}
                        aria-label="灯具亮度滑块"
                        onChange={(e) =>
                          onUpdateLight(studyLamp.id, {
                            brightness: Number(e.target.value),
                            on: true,
                          })
                        }
                        className="mijia-slider relative z-10 w-full h-6"
                      />
                    </div>
                  </div>

                  {/* Tactile Color Temperature Slider (2700K - 6500K) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <label htmlFor="hero-colortemp-slider" className="text-slate-300 font-medium">
                        色温调节 (2700K 暖烛光 – 6500K 冷日光)
                      </label>
                      <span
                        data-testid="hero-colortemp-value"
                        className="font-mono font-semibold text-white tabular-nums"
                      >
                        {studyLamp.colorTemp ?? 4100}K
                      </span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <div
                        className="pointer-events-none absolute inset-x-0 h-2 rounded-full"
                        style={{
                          background:
                            'linear-gradient(90deg, #FFAE42 0%, #FFE8C4 48%, #DAEEFF 100%)',
                        }}
                      />
                      <input
                        id="hero-colortemp-slider"
                        type="range"
                        min={2700}
                        max={6500}
                        step={50}
                        value={studyLamp.colorTemp ?? 4100}
                        aria-label="灯具色温滑块"
                        onChange={(e) =>
                          onUpdateLight(studyLamp.id, {
                            colorTemp: Number(e.target.value),
                            on: true,
                          })
                        }
                        className="mijia-slider relative z-10 w-full h-6"
                      />
                    </div>
                  </div>

                  {/* Quick Native Mode Switcher + All Off */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      {(['daylight', 'reading', 'moonlight'] as LightMode[]).map((mode) => {
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
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                              isActive
                                ? 'bg-amber-400 text-slate-950 font-semibold'
                                : 'bg-white/8 text-slate-300 hover:bg-white/15'
                            }`}
                          >
                            {preset.labelZh}模式
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={onAllLightsOff}
                      aria-label="全关当前房间灯具"
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/25 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      全关照明
                    </button>
                  </div>
                </div>
              </div>

              {/* 2 Compact Companion Cards (AC + Protected Smart Plug) */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Living Room AC */}
                <div
                  className={`p-3 rounded-2xl border transition-colors ${
                    acDevice.on
                      ? 'bg-sky-500/15 border-sky-400/35'
                      : 'bg-white/[0.04] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold truncate">{acDevice.nameZh}</span>
                    <button
                      type="button"
                      onClick={() => onToggleDevice(acDevice.id)}
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${
                        acDevice.on ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {acDevice.on ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateClimate(acDevice.id, Math.max(16, (acDevice.targetTemp ?? 24.5) - 0.5))
                      }
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="tabular-nums font-bold text-sky-200">
                      {acDevice.targetTemp?.toFixed(1)}°C
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateClimate(acDevice.id, Math.min(30, (acDevice.targetTemp ?? 24.5) + 0.5))
                      }
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Protected Smart Plug */}
                <div className="p-3 rounded-2xl border bg-white/[0.04] border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">{plugDevice.nameZh}</span>
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 tabular-nums mt-1">
                    98W · 今日 1.48 kWh
                  </div>
                  <div className="text-[10px] text-emerald-400/90 mt-0.5">
                    全关默认保护 · 不断网
                  </div>
                </div>
              </div>

              {/* 10-Second Undo Banner inside Popover */}
              {undoState.visible && (
                <div
                  onMouseEnter={() => onPauseUndo(true)}
                  onMouseLeave={() => onPauseUndo(false)}
                  data-testid="undo-banner"
                  className="mt-3 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate font-medium text-amber-100">
                      {undoState.messageZh}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onUndo}
                    aria-label="撤销上一步操作"
                    className="px-3 py-1 rounded-xl font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    撤销 ({undoState.remainingSec}s)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GIANT KEYVIZ-INSPIRED ARCHITECTURAL WORDMARK AT BOTTOM OF HERO */}
          <div className="relative z-10 -mt-6 sm:-mt-10 text-center pointer-events-none">
            <div
              className="font-display font-extrabold tracking-tighter leading-none text-[clamp(3.6rem,12.5vw,10.5rem)] transition-all duration-500"
              style={{
                backgroundImage: lighting.anyLightOn
                  ? `linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, 0.85) 100%)`
                  : 'linear-gradient(180deg, rgba(148,163,184,0.38) 0%, rgba(30,41,59,0.18) 100%)',
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
