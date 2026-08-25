import {useLocation, useRouteLoaderData} from 'react-router';
import {getLocalePathPrefix} from '~/lib/locale';

export type UiLang = 'en' | 'de' | 'fr';

export type UiCopy = {
  nav: {home: string; shop: string; limited: string; journal: string};
  hero: {
    tagline: string;
    accent: string;
    support: string;
    shopCta: string;
    journalCta: string;
    scroll: string;
  };
  landing: {
    dropEyebrow: string;
    dropLede: string;
    empty: string;
    allDrop: string;
    collectionsEyebrow: string;
    collectionsTitle: string;
    collectionsAccent: string;
    collectionsLede: string;
    collectionsAria: string;
    shopDesign: string;
    journalEyebrow: string;
    journalTitle: string;
    journalEmpty: string;
    campaignEyebrow: string;
    campaignTitle: string;
    campaignAccent: string;
    campaignCaption: string;
    campaignCta: string;
    campaignImageAlt: string;
  };
  shop: {
    view: string;
    soldOut: string;
  };
  lookAd: {
    eyebrow: string;
    title: string;
    accent: string;
    cta: string;
    collectionEyebrow: string;
    viewAll: string;
  };
  journalChrome: {
    continue: string;
    moreFrom: string;
    read: string;
  };
  trust: {
    aria: string;
    items: Array<{id: string; title: string; detail: string}>;
  };
  wardrobe: {
    eyebrow: string;
    title: string;
    accent: string;
    lede: string;
    aria: string;
    chapters: Array<{
      id: string;
      label: string;
      detail: string;
      cta: string;
    }>;
  };
  footer: {
    tagline: string;
    explore: string;
    support: string;
    newsletter: string;
    newsletterHint: string;
    shop: string;
    limited: string;
    journal: string;
    blog: string;
    about: string;
    sizeGuide: string;
    care: string;
    shippingReturns: string;
    contact: string;
    privacy: string;
    terms: string;
    refunds: string;
    copyright: string;
    shipping: string;
    rights: string;
  };
  welcome: {kicker: string; offer: string; apply: string};
  notFound: {
    message: string;
    home: string;
    shop: string;
    wayfinding: string;
    restart: string;
    lede: string;
    shopHint: string;
    journalHint: string;
    aboutHint: string;
    contactHint: string;
  };
  a11y: {
    primary: string;
    language: string;
    menu: string;
    cart: string;
    cartCount: (count: number) => string;
  };
  dateLocale: string;
  hub: {
    pageTitle: string;
    enter: string;
    metaTitle: string;
    metaDescription: string;
    journal: {eyebrow: string; title: string; support: string; imageAlt: string};
    about: {eyebrow: string; title: string; support: string; imageAlt: string};
    blog: {eyebrow: string; title: string; support: string; imageAlt: string};
  };
  about: {
    eyebrow: string;
    title: string;
    support: string;
    imageAlt: string;
    brandEyebrow: string;
    lede: string;
    note: string;
    alsoHere: string;
    detailsTitle: string;
    detailsAria: string;
    closingTagline: string;
    closingBody: string;
    metaTitle: string;
    metaDescription: string;
    links: Array<{id: string; to: string; label: string; hint: string}>;
  };
  philosophy: {
    eyebrow: string;
    title: string;
    support: string;
    imageAlt: string;
    meaningEyebrow: string;
    lede: string;
    note: string;
    metaTitle: string;
    metaDescription: string;
  };
  essays: {
    eyebrow: string;
    title: string;
    support: string;
    imageAlt: string;
    introEyebrow: string;
    introTitle: string;
    introP1: string;
    introP2: string;
    quote: string;
    quoteAttr: string;
    fromEyebrow: string;
    fromTitle: string;
    fromLede: string;
    standardsEyebrow: string;
    standardsTitle: string;
    principles: Array<{id: string; label: string; body: string}>;
    newsletterEyebrow: string;
    newsletterTitle: string;
    newsletterDesc: string;
    join: string;
    closingTagline: string;
    closingBody: string;
    metaTitle: string;
    metaDescription: string;
    articles: Record<
      'no-rush' | 'life-beyond-the-rush' | 'the-weight-of-quiet-clothing',
      {title: string; eyebrow: string; excerpt: string}
    >;
  };
  blog: {
    eyebrow: string;
    title: string;
    lede: string;
    latest: string;
    emptyTitle: string;
    emptyMessage: string;
    readJournal: string;
    dateFallback: string;
    metaTitle: string;
    metaDescription: string;
  };
};

