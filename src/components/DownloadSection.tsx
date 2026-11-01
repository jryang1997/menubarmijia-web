import React, { useState } from 'react';
import { Download, Copy, Check, Star } from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';
import { ClientOS, formatStarCount } from '../utils/mijiaEngine';
import { playBubbleSound } from '../utils/soundEffects';

interface DownloadSectionProps {
  anyLightOn: boolean;
  ambientHex: string;
  starCount: number | null;
  latestVersion: string;
  clientOS: ClientOS;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  anyLightOn,
  ambientHex,
  starCount,
  latestVersion,
  clientOS,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const brewCommand = 'brew install --cask jryang1997/tap/menubarmijia';
  const cleanVer = latestVersion.replace(/^v/, '');
  const formattedStars = formatStarCount(starCount);
  const isWindowsPreferred = clientOS === 'windows';

  const handleCopy = () => {
    navigator.clipboard?.writeText(brewCommand).catch(() => {});
    playBubbleSound(true);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="download"
      className="py-20 md:py-28 border-t border-white/60 dark:border-white/10"
    >
      <div className="max-w-[1000px] mx-auto px-6 space-y-14">
        {/* Minimalist Heading */}
        <div className="max-w-xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#007AFF] dark:text-sky-400">
            Download · {latestVersion}
          </div>
          <h2 className="font-display font-bold tracking-tight text-slate-900 dark:text-white text-3xl sm:text-4xl">
            免费开源，即刻装进菜单栏。
          </h2>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">
            手机米家 App 扫码即连；macOS 端同时支持接入局域网 Home Assistant。
          </p>
        </div>

        {/* Cohesive Apple Liquid Glass 2-Column Download Cards (Zero harsh black boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: macOS 14+ */}
          <div className="p-7 rounded-[32px] liquid-glass-surface flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3.5">
                  <OfficialLogo
                    className="w-10 h-10"
                    isLit={anyLightOn}
                    glowColor={ambientHex}
                  />
                  <div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">macOS 14+ · Swift 6</div>
                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                      macOS 原生版
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!isWindowsPreferred && (
                    <span className="px-2.5 py-1 rounded-full bg-[#007AFF]/14 text-[#007AFF] dark:text-sky-300 border border-[#007AFF]/25 text-[11px] font-semibold">
                      当前系统推荐
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {latestVersion}
                  </span>
                </div>
              </div>

              {/* Translucent Frosted Code Bar (replaces harsh black terminal block) */}
              <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-white/75 dark:bg-white/8 border border-white/90 dark:border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] font-mono text-xs text-slate-800 dark:text-slate-200">
                <code className="truncate">{brewCommand}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="复制 Homebrew 安装命令"
                  className="px-3 py-1 rounded-full bg-[#007AFF]/12 hover:bg-[#007AFF]/20 text-[#007AFF] dark:text-sky-300 border border-[#007AFF]/20 inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors font-sans font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                支持米家扫码与 Home Assistant 双后端、菜单栏按住说话、Mac 锁屏联动与温湿度 24h 趋势图。凭据存入系统钥匙串。
              </p>
            </div>

            <a
              href="https://github.com/jryang1997/MenuBarMijia/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                !isWindowsPreferred
                  ? 'bg-[#007AFF] hover:bg-[#0071E3] text-white shadow-[0_8px_22px_-4px_rgba(0,122,255,0.38),inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'bg-white/85 dark:bg-white/12 hover:bg-white dark:hover:bg-white/18 text-slate-900 dark:text-white border border-white/90 dark:border-white/20 shadow-[0_6px_18px_-4px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>下载 MenuBarMijia-{cleanVer}.dmg</span>
            </a>
          </div>

          {/* Card 2: Windows 11 */}
          <div className="p-7 rounded-[32px] liquid-glass-surface flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3.5">
                  <OfficialLogo
                    className="w-10 h-10"
                    isLit={anyLightOn}
                    glowColor={ambientHex}
                  />
                  <div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Windows 11 · Tauri v2</div>
                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                      Windows 11 托盘版
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isWindowsPreferred && (
                    <span className="px-2.5 py-1 rounded-full bg-[#007AFF]/14 text-[#007AFF] dark:text-sky-300 border border-[#007AFF]/25 text-[11px] font-semibold">
                      当前系统推荐
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {latestVersion}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/75 dark:bg-white/8 border border-white/90 dark:border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                MenuBarMijia-{cleanVer}-windows-x64-setup.exe / .msi
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                支持米家云扫码直连、自定义全局热键 <code className="font-mono">Alt+M</code>、拼音首字母盲搜、本地口令解析与全关撤销保护。凭据存入 Windows 凭据管理器。
              </p>
            </div>

            <a
              href="https://github.com/jryang1997/MenuBarMijia/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                isWindowsPreferred
                  ? 'bg-[#007AFF] hover:bg-[#0071E3] text-white shadow-[0_8px_22px_-4px_rgba(0,122,255,0.38),inset_0_1px_0_rgba(255,255,255,0.35)]'
                  : 'bg-white/85 dark:bg-white/12 hover:bg-white dark:hover:bg-white/18 text-slate-900 dark:text-white border border-white/90 dark:border-white/20 shadow-[0_6px_18px_-4px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
              }`}
            >
              <Download className={`w-4 h-4 ${isWindowsPreferred ? 'text-white' : 'text-[#007AFF] dark:text-sky-400'}`} />
              <span>下载 Windows 11 安装包 (.exe)</span>
            </a>
          </div>
        </div>

        {/* Liquid Glass Star on GitHub Callout */}
        <div className="p-8 sm:p-10 rounded-[32px] liquid-glass-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              如果它帮你少拿了几次手机，欢迎点亮一颗 ⭐ Star
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              MenuBarMijia 是完全免费的个人开源作品（MIT 协议）。你的每一颗 Star 都是持续打磨体验的最大动力。
            </p>
          </div>

          <a
            href="https://github.com/jryang1997/MenuBarMijia"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold bg-[#007AFF] hover:bg-[#0071E3] text-white transition-all shadow-[0_8px_22px_-4px_rgba(0,122,255,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] whitespace-nowrap shrink-0"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>去 GitHub 点亮 Star{formattedStars ? ` (${formattedStars})` : ''}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

