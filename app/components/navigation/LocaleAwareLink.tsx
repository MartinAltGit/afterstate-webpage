import {Link, type LinkProps, type To} from 'react-router';
import {prefixPathWithLocale, useLocalePathPrefix} from '~/lib/locale';

function localizeTo(to: To, localePrefix: string): To {
  if (typeof to === 'string') {
    return prefixPathWithLocale(to, localePrefix);
  }

  if (to && typeof to === 'object' && 'pathname' in to && to.pathname) {
    return {
      ...to,
      pathname: prefixPathWithLocale(to.pathname, localePrefix),
    };
  }

  return to;
}

/**
 * react-router Link that prefixes absolute paths with the active market locale.
 */
export function LocaleAwareLink({to, ...props}: LinkProps) {
  const localePrefix = useLocalePathPrefix();
  return <Link to={localizeTo(to, localePrefix)} {...props} />;
}
