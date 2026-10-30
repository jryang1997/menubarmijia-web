import React, { useState } from 'react';
import {
  Mic,
  RotateCcw,
  Lock,
  Unlock,
  Sun,
  Moon,
  Sparkles,
  Check,
  ShieldCheck,
  CornerDownLeft,
} from 'lucide-react';
import { SmartDevice, RoomLightingSummary, LightMode } from '../utils/mijiaEngine';

interface TactileStorySectionProps {
  devices: SmartDevice[];
  lighting: RoomLightingSummary;
  onToggleDevice: (id: string) => void;
  onUpdateLight: (
    id: string,
    updates: { brightness?: number; colorTemp?: number; lightMode?: LightMode; on?: boolean }
  ) => void;
  onExecuteCommand: (cmd: string) => void;
  onSimulateAutomation: (scenario: 'lock-away' | 'unlock-return' | 'display-connect') => void;
  onAllLightsOff: () => void;
  undoState: {
    visible: boolean;
    messageZh: string;
    messageEn: string;
    remainingSec: number;
  };
  onUndo: () => void;
}

export const TactileStorySection: React.FC<TactileStorySectionProps> = ({
  devices,
  lighting,
  onToggleDevice,
  onUpdateLight,
  onExecuteCommand,
  onSimulateAutomation,
  onAllLightsOff,
  undoState,
  onUndo,
}) => {
  const [selectedPinyin, setSelectedPinyin] = useState<'sftd' | 'pmgd' | 'ktxdd'>('sftd');
  const [activeVoiceCmd, setActiveVoiceCmd] = useState<string>('把书房灯切到月光模式');
  const [voiceReceipt, setVoiceReceipt] = useState<string>('⚡ 本地 · 12ms');
  const [macLocked, setMacLocked] = useState<boolean>(false);

  const pinyinMap = {
    sftd: {
      code: 'sftd',
      deviceId: 'study-desk-lamp',
      name: '书房台灯 Pro',
      room: '书房',
      desc: '82% · 4100K 阅读光',
    },
    pmgd: {
      code: 'pmgd',
      deviceId: 'monitor-light-bar',
      name: '屏幕挂灯 1S',
      room: '书房',
      desc: '65% · 3400K 电脑防眩光',
    },
    ktxdd: {
      code: 'ktxdd',
      deviceId: 'living-ceiling-light',
      name: '客厅吸顶灯',
      room: '客厅',
      desc: '90% · 5200K 日光模式',
    },
  };

  const currentPinyinTarget = pinyinMap[selectedPinyin];
  const targetDeviceObj = devices.find((d) => d.id === currentPinyinTarget.deviceId) || devices[0];

  const handleVoicePhrase = (cmd: string, ms: string) => {
    setActiveVoiceCmd(cmd);
    setVoiceReceipt(`⚡ 本地 · ${ms}`);
    onExecuteCommand(cmd);
  };

  const handleMacStateToggle = (locked: boolean) => {
    setMacLocked(locked);
    if (locked) {
      onSimulateAutomation('lock-away');
    } else {
      onSimulateAutomation('unlock-return');
    }
  };

  return (
    <section id="story" className="relative py-20 md:py-28">
      <div className="max-w-[1040px] mx-auto px-6">
        {/* Intro Thread Header */}
        <div className="max-w-xl mb-16 md:mb-24 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Why MenuBarMijia
          </div>
          <h2 className="font-display font-bold tracking-tight text-slate-950 dark:text-white text-3xl sm:text-4xl text-balance">
            少拿一次手机，多一点专注。
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
            无需预先搭建 Home Assistant，用手机米家 App 扫码即可直连；每一个交互都只为让你留在键盘与屏幕前的心流里。
          </p>
        </div>

        {/* THE NARRATIVE THREAD: A continuous vertical luminous line connecting 3 tactile chapters */}
        <div className="relative pl-6 sm:pl-12 border-l border-slate-300/80 dark:border-slate-800 space-y-24 md:space-y-32">
          {/* ================================================================= */}
          {/* CHAPTER 01: 手不离键盘，敲字即找灯 (GIF-01 Interactive Stage)       */}
          {/* ================================================================= */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Glowing Node on the Spine */}
            <div
              aria-hidden="true"
              className="absolute -left-[31px] sm:-left-[55px] top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-[#FAF9F5] dark:ring-[#090C12]"
            />

            <div className="lg:col-span-5 space-y-3">
              <div className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                01 · KEYBOARD FLOW
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                手不离键盘，打字找灯。
              </h3>
              <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                按 <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800">⌥M</code> 呼出，敲入拼音首字母直接定位设备，回车开关，左右方向键微调亮度色温。全程免切中文输入法。
              </p>
            </div>

            {/* Interactive Pinyin Card */}
            <div className="lg:col-span-7 p-6 rounded-[28px] bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">点击拼音测试盲搜:</span>
                  {(['sftd', 'pmgd', 'ktxdd'] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSelectedPinyin(code)}
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
                        selectedPinyin === code
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                  免切输入法 · 即时命中
                </span>
              </div>

              {/* Simulated Spotlight Result Row */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 text-white border border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 font-mono text-sm font-bold text-amber-300">
                    {currentPinyinTarget.code}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm truncate">
                      {currentPinyinTarget.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono truncate">
                      {currentPinyinTarget.room} · {targetDeviceObj.on ? '当前已开启' : '当前已关闭'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleDevice(currentPinyinTarget.deviceId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer shrink-0"
                >
                  <span>Return ↵</span>
                  <span>{targetDeviceObj.on ? '关灯' : '开灯'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* CHAPTER 02: 按住说话，松手执行 (GIF-02 Push-to-Talk & 12ms Receipt) */}
          {/* ================================================================= */}
          <div id="voice" className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div
              aria-hidden="true"
              className="absolute -left-[31px] sm:-left-[55px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-[#FAF9F5] dark:ring-[#090C12]"
            />

            <div className="lg:col-span-5 space-y-3">
              <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                02 · PUSH-TO-TALK VOICE
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                按住说话，松手即执行。
              </h3>
              <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                像对讲机一样干脆：没有唤醒词等待，也不做多余的语音播报。常规开关、月光模式、调光调温由本地规则毫秒级解析；复杂多步指令可交给你自选的 AI。
              </p>
            </div>

            {/* Interactive Voice Receipt Stage */}
            <div className="lg:col-span-7 p-6 rounded-[28px] bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg space-y-4">
              {/* Live Voice Bar Display */}
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 text-white border border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                    <Mic className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-sm truncate">
                    “{activeVoiceCmd}”
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 font-mono text-xs font-semibold shrink-0 tabular-nums">
                  {voiceReceipt}
                </span>
              </div>

              {/* 3 Clickable Voice Phrases that immediately drive the room light */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    phrase: '把书房灯切到月光模式',
                    tag: '2700K 柔和暗场',
                    ms: '12ms',
                  },
                  {
                    phrase: '日光模式',
                    tag: '5600K 满血照明',
                    ms: '9ms',
                  },
                  {
                    phrase: '暗一点',
                    tag: '当前灯具 -25%',
                    ms: '8ms',
                  },
                ].map((item) => (
                  <button
                    key={item.phrase}
                    type="button"
                    onClick={() => handleVoicePhrase(item.phrase, item.ms)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      activeVoiceCmd === item.phrase
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">「{item.phrase}」</div>
                    <div className="text-[11px] opacity-65 font-mono mt-1">{item.tag}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* CHAPTER 03: 跟上工作状态 & 能撤销才敢放心关 (GIF-03 & GIF-04)        */}
          {/* ================================================================= */}
          <div id="safety" className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div
              aria-hidden="true"
              className="absolute -left-[31px] sm:-left-[55px] top-1.5 w-3.5 h-3.5 rounded-full bg-sky-400 ring-4 ring-[#FAF9F5] dark:ring-[#090C12]"
            />

            <div className="lg:col-span-5 space-y-3">
              <div className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                03 · WORKFLOW & UNDO SAFETY
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                锁屏自动关灯，误触一键撤销。
              </h3>
              <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                离开 Mac 锁屏时自动关掉书房灯，回来解锁自动点亮。睡前全关默认排除路由器与电脑插座，并在底部保留 10 秒「撤销」横幅，原状态精准复原。
              </p>
            </div>

            {/* Dual Interactive Stage: Lock Screen Automation + Safe All-Off with Undo */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card A: Mac Screen Lock Trigger */}
              <div className="p-5 rounded-[26px] bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>MAC EVENT TRIGGER</span>
                    <span>^⌘Q</span>
                  </div>
                  <div className="font-display font-bold text-lg text-slate-950 dark:text-white">
                    {macLocked ? 'Mac 已锁屏离席' : 'Mac 唤醒工作中'}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {macLocked
                      ? '书房台灯已随锁屏自动关闭，网页进入暗场。'
                      : '解锁回到工位，书房台灯恢复 4100K 阅读光。'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleMacStateToggle(true)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      macLocked
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>锁屏离席</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMacStateToggle(false)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      !macLocked
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5 shrink-0" />
                    <span>解锁开灯</span>
                  </button>
                </div>
              </div>

              {/* Card B: 0.6s All-Off & Instant Undo */}
              <div className="p-5 rounded-[26px] bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-2">
                    <span>SAFE ALL-OFF</span>
                    <span>🔒 插座受保护</span>
                  </div>
                  <div className="font-display font-bold text-lg text-slate-950 dark:text-white">
                    能撤销，才敢放心全关
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    智能插座与扫地机默认不参与全关；关闭后立即弹出倒计时撤销条。
                  </p>
                </div>

                {undoState.visible ? (
                  <button
                    type="button"
                    onClick={onUndo}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>点击一键撤销恢复 ({undoState.remainingSec}s)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAllLightsOff}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-300 border border-red-500/25 transition-colors cursor-pointer"
                  >
                    测试全关照明 (插座保持通电)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
