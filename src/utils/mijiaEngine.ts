export type DeviceCategory = 'light' | 'climate' | 'fan' | 'plug' | 'speaker';

export type LightMode = 'daylight' | 'moonlight' | 'reading' | 'computer';

export interface SmartDevice {
  id: string;
  index: number; // 1-based shortcut key 1-6
  nameZh: string;
  nameEn: string;
  roomZh: string;
  roomEn: string;
  pinyinInitials: string;
  pinyinFull: string;
  category: DeviceCategory;
  on: boolean;
  // Light properties
  brightness?: number; // 1 - 100
  colorTemp?: number; // 2700 - 6500 K
  lightMode?: LightMode;
  maxWatts: number;
  // Climate properties
  targetTemp?: number; // 16 - 30 °C
  climateMode?: 'cool' | 'heat' | 'dry' | 'auto';
  // Fan properties
  fanLevel?: number; // 1 - 4
  oscillating?: boolean;
  // Plug properties
  todayKwh?: number;
  childLock?: boolean;
  excludedFromAllOff?: boolean;
  // Speaker properties
  volume?: number;
  playingTrackZh?: string;
  playingTrackEn?: string;
}

export interface RoomLightingSummary {
  anyLightOn: boolean;
  activeLightCount: number;
  totalLightCount: number;
  averageBrightness: number; // 0 - 100
  weightedKelvin: number; // 2700 - 6500
  ambientRgb: { r: number; g: number; b: number };
  ambientHex: string;
  estimatedLux: number;
  totalWatts: number;
}

export interface SkinConfig {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  panelBg: string;
  panelBorder: string;
  panelRadius: string;
  cardBgOn: string;
  cardBgOff: string;
  cardRadius: string;
  accentColor: string;
  textPrimary: string;
  textSecondary: string;
  isDarkSkin: boolean;
}

export const INITIAL_DEVICES: SmartDevice[] = [
  {
    id: 'study-desk-lamp',
    index: 1,
    nameZh: '书房台灯 Pro',
    nameEn: 'Study Desk Lamp Pro',
    roomZh: '书房',
    roomEn: 'Study',
    pinyinInitials: 'sftd',
    pinyinFull: 'shufangtaidengpro',
    category: 'light',
    on: true,
    brightness: 82,
    colorTemp: 4100,
    lightMode: 'reading',
    maxWatts: 14,
  },
  {
    id: 'monitor-light-bar',
    index: 2,
    nameZh: '屏幕挂灯 1S',
    nameEn: 'Monitor Light Bar 1S',
    roomZh: '书房',
    roomEn: 'Study',
    pinyinInitials: 'pmgd',
    pinyinFull: 'pingmuguadeng',
    category: 'light',
    on: false,
    brightness: 65,
    colorTemp: 3400,
    lightMode: 'computer',
    maxWatts: 7.5,
  },
  {
    id: 'living-ceiling-light',
    index: 3,
    nameZh: '客厅吸顶灯',
    nameEn: 'Living Ceiling Light',
    roomZh: '客厅',
    roomEn: 'Living',
    pinyinInitials: 'ktxdd',
    pinyinFull: 'ketingxidingdeng',
    category: 'light',
    on: false,
    brightness: 90,
    colorTemp: 5200,
    lightMode: 'daylight',
    maxWatts: 45,
  },
  {
    id: 'living-ac',
    index: 4,
    nameZh: '客厅自然风空调',
    nameEn: 'Living Room AC',
    roomZh: '客厅',
    roomEn: 'Living',
    pinyinInitials: 'ktkt',
    pinyinFull: 'ketingzirankongtiao',
    category: 'climate',
    on: true,
    targetTemp: 24.5,
    climateMode: 'cool',
    maxWatts: 620,
  },
  {
    id: 'bedroom-ambient-light',
    index: 5,
    nameZh: '主卧床头氛围灯',
    nameEn: 'Bedroom Ambient Lamp',
    roomZh: '主卧',
    roomEn: 'Bedroom',
    pinyinInitials: 'zwctfwd',
    pinyinFull: 'zhuwochuangtoufenweideng',
    category: 'light',
    on: false,
    brightness: 15,
    colorTemp: 2800,
    lightMode: 'moonlight',
    maxWatts: 9,
  },
  {
    id: 'desk-smart-plug',
    index: 6,
    nameZh: '桌面智能插座 3',
    nameEn: 'Desk Smart Plug 3',
    roomZh: '书房',
    roomEn: 'Study',
    pinyinInitials: 'zmzncz',
    pinyinFull: 'zhuomianzhinengchazuo',
    category: 'plug',
    on: true,
    todayKwh: 1.48,
    childLock: true,
    excludedFromAllOff: true,
    maxWatts: 98,
  },
];

