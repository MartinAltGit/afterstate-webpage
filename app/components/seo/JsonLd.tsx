type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function JsonLdScript({data}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

export type OrganizationJsonLdProps = {
  name?: string;
  url: string;
  logoUrl?: string;
  sameAs?: string[];
  description?: string;
};

export function OrganizationJsonLd({
  name = 'Afterstate',
  url,
  logoUrl,
  sameAs,
  description = 'Afterstate — life beyond the rush.',
}: OrganizationJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    description,
  };
  if (logoUrl) data.logo = logoUrl;
  if (sameAs?.length) data.sameAs = sameAs;
  return <JsonLdScript data={data} />;
}

export type ProductJsonLdProps = {
  name: string;
  description?: string;
  url: string;
  image?: string | string[];
  sku?: string;
  brand?: string;
  priceCurrency?: string;
  price?: string;
  availability?:
    | 'InStock'
    | 'OutOfStock'
    | 'PreOrder'
    | 'LimitedAvailability';
};

export function ProductJsonLd({
  name,
  description,
  url,
  image,
  sku,
  brand = 'Afterstate',
  priceCurrency,
  price,
  availability = 'InStock',
}: ProductJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
  };
  if (description) data.description = description;
  if (image) data.image = image;
  if (sku) data.sku = sku;
  if (price && priceCurrency) {
    data.offers = {
      '@type': 'Offer',
      url,
      priceCurrency,
      price,
      availability: `https://schema.org/${availability}`,
    };
  }
  return <JsonLdScript data={data} />;
}

export type ProductGroupJsonLdProps = {
  name: string;
  description?: string;
  url: string;
  brand?: string;
  variants: Array<{
    name: string;
    url: string;
    sku?: string;
    image?: string;
    price?: string;
    priceCurrency?: string;
  }>;
};

export function ProductGroupJsonLd({
  name,
  description,
  url,
  brand = 'Afterstate',
  variants,
}: ProductGroupJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name,
    url,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    hasVariant: variants.map((variant) => {
      const item: Record<string, unknown> = {
        '@type': 'Product',
        name: variant.name,
        url: variant.url,
        brand: {'@type': 'Brand', name: brand},
      };
      if (variant.sku) item.sku = variant.sku;
      if (variant.image) item.image = variant.image;
      if (variant.price && variant.priceCurrency) {
        item.offers = {
          '@type': 'Offer',
          url: variant.url,
          price: variant.price,
          priceCurrency: variant.priceCurrency,
          availability: 'https://schema.org/InStock',
        };
      }
      return item;
    }),
  };
  if (description) data.description = description;
  return <JsonLdScript data={data} />;
}

export type BreadcrumbJsonLdItem = {
  name: string;
  url: string;
};

export type BreadcrumbJsonLdProps = {
  items: BreadcrumbJsonLdItem[];
};

export function BreadcrumbJsonLd({items}: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLdScript data={data} />;
}

export type ArticleJsonLdProps = {
  headline: string;
  description?: string;
  url: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
};

export function ArticleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'Afterstate',
  publisherName = 'Afterstate',
  publisherLogoUrl,
}: ArticleJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    url,
    mainEntityOfPage: url,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      ...(publisherLogoUrl
        ? {logo: {'@type': 'ImageObject', url: publisherLogoUrl}}
        : {}),
    },
  };
  if (description) data.description = description;
  if (image) data.image = image;
  if (datePublished) data.datePublished = datePublished;
  if (dateModified) data.dateModified = dateModified;
  return <JsonLdScript data={data} />;
}