const EN: UiCopy = {
  nav: {home: 'Home', shop: 'Shop', limited: 'Limited', journal: 'Journal'},
  hero: {
    tagline: 'Life beyond the',
    accent: 'rush.',
    support:
      'Limited editions only — short runs, clear intent, clothes made to stay.',
    shopCta: 'Shop the drop',
    journalCta: 'The journal',
    scroll: 'Scroll',
  },
  landing: {
    dropEyebrow: 'The drop',
    dropLede: 'Four designs. Short runs. Clothes cut to live in.',
    empty: 'The drop will appear here.',
    allDrop: 'Look at the whole drop',
    collectionsEyebrow: 'The collections',
    collectionsTitle: 'Four ways in.',
    collectionsAccent: 'One drop.',
    collectionsLede: 'Each design is a short run — a tee, a layer, and a cap.',
    collectionsAria: 'Afterstate designs',
    shopDesign: 'Shop the design',
    journalEyebrow: 'Journal',
    journalTitle: 'From the journal',
    journalEmpty: 'New Afterstate journal pieces will land here.',
    campaignEyebrow: 'Limited edition',
    campaignTitle: 'No rush.',
    campaignAccent: 'Wear it longer.',
    campaignCaption: 'A short run. When it’s gone, it’s gone.',
    campaignCta: 'Explore the collection',
    campaignImageAlt: 'Model in Afterstate No Rush cream crew and forest cap',
  },
  shop: {
    view: 'View',
    soldOut: 'Sold out',
  },
  lookAd: {
    eyebrow: 'Afterstate 001',
    title: 'No rush.',
    accent: 'Wear it longer.',
    cta: 'Shop the look',
    collectionEyebrow: 'The collection',
    viewAll: 'View all pieces',
  },
  journalChrome: {
    continue: 'Continue',
    moreFrom: 'More from the journal',
    read: 'Read',
  },
  trust: {
    aria: 'Why Afterstate',
    items: [
      {id: 'limited', title: 'Limited edition', detail: 'Short runs. No extras.'},
      {id: 'restock', title: 'No restocks', detail: 'When it’s gone, it’s gone.'},
      {id: 'make', title: 'Made to last', detail: 'Weight, fit, and finish first.'},
      {id: 'ship', title: 'UK & Europe', detail: 'Tracked from London.'},
    ],
  },
  wardrobe: {
    eyebrow: 'The wardrobe',
    title: 'Built to be worn.',
    accent: 'Kept for years.',
    lede: 'Three forms. Mix them across the designs — or wear one piece hard.',
    aria: 'Wardrobe chapters',
    chapters: [
      {id: 'tees', label: 'Tees', detail: 'The print, worn easy.', cta: 'Shop tees'},
      {id: 'hoodies', label: 'Hoodies', detail: 'Weight you keep.', cta: 'Shop hoodies'},
      {id: 'caps', label: 'Caps', detail: 'The quiet finish.', cta: 'Shop caps'},
    ],
  },
  footer: {
    tagline: 'Life beyond the rush.',
    explore: 'Explore',
    support: 'Support',
    newsletter: 'Newsletter',
    newsletterHint: 'Join for drops and journal notes.',
    shop: 'Shop',
    limited: 'Limited drops',
    journal: 'Journal',
    blog: 'Blog',
    about: 'About',
    sizeGuide: 'Size guide',
    care: 'Care',
    shippingReturns: 'Shipping & returns',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    refunds: 'Refunds',
    copyright: 'Copyright',
    shipping: 'Shipping',
    rights: 'All rights reserved.',
  },
  welcome: {
    kicker: 'New here? ',
    offer: '20% off your first order',
    apply: 'Apply',
  },
  notFound: {
    message: 'This page does not exist — or it moved without leaving a note.',
    home: 'Back home',
    shop: 'Browse the shop',
    wayfinding: 'Find your way',
    restart: 'No rush',
    lede: 'Start again from somewhere that still exists.',
    shopHint: 'The collection',
    journalHint: 'Notes & essays',
    aboutHint: 'The brand',
    contactHint: 'Write us',
  },
  a11y: {
    primary: 'Primary',
    language: 'Language',
    menu: 'Menu',
    cart: 'Cart',
    cartCount: (count) => `Cart, ${count} items`,
  },
  dateLocale: 'en-GB',
  hub: {
    pageTitle: 'Journal',
    enter: 'Enter',
    metaTitle: 'Journal',
    metaDescription:
      'The Afterstate journal — brand essays, the thinking behind the clothes, and notes from a slower way of dressing.',
    journal: {
      eyebrow: 'Studio notes',
      title: 'Journal',
      support: 'Brand story, quality, and the quieter thinking behind the clothes.',
      imageAlt: 'Model in Afterstate 001 No Rush cream crew and forest cap',
    },
    about: {
      eyebrow: 'The brand',
      title: 'About',
      support: 'Clothes for the part of life that comes after the noise.',
      imageAlt: 'Afterstate lookbook — quiet silhouette against soft light',
    },
    blog: {
      eyebrow: 'Fashion world',
      title: 'Blog',
      support: 'Trends, stories, and culture — written for the wider fashion world.',
      imageAlt: 'Editorial fashion imagery for the Afterstate blog',
    },
  },
  about: {
    eyebrow: 'About',
    title: 'Afterstate',
    support: 'Clothes for the part of life that comes after the noise.',
    imageAlt: 'Afterstate lookbook — quiet silhouette against soft light',
    brandEyebrow: 'The brand',
    lede: 'Settled, useful, and quietly considered — fewer pieces with clearer intent, made to hold up beyond a single season.',
    note: 'Afterstate 001: No Rush is the first collection — a statement against forced pace, and an invitation to wear things longer.',
    alsoHere: 'Also here',
    detailsTitle: 'Contact & details',
    detailsAria: 'Brand pages',
    closingTagline: 'Life beyond the rush.',
    closingBody: 'Fewer pieces. Clearer intent.',
    metaTitle: 'About',
    metaDescription:
      'Afterstate makes fewer clothes, on purpose. A small clothing brand for a slower pace — short runs, clear intent, pieces meant to last.',
    links: [
      {id: 'contact', to: '/contact', label: 'Contact', hint: 'Write us'},
      {id: 'philosophy', to: '/philosophy', label: 'Philosophy', hint: 'Why we make less'},
      {id: 'care', to: '/care', label: 'Care', hint: 'Wear longer'},
      {id: 'size', to: '/size-guide', label: 'Size guide', hint: 'Fit notes'},
      {id: 'shipping', to: '/shipping-returns', label: 'Shipping & returns', hint: 'Orders'},
    ],
  },
  philosophy: {
    eyebrow: 'Philosophy',
    title: 'Enough',
    support: 'Enough quality, enough thought, enough time to live in what you wear.',
    imageAlt: 'Model in Afterstate After This cream tee and bone cap',
    meaningEyebrow: 'Meaning',
    lede: 'Afterstate is not about more. We design for calm intent — pieces that do not shout, and do not need replacing when the calendar turns.',
    note: 'No Rush is the practice: slow the drop, respect the material, and leave room for the garment to become yours.',
    metaTitle: 'Philosophy',
    metaDescription:
      'Calm, intentional clothing. Afterstate is about pace, permanence, and choosing less with care — enough, and nothing extra.',
  },
  essays: {
    eyebrow: 'Journal',
    title: 'Essays',
    support: 'Brand story, quality standards, and the quieter thinking behind the clothes.',
    imageAlt: 'Model in Afterstate 001 No Rush cream crew and forest cap',
    introEyebrow: 'Studio notes',
    introTitle: 'After the noise, the clothes still have to mean something',
    introP1:
      'Afterstate began as a refusal: fewer drops, denser fabric, and a pace that lets a garment become yours. The journal is where that fiction lives in full — origin nights, material decisions, and the practice of dressing without urgency.',
    introP2:
      'Read it like a lookbook with sentences. Nothing here is trend forecasting. Everything here is intent.',
    quote:
      'Life beyond the rush is not a slogan. It is a wardrobe that stops asking for more.',
    quoteAttr: 'Afterstate Journal',
    fromEyebrow: 'Essays',
    fromTitle: 'From the journal',
    fromLede: 'Three starting chapters — origin, pace, and the weight of quiet cloth.',
    standardsEyebrow: 'Standards',
    standardsTitle: 'What we stand behind',
    principles: [
      {
        id: 'limited',
        label: 'Limited editions only',
        body: 'Short runs. No restocks. When a piece sells through, its chapter closes — scarcity as honesty, not hype.',
      },
      {
        id: 'fabric',
        label: 'Fabric you can feel',
        body: 'Heavy cotton and brushed fleece chosen for hand-feel and years of wear, not for a single campaign frame.',
      },
      {
        id: 'stitch',
        label: 'Construction for the long wear',
        body: 'Seams, finishes, and hardware tuned so the garment softens into your life instead of falling apart out of it.',
      },
      {
        id: 'mark',
        label: 'A quieter mark',
        body: 'The AS sits small. Colour stays grounded. The silhouette does the speaking.',
      },
    ],
    newsletterEyebrow: 'Stay close',
    newsletterTitle: 'Journal + drop notes',
    newsletterDesc: 'New essays, limited runs, and quiet updates — never a rush of noise.',
    join: 'Join',
    closingTagline: 'Life beyond the rush.',
    closingBody: 'Every piece is limited edition. Short runs. No restocks.',
    metaTitle: 'Essays',
    metaDescription:
      'Notes from Afterstate — the brand story, quality standards, and the quieter thinking behind the clothes.',
    articles: {
      'no-rush': {
        title: 'On No Rush',
        eyebrow: 'Origin',
        excerpt:
          'How Afterstate began — not with a drop calendar, but with a refusal to hurry clothes into the world.',
      },
      'life-beyond-the-rush': {
        title: 'Life beyond the rush',
        eyebrow: 'Notes',
        excerpt:
          'A longer note on pace, wardrobe, and the quiet decision to own less — and wear it harder.',
      },
      'the-weight-of-quiet-clothing': {
        title: 'The weight of quiet clothing',
        eyebrow: 'Materials',
        excerpt:
          'Heavy cotton, brushed fleece, and the small decisions that decide how a piece ages on your body.',
      },
    },
  },
  blog: {
    eyebrow: 'Fashion world',
    title: 'Blog',
    lede: 'Trends, stories, and the culture around clothes — silhouettes in cities, seasonal shifts, and the people shaping how we dress.',
    latest: 'Latest',
    emptyTitle: 'First posts coming soon',
    emptyMessage:
      'We are preparing fashion trends, stories, and culture pieces for this space. Check back shortly — or read the Journal in the meantime.',
    readJournal: 'Read the Journal',
    dateFallback: 'Blog',
    metaTitle: 'Blog',
    metaDescription:
      'Fashion trends, stories, and culture from Afterstate — notes for the wider fashion world.',
  },
};