export const SKINS: SkinConfig[] = [
  {
    id: 'liquid-glass',
    nameZh: '液态玻璃',
    nameEn: 'Liquid Glass',
    descZh: '高透毛玻璃折射与柔和光晕边线',
    descEn: 'High-translucency specular blur with soft rim highlights',
    panelBg: 'bg-slate-900/82 backdrop-blur-2xl',
    panelBorder: 'border-white/20 shadow-2xl',
    panelRadius: 'rounded-[26px]',
    cardBgOn: 'bg-amber-400/18 border-amber-300/35',
    cardBgOff: 'bg-white/[0.06] border-white/10',
    cardRadius: 'rounded-2xl',
    accentColor: '#F59E0B',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    isDarkSkin: true,
  },
  {
    id: 'classic',
    nameZh: '经典原生',
    nameEn: 'Classic',
    descZh: '遵循 macOS Control Center 原生克制质感',
    descEn: 'Authentic macOS Control Center vibrancy and hierarchy',
    panelBg: 'bg-[#1C1E24]/92 backdrop-blur-xl',
    panelBorder: 'border-white/12 shadow-2xl',
    panelRadius: 'rounded-[20px]',
    cardBgOn: 'bg-[#2C2F38] border-amber-400/40',
    cardBgOff: 'bg-[#23262E] border-white/8',
    cardRadius: 'rounded-xl',
    accentColor: '#FF9F0A',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    isDarkSkin: true,
  },
  {
    id: 'frost',
    nameZh: '凝霜白昼',
    nameEn: 'Frost',
    descZh: '通透浅色磨砂，适合明亮日光桌面',
    descEn: 'Crisp frosted daylight surface for bright studio setups',
    panelBg: 'bg-white/90 backdrop-blur-2xl',
    panelBorder: 'border-slate-200/90 shadow-xl',
    panelRadius: 'rounded-[22px]',
    cardBgOn: 'bg-amber-50/95 border-amber-300/80',
    cardBgOff: 'bg-slate-100/80 border-slate-200/70',
    cardRadius: 'rounded-xl',
    accentColor: '#D97706',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    isDarkSkin: false,
  },
  {
    id: 'night-flight',
    nameZh: '夜航模式',
    nameEn: 'Night Flight',
    descZh: '深邃低眩光碳黑面板，深夜写代码不刺眼',
    descEn: 'Ultra-low glare obsidian instrumentation for late-night coding',
    panelBg: 'bg-[#090B10]/96 backdrop-blur-xl',
    panelBorder: 'border-slate-800/90 shadow-2xl',
    panelRadius: 'rounded-[18px]',
    cardBgOn: 'bg-amber-500/12 border-amber-500/30',
    cardBgOff: 'bg-[#11151E] border-slate-800/80',
    cardRadius: 'rounded-xl',
    accentColor: '#F59E0B',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    isDarkSkin: true,
  },
  {
    id: 'bento',
    nameZh: '便当矩阵',
    nameEn: 'Bento',
    descZh: '几何分明的结构化网格与高对比度数字标签',
    descEn: 'Structured architectural grid with high-contrast numerals',
    panelBg: 'bg-[#141619]/95 backdrop-blur-xl',
    panelBorder: 'border-neutral-700/70 shadow-2xl',
    panelRadius: 'rounded-[24px]',
    cardBgOn: 'bg-neutral-800 border-amber-400/50',
    cardBgOff: 'bg-neutral-900/90 border-neutral-800',
    cardRadius: 'rounded-[16px]',
    accentColor: '#FBBF24',
    textPrimary: 'text-neutral-100',
    textSecondary: 'text-neutral-400',
    isDarkSkin: true,
  },
  {
    id: 'soft-mist',
    nameZh: '晨雾微光',
    nameEn: 'Soft Mist',
    descZh: '温暖米灰调性，贴合米家家居柔和呼吸感',
    descEn: 'Warm stone neutral palette tuned for calm residential spaces',
    panelBg: 'bg-[#F7F5F0]/94 backdrop-blur-xl',
    panelBorder: 'border-stone-300/80 shadow-xl',
    panelRadius: 'rounded-[24px]',
    cardBgOn: 'bg-amber-100/75 border-amber-400/60',
    cardBgOff: 'bg-stone-200/55 border-stone-300/60',
    cardRadius: 'rounded-2xl',
    accentColor: '#EA580C',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-500',
    isDarkSkin: false,
  },
  {
    id: 'capsule',
    nameZh: '胶囊灵动',
    nameEn: 'Capsule',
    descZh: '饱满圆润胶囊切角，触控与拖拽反馈极其顺滑',
    descEn: 'Tactile pill-radius geometry with fluid slider affordances',
    panelBg: 'bg-[#181A20]/94 backdrop-blur-2xl',
    panelBorder: 'border-white/15 shadow-2xl',
    panelRadius: 'rounded-[30px]',
    cardBgOn: 'bg-amber-400/20 border-amber-300/40',
    cardBgOff: 'bg-white/[0.05] border-white/10',
    cardRadius: 'rounded-[22px]',
    accentColor: '#FBBF24',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    isDarkSkin: true,
  },
  {
    id: 'dawn',
    nameZh: '破晓暖阳',
    nameEn: 'Dawn',
    descZh: '暖金微光渐变底色，还原清晨第一缕阳光',
    descEn: 'Warm golden-hour gradient undertone with soft amber rim',
    panelBg: 'bg-[#211B17]/94 backdrop-blur-2xl',
    panelBorder: 'border-amber-500/25 shadow-2xl',
    panelRadius: 'rounded-[24px]',
    cardBgOn: 'bg-amber-500/22 border-amber-400/45',
    cardBgOff: 'bg-white/[0.05] border-white/10',
    cardRadius: 'rounded-2xl',
    accentColor: '#FB923C',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/70',
    isDarkSkin: true,
  },
  {
    id: 'neon',
    nameZh: '极客流光',
    nameEn: 'Neon',
    descZh: '高锐度边缘轮廓与精密仪表盘读数',
    descEn: 'Crisp instrument-grade contours for desktop setups',
    panelBg: 'bg-[#0B0F17]/95 backdrop-blur-2xl',
    panelBorder: 'border-sky-400/30 shadow-2xl',
    panelRadius: 'rounded-[20px]',
    cardBgOn: 'bg-sky-500/18 border-sky-400/45',
    cardBgOff: 'bg-slate-900/80 border-slate-800',
    cardRadius: 'rounded-xl',
    accentColor: '#38BDF8',
    textPrimary: 'text-slate-50',
    textSecondary: 'text-slate-400',
    isDarkSkin: true,
  },
];

