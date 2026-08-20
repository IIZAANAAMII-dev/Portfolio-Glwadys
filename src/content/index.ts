import type { Locale } from './locales';

/**
 * Contenu du site. Source de vérité unique, récupérée des données réelles.
 *
 * Le type impose l'exhaustivité : ajouter une clé sans sa traduction dans les
 * trois langues est une erreur de compilation.
 *
 * Convention assumée : les termes métier du secteur (SOCIAL MEDIA, CONTENT,
 * BRAND, STRATEGY…) restent en anglais dans les trois langues. C'est l'usage
 * réel de la profession, et cela stabilise les compositions typographiques.
 */

export interface WorkProject {
  id: 'yuna' | 'mgc' | 'comptoir';
  name: string;
  role: string;
  place: string;
  period: string;
  summary: string;
  skills: string[];
  caseStudy: {
    challenge: string;
    direction: string;
    outcome: string;
    evidence: Array<{
      value: string;
      label: string;
    }>;
  };
}

export interface JourneyEntry {
  year: string;
  label: string;
  place: string;
}

export interface ExpertiseEntry {
  term: string;
  context: string;
}

export interface StrategyStep {
  term: string;
  note: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
  };
  opening: {
    edition: string;
    axis: string;
    tagline: string;
  };
  hero: {
    firstName: string;
    lastName: string;
    disciplines: string[];
  };
  social: {
    /** Titre accessible de l'acte, non affiché en grand. */
    heading: string;
    front: string;
    behind: string;
    /** Les strates révélées par le Front → Behind. */
    layers: string[];
    statement: string;
  };
  phone: {
    heading: string;
    beats: string[];
  };
  immersion: {
    heading: string;
    statement: string;
  };
  process: {
    heading: string;
    sheet: string;
    moodboard: string;
    system: string;
    /** Tokens du système de marque rendus visibles. */
    systemTokens: string[];
  };
  strategy: {
    heading: string;
    steps: StrategyStep[];
    sentence: string;
  };
  work: {
    heading: string;
    caseLabels: {
      challenge: string;
      direction: string;
      outcome: string;
      evidence: string;
    };
    projects: WorkProject[];
  };
  journey: {
    heading: string;
    entries: JourneyEntry[];
  };
  expertise: {
    heading: string;
    entries: ExpertiseEntry[];
  };
  manifesto: {
    eyebrow: string;
    lineOne: string;
    lineTwo: string;
    note: string;
  };
  contact: {
    heading: string;
    statement: string;
    cta: string;
    email: string;
    linkedin: string;
    linkedinLabel: string;
    availability: string;
    axis: string;
    services: string;
    languages: string;
    backToTop: string;
    copyright: string;
  };
  nav: {
    label: string;
    home: string;
    work: string;
    journey: string;
    expertise: string;
    contact: string;
  };
  a11y: {
    skipToContent: string;
    languageSwitch: string;
    /** Description des emplacements média non encore fournis. */
    reservedMedia: string;
  };
}

const EMAIL = 'glwadys.dalleau29@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/glwadysdalleau';

