import {sortBySize} from '~/lib/sizes';
import {guessSwatchColor, isColorOptionName} from '~/lib/swatch';

export const AFTERSTATE_DESIGNS = [
  {
    id: 'no-rush',
    name: 'No Rush',
    match: /no[\s-]*(rush|flash)/i,
  },
  {
    id: 'not-yet',
    name: 'Not Yet',
    match: /not[\s-]*yet/i,
  },
  {
    id: 'say-less',
    name: 'Say Less',
    match: /say[\s-]*less/i,
  },
  {
    id: 'after-this',
    name: 'After This',
    match: /after[\s-]*this/i,
  },
] as const;

export const SHOP_FORM_PARAM = 'form';
export const SHOP_DESIGN_PARAM = 'design';
/** @deprecated use SHOP_FORM_PARAM */
export const SHOP_PIECE_PARAM = SHOP_FORM_PARAM;

export type ProductFormId =
  | 'tee'
  | 'hoodie'
  | 'crew'
  | 'cap'
  | 'beanie'
  | 'tote'
  | 'rug'
  | 'other';

export type ShopFormFilter = ProductFormId | 'all';
export type ShopDesignFilter = string | 'all';

type FormSpec = {
  id: Exclude<ProductFormId, 'other'>;
  label: string;
  pattern: RegExp;
  titlePattern: RegExp;
};

const FORM_SPECS: FormSpec[] = [
  {
    id: 'tote',
    label: 'Tote',
    pattern: /tote(\s*bag)?/i,
    titlePattern: /tote(\s*bag)?/i,
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
    pattern: /hoodie|hooded/i,
    titlePattern: /hoodie|hooded(\s+sweatshirt)?/i,
  },
  {
    id: 'crew',
    label: 'Crew',
    pattern: /crewneck|\bcrews?\b|sweatshirt/i,
    titlePattern: /crewnecks?|\bcrews?\b|sweatshirts?/i,
  },
  {
    id: 'tee',
    label: 'Tee',
    pattern: /\btees?\b|t-shirts?|tshirts?/i,
    titlePattern: /t-shirts?|tshirts?|\btees?\b/i,
  },
  {
    id: 'cap',
    label: 'Cap',
    pattern: /\b(caps?|hats?)\b/i,
    titlePattern: /\b(caps?|hats?)\b/i,
  },
  {
    id: 'beanie',
    label: 'Beanie',
    pattern: /beanie/i,
    titlePattern: /beanies?/i,
  },
  {
    id: 'rug',
    label: 'Rug',
    pattern: /\brugs?\b|blanket/i,
    titlePattern: /\brugs?\b|blankets?/i,
  },
];

export const FORM_ORDER: ProductFormId[] = [
  'tee',
  'hoodie',
  'crew',
  'cap',
  'beanie',
  'tote',
  'rug',
  'other',
];

export const SHOP_FORM_FILTERS: Array<{id: ShopFormFilter; label: string}> = [
  {id: 'all', label: 'All objects'},
  {id: 'tee', label: 'T-shirts'},
  {id: 'hoodie', label: 'Hoodies'},
  {id: 'crew', label: 'Crews'},
  {id: 'cap', label: 'Caps'},
  {id: 'beanie', label: 'Beanies'},
  {id: 'tote', label: 'Totes'},
  {id: 'rug', label: 'Rugs'},
];

export type ShopCatalogImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ShopCatalogProduct = {
  id?: string;
  handle?: string;
  title?: string | null;
  productType?: string | null;
  tags?: string[] | null;
  featuredImage?: ShopCatalogImage | null;
  images?: {
    nodes?: Array<ShopCatalogImage | null> | null;
  } | null;
  options?: Array<{
    name: string;
    optionValues?: Array<{name: string} | null> | null;
  } | null> | null;
};

export type ProductSwatch = {
  name: string;
  color: string | null;
};

export type ShopFormGroup<T extends ShopCatalogProduct = ShopCatalogProduct> = {
  id: ProductFormId;
  label: string;
  products: T[];
};

export type ShopDesignFamily<T extends ShopCatalogProduct = ShopCatalogProduct> = {
  id: string;
  name: string;
  forms: ShopFormGroup<T>[];
  products: T[];
};

const FORM_IDS = new Set<string>(FORM_ORDER);

export function parseShopForm(value: string | null | undefined): ShopFormFilter {
  if (value === 'all' || !value) return 'all';
  if (FORM_IDS.has(value) && value !== 'other') {
    return value as ProductFormId;
  }
  return 'all';
}

export function parseShopDesign(value: string | null | undefined): ShopDesignFilter {
  if (!value || value === 'all') return 'all';
  if (AFTERSTATE_DESIGNS.some((design) => design.id === value)) return value;
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return value;
  return 'all';
}