const DE: UiCopy = {
  nav: {home: 'Start', shop: 'Shop', limited: 'Limitiert', journal: 'Journal'},
  hero: {
    tagline: 'Leben jenseits der',
    accent: 'Eile.',
    support:
      'Nur limitierte Editionen — kleine Serien, klare Absicht, Kleidung, die bleibt.',
    shopCta: 'Zum Drop',
    journalCta: 'Das Journal',
    scroll: 'Scrollen',
  },
  landing: {
    dropEyebrow: 'Der Drop',
    dropLede: 'Vier Designs. Kleine Serien. Kleidung, die bleibt.',
    empty: 'Der Drop erscheint hier.',
    allDrop: 'Den ganzen Drop ansehen',
    collectionsEyebrow: 'Die Kollektionen',
    collectionsTitle: 'Vier Zugänge.',
    collectionsAccent: 'Ein Drop.',
    collectionsLede: 'Jedes Design ist eine kleine Serie — ein Tee, ein Layer und ein Cap.',
    collectionsAria: 'Afterstate Designs',
    shopDesign: 'Das Design ansehen',
    journalEyebrow: 'Journal',
    journalTitle: 'Aus dem Journal',
    journalEmpty: 'Neue Afterstate-Journalstücke erscheinen hier.',
    campaignEyebrow: 'Limitierte Edition',
    campaignTitle: 'Keine Eile.',
    campaignAccent: 'Länger tragen.',
    campaignCaption: 'Eine kleine Serie. Was weg ist, bleibt weg.',
    campaignCta: 'Die Kollektion entdecken',
    campaignImageAlt: 'Model in Afterstate No Rush Cream-Crew und Forest-Cap',
  },
  shop: {
    view: 'Ansehen',
    soldOut: 'Ausverkauft',
  },
  lookAd: {
    eyebrow: 'Afterstate 001',
    title: 'Keine Eile.',
    accent: 'Länger tragen.',
    cta: 'Den Look shoppen',
    collectionEyebrow: 'Die Kollektion',
    viewAll: 'Alle Stücke ansehen',
  },
  journalChrome: {
    continue: 'Weiterlesen',
    moreFrom: 'Mehr aus dem Journal',
    read: 'Lesen',
  },
  trust: {
    aria: 'Warum Afterstate',
    items: [
      {
        id: 'limited',
        title: 'Limitierte Edition',
        detail: 'Kleine Serien. Nichts Extra.',
      },
      {
        id: 'restock',
        title: 'Keine Nachlieferungen',
        detail: 'Was weg ist, bleibt weg.',
      },
      {
        id: 'make',
        title: 'Zum Bleiben gemacht',
        detail: 'Gewicht, Passform, Verarbeitung zuerst.',
      },
      {
        id: 'ship',
        title: 'UK & Europa',
        detail: 'Sendungsverfolgung ab London.',
      },
    ],
  },
  wardrobe: {
    eyebrow: 'Die Garderobe',
    title: 'Zum Tragen gemacht.',
    accent: 'Für Jahre behalten.',
    lede: 'Drei Formen. Kombiniere sie über die Designs — oder trag ein Stück konsequent.',
    aria: 'Garderoben-Kapitel',
    chapters: [
      {id: 'tees', label: 'Tees', detail: 'Der Print, leicht getragen.', cta: 'Tees ansehen'},
      {id: 'hoodies', label: 'Hoodies', detail: 'Gewicht, das bleibt.', cta: 'Hoodies ansehen'},
      {id: 'caps', label: 'Caps', detail: 'Der ruhige Abschluss.', cta: 'Caps ansehen'},
    ],
  },
  footer: {
    tagline: 'Leben jenseits der Eile.',
    explore: 'Entdecken',
    support: 'Service',
    newsletter: 'Newsletter',
    newsletterHint: 'Drops und Notizen aus dem Journal.',
    shop: 'Shop',
    limited: 'Limitierte Drops',
    journal: 'Journal',
    blog: 'Blog',
    about: 'Über uns',
    sizeGuide: 'Größentabelle',
    care: 'Pflege',
    shippingReturns: 'Versand & Rücksendung',
    contact: 'Kontakt',
    privacy: 'Datenschutz',
    terms: 'AGB',
    refunds: 'Rückerstattung',
    copyright: 'Urheberrecht',
    shipping: 'Versand',
    rights: 'Alle Rechte vorbehalten.',
  },
  welcome: {
    kicker: 'Neu hier? ',
    offer: '20 % Rabatt auf deine erste Bestellung',
    apply: 'Code anwenden',
  },
  notFound: {
    message:
      'Diese Seite gibt es nicht — oder sie ist umgezogen, ohne eine Notiz zu hinterlassen.',
    home: 'Zur Startseite',
    shop: 'Zum Shop',
    wayfinding: 'Finde deinen Weg',
    restart: 'Keine Eile',
    lede: 'Starte neu an einem Ort, der noch existiert.',
    shopHint: 'Die Kollektion',
    journalHint: 'Notizen & Essays',
    aboutHint: 'Die Marke',
    contactHint: 'Schreib uns',
  },
  a11y: {
    primary: 'Hauptnavigation',
    language: 'Sprache',
    menu: 'Menü',
    cart: 'Warenkorb',
    cartCount: (count) => `Warenkorb, ${count} Artikel`,
  },
  dateLocale: 'de-DE',
  hub: {
    pageTitle: 'Journal',
    enter: 'Eintreten',
    metaTitle: 'Journal',
    metaDescription:
      'Das Afterstate Journal — Essays zur Marke, das Denken hinter der Kleidung, und Notizen zu einem langsameren Anziehen.',
    journal: {
      eyebrow: 'Studio-Notizen',
      title: 'Journal',
      support:
        'Markengeschichte, Qualität und das ruhigere Denken hinter der Kleidung.',
      imageAlt: 'Model in Afterstate 001 No Rush Cream-Crew und Forest-Cap',
    },
    about: {
      eyebrow: 'Die Marke',
      title: 'Über uns',
      support: 'Kleidung für den Teil des Lebens, der nach dem Lärm kommt.',
      imageAlt: 'Afterstate Lookbook — ruhige Silhouette im weichen Licht',
    },
    blog: {
      eyebrow: 'Fashion-Welt',
      title: 'Blog',
      support:
        'Trends, Geschichten und Kultur — geschrieben für die weitere Fashion-Welt.',
      imageAlt: 'Editoriale Fashion-Bilder für den Afterstate Blog',
    },
  },
  about: {
    eyebrow: 'Über uns',
    title: 'Afterstate',
    support: 'Kleidung für den Teil des Lebens, der nach dem Lärm kommt.',
    imageAlt: 'Afterstate Lookbook — ruhige Silhouette im weichen Licht',
    brandEyebrow: 'Die Marke',
    lede: 'Ruhig, nützlich und still durchdacht — weniger Stücke mit klarerer Absicht, gemacht, um mehr als eine Saison zu halten.',
    note: 'Afterstate 001: No Rush ist die erste Kollektion — ein Statement gegen erzwungenes Tempo, und eine Einladung, Dinge länger zu tragen.',
    alsoHere: 'Auch hier',
    detailsTitle: 'Kontakt & Details',
    detailsAria: 'Markenseiten',
    closingTagline: 'Leben jenseits der Eile.',
    closingBody: 'Weniger Stücke. Klarere Absicht.',
    metaTitle: 'Über uns',
    metaDescription:
      'Afterstate macht weniger Kleidung — absichtlich. Eine kleine Marke für ein langsameres Tempo: kleine Serien, klare Absicht, Stücke zum Bleiben.',
    links: [
      {id: 'contact', to: '/contact', label: 'Kontakt', hint: 'Schreib uns'},
      {
        id: 'philosophy',
        to: '/philosophy',
        label: 'Philosophie',
        hint: 'Warum wir weniger machen',
      },
      {id: 'care', to: '/care', label: 'Pflege', hint: 'Länger tragen'},
      {id: 'size', to: '/size-guide', label: 'Größentabelle', hint: 'Passform'},
      {
        id: 'shipping',
        to: '/shipping-returns',
        label: 'Versand & Rücksendung',
        hint: 'Bestellungen',
      },
    ],
  },
  philosophy: {
    eyebrow: 'Philosophie',
    title: 'Genug',
    support:
      'Genug Qualität, genug Gedanke, genug Zeit, um in dem zu leben, was du trägst.',
    imageAlt: 'Model in Afterstate After This Cream-Tee und Bone-Cap',
    meaningEyebrow: 'Bedeutung',
    lede: 'Afterstate geht nicht um mehr. Wir entwerfen mit ruhiger Absicht — Stücke, die nicht schreien und nicht ersetzt werden müssen, wenn der Kalender umschlägt.',
    note: 'No Rush ist die Praxis: den Drop verlangsamen, das Material respektieren, und dem Kleidungsstück Raum lassen, deins zu werden.',
    metaTitle: 'Philosophie',
    metaDescription:
      'Ruhige, bewusste Kleidung. Afterstate steht für Tempo, Dauerhaftigkeit und weniger — mit Sorgfalt gewählt. Genug, und nichts Extra.',
  },
  essays: {
    eyebrow: 'Journal',
    title: 'Essays',
    support:
      'Markengeschichte, Qualitätsmaßstäbe und das ruhigere Denken hinter der Kleidung.',
    imageAlt: 'Model in Afterstate 001 No Rush Cream-Crew und Forest-Cap',
    introEyebrow: 'Studio-Notizen',
    introTitle: 'Nach dem Lärm muss die Kleidung trotzdem etwas bedeuten',
    introP1:
      'Afterstate begann als Absage: weniger Drops, dichterer Stoff, und ein Tempo, in dem ein Kleidungsstück deins werden kann. Das Journal ist der Ort, an dem das in voller Länge steht — Ursprungsnächte, Materialentscheidungen, und die Praxis, sich ohne Eile anzuziehen.',
    introP2:
      'Lies es wie ein Lookbook mit Sätzen. Hier gibt es keine Trendprognose. Hier geht es um Absicht.',
    quote:
      'Leben jenseits der Eile ist kein Slogan. Es ist eine Garderobe, die aufhört, nach mehr zu fragen.',
    quoteAttr: 'Afterstate Journal',
    fromEyebrow: 'Essays',
    fromTitle: 'Aus dem Journal',
    fromLede:
      'Drei Einstiegskapitel — Ursprung, Tempo und das Gewicht ruhiger Stoffe.',
    standardsEyebrow: 'Maßstäbe',
    standardsTitle: 'Wofür wir einstehen',
    principles: [
      {
        id: 'limited',
        label: 'Nur limitierte Editionen',
        body: 'Kleine Serien. Keine Nachlieferungen. Wenn ein Stück ausverkauft ist, schließt sich das Kapitel — Knappheit als Ehrlichkeit, nicht als Hype.',
      },
      {
        id: 'fabric',
        label: 'Stoff, den man spürt',
        body: 'Schwerer Cotton und gebürstetes Fleece für Griff und Jahre des Tragens — nicht für ein einziges Kampagnenbild.',
      },
      {
        id: 'stitch',
        label: 'Verarbeitung fürs lange Tragen',
        body: 'Nähte, Abschlüsse und Hardware so gewählt, dass das Kleidungsstück in dein Leben weicher wird — statt daraus zu fallen.',
      },
      {
        id: 'mark',
        label: 'Ein ruhigeres Zeichen',
        body: 'Das AS sitzt klein. Die Farbe bleibt geerdet. Die Silhouette spricht.',
      },
    ],
    newsletterEyebrow: 'Bleib nah',
    newsletterTitle: 'Journal + Drop-Notizen',
    newsletterDesc:
      'Neue Essays, limitierte Serien und ruhige Updates — nie ein Lärm von Nachrichten.',
    join: 'Anmelden',
    closingTagline: 'Leben jenseits der Eile.',
    closingBody:
      'Jedes Stück ist eine limitierte Edition. Kleine Serien. Keine Nachlieferungen.',
    metaTitle: 'Essays',
    metaDescription:
      'Notizen von Afterstate — die Markengeschichte, Qualitätsmaßstäbe und das ruhigere Denken hinter der Kleidung.',
    articles: {
      'no-rush': {
        title: 'Über No Rush',
        eyebrow: 'Ursprung',
        excerpt:
          'Wie Afterstate begann — nicht mit einem Drop-Kalender, sondern mit der Absage, Kleidung in die Welt zu hetzen.',
      },
      'life-beyond-the-rush': {
        title: 'Leben jenseits der Eile',
        eyebrow: 'Notizen',
        excerpt:
          'Eine längere Notiz zu Tempo, Garderobe und der ruhigen Entscheidung, weniger zu besitzen — und es härter zu tragen.',
      },
      'the-weight-of-quiet-clothing': {
        title: 'Das Gewicht ruhiger Kleidung',
        eyebrow: 'Materialien',
        excerpt:
          'Schwerer Cotton, gebürstetes Fleece und die kleinen Entscheidungen, die bestimmen, wie ein Stück am Körper altert.',
      },
    },
  },
  blog: {
    eyebrow: 'Fashion-Welt',
    title: 'Blog',
    lede: 'Trends, Geschichten und die Kultur um Kleidung — Silhouetten in Städten, saisonale Wechsel, und die Menschen, die prägen, wie wir uns anziehen.',
    latest: 'Aktuell',
    emptyTitle: 'Erste Beiträge folgen bald',
    emptyMessage:
      'Wir bereiten Fashion-Trends, Geschichten und Kulturstücke für diesen Raum vor. Schau bald wieder vorbei — oder lies inzwischen das Journal.',
    readJournal: 'Das Journal lesen',
    dateFallback: 'Blog',
    metaTitle: 'Blog',
    metaDescription:
      'Fashion-Trends, Geschichten und Kultur von Afterstate — Notizen für die weitere Fashion-Welt.',
  },
};

