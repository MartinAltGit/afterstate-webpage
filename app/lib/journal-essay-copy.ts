import type {JournalIconName} from '~/components/journal/JournalIcons';
import type {UiLang} from '~/lib/ui-copy';

type Principle = {
  id: string;
  icon: JournalIconName;
  label: string;
  body: string;
};

type SplitCopy = {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
};

export type EssayStoryCopy = {
  open: {eyebrow: string; title: string; p1: string; p2: string; p3?: string};
  quote: {quote: string; attribution: string};
  chapter1: SplitCopy;
  manifesto: {p1: string; p2: string};
  imageCaption: string;
  standards: {eyebrow: string; title: string; principles: Principle[]};
  chapter2: SplitCopy;
  extraCaption?: string;
  extraSplit?: SplitCopy;
  closing?: {label: string; p1: string; p2?: string};
};

export type EssayCopy = {
  noRush: EssayStoryCopy;
  lifeBeyond: EssayStoryCopy;
  quietCloth: EssayStoryCopy;
};

const EN: EssayCopy = {
  noRush: {
    open: {
      eyebrow: 'Origin',
      title: 'It started with a pause',
      p1: 'The story of Afterstate is not a founding myth with a boardroom and a launch date. It begins on a late train, somewhere between a city that never sleeps and a small apartment that finally did.',
      p2: 'One of us was wearing a hoodie bought in a hurry — soft for a week, thin by the third wash, already asking to be replaced. The other was carrying a sketchbook full of silhouettes that never made it past “next season.” Somewhere between those two failures, a quieter idea landed: what if the clothes arrived after the rush, not because of it?',
      p3: 'Afterstate is the name we gave that idea. Not after fashion. After urgency. The state you enter when you stop chasing the next thing and start living in the one you already have.',
    },
    quote: {
      quote:
        'We did not need another brand that moved faster. We needed one that moved with intention.',
      attribution: 'Studio note, 2024',
    },
    chapter1: {
      eyebrow: 'Chapter 01',
      title: 'The night we named it',
      p1: 'The first logo was drawn on the back of a receipt. The first name was wrong. The second was too clever. The third — Afterstate — felt like a place you could stand in: after the scroll, after the sale, after the noise that tells you your wardrobe is already outdated.',
      p2: 'We wrote three rules on the same page: make fewer pieces. Make them heavier in the hand. Never restock a run just because it sold through. Scarcity, for us, is not a trick. It is a promise that the work stays rare because we refuse to dilute it.',
    },
    manifesto: {
      p1: 'No Rush became the first collection because it had to. It is less a slogan than a working method: slow the sample loop, trust the fabric, leave room for the garment to become yours.',
      p2: 'Every piece in Afterstate 001 is limited edition. Short runs. No restocks. When it is gone, the story moves forward — not sideways into endless reprints.',
    },
    imageCaption: 'Afterstate 001 — No Rush · campaign still',
    standards: {
      eyebrow: 'The standard',
      title: 'What No Rush protects',
      principles: [
        {
          id: 'runs',
          icon: 'limited',
          label: 'Short runs, finished stories',
          body: 'We cut what we can stand behind — then stop. Limited editions keep the work honest and the wardrobe from drowning in noise.',
        },
        {
          id: 'fabric',
          icon: 'fabric',
          label: 'Fabric before calendar',
          body: 'Drops follow material readiness, not marketing weeks. If the hand-feel is wrong, the piece waits.',
        },
        {
          id: 'pace',
          icon: 'pace',
          label: 'Silhouettes that settle',
          body: 'Shapes are built to be lived in: clean lines, quiet logos, proportion that still reads after a hundred wears.',
        },
        {
          id: 'stitch',
          icon: 'stitch',
          label: 'Repair over replace',
          body: 'Construction choices favour longevity — seams, weight, and finishes that invite years, not seasons.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Chapter 02',
      title: 'Why the clothes feel calm',
      p1: 'Calm is not emptiness. It is the absence of panic. Our colour stories lean Mediterranean stone and cool fog — teal, coral, mustard as accents, never as shouting. The AS mark sits small, because the fabric should do the talking.',
      p2: 'If the first viewport of your day still feels rushed, that is fine. The clothes are for the hours after — coffee gone cold, city lights soft, one good piece that does not ask for attention.',
    },
  },
  lifeBeyond: {
    open: {
      eyebrow: 'Notes',
      title: 'The wardrobe after urgency',
      p1: 'Most closets are archives of almosts: pieces bought for a version of yourself that never quite arrived, or for a weekend that already ended. Life beyond the rush is not a retreat from the city. It is a different relationship to getting dressed.',
      p2: 'Afterstate writes for that moment — when you stop asking “what’s new” and start asking “what still feels like mine.” The answer is usually quieter than the algorithm expects.',
    },
    quote: {
      quote: 'Pace is a design decision. So is owning less.',
      attribution: 'Afterstate',
    },
    chapter1: {
      eyebrow: 'Rhythm',
      title: 'A slower loop',
      p1: 'We imagine the Afterstate week like this: Monday without a costume change. Thursday in the same hoodie, a little softer. Sunday with one good outer layer that still looks decided under streetlight.',
      p2: 'The brand story is fictional in the details — the train, the receipt, the sketchbook — and true in the practice. Fewer decisions in the morning. More years on the garment. Less theatre around “dropping.”',
    },
    manifesto: {
      p1: 'Belonging to your wardrobe sounds small until you try it. It means the hoodie on the chair is enough. It means the cap by the door is not a prop. It means Afterstate is less a logo to collect and more a pace to keep.',
      p2: 'Life beyond the rush is available every day. The clothes are just the reminder you can put on.',
    },
    imageCaption: 'Evening light · life beyond the rush',
    standards: {
      eyebrow: 'Practice',
      title: 'How to dress without the hurry',
      principles: [
        {
          id: 'silhouette',
          icon: 'pace',
          label: 'One silhouette, many days',
          body: 'Choose shapes that survive context — studio, street, late dinner — so you are not rebuilding an outfit from scratch each morning.',
        },
        {
          id: 'colour',
          icon: 'mark',
          label: 'Colour that holds still',
          body: 'Muted grounds with one quiet accent keep pieces mixing for years instead of fighting last season’s palette.',
        },
        {
          id: 'weight',
          icon: 'fabric',
          label: 'Buy the weight you can feel',
          body: 'If the fabric feels thin in the hand, it will feel temporary on the body. Density is a form of respect.',
        },
        {
          id: 'scarce',
          icon: 'limited',
          label: 'Let scarcity mean something',
          body: 'When a run ends, it ends. That absence teaches you to wear what you have — and to choose the next piece carefully.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Belonging',
      title: 'Wear what still feels like yours',
      p1: 'The afterstate is not a weekend away. It is Tuesday, in the same layer, with less noise in the decision.',
      p2: 'Own less. Wear it harder. Let the rush happen somewhere else.',
    },
    closing: {
      label: 'Belonging',
      p1: 'Belonging to your wardrobe sounds small until you try it. It means the hoodie on the chair is enough. It means the cap by the door is not a prop. It means Afterstate is less a logo to collect and more a pace to keep.',
      p2: 'Life beyond the rush is available every day. The clothes are just the reminder you can put on.',
    },
  },
  quietCloth: {
    open: {
      eyebrow: 'Materials',
      title: 'Quiet does not mean light',
      p1: 'Quiet clothing is often misunderstood as soft branding and thin cotton. For Afterstate, quiet is the opposite: dense cloth, honest seams, and a logo that knows when to stay out of the way.',
      p2: 'The weight you feel when you pick up a piece is the first sentence of the story. Everything else — colour, cut, campaign — has to agree with that sentence.',
    },
    quote: {
      quote: 'If the fabric cannot carry the years, the brand cannot either.',
      attribution: 'Materials desk',
    },
    chapter1: {
      eyebrow: 'Hand-feel',
      title: 'Heavy cotton, brushed fleece',
      p1: 'We specify fabric the way some studios specify moodboards: by touch first. Heavy cotton that keeps its structure after washing. Brushed fleece that softens without collapsing. Rib that recovers. Thread that matches the life of the cloth, not just the look of the sample.',
      p2: 'These are not luxury codes for their own sake. They are how a hoodie survives rain, bag straps, and the hundredth commute without turning into a memory of itself.',
    },
    manifesto: {
      p1: 'Wash cold when you can. Hang dry when the label allows. Repair a seam before you replace a friend. We publish care notes because longevity is part of the product — not an afterthought buried in a FAQ.',
      p2: 'Trends ask you to restart. Quality asks you to continue. We design for the second question.',
    },
    imageCaption: 'Fabric, mark, and evening air',
    standards: {
      eyebrow: 'Quality',
      title: 'Decisions you can wear',
      principles: [
        {
          id: 'grammage',
          icon: 'fabric',
          label: 'Grammage with purpose',
          body: 'We choose weights that drape with authority — substantial enough to hold a silhouette, breathable enough for real days.',
        },
        {
          id: 'build',
          icon: 'stitch',
          label: 'Construction you notice later',
          body: 'Reinforced stress points, clean finishing, and seams placed for movement. The best construction is the kind you forget until year three.',
        },
        {
          id: 'colour',
          icon: 'mark',
          label: 'Colour that ages well',
          body: 'Dyes and washes are tested for how they live, not only how they photograph. Soft shifts over time beat brittle brightness.',
        },
        {
          id: 'runs',
          icon: 'limited',
          label: 'Limited runs as quality control',
          body: 'Short editions let us stay close to every batch. When something is not right, we do not scale the mistake.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Age',
      title: 'How a piece earns its keep',
      p1: 'The best Afterstate pieces should look more like you over time — not more like a campaign. Elbows soften. Fleece opens. The colour settles into your city’s light. That is the weight of quiet clothing: it stays in the rotation because it keeps becoming familiar.',
      p2: 'Trends ask you to restart. Quality asks you to continue. We design for the second question.',
    },
    extraCaption: 'Fabric, mark, and evening air',
    closing: {
      label: 'Care',
      p1: 'Wash cold when you can. Hang dry when the label allows. Repair a seam before you replace a friend. We publish care notes because longevity is part of the product — not an afterthought buried in a FAQ.',
    },
  },
};

const DE: EssayCopy = {
  noRush: {
    open: {
      eyebrow: 'Ursprung',
      title: 'Es begann mit einer Pause',
      p1: 'Die Geschichte von Afterstate ist kein Gründungsmythos mit Sitzungsraum und Launch-Datum. Sie beginnt in einem späten Zug, irgendwo zwischen einer Stadt, die nie schläft, und einer kleinen Wohnung, die es endlich tat.',
      p2: 'Einer von uns trug einen Hoodie, der in Eile gekauft war — eine Woche weich, nach der dritten Wäsche dünn, schon auf Ersatz aus. Der andere trug ein Skizzenbuch voller Silhouetten, die nie über „nächste Saison“ hinauskamen. Zwischen diesen zwei Fehlern landete eine ruhigere Idee: Was, wenn die Kleidung nach der Eile kommt — nicht wegen ihr?',
      p3: 'Afterstate ist der Name, den wir dieser Idee gaben. Nicht after fashion. After urgency. Der Zustand, in den du eintrittst, wenn du aufhörst, das Nächste zu jagen, und in dem zu leben beginnst, das du schon hast.',
    },
    quote: {
      quote:
        'Wir brauchten keine weitere Marke, die schneller wird. Wir brauchten eine, die mit Absicht geht.',
      attribution: 'Studio-Notiz, 2024',
    },
    chapter1: {
      eyebrow: 'Kapitel 01',
      title: 'Die Nacht, in der wir es benannten',
      p1: 'Das erste Logo wurde auf die Rückseite eines Belegs gezeichnet. Der erste Name war falsch. Der zweite zu clever. Der dritte — Afterstate — fühlte sich an wie ein Ort, an dem man stehen kann: nach dem Scrollen, nach dem Sale, nach dem Lärm, der dir sagt, deine Garderobe sei schon veraltet.',
      p2: 'Wir schrieben drei Regeln auf dieselbe Seite: weniger Stücke machen. Sie schwerer in der Hand machen. Eine Serie nie nachliefern, nur weil sie ausverkauft ist. Knappheit ist bei uns kein Trick. Es ist das Versprechen, dass die Arbeit selten bleibt, weil wir sie nicht verdünnen.',
    },
    manifesto: {
      p1: 'No Rush wurde die erste Kollektion, weil es so sein musste. Weniger Slogan als Methode: den Sample-Loop verlangsamen, dem Stoff vertrauen, dem Kleidungsstück Raum lassen, deins zu werden.',
      p2: 'Jedes Stück in Afterstate 001 ist eine limitierte Edition. Kleine Serien. Keine Nachlieferungen. Wenn es weg ist, geht die Geschichte weiter — nicht seitwärts in endlose Nachdrucke.',
    },
    imageCaption: 'Afterstate 001 — No Rush · Kampagnenstill',
    standards: {
      eyebrow: 'Der Maßstab',
      title: 'Was No Rush schützt',
      principles: [
        {
          id: 'runs',
          icon: 'limited',
          label: 'Kleine Serien, abgeschlossene Kapitel',
          body: 'Wir schneiden, wofür wir einstehen — und hören dann auf. Limitierte Editionen halten die Arbeit ehrlich und die Garderobe frei von Lärm.',
        },
        {
          id: 'fabric',
          icon: 'fabric',
          label: 'Stoff vor Kalender',
          body: 'Drops folgen der Materialreife, nicht Marketingwochen. Wenn der Griff nicht stimmt, wartet das Stück.',
        },
        {
          id: 'pace',
          icon: 'pace',
          label: 'Silhouetten, die sich setzen',
          body: 'Formen zum Leben: klare Linien, ruhige Logos, Proportionen, die nach hundert Tragen noch lesbar sind.',
        },
        {
          id: 'stitch',
          icon: 'stitch',
          label: 'Reparieren statt ersetzen',
          body: 'Konstruktion für Dauer — Nähte, Gewicht und Abschlüsse, die Jahre einladen, nicht Saisons.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Kapitel 02',
      title: 'Warum die Kleidung ruhig wirkt',
      p1: 'Ruhe ist keine Leere. Sie ist die Abwesenheit von Panik. Unsere Farben neigen zu mediterranem Stein und kühlem Nebel — Teal, Coral, Senf als Akzente, nie als Schrei. Das AS sitzt klein, weil der Stoff sprechen soll.',
      p2: 'Wenn der erste Bildschirm des Tages noch eilig wirkt, ist das in Ordnung. Die Kleidung ist für die Stunden danach — kalter Kaffee, weiches Stadtlicht, ein gutes Stück, das nicht um Aufmerksamkeit bittet.',
    },
  },
  lifeBeyond: {
    open: {
      eyebrow: 'Notizen',
      title: 'Die Garderobe nach der Eile',
      p1: 'Die meisten Schränke sind Archive von Beinahe: Stücke für eine Version von dir, die nie ganz ankam, oder für ein Wochenende, das schon vorbei ist. Leben jenseits der Eile ist kein Rückzug aus der Stadt. Es ist ein anderes Verhältnis zum Anziehen.',
      p2: 'Afterstate schreibt für diesen Moment — wenn du aufhörst zu fragen „was ist neu“ und anfängst zu fragen „was fühlt sich noch wie meins an.“ Die Antwort ist meist ruhiger, als der Algorithmus erwartet.',
    },
    quote: {
      quote: 'Tempo ist eine Designentscheidung. Weniger besitzen auch.',
      attribution: 'Afterstate',
    },
    chapter1: {
      eyebrow: 'Rhythmus',
      title: 'Eine langsamere Schleife',
      p1: 'Wir stellen uns die Afterstate-Woche so vor: Montag ohne Kostümwechsel. Donnerstag im selben Hoodie, etwas weicher. Sonntag mit einem guten Outer, der unter Straßenlicht immer noch entschieden wirkt.',
      p2: 'Die Markengeschichte ist in den Details fiktiv — der Zug, der Beleg, das Skizzenbuch — und wahr in der Praxis. Weniger Entscheidungen am Morgen. Mehr Jahre am Kleidungsstück. Weniger Theater ums „Droppen.“',
    },
    manifesto: {
      p1: 'Zur eigenen Garderobe zu gehören klingt klein, bis man es versucht. Es heißt: der Hoodie auf dem Stuhl reicht. Die Cap an der Tür ist kein Prop. Afterstate ist weniger ein Logo zum Sammeln als ein Tempo zum Halten.',
      p2: 'Leben jenseits der Eile gibt es jeden Tag. Die Kleidung ist nur die Erinnerung, die du anziehen kannst.',
    },
    imageCaption: 'Abendlicht · Leben jenseits der Eile',
    standards: {
      eyebrow: 'Praxis',
      title: 'Anziehen ohne die Hetze',
      principles: [
        {
          id: 'silhouette',
          icon: 'pace',
          label: 'Eine Silhouette, viele Tage',
          body: 'Wähle Formen, die Kontext überstehen — Studio, Straße, spätes Essen — damit du morgens nicht jedes Outfit neu baust.',
        },
        {
          id: 'colour',
          icon: 'mark',
          label: 'Farbe, die stillhält',
          body: 'Gedämpfte Gründe mit einem ruhigen Akzent lassen Stücke jahrelang mischen, statt gegen die Palette der letzten Saison zu kämpfen.',
        },
        {
          id: 'weight',
          icon: 'fabric',
          label: 'Kauf das Gewicht, das du spürst',
          body: 'Fühlt sich der Stoff in der Hand dünn an, fühlt er sich am Körper vorläufig an. Dichte ist eine Form von Respekt.',
        },
        {
          id: 'scarce',
          icon: 'limited',
          label: 'Lass Knappheit etwas bedeuten',
          body: 'Wenn eine Serie endet, endet sie. Diese Abwesenheit lehrt dich, zu tragen, was du hast — und das nächste Stück mit Sorgfalt zu wählen.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Zugehörigkeit',
      title: 'Trag, was sich noch wie deins anfühlt',
      p1: 'Der Afterstate ist kein Wochenende weg. Es ist Dienstag, im selben Layer, mit weniger Lärm in der Entscheidung.',
      p2: 'Besitz weniger. Trag es härter. Lass die Eile woanders stattfinden.',
    },
    closing: {
      label: 'Zugehörigkeit',
      p1: 'Zur eigenen Garderobe zu gehören klingt klein, bis man es versucht. Es heißt: der Hoodie auf dem Stuhl reicht. Die Cap an der Tür ist kein Prop. Afterstate ist weniger ein Logo zum Sammeln als ein Tempo zum Halten.',
      p2: 'Leben jenseits der Eile gibt es jeden Tag. Die Kleidung ist nur die Erinnerung, die du anziehen kannst.',
    },
  },
  quietCloth: {
    open: {
      eyebrow: 'Materialien',
      title: 'Ruhig heißt nicht leicht',
      p1: 'Ruhige Kleidung wird oft als weiches Branding und dünner Cotton missverstanden. Für Afterstate ist ruhig das Gegenteil: dichter Stoff, ehrliche Nähte, und ein Logo, das weiß, wann es aus dem Weg geht.',
      p2: 'Das Gewicht, das du spürst, wenn du ein Stück aufhebst, ist der erste Satz der Geschichte. Alles andere — Farbe, Schnitt, Kampagne — muss diesem Satz zustimmen.',
    },
    quote: {
      quote: 'Wenn der Stoff die Jahre nicht trägt, kann es die Marke auch nicht.',
      attribution: 'Materialien',
    },
    chapter1: {
      eyebrow: 'Griff',
      title: 'Schwerer Cotton, gebürstetes Fleece',
      p1: 'Wir spezifizieren Stoff, wie andere Moodboards spezifizieren: zuerst über die Hand. Schwerer Cotton, der nach dem Waschen hält. Gebürstetes Fleece, das weicher wird, ohne einzubrechen. Ripp, der zurückkommt. Garn, das zum Leben des Tuchs passt, nicht nur zum Look des Samples.',
      p2: 'Das sind keine Luxuscodes um ihrer selbst willen. So überlebt ein Hoodie Regen, Taschenriemen und den hundertsten Arbeitsweg, ohne zur Erinnerung an sich selbst zu werden.',
    },
    manifesto: {
      p1: 'Wasch kalt, wenn du kannst. Hänge zum Trocknen, wenn das Label es erlaubt. Repariere eine Naht, bevor du einen Freund ersetzt. Wir schreiben Pflegenotizen, weil Langlebigkeit Teil des Produkts ist — kein Nachgedanke in einer FAQ.',
      p2: 'Trends bitten dich, neu anzufangen. Qualität bittet dich, weiterzumachen. Wir entwerfen für die zweite Frage.',
    },
    imageCaption: 'Stoff, Zeichen und Abendluft',
    standards: {
      eyebrow: 'Qualität',
      title: 'Entscheidungen, die man tragen kann',
      principles: [
        {
          id: 'grammage',
          icon: 'fabric',
          label: 'Grammatur mit Absicht',
          body: 'Wir wählen Gewichte mit Haltung — fest genug für die Silhouette, atmungsaktiv genug für echte Tage.',
        },
        {
          id: 'build',
          icon: 'stitch',
          label: 'Konstruktion, die man später merkt',
          body: 'Verstärkte Stresspunkte, saubere Abschlüsse, Nähte für Bewegung. Die beste Konstruktion vergisst man bis Jahr drei.',
        },
        {
          id: 'colour',
          icon: 'mark',
          label: 'Farbe, die gut altert',
          body: 'Farben und Washes werden dafür getestet, wie sie leben — nicht nur, wie sie fotografieren. Weiche Verschiebungen schlagen brüchige Helligkeit.',
        },
        {
          id: 'runs',
          icon: 'limited',
          label: 'Kleine Serien als Qualitätskontrolle',
          body: 'Kurze Editionen halten uns nah an jeder Charge. Wenn etwas nicht stimmt, skalieren wir den Fehler nicht.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Alter',
      title: 'Wie ein Stück sich verdient',
      p1: 'Die besten Afterstate-Stücke sollen mit der Zeit mehr nach dir aussehen — nicht mehr nach einer Kampagne. Ellbogen werden weicher. Fleece öffnet sich. Die Farbe setzt sich ins Licht deiner Stadt. Das ist das Gewicht ruhiger Kleidung: sie bleibt in der Rotation, weil sie vertrauter wird.',
      p2: 'Trends bitten dich, neu anzufangen. Qualität bittet dich, weiterzumachen. Wir entwerfen für die zweite Frage.',
    },
    extraCaption: 'Stoff, Zeichen und Abendluft',
    closing: {
      label: 'Pflege',
      p1: 'Wasch kalt, wenn du kannst. Hänge zum Trocknen, wenn das Label es erlaubt. Repariere eine Naht, bevor du einen Freund ersetzt. Wir schreiben Pflegenotizen, weil Langlebigkeit Teil des Produkts ist — kein Nachgedanke in einer FAQ.',
    },
  },
};

const FR: EssayCopy = {
  noRush: {
    open: {
      eyebrow: 'Origine',
      title: 'Ça a commencé par une pause',
      p1: 'L’histoire d’Afterstate n’est pas un mythe fondateur avec une salle de conseil et une date de lancement. Elle commence dans un train tardif, quelque part entre une ville qui ne dort jamais et un petit appartement qui l’a enfin fait.',
      p2: 'L’un de nous portait un hoodie acheté à la hâte — doux une semaine, mince dès le troisième lavage, déjà en demande de remplacement. L’autre portait un carnet de silhouettes qui n’allaient jamais plus loin que « la saison prochaine ». Entre ces deux échecs, une idée plus calme s’est posée : et si les vêtements arrivaient après la course, pas à cause d’elle ?',
      p3: 'Afterstate est le nom que nous avons donné à cette idée. Pas after fashion. After urgency. L’état dans lequel on entre quand on arrête de chasser la suite et qu’on commence à vivre dans ce qu’on a déjà.',
    },
    quote: {
      quote:
        'Nous n’avions pas besoin d’une autre marque plus rapide. Nous avions besoin d’une marque qui avance avec intention.',
      attribution: 'Note de studio, 2024',
    },
    chapter1: {
      eyebrow: 'Chapitre 01',
      title: 'La nuit où nous l’avons nommé',
      p1: 'Le premier logo a été dessiné au dos d’un ticket. Le premier nom était faux. Le second trop malin. Le troisième — Afterstate — ressemblait à un endroit où l’on peut se tenir : après le scroll, après la soldes, après le bruit qui dit que votre garde-robe est déjà datée.',
      p2: 'Nous avons écrit trois règles sur la même page : faire moins de pièces. Les rendre plus lourdes en main. Ne jamais restocker une série parce qu’elle s’est vendue. La rareté, pour nous, n’est pas un tour. C’est la promesse que le travail reste rare parce que nous refusons de le diluer.',
    },
    manifesto: {
      p1: 'No Rush est devenue la première collection parce qu’il le fallait. Moins un slogan qu’une méthode : ralentir la boucle d’échantillons, faire confiance au tissu, laisser au vêtement la place de devenir le vôtre.',
      p2: 'Chaque pièce d’Afterstate 001 est une édition limitée. Petites séries. Pas de restock. Quand c’est parti, l’histoire avance — pas de côté vers d’éternelles réimpressions.',
    },
    imageCaption: 'Afterstate 001 — No Rush · still de campagne',
    standards: {
      eyebrow: 'Le standard',
      title: 'Ce que No Rush protège',
      principles: [
        {
          id: 'runs',
          icon: 'limited',
          label: 'Petites séries, chapitres fermés',
          body: 'Nous coupons ce que nous pouvons défendre — puis nous arrêtons. Les éditions limitées gardent le travail honnête et la garde-robe hors du bruit.',
        },
        {
          id: 'fabric',
          icon: 'fabric',
          label: 'Le tissu avant le calendrier',
          body: 'Les drops suivent la maturité de la matière, pas les semaines marketing. Si la main est fausse, la pièce attend.',
        },
        {
          id: 'pace',
          icon: 'pace',
          label: 'Des silhouettes qui s’installent',
          body: 'Des formes à vivre : lignes nettes, logos calmes, une proportion qui se lit encore après cent ports.',
        },
        {
          id: 'stitch',
          icon: 'stitch',
          label: 'Réparer plutôt que remplacer',
          body: 'Une construction pour durer — coutures, poids et finitions qui invitent les années, pas les saisons.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Chapitre 02',
      title: 'Pourquoi les vêtements se sentent calmes',
      p1: 'Le calme n’est pas le vide. C’est l’absence de panique. Nos couleurs penchent vers la pierre méditerranéenne et le brouillard froid — teal, corail, moutarde en accents, jamais en cri. Le AS reste petit, parce que le tissu doit parler.',
      p2: 'Si le premier écran de la journée est encore pressé, tant pis. Les vêtements sont pour les heures d’après — café froid, lumières de ville douces, une bonne pièce qui ne demande pas l’attention.',
    },
  },
  lifeBeyond: {
    open: {
      eyebrow: 'Notes',
      title: 'La garde-robe après l’urgence',
      p1: 'La plupart des placards sont des archives de presque : des pièces achetées pour une version de soi qui n’est jamais tout à fait arrivée, ou pour un week-end déjà fini. La vie au-delà de la course n’est pas un retrait de la ville. C’est un autre rapport à s’habiller.',
      p2: 'Afterstate écrit pour ce moment — quand on arrête de demander « quoi de neuf » et qu’on commence à demander « qu’est-ce qui me ressemble encore ». La réponse est en général plus calme que ce que l’algorithme attend.',
    },
    quote: {
      quote: 'Le rythme est une décision de design. Posséder moins aussi.',
      attribution: 'Afterstate',
    },
    chapter1: {
      eyebrow: 'Rythme',
      title: 'Une boucle plus lente',
      p1: 'Nous imaginons la semaine Afterstate ainsi : lundi sans changement de costume. Jeudi dans le même hoodie, un peu plus doux. Dimanche avec une bonne couche extérieure qui a encore l’air décidée sous le lampadaire.',
      p2: 'L’histoire de la marque est fictive dans les détails — le train, le ticket, le carnet — et vraie dans la pratique. Moins de décisions le matin. Plus d’années sur le vêtement. Moins de théâtre autour du « drop ».',
    },
    manifesto: {
      p1: 'Appartenir à sa garde-robe paraît petit jusqu’à ce qu’on l’essaie. Ça veut dire : le hoodie sur la chaise suffit. La casquette près de la porte n’est pas un accessoire. Afterstate est moins un logo à collectionner qu’un rythme à tenir.',
      p2: 'La vie au-delà de la course est disponible tous les jours. Les vêtements sont juste le rappel que l’on peut porter.',
    },
    imageCaption: 'Lumière du soir · la vie au-delà de la course',
    standards: {
      eyebrow: 'Pratique',
      title: 'S’habiller sans la hâte',
      principles: [
        {
          id: 'silhouette',
          icon: 'pace',
          label: 'Une silhouette, plusieurs jours',
          body: 'Choisissez des formes qui survivent au contexte — studio, rue, dîner tardif — pour ne pas reconstruire une tenue chaque matin.',
        },
        {
          id: 'colour',
          icon: 'mark',
          label: 'Une couleur qui tient',
          body: 'Des fonds sourds et un accent calme laissent les pièces se mélanger des années, au lieu de se battre contre la palette de la saison passée.',
        },
        {
          id: 'weight',
          icon: 'fabric',
          label: 'Achetez le poids que l’on sent',
          body: 'Si le tissu est mince en main, il sera temporaire sur le corps. La densité est une forme de respect.',
        },
        {
          id: 'scarce',
          icon: 'limited',
          label: 'Que la rareté veuille dire quelque chose',
          body: 'Quand une série s’arrête, elle s’arrête. Cette absence apprend à porter ce que l’on a — et à choisir la pièce suivante avec soin.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Appartenance',
      title: 'Porter ce qui vous ressemble encore',
      p1: 'L’afterstate n’est pas un week-end ailleurs. C’est mardi, dans la même couche, avec moins de bruit dans la décision.',
      p2: 'Posséder moins. Le porter plus fort. Laisser la course se passer ailleurs.',
    },
    closing: {
      label: 'Appartenance',
      p1: 'Appartenir à sa garde-robe paraît petit jusqu’à ce qu’on l’essaie. Ça veut dire : le hoodie sur la chaise suffit. La casquette près de la porte n’est pas un accessoire. Afterstate est moins un logo à collectionner qu’un rythme à tenir.',
      p2: 'La vie au-delà de la course est disponible tous les jours. Les vêtements sont juste le rappel que l’on peut porter.',
    },
  },
  quietCloth: {
    open: {
      eyebrow: 'Matières',
      title: 'Calme ne veut pas dire léger',
      p1: 'Le vêtement calme est souvent mal compris comme un branding doux et un coton mince. Pour Afterstate, le calme est l’inverse : un tissu dense, des coutures honnêtes, et un logo qui sait quand s’écarter.',
      p2: 'Le poids que l’on sent en soulevant une pièce est la première phrase de l’histoire. Tout le reste — couleur, coupe, campagne — doit être d’accord avec cette phrase.',
    },
    quote: {
      quote: 'Si le tissu ne peut pas porter les années, la marque non plus.',
      attribution: 'Bureau matières',
    },
    chapter1: {
      eyebrow: 'Main',
      title: 'Coton lourd, molleton brossé',
      p1: 'Nous spécifions le tissu comme d’autres spécifient des moodboards : par le toucher d’abord. Un coton lourd qui tient après le lavage. Un molleton brossé qui s’assouplit sans s’effondrer. Un côte qui revient. Un fil à la vie du tissu, pas seulement au look de l’échantillon.',
      p2: 'Ce ne sont pas des codes luxe pour eux-mêmes. C’est ainsi qu’un hoodie survit à la pluie, aux sangles de sac, et à la centième navette sans devenir le souvenir de lui-même.',
    },
    manifesto: {
      p1: 'Lavez à froid quand vous pouvez. Séchez à l’air si l’étiquette le permet. Réparez une couture avant de remplacer un ami. Nous publions des notes d’entretien parce que la durée fait partie du produit — pas une note oubliée dans une FAQ.',
      p2: 'Les tendances vous demandent de recommencer. La qualité vous demande de continuer. Nous concevons pour la seconde question.',
    },
    imageCaption: 'Tissu, marque, et air du soir',
    standards: {
      eyebrow: 'Qualité',
      title: 'Des décisions que l’on porte',
      principles: [
        {
          id: 'grammage',
          icon: 'fabric',
          label: 'Un grammage avec une raison',
          body: 'Nous choisissons des poids qui drapent avec autorité — assez denses pour tenir une silhouette, assez respirants pour des jours réels.',
        },
        {
          id: 'build',
          icon: 'stitch',
          label: 'Une construction que l’on remarque plus tard',
          body: 'Points de tension renforcés, finitions nettes, coutures placées pour le mouvement. La meilleure construction est celle qu’on oublie jusqu’à l’an trois.',
        },
        {
          id: 'colour',
          icon: 'mark',
          label: 'Une couleur qui vieillit bien',
          body: 'Teintures et lavages sont testés pour la vie, pas seulement pour la photo. Les glissements doux battent la brillance cassante.',
        },
        {
          id: 'runs',
          icon: 'limited',
          label: 'Petites séries comme contrôle qualité',
          body: 'Des éditions courtes nous gardent proches de chaque lot. Quand quelque chose cloche, nous ne mettons pas l’erreur à l’échelle.',
        },
      ],
    },
    chapter2: {
      eyebrow: 'Âge',
      title: 'Comment une pièce mérite sa place',
      p1: 'Les meilleures pièces Afterstate devraient vous ressembler davantage avec le temps — pas davantage à une campagne. Les coudes s’assouplissent. Le molleton s’ouvre. La couleur s’installe dans la lumière de votre ville. C’est le poids du vêtement calme : il reste dans la rotation parce qu’il devient familier.',
      p2: 'Les tendances vous demandent de recommencer. La qualité vous demande de continuer. Nous concevons pour la seconde question.',
    },
    extraCaption: 'Tissu, marque, et air du soir',
    closing: {
      label: 'Entretien',
      p1: 'Lavez à froid quand vous pouvez. Séchez à l’air si l’étiquette le permet. Réparez une couture avant de remplacer un ami. Nous publions des notes d’entretien parce que la durée fait partie du produit — pas une note oubliée dans une FAQ.',
    },
  },
};

const COPY: Record<UiLang, EssayCopy> = {en: EN, de: DE, fr: FR};

export function getEssayCopy(lang: UiLang): EssayCopy {
  return COPY[lang];
}
