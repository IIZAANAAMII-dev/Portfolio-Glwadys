export type AspectRatio = '9:16' | '4:5' | '1:1' | '16:9' | '3:2';
export type MediaRole =
  | 'hero'
  | 'portrait'
  | 'post'
  | 'reel'
  | 'story'
  | 'campaign'
  | 'feed'
  | 'yuna'
  | 'mgc'
  | 'comptoir'
  | 'detail'
  | 'mood'
  | 'reference'
  | 'strategy';

export interface MediaSlot {
  id: string;
  role: MediaRole;
  aspect: AspectRatio;
  color: 'charcoal' | 'espresso' | 'ivory' | 'champagne' | 'clay' | 'obsidian';
  label: string;
  // real path to be injected later
  src?: string;
  alt?: string;
}

export const aspectRatioToPadding: Record<AspectRatio, string> = {
  '9:16': '177.78%',
  '4:5': '125%',
  '1:1': '100%',
  '16:9': '56.25%',
  '3:2': '66.67%',
};

export const colorMap: Record<MediaSlot['color'], string> = {
  charcoal: 'bg-charcoal',
  espresso: 'bg-espresso',
  ivory: 'bg-ivory',
  champagne: 'bg-champagne',
  clay: 'bg-clay',
  obsidian: 'bg-obsidian',
};

export const mediaSlots: Record<string, MediaSlot> = {
  heroMain: {
    id: 'heroMain',
    role: 'hero',
    aspect: '3:2',
    color: 'espresso',
    label: 'HERO',
  },
  heroFragment1: {
    id: 'heroFragment1',
    role: 'detail',
    aspect: '4:5',
    color: 'charcoal',
    label: 'FRAGMENT 01',
  },
  heroFragment2: {
    id: 'heroFragment2',
    role: 'detail',
    aspect: '16:9',
    color: 'clay',
    label: 'FRAGMENT 02',
  },
  socialMain: {
    id: 'socialMain',
    role: 'story',
    aspect: '9:16',
    color: 'espresso',
    label: 'STORY',
  },
  socialPost1: {
    id: 'socialPost1',
    role: 'post',
    aspect: '4:5',
    color: 'charcoal',
    label: 'POST',
  },
  socialReel1: {
    id: 'socialReel1',
    role: 'reel',
    aspect: '9:16',
    color: 'clay',
    label: 'REEL',
  },
  socialCampaign: {
    id: 'socialCampaign',
    role: 'campaign',
    aspect: '16:9',
    color: 'ivory',
    label: 'CAMPAIGN',
  },
  phoneFeed1: {
    id: 'phoneFeed1',
    role: 'feed',
    aspect: '4:5',
    color: 'charcoal',
    label: 'FEED 01',
  },
  phoneFeed2: {
    id: 'phoneFeed2',
    role: 'feed',
    aspect: '4:5',
    color: 'espresso',
    label: 'FEED 02',
  },
  phoneStory: {
    id: 'phoneStory',
    role: 'story',
    aspect: '9:16',
    color: 'ivory',
    label: 'STORY',
  },
  webglForeground: {
    id: 'webglForeground',
    role: 'campaign',
    aspect: '9:16',
    color: 'champagne',
    label: 'FOREGROUND',
  },
  webglMid: {
    id: 'webglMid',
    role: 'post',
    aspect: '4:5',
    color: 'espresso',
    label: 'MID',
  },
  webglBack: {
    id: 'webglBack',
    role: 'reel',
    aspect: '16:9',
    color: 'charcoal',
    label: 'BACK',
  },
  yuna1: {
    id: 'yuna1',
    role: 'yuna',
    aspect: '4:5',
    color: 'ivory',
    label: 'YUNA 01',
  },
  mgc1: {
    id: 'mgc1',
    role: 'mgc',
    aspect: '1:1',
    color: 'clay',
    label: 'MGC 01',
  },
  comptoir1: {
    id: 'comptoir1',
    role: 'comptoir',
    aspect: '3:2',
    color: 'champagne',
    label: 'COMPTOIR 01',
  },
};

export function getMediaSlot(id: string): MediaSlot | undefined {
  return mediaSlots[id];
}
