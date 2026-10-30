import React, { useState } from 'react';
import { Download, Copy, Check, Star, Github } from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';

interface DownloadSectionProps {
  anyLightOn: boolean;
  ambientHex: string;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  anyLightOn,
  ambientHex,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const brewCommand = 'brew install --cask jryang1997/tap/menubarmijia';

  const handleCopy = () => {
    navigator.clipboard?.writeText(brewCommand).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="download"
      className="py-20 md:py-28 border-t border-slate-200/70 dark:border-slate-800/70"
    >
      <div className="max-w-[1040px] mx-auto px-6 space-y-16">
        {/* Minimalist Heading */}
        <div className="max-w-xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Download · v1.1.4
          </div>
          <h2 className="font-display font-bold tracking-tight text-slate-950 dark:text-white text-3xl sm:text-4xl">
            免费开源，即刻装进菜单栏。
          </h2>
          <p className="text-[15px] text-slate-500 dark:text-slate-400">
            手机米家 App 扫码即连；macOS 端同时支持接入局域网 Home Assistant。
          </p>
        </div>

        {/* Keyviz-style 2-Column Clean Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: macOS 14+ */}
          <div className="p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <OfficialLogo
                    className="w-10 h-10"
                    isLit={anyLightOn}
                    glowColor={ambientHex}
                  />
                  <div>
                    <div className="text-xs font-mono text-slate-400">macOS 14+ · Swift 6</div>
                    <h3 className="font-display font-bold text-2xl text-slate-950 dark:text-white">
                      macOS 原生版
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500">v1.1.4</span>
              </div>

              {/* One-line Homebrew Command */}
              <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800">
                <code className="truncate">{brewCommand}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="复制 Homebrew 安装命令"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              <span>下载 MenuBarMijia-1.1.4.dmg</span>
            </a>
          </div>

          {/* Card 2: Windows 11 */}
          <div className="p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <OfficialLogo
                    className="w-10 h-10"
                    isLit={anyLightOn}
                    glowColor={ambientHex}
                  />
                  <div>
                    <div className="text-xs font-mono text-slate-400">Windows 11 · Tauri v2</div>
                    <h3 className="font-display font-bold text-2xl text-slate-950 dark:text-white">
                      Windows 11 托盘版
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500">v1.1.4</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                MenuBarMijia-1.1.4-windows-x64-setup.exe / .msi
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                支持米家云扫码直连、自定义全局热键 <code className="font-mono">Alt+M</code>、拼音首字母盲搜、本地口令解析与全关撤销保护。凭据存入 Windows 凭据管理器。
              </p>
            </div>

            <a
              href="https://github.com/jryang1997/MenuBarMijia/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              <span>下载 Windows 11 安装包 (.exe)</span>
            </a>
          </div>
        </div>

        {/* EMOTIONAL FINALE: Star on GitHub Callout */}
        <div className="p-8 sm:p-10 rounded-[32px] border border-amber-400/35 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="font-display font-bold text-xl sm:text-2xl text-slate-950 dark:text-white">
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
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md whitespace-nowrap shrink-0"
          >
            <Star className="w-4 h-4 fill-slate-950 group-hover:rotate-12 transition-transform" />
            <span>去 GitHub 点亮 Star</span>
          </a>
        </div>
      </div>
    </section>
  );
};
