import {useId, useState} from 'react';
import styles from './ProductDetails.module.css';

export type ProductDetailSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export type ProductDetailsProps = {
  /** Explicit sections. When omitted, built from known metafield-like props. */
  sections?: ProductDetailSection[];
  fit?: React.ReactNode;
  fabric?: React.ReactNode;
  construction?: React.ReactNode;
  care?: React.ReactNode;
  measurements?: React.ReactNode;
  modelInfo?: React.ReactNode;
  designStory?: React.ReactNode;
  className?: string;
  /** Open first section by default */
  defaultOpenId?: string | null;
};

/**
 * Accordion sections for fit, fabric, construction, care, measurements, model, story.
 */
export function ProductDetails({
  sections: sectionsProp,
  fit,
  fabric,
  construction,
  care,
  measurements,
  modelInfo,
  designStory,
  className,
  defaultOpenId,
}: ProductDetailsProps) {
  const baseId = useId();
  const sections =
    sectionsProp ??
    buildSections({
      fit,
      fabric,
      construction,
      care,
      measurements,
      modelInfo,
      designStory,
    });

  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId === undefined
      ? (sections[0]?.id ?? null)
      : defaultOpenId,
  );

  if (!sections.length) return null;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Product details"
    >
      {sections.map((section) => {
        const panelId = `${baseId}-${section.id}-panel`;
        const headerId = `${baseId}-${section.id}-header`;
        const isOpen = openId === section.id;

        return (
          <div key={section.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={headerId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : section.id)}
              >
                <span>{section.title}</span>
                <span className={styles.icon} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={styles.panel}
            >
              <div className={styles.content}>{section.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildSections(fields: {
  fit?: React.ReactNode;
  fabric?: React.ReactNode;
  construction?: React.ReactNode;
  care?: React.ReactNode;
  measurements?: React.ReactNode;
  modelInfo?: React.ReactNode;
  designStory?: React.ReactNode;
}): ProductDetailSection[] {
  const map: Array<[string, string, React.ReactNode | undefined]> = [
    ['fit', 'Fit', fields.fit],
    ['fabric', 'Fabric', fields.fabric],
    ['construction', 'Construction', fields.construction],
    ['care', 'Care', fields.care],
    ['measurements', 'Measurements', fields.measurements],
    ['model', 'Model', fields.modelInfo],
    ['story', 'Design story', fields.designStory],
  ];

  return map
    .filter(([, , content]) => Boolean(content))
    .map(([id, title, content]) => ({id, title, content: content!}));
}
