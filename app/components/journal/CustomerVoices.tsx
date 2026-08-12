export type CustomerVoice = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  city?: string;
};

export type CustomerVoicesProps = {
  eyebrow?: string;
  title?: string;
  voices?: CustomerVoice[];
  className?: string;
};

/**
 * Customer quote carousel. Renders nothing until we have real, attributable
 * quotes — invented names/cities must not appear as reviews.
 */
export function CustomerVoices(_props: CustomerVoicesProps) {
  return null;
}