const fr: Content = {
  meta: {
    title: 'Glwadys Dalleau — Social Media & Brand Communication',
    description:
      'Je transforme les marques en histoires dont on se souvient. Social media, création de contenu et communication de marque. Paris ↔ Seoul.',
  },
  opening: {
    edition: 'Portfolio 2026',
    axis: 'Paris ↔ Seoul',
    tagline: 'Je transforme les marques en histoires dont on se souvient.',
  },
  hero: {
    firstName: 'Glwadys',
    lastName: 'Dalleau',
    disciplines: ['Content', 'Social', 'Brand Strategy'],
  },
  social: {
    heading: 'Le contenu',
    front: 'Ce que l’on voit',
    behind: 'Ce qui le tient',
    layers: ['Moodboard', 'Planning', 'Copy', 'Calendrier', 'Direction'],
    statement: 'Derrière chaque contenu, une stratégie.',
  },
  phone: {
    heading: 'Le contenu en situation',
    beats: ['Feed', 'Focus', 'Story', 'Campagne'],
  },
  immersion: {
    heading: 'Dans le contenu',
    statement: 'On ne regarde plus le contenu. On est dedans.',
  },
  process: {
    heading: 'Le processus',
    sheet: 'Planche contact',
    moodboard: 'Intention',
    system: 'Système',
    systemTokens: ['Palette', 'Typographie', 'Ton', 'Message', 'Cadrage'],
  },
  strategy: {
    heading: 'La méthode',
    steps: [
      { term: 'Audience', note: 'À qui l’on parle vraiment.' },
      { term: 'Positioning', note: 'La place que la marque occupe.' },
      { term: 'Tone', note: 'La voix qui la rend reconnaissable.' },
      { term: 'Content', note: 'Ce qui est produit, et pourquoi.' },
      { term: 'Planning', note: 'Le rythme qui installe la présence.' },
      { term: 'Campaign', note: 'Le moment où tout converge.' },
    ],
    sentence: 'Une audience, une place, une voix, un rythme.',
  },
  work: {
    heading: 'Sélection',
    caseLabels: {
      challenge: 'Enjeu',
      direction: 'Direction',
      outcome: 'Résultat',
      evidence: 'Preuves',
    },
    projects: [
      {
        id: 'yuna',
        name: 'Yuna Bijoux',
        role: 'Social Media & Communication — alternance',
        place: 'Brest',
        period: '2022 — 2023',
        summary:
          'Valoriser des collections de bijoux raffinés : storytelling produit, création visuelle et engagement d’une audience sensible au détail.',
        skills: ['Social Media', 'Contenu visuel', 'Planning éditorial', 'Storytelling produit'],
        caseStudy: {
          challenge:
            'Faire sentir la finesse d’un bijou à travers un écran, sans perdre la proximité de la marque.',
          direction:
            'Construire une ligne visuelle sobre autour du geste, de la matière et du détail, puis l’inscrire dans un calendrier cohérent.',
          outcome:
            'Une présence produit plus désirable et reconnaissable, pensée pour nourrir la découverte comme la relation.',
          evidence: [
            { value: 'Produit', label: 'storytelling & détail' },
            { value: 'Social', label: 'feed, story, calendrier' },
            { value: 'Marque', label: 'cohérence visuelle' },
          ],
        },
      },
      {
        id: 'mgc',
        name: 'Marseille Girls Club',
        role: 'Community & Communication — CDI temps partiel',
        place: 'Marseille / hybride',
        period: '2025 — 2026',
        summary:
          'Animer et faire grandir un club féminin méditerranéen : formats scrapbook, couverture d’événements, engagement et authenticité.',
        skills: ['Community', 'Contenu digital', 'Événementiel', 'Cohérence de marque'],
        caseStudy: {
          challenge:
            'Faire grandir une communauté locale sans lisser sa spontanéité ni son identité méditerranéenne.',
          direction:
            'Mêler formats scrapbook, couverture d’événements et prises de parole directes dans un langage collectif.',
          outcome:
            'Une communication vivante qui transforme chaque rendez-vous en récit et chaque membre en relais naturel.',
          evidence: [
            { value: 'Community', label: 'animation & proximité' },
            { value: 'Live', label: 'couverture événementielle' },
            { value: 'Formats', label: 'scrapbook & social' },
          ],
        },
      },
      {
        id: 'comptoir',
        name: 'Le Comptoir de Mathilde',
        role: 'Expérience client & support vente — CDD',
        place: 'Marseille',
        period: '2024 — aujourd’hui',
        summary:
          'Immersion dans l’épicerie fine artisanale : conseil personnalisé, merchandising soigné et valorisation de marque en boutique.',
        skills: ['Expérience client', 'Merchandising', 'Storytelling de marque', 'Retail'],
        caseStudy: {
          challenge:
            'Faire vivre une marque gourmande dans chaque détail du parcours, de la vitrine jusqu’au conseil.',
          direction:
            'Relier merchandising, connaissance produit et attention portée au client dans une expérience cohérente.',
          outcome:
            'Une compréhension concrète de la marque en situation : ce qui attire, ce qui rassure et ce qui déclenche le choix.',
          evidence: [
            { value: 'Retail', label: 'expérience en boutique' },
            { value: 'Produit', label: 'conseil personnalisé' },
            { value: 'Espace', label: 'merchandising & récit' },
          ],
        },
      },
    ],
  },
  journey: {
    heading: 'Parcours',
    entries: [
      { year: '2021', label: 'Premiers contenus, premières marques', place: 'Freelance' },
      { year: '2022', label: 'Social media en joaillerie', place: 'Yuna Bijoux, Brest' },
      { year: '2023', label: 'Bachelor commerce international & marketing', place: 'IPAC' },
      { year: '2024', label: 'Retail, merchandising, marque', place: 'Le Comptoir de Mathilde' },
      { year: '2025', label: 'Communauté et contenu', place: 'Marseille Girls Club' },
      { year: '2026', label: 'Direction de contenu et de marque', place: 'Paris ↔ Seoul' },
    ],
  },
  expertise: {
    heading: 'Expertise',
    entries: [
      { term: 'Social Media', context: 'Stratégie, publication, animation, analyse.' },
      { term: 'Content Creation', context: 'Photo, vidéo courte, copy, direction visuelle.' },
      { term: 'Content Strategy', context: 'Ligne éditoriale, formats, calendrier.' },
      { term: 'Brand Communication', context: 'Positionnement, ton, cohérence.' },
      { term: 'Community', context: 'Animation, modération, relation, fidélisation.' },
      { term: 'Digital Marketing', context: 'Acquisition organique, campagnes, performance.' },
      { term: 'International', context: 'Français, anglais, coréen. Paris ↔ Seoul.' },
    ],
  },
  manifesto: {
    eyebrow: 'Manifeste / 08.5',
    lineOne: 'Construire une marque,',
    lineTwo: 'c’est décider de ce que l’on retiendra.',
    note: 'Le reste est du bruit.',
  },
  contact: {
    heading: 'Contact',
    statement: 'Créons quelque chose dont on se souvient.',
    cta: 'Écrire à Glwadys',
    email: EMAIL,
    linkedin: LINKEDIN,
    linkedinLabel: 'LinkedIn',
    availability: 'Disponible — Marseille & à distance',
    axis: 'Paris ↔ Seoul',
    services: 'Social media · Content · Brand communication',
    languages: 'FR · EN · KO',
    backToTop: 'Revenir au début',
    copyright: '© 2026 Glwadys Dalleau',
  },
  nav: {
    label: 'Navigation principale',
    home: 'Accueil',
    work: 'Projets',
    journey: 'Parcours',
    expertise: 'Expertise',
    contact: 'Contact',
  },
  a11y: {
    skipToContent: 'Aller au contenu',
    languageSwitch: 'Changer de langue',
    reservedMedia: 'Emplacement réservé à un visuel',
  },
};