/**
 * Converts a color temperature in Kelvin (2700K - 6500K) to a perceptual RGB color
 * suitable for ambient room illumination and device glow indicators.
 */
export function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const clamped = Math.max(2700, Math.min(6500, kelvin));
  // Normalize 2700..6500 to t in 0..1
  const t = (clamped - 2700) / (6500 - 2700);

  if (t <= 0.45) {
    // 2700K (Warm Amber: 255, 174, 66) -> 4400K (Warm Daylight: 255, 232, 196)
    const localT = t / 0.45;
    return {
      r: 255,
      g: Math.round(174 + (232 - 174) * localT),
      b: Math.round(66 + (196 - 66) * localT),
    };
  } else {
    // 4400K (255, 232, 196) -> 6500K (Crisp Cool White: 218, 238, 255)
    const localT = (t - 0.45) / 0.55;
    return {
      r: Math.round(255 - (255 - 218) * localT),
      g: Math.round(232 + (238 - 232) * localT),
      b: Math.round(196 + (255 - 196) * localT),
    };
  }
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Calculates aggregate room lighting state from all devices.
 */
export function calculateRoomLighting(devices: SmartDevice[]): RoomLightingSummary {
  const lights = devices.filter((d) => d.category === 'light');
  const activeLights = lights.filter((d) => d.on);

  let totalWatts = 0;
  for (const d of devices) {
    if (!d.on) continue;
    if (d.category === 'light') {
      const ratio = Math.max(0.08, (d.brightness ?? 80) / 100);
      totalWatts += d.maxWatts * ratio;
    } else if (d.category === 'climate') {
      totalWatts += d.maxWatts;
    } else if (d.category === 'plug') {
      totalWatts += d.maxWatts;
    } else {
      totalWatts += d.maxWatts * 0.5;
    }
  }

  if (activeLights.length === 0) {
    const fallbackRgb = kelvinToRgb(3500);
    return {
      anyLightOn: false,
      activeLightCount: 0,
      totalLightCount: lights.length,
      averageBrightness: 0,
      weightedKelvin: 3500,
      ambientRgb: fallbackRgb,
      ambientHex: rgbToHex(fallbackRgb),
      estimatedLux: 0,
      totalWatts: Math.round(totalWatts * 10) / 10,
    };
  }

  let sumBrightness = 0;
  let weightedKelvinSum = 0;
  let weightSum = 0;

  for (const light of activeLights) {
    const b = light.brightness ?? 80;
    const k = light.colorTemp ?? 4000;
    sumBrightness += b;
    weightedKelvinSum += k * b;
    weightSum += b;
  }

  const averageBrightness = Math.round(sumBrightness / activeLights.length);
  const weightedKelvin = weightSum > 0 ? Math.round(weightedKelvinSum / weightSum) : 4000;
  const ambientRgb = kelvinToRgb(weightedKelvin);

  // Estimate lux based on number of active lights and their brightness
  const capacityRatio = sumBrightness / (lights.length * 100);
  const estimatedLux = Math.round(capacityRatio * 680 + activeLights.length * 35);

  return {
    anyLightOn: true,
    activeLightCount: activeLights.length,
    totalLightCount: lights.length,
    averageBrightness,
    weightedKelvin,
    ambientRgb,
    ambientHex: rgbToHex(ambientRgb),
    estimatedLux,
    totalWatts: Math.round(totalWatts * 10) / 10,
  };
}

