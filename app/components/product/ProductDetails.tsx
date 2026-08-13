import {useId, useState, type ReactNode} from 'react';
import {parseMeasurementTable, splitMultiline} from '~/lib/measurements';
import styles from './ProductDetails.module.css';

export type ProductDetailSection = {
  id: string;
  title: string;
  hint?: string;
  content: ReactNode;
};

export type ProductDetailsProps = {
  sections?: ProductDetailSection[];
  description?: ReactNode;
  fit?: ReactNode;
  fabric?: ReactNode;
  construction?: ReactNode;
  care?: ReactNode;
  measurements?: ReactNode;
  modelInfo?: ReactNode;
  designStory?: ReactNode;
  sizeGuide?: ReactNode;
  shipping?: ReactNode;
  shippingHint?: string;
  className?: string;
  defaultOpenId?: string | null;
};

/**
 * The piece / Care / Shipping as one horizontal line; open panel sits below.
 */
export function ProductDetails({
  sections: sectionsProp,
  description,
  fit,
  fabric,
  construction,
  care,
  measurements,
  modelInfo,
  designStory,
  sizeGuide,
  shipping,
  shippingHint,
  className,
  defaultOpenId,
}: ProductDetailsProps) {
  const baseId = useId();
  const sections =
    sectionsProp ??
    buildSections({
      description,
      fit,
      fabric,
      construction,
      care,
      measurements,
      modelInfo,
      designStory,
      sizeGuide,
      shipping,
      shippingHint,
    });

  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId === undefined ? null : defaultOpenId,
  );

  if (!sections.length) return null;

  const openSection = sections.find((section) => section.id === openId);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Product details"
    >
      <div className={styles.row}>
        {sections.map((section) => {
          const panelId = `${baseId}-${section.id}-panel`;
          const headerId = `${baseId}-${section.id}-header`;
          const isOpen = openId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              id={headerId}
              className={[styles.trigger, isOpen ? styles.triggerOpen : '']
                .filter(Boolean)
                .join(' ')}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              {section.title}
            </button>
          );
        })}
      </div>
      {openSection ? (
        <div
          id={`${baseId}-${openSection.id}-panel`}
          role="region"
          aria-labelledby={`${baseId}-${openSection.id}-header`}
          className={styles.panel}
        >
          <div className={styles.content}>
            {typeof openSection.content === 'string' ? (
              <Paragraphs text={openSection.content} />
            ) : (
              openSection.content
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Paragraphs({text}: {text: ReactNode}) {
  if (typeof text !== 'string') return <>{text}</>;
  const lines = splitMultiline(text);
  if (!lines.length) return null;
  return (
    <>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </>
  );
}

function MeasurementBlock({value}: {value: ReactNode}) {
  if (typeof value !== 'string') return <>{value}</>;
  const table = parseMeasurementTable(value);
  if (!table) return <Paragraphs text={value} />;
  return (
    <div className={styles.tableWrap}>
      {table.units ? <p className={styles.units}>Units: {table.units}</p> : null}
      <table className={styles.table}>
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, cellIndex) => (
                <td key={`${table.headers[cellIndex] ?? 'col'}-${cell}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stack({children}: {children: ReactNode[]}) {
  const present = children.filter(Boolean);
  if (!present.length) return null;
  return <div className={styles.stack}>{present}</div>;
}

function buildSections(fields: {
  description?: ReactNode;
  fit?: ReactNode;
  fabric?: ReactNode;
  construction?: ReactNode;
  care?: ReactNode;
  measurements?: ReactNode;
  modelInfo?: ReactNode;
  designStory?: ReactNode;
  sizeGuide?: ReactNode;
  shipping?: ReactNode;
  shippingHint?: string;
}): ProductDetailSection[] {
  const description = fields.designStory || fields.description;
  const hasFit = Boolean(
    fields.fit || fields.measurements || fields.modelInfo || fields.sizeGuide,
  );
  const hasFabric = Boolean(fields.fabric || fields.construction);
  const fit = hasFit ? (
    <Stack>
      {fields.fit ? <Paragraphs text={fields.fit} /> : null}
      {fields.measurements ? (
        <MeasurementBlock value={fields.measurements} />
      ) : null}
      {fields.modelInfo ? <Paragraphs text={fields.modelInfo} /> : null}
      {fields.sizeGuide ? <Paragraphs text={fields.sizeGuide} /> : null}
    </Stack>
  ) : undefined;
  const fabric = hasFabric ? (
    <Stack>
      {fields.fabric ? <Paragraphs text={fields.fabric} /> : null}
      {fields.construction ? <Paragraphs text={fields.construction} /> : null}
    </Stack>
  ) : undefined;

  const hasPiece = Boolean(description || fit || fabric);
  const piece = hasPiece ? (
    <Stack>
      {description ? (
        typeof description === 'string' ? (
          <Paragraphs text={description} />
        ) : (
          description
        )
      ) : null}
      {fit}
      {fabric}
    </Stack>
  ) : undefined;

  const map: Array<[string, string, ReactNode | undefined, string | undefined]> =
    [
      ['description', 'The piece', piece, undefined],
      ['care', 'Care', fields.care, undefined],
      ['shipping', 'Shipping', fields.shipping, fields.shippingHint],
    ];

  return map
    .filter(([, , content]) => Boolean(content))
    .map(([id, title, content, hint]) => ({
      id,
      title,
      hint,
      content: content!,
    }));
}