const FR: UiCopy = {
  nav: {home: 'Accueil', shop: 'Boutique', limited: 'Limited', journal: 'Journal'},
  hero: {
    tagline: 'La vie au-delà de la',
    accent: 'course.',
    support:
      'Uniquement des éditions limitées — petites séries, intention claire, des vêtements faits pour durer.',
    shopCta: 'Voir le drop',
    journalCta: 'Le journal',
    scroll: 'Descendre',
  },
  landing: {
    dropEyebrow: 'Le drop',
    dropLede: 'Quatre designs. Petites séries. Des vêtements pour le quotidien.',
    empty: 'Le drop apparaîtra ici.',
    allDrop: 'Voir tout le drop',
    collectionsEyebrow: 'Les collections',
    collectionsTitle: 'Quatre accès.',
    collectionsAccent: 'Un drop.',
    collectionsLede:
      'Chaque design est une petite série — un tee, une couche, et une casquette.',
    collectionsAria: 'Designs Afterstate',
    shopDesign: 'Voir le design',
    journalEyebrow: 'Journal',
    journalTitle: 'Du journal',
    journalEmpty: 'De nouvelles pièces du journal Afterstate arriveront ici.',
    campaignEyebrow: 'Édition limitée',
    campaignTitle: 'Pas de précipitation.',
    campaignAccent: 'Le porter plus longtemps.',
    campaignCaption: 'Une petite série. Une fois parti, c’est parti.',
    campaignCta: 'Explorer la collection',
    campaignImageAlt:
      'Mannequin en Afterstate No Rush crew crème et casquette forest',
  },
  shop: {
    view: 'Voir',
    soldOut: 'Épuisé',
  },
  lookAd: {
    eyebrow: 'Afterstate 001',
    title: 'Pas de précipitation.',
    accent: 'Le porter plus longtemps.',
    cta: 'Shopper le look',
    collectionEyebrow: 'La collection',
    viewAll: 'Voir toutes les pièces',
  },
  journalChrome: {
    continue: 'Continuer',
    moreFrom: 'Plus du journal',
    read: 'Lire',
  },
  trust: {
    aria: 'Pourquoi Afterstate',
    items: [
      {
        id: 'limited',
        title: 'Édition limitée',
        detail: 'Petites séries. Rien en trop.',
      },
      {
        id: 'restock',
        title: 'Pas de restock',
        detail: 'Une fois parti, c’est parti.',
      },
      {
        id: 'make',
        title: 'Fait pour durer',
        detail: 'Poids, coupe et finitions d’abord.',
      },
      {
        id: 'ship',
        title: 'UK & Europe',
        detail: 'Suivi depuis Londres.',
      },
    ],
  },
  wardrobe: {
    eyebrow: 'La garde-robe',
    title: 'Fait pour être porté.',
    accent: 'Gardé des années.',
    lede: 'Trois formes. Mélangez-les entre les designs — ou portez une pièce à fond.',
    aria: 'Chapitres de la garde-robe',
    chapters: [
      {id: 'tees', label: 'Tees', detail: 'Le print, porté simple.', cta: 'Voir les tees'},
      {id: 'hoodies', label: 'Hoodies', detail: 'Le poids que l’on garde.', cta: 'Voir les hoodies'},
      {id: 'caps', label: 'Caps', detail: 'La finition calme.', cta: 'Voir les caps'},
    ],
  },
  footer: {
    tagline: 'La vie au-delà de la course.',
    explore: 'Explorer',
    support: 'Aide',
    newsletter: 'Newsletter',
    newsletterHint: 'Drops et notes du journal.',
    shop: 'Shop',
    limited: 'Drops limités',
    journal: 'Journal',
    blog: 'Blog',
    about: 'À propos',
    sizeGuide: 'Guide des tailles',
    care: 'Entretien',
    shippingReturns: 'Livraison & retours',
    contact: 'Contact',
    privacy: 'Confidentialité',
    terms: 'CGV',
    refunds: 'Remboursements',
    copyright: 'Copyright',
    shipping: 'Livraison',
    rights: 'Tous droits réservés.',
  },
  welcome: {
    kicker: 'Première visite ? ',
    offer: '20 % de réduction sur votre première commande',
    apply: 'Appliquer',
  },
  notFound: {
    message:
      'Cette page n’existe pas — ou elle a été déplacée sans laisser de note.',
    home: 'Retour à l’accueil',
    shop: 'Voir le shop',
    wayfinding: 'Retrouver son chemin',
    restart: 'Pas de précipitation',
    lede: 'Recommencer depuis un endroit qui existe encore.',
    shopHint: 'La collection',
    journalHint: 'Notes & essais',
    aboutHint: 'La marque',
    contactHint: 'Écrivez-nous',
  },
  a11y: {
    primary: 'Navigation principale',
    language: 'Langue',
    menu: 'Menu',
    cart: 'Panier',
    cartCount: (count) => `Panier, ${count} articles`,
  },
  dateLocale: 'fr-FR',
  hub: {
    pageTitle: 'Journal',
    enter: 'Entrer',
    metaTitle: 'Journal',
    metaDescription:
      'Le journal Afterstate — essais sur la marque, la pensée derrière les vêtements, et des notes sur une façon plus lente de s’habiller.',
    journal: {
      eyebrow: 'Notes du studio',
      title: 'Journal',
      support:
        'Histoire de la marque, qualité, et la pensée plus calme derrière les vêtements.',
      imageAlt: 'Mannequin en Afterstate 001 No Rush crew crème et casquette forest',
    },
    about: {
      eyebrow: 'La marque',
      title: 'À propos',
      support: 'Des vêtements pour la part de la vie qui vient après le bruit.',
      imageAlt: 'Lookbook Afterstate — silhouette calme dans une lumière douce',
    },
    blog: {
      eyebrow: 'Le monde de la mode',
      title: 'Blog',
      support:
        'Tendances, récits et culture — écrits pour le monde plus large de la mode.',
      imageAlt: 'Images éditoriales de mode pour le blog Afterstate',
    },
  },
  about: {
    eyebrow: 'À propos',
    title: 'Afterstate',
    support: 'Des vêtements pour la part de la vie qui vient après le bruit.',
    imageAlt: 'Lookbook Afterstate — silhouette calme dans une lumière douce',
    brandEyebrow: 'La marque',
    lede: 'Posés, utiles et considérés avec calme — moins de pièces, une intention plus claire, faites pour tenir au-delà d’une saison.',
    note: 'Afterstate 001: No Rush est la première collection — une prise de position contre le rythme forcé, et une invitation à porter plus longtemps.',
    alsoHere: 'Aussi ici',
    detailsTitle: 'Contact et détails',
    detailsAria: 'Pages de la marque',
    closingTagline: 'La vie au-delà de la course.',
    closingBody: 'Moins de pièces. Une intention plus claire.',
    metaTitle: 'À propos',
    metaDescription:
      'Afterstate fait moins de vêtements — exprès. Une petite marque pour un rythme plus lent : petites séries, intention claire, des pièces faites pour durer.',
    links: [
      {id: 'contact', to: '/contact', label: 'Contact', hint: 'Écrivez-nous'},
      {
        id: 'philosophy',
        to: '/philosophy',
        label: 'Philosophie',
        hint: 'Pourquoi nous faisons moins',
      },
      {id: 'care', to: '/care', label: 'Entretien', hint: 'Porter plus longtemps'},
      {
        id: 'size',
        to: '/size-guide',
        label: 'Guide des tailles',
        hint: 'Notes de coupe',
      },
      {
        id: 'shipping',
        to: '/shipping-returns',
        label: 'Livraison & retours',
        hint: 'Commandes',
      },
    ],
  },
  philosophy: {
    eyebrow: 'Philosophie',
    title: 'Assez',
    support:
      'Assez de qualité, assez de pensée, assez de temps pour vivre dans ce que vous portez.',
    imageAlt: 'Mannequin en Afterstate After This tee crème et casquette bone',
    meaningEyebrow: 'Sens',
    lede: 'Afterstate ne vise pas le plus. Nous concevons avec une intention calme — des pièces qui ne crient pas, et qu’il n’est pas besoin de remplacer quand le calendrier tourne.',
    note: 'No Rush est la pratique : ralentir le drop, respecter la matière, et laisser de la place au vêtement pour qu’il devienne le vôtre.',
    metaTitle: 'Philosophie',
    metaDescription:
      'Des vêtements calmes, intentionnels. Afterstate, c’est le rythme, la durée, et choisir moins avec soin — assez, et rien en trop.',
  },
  essays: {
    eyebrow: 'Journal',
    title: 'Essais',
    support:
      'Histoire de la marque, exigences de qualité, et la pensée plus calme derrière les vêtements.',
    imageAlt: 'Mannequin en Afterstate 001 No Rush crew crème et casquette forest',
    introEyebrow: 'Notes du studio',
    introTitle: 'Après le bruit, les vêtements doivent encore vouloir dire quelque chose',
    introP1:
      'Afterstate a commencé comme un refus : moins de drops, un tissu plus dense, et un rythme qui laisse un vêtement devenir le vôtre. Le journal est l’endroit où cela tient en entier — nuits d’origine, choix de matières, et la pratique de s’habiller sans urgence.',
    introP2:
      'Lisez-le comme un lookbook avec des phrases. Rien ici n’est une prévision de tendance. Tout ici est de l’intention.',
    quote:
      'La vie au-delà de la course n’est pas un slogan. C’est une garde-robe qui cesse de demander plus.',
    quoteAttr: 'Afterstate Journal',
    fromEyebrow: 'Essais',
    fromTitle: 'Du journal',
    fromLede:
      'Trois chapitres pour commencer — l’origine, le rythme, et le poids du tissu calme.',
    standardsEyebrow: 'Exigences',
    standardsTitle: 'Ce que nous défendons',
    principles: [
      {
        id: 'limited',
        label: 'Uniquement des éditions limitées',
        body: 'Petites séries. Pas de restock. Quand une pièce est épuisée, le chapitre se ferme — la rareté comme honnêteté, pas comme hype.',
      },
      {
        id: 'fabric',
        label: 'Un tissu que l’on sent',
        body: 'Coton lourd et molleton brossé choisis pour la main et des années de port — pas pour un seul cadre de campagne.',
      },
      {
        id: 'stitch',
        label: 'Une construction pour durer',
        body: 'Coutures, finitions et quincaillerie réglées pour que le vêtement s’assouplisse dans votre vie, au lieu d’en sortir en se défaisant.',
      },
      {
        id: 'mark',
        label: 'Une marque plus discrète',
        body: 'Le AS reste petit. La couleur reste ancrée. La silhouette parle.',
      },
    ],
    newsletterEyebrow: 'Rester proche',
    newsletterTitle: 'Journal + notes de drop',
    newsletterDesc:
      'Nouveaux essais, séries limitées et mises à jour calmes — jamais un flot de bruit.',
    join: 'S’inscrire',
    closingTagline: 'La vie au-delà de la course.',
    closingBody:
      'Chaque pièce est une édition limitée. Petites séries. Pas de restock.',
    metaTitle: 'Essais',
    metaDescription:
      'Notes d’Afterstate — l’histoire de la marque, les exigences de qualité, et la pensée plus calme derrière les vêtements.',
    articles: {
      'no-rush': {
        title: 'Sur No Rush',
        eyebrow: 'Origine',
        excerpt:
          'Comment Afterstate a commencé — pas avec un calendrier de drops, mais avec le refus de précipiter les vêtements dans le monde.',
      },
      'life-beyond-the-rush': {
        title: 'La vie au-delà de la course',
        eyebrow: 'Notes',
        excerpt:
          'Une note plus longue sur le rythme, la garde-robe, et la décision calme de posséder moins — et de le porter plus fort.',
      },
      'the-weight-of-quiet-clothing': {
        title: 'Le poids des vêtements calmes',
        eyebrow: 'Matières',
        excerpt:
          'Coton lourd, molleton brossé, et les petits choix qui décident comment une pièce vieillit sur le corps.',
      },
    },
  },
  blog: {
    eyebrow: 'Le monde de la mode',
    title: 'Blog',
    lede: 'Tendances, récits et la culture autour des vêtements — silhouettes en ville, glissements de saison, et les personnes qui façonnent la façon dont nous nous habillons.',
    latest: 'À la une',
    emptyTitle: 'Premiers articles bientôt',
    emptyMessage:
      'Nous préparons des tendances, des récits et des pièces de culture pour cet espace. Revenez bientôt — ou lisez le Journal en attendant.',
    readJournal: 'Lire le Journal',
    dateFallback: 'Blog',
    metaTitle: 'Blog',
    metaDescription:
      'Tendances, récits et culture Afterstate — des notes pour le monde plus large de la mode.',
  },
};

