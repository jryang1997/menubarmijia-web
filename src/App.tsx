/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  INITIAL_DEVICES,
  SmartDevice,
  LightMode,
  calculateRoomLighting,
  executeLocalCommand,
} from './utils/mijiaEngine';
import { InteractiveMenuBarHero } from './components/InteractiveMenuBarHero';
import { TactileStorySection } from './components/TactileStorySection';
import { DownloadSection } from './components/DownloadSection';
import { OfficialLogo } from './components/OfficialLogo';

export default function App() {
  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('study-desk-lamp');
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  // Undo state machine (mirrors MenuBarMijia's 10s Undo Bar)
  const previousDevicesRef = useRef<SmartDevice[] | null>(null);
  const [undoState, setUndoState] = useState<{
    visible: boolean;
    messageZh: string;
    messageEn: string;
    remainingSec: number;
  }>({
    visible: false,
    messageZh: '',
    messageEn: '',
    remainingSec: 10,
  });
  const [undoPaused, setUndoPaused] = useState<boolean>(false);

  const lighting = useMemo(() => calculateRoomLighting(devices), [devices]);

  // Sync room lighting state with document.documentElement dark class:
  // Turning lights OFF or entering dim Moonlight mode (<22% brightness) immerses the page in dark night mode;
  // Turning lights ON (>=22% brightness) illuminates the page background!
  const isRoomBright = lighting.anyLightOn && lighting.averageBrightness >= 22;

  useEffect(() => {
    const root = document.documentElement;
    if (isRoomBright) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [isRoomBright]);

  // Countdown timer for Undo bar
  useEffect(() => {
    if (!undoState.visible || undoPaused) return;
    const timer = setInterval(() => {
      setUndoState((prev) => {
        if (prev.remainingSec <= 1) {
          return { ...prev, visible: false, remainingSec: 0 };
        }
        return { ...prev, remainingSec: prev.remainingSec - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [undoState.visible, undoPaused]);

  const raiseUndoBar = (
    snapshot: SmartDevice[],
    messageZh: string,
    messageEn: string,
    seconds = 10
  ) => {
    previousDevicesRef.current = snapshot.map((d) => ({ ...d }));
    setUndoState({
      visible: true,
      messageZh,
      messageEn,
      remainingSec: seconds,
    });
  };

  const handleUndo = () => {
    if (previousDevicesRef.current) {
      setDevices(previousDevicesRef.current);
      previousDevicesRef.current = null;
    }
    setUndoState((prev) => ({ ...prev, visible: false }));
    setLastFeedback('已恢复至修改前的设备状态、亮度与色温');
  };

  const handleToggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextOn = !d.on;
        return {
          ...d,
          on: nextOn,
          brightness: nextOn && (d.brightness ?? 0) < 10 ? 82 : d.brightness,
        };
      })
    );
  };

  const handleUpdateLight = (
    id: string,
    updates: { brightness?: number; colorTemp?: number; lightMode?: LightMode; on?: boolean }
  ) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          ...updates,
          on: updates.on !== undefined ? updates.on : true,
        };
      })
    );
  };

  const handleUpdateClimate = (id: string, targetTemp: number) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, on: true, targetTemp } : d))
    );
  };

  const handleAllLightsOff = () => {
    const snapshot = devices.map((d) => ({ ...d }));
    const next = devices.map((d) =>
      d.category === 'light' ? { ...d, on: false } : d
    );
    setDevices(next);
    raiseUndoBar(
      snapshot,
      '已全关当前照明（智能插座默认保护）',
      'All lights turned off (Smart plug safely excluded)',
      10
    );
  };

  const handleAllLightsOn = () => {
    const snapshot = devices.map((d) => ({ ...d }));
    const next = devices.map((d) =>
      d.category === 'light'
        ? {
            ...d,
            on: true,
            brightness: (d.brightness ?? 0) < 35 ? 82 : d.brightness,
          }
        : d
    );
    setDevices(next);
    raiseUndoBar(
      snapshot,
      '已点亮全屋照明设备',
      'Turned on room lights',
      10
    );
  };

  const handleExecuteCommand = (rawCommand: string) => {
    const snapshot = devices.map((d) => ({ ...d }));
    const result = executeLocalCommand(devices, rawCommand);
    if (result.matched) {
      setDevices(result.updatedDevices);
      setLastFeedback(result.summaryZh);
      raiseUndoBar(snapshot, result.summaryZh, result.summaryEn, 10);
    } else {
      setLastFeedback(result.summaryZh);
    }
  };

  const handleSimulateAutomation = (
    scenario: 'lock-away' | 'unlock-return' | 'display-connect'
  ) => {
    const snapshot = devices.map((d) => ({ ...d }));
    if (scenario === 'lock-away') {
      const next = devices.map((d) =>
        d.category === 'light' ? { ...d, on: false } : d
      );
      setDevices(next);
      raiseUndoBar(
        snapshot,
        'Mac 锁屏离席：书房台灯已随锁屏自动关闭',
        'Mac Locked (Away): Turned off lights automatically',
        10
      );
    } else if (scenario === 'unlock-return') {
      const next = devices.map((d) =>
        d.id === 'study-desk-lamp' || d.id === 'monitor-light-bar'
          ? { ...d, on: true, brightness: 85, colorTemp: 4100, lightMode: 'reading' as LightMode }
          : d
      );
      setDevices(next);
      raiseUndoBar(
        snapshot,
        'Mac 解锁返回：已恢复书房 4100K 阅读光',
        'Mac Unlocked (Return): Restored study lights (4100K)',
        10
      );
    } else if (scenario === 'display-connect') {
      const next = devices.map((d) =>
        d.category === 'light'
          ? { ...d, on: true, brightness: 50, colorTemp: 3400, lightMode: 'computer' as LightMode }
          : d
      );
      setDevices(next);
      raiseUndoBar(
        snapshot,
        '接入外接显示器：已切换至 3400K 电脑模式',
        'External Display Connected: Switched to 3400K Computer mode',
        10
      );
    }
  };

  return (
    <div
      data-room-lit={lighting.anyLightOn ? 'true' : 'false'}
      data-kelvin={lighting.weightedKelvin}
      className={`min-h-screen transition-colors duration-500 ${
        isRoomBright
          ? 'bg-[#F4F8FC] text-slate-900 bg-dot-grid-light'
          : 'bg-[#080D16] text-slate-100 bg-dot-grid-dark'
      }`}
      style={{
        backgroundImage: lighting.anyLightOn
          ? `radial-gradient(circle at 50% 24%, rgba(${lighting.ambientRgb.r}, ${lighting.ambientRgb.g}, ${lighting.ambientRgb.b}, ${(0.14 + (lighting.averageBrightness / 100) * 0.24).toFixed(3)}) 0%, rgba(125, 211, 252, 0.14) 45%, transparent 72%), ${
              isRoomBright
                ? 'radial-gradient(rgba(15, 23, 42, 0.06) 1.25px, transparent 1.25px)'
                : 'radial-gradient(rgba(248, 250, 252, 0.07) 1.25px, transparent 1.25px)'
            }`
          : undefined,
        backgroundSize: lighting.anyLightOn ? '100% 100%, 24px 24px' : '24px 24px',
      }}
    >
      {/* Top Bar Contract: Strictly 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-white/70 dark:border-white/10 bg-white/65 dark:bg-slate-900/65 backdrop-blur-2xl">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
        >
          MenuBarMijia
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#hero"
            className="hover:text-[#007AFF] dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            交互体验
          </a>
          <a
            href="#story"
            className="hover:text-[#007AFF] dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            键盘找灯
          </a>
          <a
            href="#voice"
            className="hover:text-[#007AFF] dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            按住说话
          </a>
          <a
            href="#safety"
            className="hover:text-[#007AFF] dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            锁屏与撤销
          </a>
          <a
            href="#download"
            className="hover:text-[#007AFF] dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            下载 v1.1.4
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/jryang1997/MenuBarMijia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0071E3] rounded-full shadow-[0_4px_14px_rgba(0,122,255,0.32),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all whitespace-nowrap shrink-0"
          >
            ★ Star on GitHub
          </a>
        </div>
      </header>

      <main>
        {/* Act I: Keyviz-inspired Sculptural Hero with Floating 3D Keycaps & Live Popover */}
        <InteractiveMenuBarHero
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          setSelectedDeviceId={setSelectedDeviceId}
          onToggleDevice={handleToggleDevice}
          onUpdateLight={handleUpdateLight}
          onUpdateClimate={handleUpdateClimate}
          onAllLightsOff={handleAllLightsOff}
          onAllLightsOn={handleAllLightsOn}
          onExecuteCommand={handleExecuteCommand}
          lighting={lighting}
          undoState={undoState}
          onUndo={handleUndo}
          onPauseUndo={setUndoPaused}
          lastFeedback={lastFeedback}
        />

        {/* Act II: The Continuous Narrative Spine (Keyboard -> Voice 12ms -> Lock & Undo) */}
        <TactileStorySection
          devices={devices}
          lighting={lighting}
          onToggleDevice={handleToggleDevice}
          onUpdateLight={handleUpdateLight}
          onExecuteCommand={handleExecuteCommand}
          onSimulateAutomation={handleSimulateAutomation}
          onAllLightsOff={handleAllLightsOff}
          undoState={undoState}
          onUndo={handleUndo}
        />

        {/* Act III: Minimalist v1.1.4 Download & GitHub Star Finale */}
        <DownloadSection
          anyLightOn={lighting.anyLightOn}
          ambientHex={lighting.ambientHex}
        />
      </main>

      {/* Quiet Keyviz-inspired Footer */}
      <footer className="border-t border-slate-200/70 dark:border-slate-800/70 py-12 px-6">
        <div className="max-w-[1040px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <OfficialLogo
              className="w-7 h-7"
              isLit={lighting.anyLightOn}
              glowColor={lighting.ambientHex}
            />
            <div>
              <div className="font-display font-bold text-sm text-slate-950 dark:text-white">
                MenuBarMijia v1.1.4
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                MIT License © jryang1997 (一群小羊说) · 个人开源作品，非小米或米家官方客户端
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <a
              href="https://github.com/jryang1997/MenuBarMijia"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/jryang1997/MenuBarMijia/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Releases
            </a>
            <a
              href="https://github.com/jryang1997/MenuBarMijia/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Changelog
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