const en: Content = {
  meta: {
    title: 'Glwadys Dalleau — Social Media & Brand Communication',
    description:
      'I turn brands into stories people remember. Social media, content creation and brand communication. Paris ↔ Seoul.',
  },
  opening: {
    edition: 'Portfolio 2026',
    axis: 'Paris ↔ Seoul',
    tagline: 'I turn brands into stories people remember.',
  },
  hero: {
    firstName: 'Glwadys',
    lastName: 'Dalleau',
    disciplines: ['Content', 'Social', 'Brand Strategy'],
  },
  social: {
    heading: 'The content',
    front: 'What you see',
    behind: 'What holds it',
    layers: ['Moodboard', 'Planning', 'Copy', 'Calendar', 'Direction'],
    statement: 'Behind every piece of content, a strategy.',
  },
  phone: {
    heading: 'Content in context',
    beats: ['Feed', 'Focus', 'Story', 'Campaign'],
  },
  immersion: {
    heading: 'Inside the content',
    statement: 'You are no longer looking at the content. You are inside it.',
  },
  process: {
    heading: 'The process',
    sheet: 'Contact sheet',
    moodboard: 'Intent',
    system: 'System',
    systemTokens: ['Palette', 'Typography', 'Tone', 'Message', 'Framing'],
  },
  strategy: {
    heading: 'The method',
    steps: [
      { term: 'Audience', note: 'Who we are actually speaking to.' },
      { term: 'Positioning', note: 'The space the brand occupies.' },
      { term: 'Tone', note: 'The voice that makes it recognisable.' },
      { term: 'Content', note: 'What gets made, and why.' },
      { term: 'Planning', note: 'The rhythm that builds presence.' },
      { term: 'Campaign', note: 'The moment everything converges.' },
    ],
    sentence: 'An audience, a place, a voice, a rhythm.',
  },
  work: {
    heading: 'Selected work',
    caseLabels: {
      challenge: 'Challenge',
      direction: 'Direction',
      outcome: 'Outcome',
      evidence: 'Evidence',
    },
    projects: [
      {
        id: 'yuna',
        name: 'Yuna Bijoux',
        role: 'Social Media & Communication — work-study',
        place: 'Brest',
        period: '2022 — 2023',
        summary:
          'Bringing delicate jewellery collections forward: product storytelling, visual creation and engaging an audience that notices detail.',
        skills: ['Social Media', 'Visual Content', 'Editorial Planning', 'Product Storytelling'],
        caseStudy: {
          challenge:
            'Translate the delicacy of jewellery through a screen without losing the brand’s sense of proximity.',
          direction:
            'Build a restrained visual language around gesture, material and detail, then give it a consistent editorial rhythm.',
          outcome:
            'A more desirable and recognisable product presence, designed to support discovery and connection.',
          evidence: [
            { value: 'Product', label: 'storytelling & detail' },
            { value: 'Social', label: 'feed, story, calendar' },
            { value: 'Brand', label: 'visual consistency' },
          ],
        },
      },
      {
        id: 'mgc',
        name: 'Marseille Girls Club',
        role: 'Community & Communication — part-time permanent',
        place: 'Marseille / hybrid',
        period: '2025 — 2026',
        summary:
          'Growing a Mediterranean women’s club: scrapbook formats, event coverage, engagement and authenticity.',
        skills: ['Community', 'Digital Content', 'Event Communication', 'Brand Consistency'],
        caseStudy: {
          challenge:
            'Grow a local community without smoothing away its spontaneity or Mediterranean identity.',
          direction:
            'Combine scrapbook formats, event coverage and direct conversation in a collective visual language.',
          outcome:
            'Lively communication that turns every gathering into a story and every member into a natural ambassador.',
          evidence: [
            { value: 'Community', label: 'engagement & proximity' },
            { value: 'Live', label: 'event coverage' },
            { value: 'Formats', label: 'scrapbook & social' },
          ],
        },
      },
      {
        id: 'comptoir',
        name: 'Le Comptoir de Mathilde',
        role: 'Customer Experience & Sales Support — fixed term',
        place: 'Marseille',
        period: '2024 — present',
        summary:
          'Immersed in artisanal fine food retail: personal advice, meticulous merchandising and in-store brand storytelling.',
        skills: ['Customer Experience', 'Merchandising', 'Brand Storytelling', 'Retail'],
        caseStudy: {
          challenge:
            'Make a gourmet brand tangible at every step, from the storefront to personal advice.',
          direction:
            'Connect merchandising, product knowledge and customer care in one coherent experience.',
          outcome:
            'A practical understanding of brand experience: what attracts, reassures and ultimately drives choice.',
          evidence: [
            { value: 'Retail', label: 'in-store experience' },
            { value: 'Product', label: 'personal advice' },
            { value: 'Space', label: 'merchandising & story' },
          ],
        },
      },
    ],
  },
  journey: {
    heading: 'Journey',
    entries: [
      { year: '2021', label: 'First content, first brands', place: 'Freelance' },
      { year: '2022', label: 'Social media in jewellery', place: 'Yuna Bijoux, Brest' },
      { year: '2023', label: 'Bachelor in international business & marketing', place: 'IPAC' },
      { year: '2024', label: 'Retail, merchandising, brand', place: 'Le Comptoir de Mathilde' },
      { year: '2025', label: 'Community and content', place: 'Marseille Girls Club' },
      { year: '2026', label: 'Content and brand direction', place: 'Paris ↔ Seoul' },
    ],
  },
  expertise: {
    heading: 'Expertise',
    entries: [
      { term: 'Social Media', context: 'Strategy, publishing, community, analysis.' },
      { term: 'Content Creation', context: 'Photo, short video, copy, visual direction.' },
      { term: 'Content Strategy', context: 'Editorial line, formats, calendar.' },
      { term: 'Brand Communication', context: 'Positioning, tone, consistency.' },
      { term: 'Community', context: 'Engagement, moderation, relationships, loyalty.' },
      { term: 'Digital Marketing', context: 'Organic growth, campaigns, performance.' },
      { term: 'International', context: 'French, English, Korean. Paris ↔ Seoul.' },
    ],
  },
  manifesto: {
    eyebrow: 'Manifesto / 08.5',
    lineOne: 'Building a brand',
    lineTwo: 'means choosing what people will remember.',
    note: 'Everything else is noise.',
  },
  contact: {
    heading: 'Contact',
    statement: 'Let’s make something people remember.',
    cta: 'Email Glwadys',
    email: EMAIL,
    linkedin: LINKEDIN,
    linkedinLabel: 'LinkedIn',
    availability: 'Available — Marseille & remote',
    axis: 'Paris ↔ Seoul',
    services: 'Social media · Content · Brand communication',
    languages: 'FR · EN · KO',
    backToTop: 'Back to the beginning',
    copyright: '© 2026 Glwadys Dalleau',
  },
  nav: {
    label: 'Main navigation',
    home: 'Home',
    work: 'Work',
    journey: 'Journey',
    expertise: 'Expertise',
    contact: 'Contact',
  },
  a11y: {
    skipToContent: 'Skip to content',
    languageSwitch: 'Change language',
    reservedMedia: 'Reserved image slot',
  },
};