/**
 * Filters devices by room and Pinyin initials / Chinese / English query.
 */
export function filterDevices(
  devices: SmartDevice[],
  query: string,
  roomFilter: string = 'all'
): SmartDevice[] {
  const normalizedQuery = query.trim().toLowerCase();

  return devices.filter((device) => {
    if (roomFilter !== 'all' && device.roomZh !== roomFilter && device.roomEn.toLowerCase() !== roomFilter.toLowerCase()) {
      return false;
    }
    if (!normalizedQuery) return true;

    return (
      device.nameZh.toLowerCase().includes(normalizedQuery) ||
      device.nameEn.toLowerCase().includes(normalizedQuery) ||
      device.roomZh.toLowerCase().includes(normalizedQuery) ||
      device.roomEn.toLowerCase().includes(normalizedQuery) ||
      device.pinyinInitials.toLowerCase().includes(normalizedQuery) ||
      device.pinyinFull.toLowerCase().includes(normalizedQuery)
    );
  });
}

export interface CommandParseResult {
  matched: boolean;
  summaryZh: string;
  summaryEn: string;
  updatedDevices: SmartDevice[];
}

/**
 * Mirrors MijiaCore's local parser for natural Chinese & English spoken/typed commands.
 */
export function executeLocalCommand(
  devices: SmartDevice[],
  rawCommand: string
): CommandParseResult {
  const cmd = rawCommand.trim().toLowerCase();
  if (!cmd) {
    return {
      matched: false,
      summaryZh: '请输入或说出控制指令',
      summaryEn: 'Please enter or speak a command',
      updatedDevices: devices,
    };
  }

  const clone = devices.map((d) => ({ ...d }));

  // 1. Moonlight mode
  if (cmd.includes('月光') || cmd.includes('moonlight')) {
    let changed = 0;
    for (const d of clone) {
      if (d.category === 'light') {
        if (cmd.includes('书房') && d.roomZh !== '书房') continue;
        d.on = true;
        d.brightness = 12;
        d.colorTemp = 2700;
        d.lightMode = 'moonlight';
        changed++;
      }
    }
    if (changed > 0) {
      return {
        matched: true,
        summaryZh: `已将 ${changed} 盏灯切换至原生月光模式 (12% · 2700K)`,
        summaryEn: `Switched ${changed} light(s) to native Moonlight mode (12% · 2700K)`,
        updatedDevices: clone,
      };
    }
  }

  // 2. Daylight mode
  if (cmd.includes('日光') || cmd.includes('daylight')) {
    let changed = 0;
    for (const d of clone) {
      if (d.category === 'light') {
        d.on = true;
        d.brightness = 95;
        d.colorTemp = 5600;
        d.lightMode = 'daylight';
        changed++;
      }
    }
    return {
      matched: true,
      summaryZh: `已将 ${changed} 盏灯切换至日光模式 (95% · 5600K)`,
      summaryEn: `Switched ${changed} light(s) to Daylight mode (95% · 5600K)`,
      updatedDevices: clone,
    };
  }

  // 3. Reading mode
  if (cmd.includes('阅读') || cmd.includes('reading')) {
    let changed = 0;
    for (const d of clone) {
      if (d.category === 'light') {
        d.on = true;
        d.brightness = 82;
        d.colorTemp = 4200;
        d.lightMode = 'reading';
        changed++;
      }
    }
    return {
      matched: true,
      summaryZh: `已切换至专注阅读光效 (82% · 4200K)`,
      summaryEn: `Switched lights to Reading mode (82% · 4200K)`,
      updatedDevices: clone,
    };
  }

  // 4. Turn off all lights / All Off
  if (
    cmd.includes('关闭所有灯') ||
    cmd.includes('关所有灯') ||
    cmd.includes('全部关灯') ||
    cmd.includes('全关') ||
    cmd.includes('turn off all lights') ||
    cmd.includes('all off')
  ) {
    let changed = 0;
    for (const d of clone) {
      if (d.category === 'light' && d.on) {
        d.on = false;
        changed++;
      }
    }
    return {
      matched: true,
      summaryZh: `已关闭全部照明设备（插座已按安全规则默认排除）`,
      summaryEn: `Turned off all lights (Smart plugs excluded by default)`,
      updatedDevices: clone,
    };
  }

  // 5. Turn on all lights
  if (
    cmd.includes('打开所有灯') ||
    cmd.includes('开所有灯') ||
    cmd.includes('全部开灯') ||
    cmd.includes('turn on all lights')
  ) {
    let changed = 0;
    for (const d of clone) {
      if (d.category === 'light') {
        d.on = true;
        if ((d.brightness ?? 0) < 30) d.brightness = 80;
        changed++;
      }
    }
    return {
      matched: true,
      summaryZh: `已开启全屋 ${changed} 盏灯具`,
      summaryEn: `Turned on all ${changed} lights`,
      updatedDevices: clone,
    };
  }

  // 6. Brightness nudge
  if (cmd.includes('亮一点') || cmd.includes('调亮') || cmd.includes('brighter')) {
    for (const d of clone) {
      if (d.category === 'light' && d.on) {
        d.brightness = Math.min(100, (d.brightness ?? 50) + 20);
      }
    }
    return {
      matched: true,
      summaryZh: '已将当前开启的灯具亮度上调 20%',
      summaryEn: 'Increased brightness of active lights by 20%',
      updatedDevices: clone,
    };
  }

  if (cmd.includes('暗一点') || cmd.includes('调暗') || cmd.includes('dimmer')) {
    for (const d of clone) {
      if (d.category === 'light' && d.on) {
        d.brightness = Math.max(5, (d.brightness ?? 50) - 25);
      }
    }
    return {
      matched: true,
      summaryZh: '已将当前开启的灯具亮度下调 25%',
      summaryEn: 'Decreased brightness of active lights by 25%',
      updatedDevices: clone,
    };
  }

  // 7. AC Temperature adjustment
  if (cmd.includes('空调') || cmd.includes('温度') || cmd.includes('ac') || cmd.includes('度') || cmd.includes('warmer') || cmd.includes('cooler')) {
    const ac = clone.find((d) => d.category === 'climate');
    if (ac) {
      if (cmd.includes('关') || cmd.includes('off')) {
        ac.on = false;
        return {
          matched: true,
          summaryZh: '已关闭客厅自然风空调',
          summaryEn: 'Turned off Living Room AC',
          updatedDevices: clone,
        };
      }
      ac.on = true;
      const numMatch = cmd.match(/(\d{2}(?:\.\d)?)/);
      if (numMatch) {
        const val = Math.max(16, Math.min(30, parseFloat(numMatch[1])));
        ac.targetTemp = val;
      } else if (cmd.includes('高') || cmd.includes('warmer')) {
        ac.targetTemp = Math.min(30, (ac.targetTemp ?? 24) + 1.5);
      } else if (cmd.includes('低') || cmd.includes('cooler')) {
        ac.targetTemp = Math.max(16, (ac.targetTemp ?? 24) - 1.5);
      }
      return {
        matched: true,
        summaryZh: `客厅空调已设定为 ${ac.targetTemp?.toFixed(1)}°C`,
        summaryEn: `Living Room AC set to ${ac.targetTemp?.toFixed(1)}°C`,
        updatedDevices: clone,
      };
    }
  }

  // 8. Room/Device specific toggle (e.g. "关客厅灯", "开书房灯")
  const isTurnOff = cmd.includes('关') || cmd.includes('off');
  const isTurnOn = cmd.includes('开') || cmd.includes('on');
  if (isTurnOff || isTurnOn) {
    let targetRoom = '';
    if (cmd.includes('书房') || cmd.includes('study')) targetRoom = '书房';
    if (cmd.includes('客厅') || cmd.includes('living')) targetRoom = '客厅';
    if (cmd.includes('主卧') || cmd.includes('卧室') || cmd.includes('bedroom')) targetRoom = '主卧';

    let hitCount = 0;
    for (const d of clone) {
      const roomMatches = !targetRoom || d.roomZh === targetRoom;
      const isTargetLight = d.category === 'light';
      if (roomMatches && isTargetLight) {
        d.on = isTurnOn && !isTurnOff;
        hitCount++;
      }
    }
    if (hitCount > 0) {
      return {
        matched: true,
        summaryZh: `已${isTurnOff ? '关闭' : '开启'}${targetRoom || '指定'}照明设备 (${hitCount} 台)`,
        summaryEn: `${isTurnOff ? 'Turned off' : 'Turned on'} ${targetRoom || 'selected'} lights (${hitCount})`,
        updatedDevices: clone,
      };
    }
  }

  return {
    matched: false,
    summaryZh: `本地解析器未匹配「${rawCommand}」，可按回车筛选设备`,
    summaryEn: `Local parser did not match "${rawCommand}"; filtering devices instead`,
    updatedDevices: devices,
  };
}

export function getLightModePreset(mode: LightMode): { brightness: number; colorTemp: number; labelZh: string; labelEn: string } {
  switch (mode) {
    case 'daylight':
      return { brightness: 95, colorTemp: 5600, labelZh: '日光', labelEn: 'Daylight' };
    case 'moonlight':
      return { brightness: 10, colorTemp: 2700, labelZh: '月光', labelEn: 'Moonlight' };
    case 'reading':
      return { brightness: 82, colorTemp: 4200, labelZh: '阅读', labelEn: 'Reading' };
    case 'computer':
      return { brightness: 50, colorTemp: 3500, labelZh: '电脑', labelEn: 'Computer' };
  }
}
