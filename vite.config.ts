import {fileURLToPath} from 'node:url';
import {defineConfig, type Plugin} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';

type DevCssHooks = {
  getCriticalCss?: (...args: unknown[]) => unknown;
};

type DevHookGlobals = typeof globalThis & {
  __remix_devServerHooks?: DevCssHooks;
  __reactRouterDevServerHooks?: DevCssHooks;
};

/**
 * Hydrogen still forwards critical CSS through `__remix_devServerHooks`.
 * React Router 7 reads `__reactRouterDevServerHooks`. Without this alias,
 * SSR HTML ships without CSS-module styles and the first paint looks crashed
 * until client JS injects them (~0.5s).
 */
function afterstateCriticalCssHooks(): Plugin {
  const alias = () => {
    const g = globalThis as DevHookGlobals;
    const fromRouter = g.__reactRouterDevServerHooks?.getCriticalCss;
    if (!fromRouter) return;
    g.__remix_devServerHooks = {
      ...g.__remix_devServerHooks,
      getCriticalCss: (...args: unknown[]) => fromRouter(...args),
    };
  };

  return {
    name: 'afterstate-critical-css-hooks',
    configureServer() {
      alias();
      return () => alias();
    },
  };
}

export default defineConfig({
  plugins: [hydrogen(), oxygen(), reactRouter(), afterstateCriticalCssHooks()],
  resolve: {
    alias: {
      // Vite's native tsconfig path resolver does not cover JavaScript
      // projects that use jsconfig.json, so define Hydrogen's app alias here.
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
    tsconfigPaths: true,
  },
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
    // One CSS bundle — stops React Router from unloading per-route
    // stylesheets on navigation (Back often left pages unstyled until reload).
    // Supported by React Router 7.7+ (#13943).
    cssCodeSplit: false,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        'react-router > set-cookie-parser',
        'react-router > cookie',
        'react-router',
      ],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
    watch: {
      // Do not watch binary mockups. On Windows, attaching fs.watch to a JPEG
      // that is still being written throws EBUSY and kills Hydrogen. Polling
      // the same tree is worse — it restats every image and retriggers SSR.
      ignored: ['**/app/assets/**', '**/_candidates/**'],
    },
  },
});