const ko: Content = {
  meta: {
    title: 'Glwadys Dalleau — 소셜 미디어 & 브랜드 커뮤니케이션',
    description:
      '브랜드를 기억에 남는 이야기로 만듭니다. 소셜 미디어, 콘텐츠 제작, 브랜드 커뮤니케이션. 파리 ↔ 서울.',
  },
  opening: {
    edition: 'Portfolio 2026',
    axis: '파리 ↔ 서울',
    tagline: '브랜드를 기억에 남는 이야기로 만듭니다.',
  },
  hero: {
    firstName: 'Glwadys',
    lastName: 'Dalleau',
    disciplines: ['Content', 'Social', 'Brand Strategy'],
  },
  social: {
    heading: '콘텐츠',
    front: '보이는 것',
    behind: '그것을 지탱하는 것',
    layers: ['무드보드', '기획', '카피', '캘린더', '디렉션'],
    statement: '모든 콘텐츠 뒤에는 전략이 있습니다.',
  },
  phone: {
    heading: '실제 맥락 속의 콘텐츠',
    beats: ['Feed', 'Focus', 'Story', 'Campaign'],
  },
  immersion: {
    heading: '콘텐츠 안으로',
    statement: '더 이상 콘텐츠를 보는 것이 아니라, 그 안에 있습니다.',
  },
  process: {
    heading: '과정',
    sheet: '콘택트 시트',
    moodboard: '의도',
    system: '시스템',
    systemTokens: ['팔레트', '타이포그래피', '톤', '메시지', '프레이밍'],
  },
  strategy: {
    heading: '방법',
    steps: [
      { term: 'Audience', note: '실제로 누구에게 말하는가.' },
      { term: 'Positioning', note: '브랜드가 차지하는 자리.' },
      { term: 'Tone', note: '알아볼 수 있게 만드는 목소리.' },
      { term: 'Content', note: '무엇을, 왜 만드는가.' },
      { term: 'Planning', note: '존재감을 만드는 리듬.' },
      { term: 'Campaign', note: '모든 것이 모이는 순간.' },
    ],
    sentence: '하나의 오디언스, 하나의 자리, 하나의 목소리, 하나의 리듬.',
  },
  work: {
    heading: '주요 작업',
    caseLabels: {
      challenge: '과제',
      direction: '방향',
      outcome: '결과',
      evidence: '근거',
    },
    projects: [
      {
        id: 'yuna',
        name: 'Yuna Bijoux',
        role: 'Social Media & Communication — 인턴십',
        place: '브레스트',
        period: '2022 — 2023',
        summary:
          '섬세한 주얼리 컬렉션을 알리는 일. 제품 스토리텔링, 비주얼 제작, 디테일에 민감한 오디언스와의 관계 형성.',
        skills: ['Social Media', '비주얼 콘텐츠', '에디토리얼 기획', '제품 스토리텔링'],
        caseStudy: {
          challenge:
            '브랜드의 친밀함을 잃지 않으면서 화면 안에서 주얼리의 섬세함을 전달하는 것.',
          direction:
            '손의 움직임, 소재와 디테일을 중심으로 절제된 비주얼 언어와 일관된 에디토리얼 리듬을 설계했습니다.',
          outcome:
            '발견과 관계 형성을 함께 돕는, 더 매력적이고 알아보기 쉬운 제품 존재감을 만들었습니다.',
          evidence: [
            { value: '제품', label: '스토리텔링 & 디테일' },
            { value: 'Social', label: '피드, 스토리, 캘린더' },
            { value: '브랜드', label: '비주얼 일관성' },
          ],
        },
      },
      {
        id: 'mgc',
        name: 'Marseille Girls Club',
        role: 'Community & Communication — 파트타임 정규직',
        place: '마르세유 / 하이브리드',
        period: '2025 — 2026',
        summary:
          '지중해 여성 커뮤니티의 성장. 스크랩북 포맷, 이벤트 기록, 참여와 진정성.',
        skills: ['커뮤니티', '디지털 콘텐츠', '이벤트 커뮤니케이션', '브랜드 일관성'],
        caseStudy: {
          challenge:
            '자발성과 지중해의 정체성을 잃지 않으면서 지역 커뮤니티를 성장시키는 것.',
          direction:
            '스크랩북 포맷, 이벤트 현장 기록과 직접적인 대화를 하나의 집단적 비주얼 언어로 엮었습니다.',
          outcome:
            '모든 만남을 이야기로, 모든 멤버를 자연스러운 연결점으로 바꾸는 생동감 있는 커뮤니케이션.',
          evidence: [
            { value: 'Community', label: '참여 & 친밀함' },
            { value: 'Live', label: '이벤트 현장 기록' },
            { value: 'Formats', label: '스크랩북 & 소셜' },
          ],
        },
      },
      {
        id: 'comptoir',
        name: 'Le Comptoir de Mathilde',
        role: 'Customer Experience & Sales Support — 계약직',
        period: '2024 — 현재',
        place: '마르세유',
        summary:
          '수공예 식품 리테일 현장. 맞춤 상담, 정교한 머천다이징, 매장에서의 브랜드 스토리텔링.',
        skills: ['고객 경험', '머천다이징', '브랜드 스토리텔링', '리테일'],
        caseStudy: {
          challenge:
            '쇼윈도부터 상담까지, 고객 여정의 모든 디테일에서 미식 브랜드를 경험하게 하는 것.',
          direction:
            '머천다이징, 제품 지식과 고객에 대한 세심한 관심을 하나의 일관된 경험으로 연결했습니다.',
          outcome:
            '무엇이 시선을 끌고, 신뢰를 주며, 선택을 만드는지 브랜드를 현장에서 이해했습니다.',
          evidence: [
            { value: 'Retail', label: '매장 경험' },
            { value: '제품', label: '맞춤 상담' },
            { value: '공간', label: '머천다이징 & 이야기' },
          ],
        },
      },
    ],
  },
  journey: {
    heading: '여정',
    entries: [
      { year: '2021', label: '첫 콘텐츠, 첫 브랜드', place: '프리랜스' },
      { year: '2022', label: '주얼리 소셜 미디어', place: 'Yuna Bijoux, 브레스트' },
      { year: '2023', label: '국제 비즈니스 & 마케팅 학사', place: 'IPAC' },
      { year: '2024', label: '리테일, 머천다이징, 브랜드', place: 'Le Comptoir de Mathilde' },
      { year: '2025', label: '커뮤니티와 콘텐츠', place: 'Marseille Girls Club' },
      { year: '2026', label: '콘텐츠 및 브랜드 디렉션', place: '파리 ↔ 서울' },
    ],
  },
  expertise: {
    heading: '전문 분야',
    entries: [
      { term: 'Social Media', context: '전략, 발행, 커뮤니티, 분석.' },
      { term: 'Content Creation', context: '사진, 숏폼 영상, 카피, 비주얼 디렉션.' },
      { term: 'Content Strategy', context: '에디토리얼 라인, 포맷, 캘린더.' },
      { term: 'Brand Communication', context: '포지셔닝, 톤, 일관성.' },
      { term: 'Community', context: '참여, 모더레이션, 관계, 로열티.' },
      { term: 'Digital Marketing', context: '오가닉 성장, 캠페인, 퍼포먼스.' },
      { term: 'International', context: '프랑스어, 영어, 한국어. 파리 ↔ 서울.' },
    ],
  },
  manifesto: {
    eyebrow: 'Manifesto / 08.5',
    lineOne: '브랜드를 만든다는 것은,',
    lineTwo: '사람들이 무엇을 기억할지 결정하는 일입니다.',
    note: '나머지는 소음입니다.',
  },
  contact: {
    heading: '연락',
    statement: '기억에 남는 것을 함께 만들어요.',
    cta: '이메일 보내기',
    email: EMAIL,
    linkedin: LINKEDIN,
    linkedinLabel: 'LinkedIn',
    availability: '가능 — 마르세유 및 원격',
    axis: '파리 ↔ 서울',
    services: 'Social media · Content · Brand communication',
    languages: 'FR · EN · KO',
    backToTop: '처음으로 돌아가기',
    copyright: '© 2026 Glwadys Dalleau',
  },
  nav: {
    label: '주요 내비게이션',
    home: '홈',
    work: '작업',
    journey: '여정',
    expertise: '전문 분야',
    contact: '연락',
  },
  a11y: {
    skipToContent: '본문으로 건너뛰기',
    languageSwitch: '언어 변경',
    reservedMedia: '이미지 예정 영역',
  },
};

const dictionaries: Record<Locale, Content> = { fr, en, ko };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}
