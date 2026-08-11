import {Link} from 'react-router';
import {
  EditorialImage,
  EditorialText,
  ManifestoBlock,
  QuoteBlock,
  SplitMediaText,
} from '~/components/content';
import {CustomerVoices} from '~/components/journal/CustomerVoices';
import {IconPrinciples} from '~/components/journal/IconPrinciples';
import {ReadingProgress} from '~/components/journal/ReadingProgress';
import journalWorld from '~/components/journal/journalWorld.module.css';
import {Reveal} from '~/components/motion/Reveal';
import {OpeningStatement} from '~/sections/OpeningStatement';
import {
  getFallbackJournalArticle,
  JOURNAL_IMAGES,
  type FallbackJournalArticle,
} from '~/lib/journal/fallback';
import styles from './FallbackJournalArticle.module.css';

type FallbackJournalArticleViewProps = {
  article: FallbackJournalArticle;
};

function RelatedReading({handles}: {handles: string[]}) {
  return (
    <aside className={styles.related} aria-labelledby="related-reading-title">
      <p className={styles.relatedEyebrow}>Continue</p>
      <h2 id="related-reading-title" className={styles.relatedTitle}>
        More from the journal
      </h2>
      <ul className={styles.relatedList}>
        {handles.map((handle) => {
          const related = getFallbackJournalArticle(handle);
          if (!related) return null;
          return (
            <li key={handle}>
              <Link to={`/journal/${handle}`} prefetch="intent">
                <span className={styles.relatedLabel}>{related.eyebrow}</span>
                <span className={styles.relatedName}>{related.title}</span>
                <span className={styles.relatedCta}>
                  Read
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function NoRushStory() {
  return (
    <>
      <Reveal>
        <EditorialText eyebrow="Origin" title="It started with a pause">
          <p>
            The story of Afterstate is not a founding myth with a boardroom and a
            launch date. It begins on a late train, somewhere between a city that
            never sleeps and a small apartment that finally did.
          </p>
          <p>
            One of us was wearing a hoodie bought in a hurry — soft for a week,
            thin by the third wash, already asking to be replaced. The other was
            carrying a sketchbook full of silhouettes that never made it past
            “next season.” Somewhere between those two failures, a quieter idea
            landed: what if the clothes arrived after the rush, not because of it?
          </p>
          <p>
            Afterstate is the name we gave that idea. Not after fashion. After
            urgency. The state you enter when you stop chasing the next thing and
            start living in the one you already have.
          </p>
        </EditorialText>
      </Reveal>

      <Reveal delayMs={60}>
        <QuoteBlock
          quote="We did not need another brand that moved faster. We needed one that moved with intention."
          attribution="Studio note, 2024"
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow="Chapter 01"
          title="The night we named it"
          image={JOURNAL_IMAGES.lookbook02}
          mediaPosition="left"
        >
          <p>
            The first logo was drawn on the back of a receipt. The first name was
            wrong. The second was too clever. The third — Afterstate — felt like a
            place you could stand in: after the scroll, after the sale, after the
            noise that tells you your wardrobe is already outdated.
          </p>
          <p>
            We wrote three rules on the same page: make fewer pieces. Make them
            heavier in the hand. Never restock a run just because it sold through.
            Scarcity, for us, is not a trick. It is a promise that the work stays
            rare because we refuse to dilute it.
          </p>
        </SplitMediaText>
      </Reveal>

      <Reveal delayMs={80}>
        <ManifestoBlock label="No Rush">
          <p>
            No Rush became the first collection because it had to. It is less a
            slogan than a working method: slow the sample loop, trust the fabric,
            leave room for the garment to become yours.
          </p>
          <p>
            Every piece in Afterstate 001 is limited edition. Short runs. No
            restocks. When it is gone, the story moves forward — not sideways into
            endless reprints.
          </p>
        </ManifestoBlock>
      </Reveal>

      <Reveal delayMs={60}>
        <EditorialImage
          image={JOURNAL_IMAGES.heroHoodies}
          caption="Afterstate 001 — No Rush · campaign still"
          fullBleed
        />
      </Reveal>

      <Reveal delayMs={80}>
        <IconPrinciples
          eyebrow="The standard"
          title="What No Rush protects"
          principles={[
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
          ]}
        />
      </Reveal>

      <Reveal delayMs={40}>
        <CustomerVoices
          eyebrow="Worn in"
          title="Owners on No Rush"
          voices={[
            {
              id: 'lena',
              quote:
                'I bought one hoodie and stopped refreshing drops. It still looks decided after a winter of trains and rain.',
              name: 'Lena M.',
              detail: 'No Rush hoodie · owned 7 months',
              city: 'Lisbon',
            },
            {
              id: 'jonas',
              quote:
                'The weight surprised me first — then the quiet. No loud branding, just cloth that holds its shape.',
              name: 'Jonas K.',
              detail: '001 fleece · owned 4 months',
              city: 'Berlin',
            },
            {
              id: 'mira',
              quote:
                'I like that it sold out and stayed sold out. Feels like the brand meant the limited part.',
              name: 'Mira S.',
              detail: 'Campaign tee · owned 5 months',
              city: 'Copenhagen',
            },
          ]}
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow="Chapter 02"
          title="Why the clothes feel calm"
          image={JOURNAL_IMAGES.lookbook03}
          mediaPosition="right"
        >
          <p>
            Calm is not emptiness. It is the absence of panic. Our colour stories
            lean Mediterranean stone and cool fog — teal, coral, mustard as
            accents, never as shouting. The AS mark sits small, because the fabric
            should do the talking.
          </p>
          <p>
            If the first viewport of your day still feels rushed, that is fine.
            The clothes are for the hours after — coffee gone cold, city lights
            soft, one good piece that does not ask for attention.
          </p>
        </SplitMediaText>
      </Reveal>
    </>
  );
}

function LifeBeyondStory() {
  return (
    <>
      <Reveal>
        <EditorialText eyebrow="Notes" title="The wardrobe after urgency">
          <p>
            Most closets are archives of almosts: pieces bought for a version of
            yourself that never quite arrived, or for a weekend that already
            ended. Life beyond the rush is not a retreat from the city. It is a
            different relationship to getting dressed.
          </p>
          <p>
            Afterstate writes for that moment — when you stop asking “what’s new”
            and start asking “what still feels like mine.” The answer is usually
            quieter than the algorithm expects.
          </p>
        </EditorialText>
      </Reveal>

      <Reveal delayMs={60}>
        <QuoteBlock
          quote="Pace is a design decision. So is owning less."
          attribution="Afterstate"
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow="Rhythm"
          title="A slower loop"
          image={JOURNAL_IMAGES.campaignLook}
          mediaPosition="right"
        >
          <p>
            We imagine the Afterstate week like this: Monday without a costume
            change. Thursday in the same hoodie, a little softer. Sunday with one
            good outer layer that still looks decided under streetlight.
          </p>
          <p>
            The brand story is fictional in the details — the train, the receipt,
            the sketchbook — and true in the practice. Fewer decisions in the
            morning. More years on the garment. Less theatre around “dropping.”
          </p>
        </SplitMediaText>
      </Reveal>

      <Reveal delayMs={60}>
        <EditorialImage
          image={JOURNAL_IMAGES.lookbook02}
          caption="Evening light · life beyond the rush"
          fullBleed
        />
      </Reveal>

      <Reveal delayMs={80}>
        <IconPrinciples
          eyebrow="Practice"
          title="How to dress without the hurry"
          principles={[
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
          ]}
        />
      </Reveal>

      <Reveal delayMs={40}>
        <CustomerVoices
          title="Pace, according to wearers"
          voices={[
            {
              id: 'adrian',
              quote:
                'Morning decisions got easier. Same silhouette, different days. That is the Afterstate trick.',
              name: 'Adrian P.',
              detail: 'Cap + hoodie set · owned 3 months',
              city: 'Barcelona',
            },
            {
              id: 'lena',
              quote:
                'I stopped treating my closet like a feed. One good layer beats five almosts.',
              name: 'Lena M.',
              detail: 'No Rush hoodie · owned 7 months',
              city: 'Lisbon',
            },
            {
              id: 'mira',
              quote:
                'The limited runs make me wear what I own harder — in a good way.',
              name: 'Mira S.',
              detail: 'Campaign tee · owned 5 months',
              city: 'Copenhagen',
            },
          ]}
        />
      </Reveal>

      <Reveal delayMs={80}>
        <ManifestoBlock label="Belonging">
          <p>
            Belonging to your wardrobe sounds small until you try it. It means the
            hoodie on the chair is enough. It means the cap by the door is not a
            prop. It means Afterstate is less a logo to collect and more a pace
            to keep.
          </p>
          <p>
            Life beyond the rush is available every day. The clothes are just the
            reminder you can put on.
          </p>
        </ManifestoBlock>
      </Reveal>
    </>
  );
}

function QuietClothingStory() {
  return (
    <>
      <Reveal>
        <EditorialText eyebrow="Materials" title="Quiet does not mean light">
          <p>
            Quiet clothing is often misunderstood as soft branding and thin
            cotton. For Afterstate, quiet is the opposite: dense cloth, honest
            seams, and a logo that knows when to stay out of the way.
          </p>
          <p>
            The weight you feel when you pick up a piece is the first sentence of
            the story. Everything else — colour, cut, campaign — has to agree with
            that sentence.
          </p>
        </EditorialText>
      </Reveal>

      <Reveal delayMs={60}>
        <QuoteBlock
          quote="If the fabric cannot carry the years, the brand cannot either."
          attribution="Materials desk"
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow="Hand-feel"
          title="Heavy cotton, brushed fleece"
          image={JOURNAL_IMAGES.lookbook01}
          mediaPosition="left"
        >
          <p>
            We specify fabric the way some studios specify moodboards: by touch
            first. Heavy cotton that keeps its structure after washing. Brushed
            fleece that softens without collapsing. Rib that recovers. Thread that
            matches the life of the cloth, not just the look of the sample.
          </p>
          <p>
            These are not luxury codes for their own sake. They are how a hoodie
            survives rain, bag straps, and the hundredth commute without turning
            into a memory of itself.
          </p>
        </SplitMediaText>
      </Reveal>

      <Reveal delayMs={80}>
        <IconPrinciples
          eyebrow="Quality"
          title="Decisions you can wear"
          principles={[
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
          ]}
        />
      </Reveal>

      <Reveal delayMs={40}>
        <CustomerVoices
          title="On the weight of the cloth"
          voices={[
            {
              id: 'jonas',
              quote:
                'The weight surprised me first — then the quiet. No loud branding, just cloth that holds its shape.',
              name: 'Jonas K.',
              detail: '001 fleece · owned 4 months',
              city: 'Berlin',
            },
            {
              id: 'lena',
              quote:
                'After seven months it looks more like mine, not less like the product photo. That is rare.',
              name: 'Lena M.',
              detail: 'No Rush hoodie · owned 7 months',
              city: 'Lisbon',
            },
            {
              id: 'adrian',
              quote:
                'You feel the density in the hand before you even put it on. That is how I decide now.',
              name: 'Adrian P.',
              detail: 'Cap + hoodie set · owned 3 months',
              city: 'Barcelona',
            },
          ]}
        />
      </Reveal>

      <Reveal delayMs={60}>
        <EditorialImage
          image={JOURNAL_IMAGES.campaignLookAlt}
          caption="Fabric, mark, and evening air"
          fullBleed
        />
      </Reveal>

      <Reveal delayMs={80}>
        <SplitMediaText
          eyebrow="Age"
          title="How a piece earns its keep"
          image={JOURNAL_IMAGES.lookbook03}
          mediaPosition="right"
        >
          <p>
            The best Afterstate pieces should look more like you over time — not
            more like a campaign. Elbows soften. Fleece opens. The colour settles
            into your city’s light. That is the weight of quiet clothing: it stays
            in the rotation because it keeps becoming familiar.
          </p>
          <p>
            Trends ask you to restart. Quality asks you to continue. We design for
            the second question.
          </p>
        </SplitMediaText>
      </Reveal>

      <Reveal delayMs={80}>
        <ManifestoBlock label="Care">
          <p>
            Wash cold when you can. Hang dry when the label allows. Repair a seam
            before you replace a friend. We publish care notes because longevity is
            part of the product — not an afterthought buried in a FAQ.
          </p>
        </ManifestoBlock>
      </Reveal>
    </>
  );
}

function ArticleBody({handle}: {handle: string}) {
  switch (handle) {
    case 'no-rush':
      return <NoRushStory />;
    case 'life-beyond-the-rush':
      return <LifeBeyondStory />;
    case 'the-weight-of-quiet-clothing':
      return <QuietClothingStory />;
    default:
      return null;
  }
}

/**
 * Multi-section editorial layout for local journal essays
 * (used when Shopify blog content is not yet connected).
 */
export function FallbackJournalArticleView({
  article,
}: FallbackJournalArticleViewProps) {
  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className={[styles.root, journalWorld.journalWorld].join(" ")}>
      <ReadingProgress />

      <header className={styles.hero}>
        <div className={styles.heroMedia} aria-hidden="true">
          <img
            className={styles.heroImage}
            src={article.hero.url}
            alt=""
            width={article.hero.width}
            height={article.hero.height}
            decoding="async"
            fetchPriority="high"
          />
          <div className={styles.heroVeil} />
          <div className={styles.heroGrain} />
        </div>
        <div className={styles.heroInner}>
          <p className={styles.meta}>
            <span>{article.eyebrow}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={article.publishedAt}>{publishedDate}</time>
            <span aria-hidden="true"> · </span>
            <span>{article.authorName}</span>
          </p>
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.excerpt}>{article.excerpt}</p>
        </div>
      </header>

      <div className={styles.body}>
        <ArticleBody handle={article.handle} />
        <RelatedReading handles={article.relatedHandles} />
      </div>

      <OpeningStatement
        section={{
          id: 'journal-article-close',
          type: 'closing_statement',
          brand: 'Afterstate',
          tagline: 'Life beyond the rush.',
          body: 'Every piece is limited edition. Short runs. No restocks.',
        }}
      />
    </article>
  );
}