export function shopCatalogSearch(
  form: ShopFormFilter = 'all',
  design: ShopDesignFilter = 'all',
) {
  const params = new URLSearchParams();
  if (form !== 'all') params.set(SHOP_FORM_PARAM, form);
  if (design !== 'all') params.set(SHOP_DESIGN_PARAM, design);
  const query = params.toString();
  return query ? `?${query}` : '';
}

function haystack(product: ShopCatalogProduct): string {
  return [product.productType, product.title, ...(product.tags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function getProductForm(product: ShopCatalogProduct): {
  id: ProductFormId;
  label: string;
} {
  const text = haystack(product);
  for (const spec of FORM_SPECS) {
    if (spec.pattern.test(text)) {
      return {id: spec.id, label: spec.label};
    }
  }
  const type = product.productType?.trim();
  return {id: 'other', label: type || 'Piece'};
}

export function getProductTypeLabel(product: ShopCatalogProduct): string | null {
  const form = getProductForm(product);
  return form.label;
}

export function getDesignName(product: ShopCatalogProduct): string {
  return matchAfterstateDesign(product)?.name ?? parseDesignFromTitle(product);
}

export function matchAfterstateDesign(product: ShopCatalogProduct) {
  const text = haystack(product);
  return AFTERSTATE_DESIGNS.find((design) => design.match.test(text)) ?? null;
}

function parseDesignFromTitle(product: ShopCatalogProduct): string {
  const raw = product.title?.trim() || 'Untitled';
  let name = raw;

  for (const spec of FORM_SPECS) {
    name = name.replace(
      new RegExp(`\\s*[-–—:]?\\s*(?:${spec.titlePattern.source})\\s*$`, 'i'),
      '',
    );
  }

  name = name.replace(/\s+[-–—]\s*$/, '').trim();
  return name || raw;
}

export function getDesignSlug(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
  return slug || 'design';
}

export function getHoverImage(product: ShopCatalogProduct) {
  const featuredUrl = getCatalogImage(product)?.url;
  const nodes = product.images?.nodes ?? [];
  return (
    nodes.find((image) => image?.url && image.url !== featuredUrl) ?? null
  );
}

/**
 * Prefer a front-facing still when Shopify featured the back of a garment.
 */
export function getCatalogImage(product: ShopCatalogProduct) {
  const nodes = product.images?.nodes ?? [];
  const front = nodes.find(
    (image) => image?.url && /(?:^|[/_-])front(?:[._-]|$)/i.test(image.url),
  );
  return front ?? product.featuredImage ?? null;
}

export function getProductSwatches(product: ShopCatalogProduct): ProductSwatch[] {
  const colorOption = product.options?.find(
    (option) => option && isColorOptionName(option.name),
  );
  const values = colorOption?.optionValues ?? [];

  return values
    .filter((value): value is {name: string} => Boolean(value?.name))
    .slice(0, 6)
    .map((value) => ({
      name: value.name,
      color: guessSwatchColor(value.name),
    }));
}

function formRank(id: ProductFormId) {
  const index = FORM_ORDER.indexOf(id);
  return index === -1 ? FORM_ORDER.length : index;
}

export function groupShopFamilies<T extends ShopCatalogProduct>(
  products: T[],
): ShopDesignFamily<T>[] {
  const families = AFTERSTATE_DESIGNS.map((design) => ({
    id: design.id,
    name: design.name,
    forms: [] as ShopFormGroup<T>[],
    products: [] as T[],
  }));
  const leftover: T[] = [];

  for (const product of products) {
    const known = matchAfterstateDesign(product);
    const family = known
      ? families.find((entry) => entry.id === known.id)
      : null;

    if (!family) {
      leftover.push(product);
      continue;
    }

    addProductToFamily(family, product);
  }

  for (const product of leftover) {
    const slug = getDesignSlug(parseDesignFromTitle(product));
    const family = families.find((entry) => entry.id === slug);
    if (family) addProductToFamily(family, product);
  }

  for (const family of families) {
    family.forms.sort((a, b) => formRank(a.id) - formRank(b.id));
  }

  return families;
}

function addProductToFamily<T extends ShopCatalogProduct>(
  family: ShopDesignFamily<T>,
  product: T,
) {
  const form = getProductForm(product);
  family.products.push(product);
  let group = family.forms.find((entry) => entry.id === form.id);
  if (!group) {
    group = {id: form.id, label: form.label, products: []};
    family.forms.push(group);
  }
  group.products.push(product);
}

export function countShopForms(products: ShopCatalogProduct[]) {
  const counts: Record<ShopFormFilter, number> = {
    all: products.length,
    tee: 0,
    hoodie: 0,
    crew: 0,
    cap: 0,
    beanie: 0,
    tote: 0,
    rug: 0,
    other: 0,
  };

  for (const product of products) {
    counts[getProductForm(product).id] += 1;
  }

  return counts;
}

export function filterFamiliesByForm<T extends ShopCatalogProduct>(
  families: ShopDesignFamily<T>[],
  form: ShopFormFilter,
): ShopDesignFamily<T>[] {
  if (form === 'all') return families;
  return families.filter((family) => family.forms.some((entry) => entry.id === form));
}

export function filterFamiliesByDesign<T extends ShopCatalogProduct>(
  families: ShopDesignFamily<T>[],
  design: ShopDesignFilter,
): ShopDesignFamily<T>[] {
  if (design === 'all') return families;
  return families.filter((family) => family.id === design);
}

export function isSizeOptionName(name: string): boolean {
  return /^(size|taille|gr[oö]sse|taglia|talla)$/i.test(name.trim());
}

export function getProductSizeLabels(product: ShopCatalogProduct): string[] {
  const option = product.options?.find(
    (entry) => entry && isSizeOptionName(entry.name),
  );
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const value of option?.optionValues ?? []) {
    const name = value?.name?.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    labels.push(name);
  }

  return sortBySize(labels, (label) => label).slice(0, 8);
}

export function getFamilyPieces<T extends ShopCatalogProduct>(
  family: ShopDesignFamily<T>,
  preferredForm: ShopFormFilter = 'all',
): T[] {
  if (preferredForm === 'all') {
    return family.forms
      .map((entry) => entry.products[0])
      .filter((product): product is T => Boolean(product));
  }

  return (
    family.forms.find((entry) => entry.id === preferredForm)?.products ?? []
  );
}

export function getFamilyCoverProduct<T extends ShopCatalogProduct>(
  family: ShopDesignFamily<T>,
  form: ShopFormFilter = 'all',
): T | undefined {
  if (form !== 'all') {
    const group = family.forms.find((entry) => entry.id === form);
    return (
      group?.products.find((product) => getCatalogImage(product)?.url) ??
      group?.products[0]
    );
  }

  const preferred: ProductFormId[] = ['hoodie', 'tee', 'crew', 'cap'];
  for (const id of preferred) {
    const hit = family.forms
      .find((entry) => entry.id === id)
      ?.products.find((product) => getCatalogImage(product)?.url);
    if (hit) return hit;
  }

  return (
    family.products.find((product) => getCatalogImage(product)?.url) ??
    family.products[0]
  );
}

function catalogProductKey(product: ShopCatalogProduct): string | null {
  return product.id || product.handle || null;
}

/**
 * Compact mixed set for empty-cart rails.
 * Prefers one piece per design family, rotating forms so the grid is not all hoodies.
 */
export function pickShopRecommendations<T extends ShopCatalogProduct>(
  products: T[],
  limit = 4,
): T[] {
  if (limit <= 0 || products.length === 0) return [];

  const families = groupShopFamilies(products).filter(
    (family) => family.products.length > 0,
  );
  const picked: T[] = [];
  const used = new Set<string>();

  const take = (product: T | undefined) => {
    const key = product ? catalogProductKey(product) : null;
    if (!product || !key || used.has(key) || picked.length >= limit) return;
    used.add(key);
    picked.push(product);
  };

  families.forEach((family, index) => {
    const preferred = FORM_ORDER[index % FORM_ORDER.length];
    const rotated = [
      preferred,
      ...FORM_ORDER.filter((id) => id !== preferred),
    ];
    let piece: T | undefined;
    for (const form of rotated) {
      piece = family.forms
        .find((entry) => entry.id === form)
        ?.products.find((product) => {
          const key = catalogProductKey(product);
          return key ? !used.has(key) : false;
        });
      if (piece) break;
    }
    take(
      piece ??
        family.products.find((product) => {
          const key = catalogProductKey(product);
          return key ? !used.has(key) : false;
        }),
    );
  });

  for (const product of products) {
    take(product);
    if (picked.length >= limit) break;
  }

  return picked;
}

/** Back-compat aliases used by older shop chips. */
export type ShopCategoryId = ShopFormFilter;
export const SHOP_CATEGORIES = SHOP_FORM_FILTERS;

export function parseShopCategory(value: string | null | undefined): ShopFormFilter {
  if (value === 'tees') return 'tee';
  if (value === 'hoodies') return 'hoodie';
  if (value === 'crews') return 'crew';
  return parseShopForm(value);
}

export function getProductCategory(product: ShopCatalogProduct): Exclude<ShopFormFilter, 'all'> {
  return getProductForm(product).id;
}

export function countShopCategories(products: ShopCatalogProduct[]) {
  return countShopForms(products);
}

export function filterShopProducts<T extends ShopCatalogProduct>(
  products: T[],
  form: ShopFormFilter,
): T[] {
  if (form === 'all') return products;
  return products.filter((product) => getProductForm(product).id === form);
}