const COPY: Record<UiLang, UiCopy> = {en: EN, de: DE, fr: FR};

export function uiLangFromPathname(pathname: string): UiLang {
  const prefix = getLocalePathPrefix(pathname);
  if (prefix.startsWith('/de')) return 'de';
  if (prefix.startsWith('/fr')) return 'fr';
  return 'en';
}

export function uiLangFromLanguage(language?: string | null): UiLang {
  const code = language?.toLowerCase();
  if (code === 'de') return 'de';
  if (code === 'fr') return 'fr';
  return 'en';
}

/** Prefer the URL so chrome stays translated even if root i18n lags. */
export function getUiCopy(pathname: string, language?: string | null): UiCopy {
  const fromPath = uiLangFromPathname(pathname);
  const fromI18n = uiLangFromLanguage(language);
  return COPY[fromPath !== 'en' ? fromPath : fromI18n];
}

export function useUiCopy(): UiCopy {
  const {pathname} = useLocation();
  const root = useRouteLoaderData('root') as
    | {i18n?: {language?: string}}
    | undefined;
  return getUiCopy(pathname, root?.i18n?.language);
}

export function useUiLang(): UiLang {
  const {pathname} = useLocation();
  const root = useRouteLoaderData('root') as
    | {i18n?: {language?: string}}
    | undefined;
  const fromPath = uiLangFromPathname(pathname);
  const fromI18n = uiLangFromLanguage(root?.i18n?.language);
  return fromPath !== 'en' ? fromPath : fromI18n;
}

export function navLabelForPath(to: string, copy: UiCopy): string {
  if (to === '/') return copy.nav.home;
  if (to === '/shop') return copy.nav.shop;
  if (to === '/collections') return copy.nav.limited;
  if (to === '/journal') return copy.nav.journal;
  return to;
}
