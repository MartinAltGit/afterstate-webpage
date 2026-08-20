import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';
import {
  applyStorefrontPasswordResponseHeaders,
  gateStorefrontPassword,
  isStorefrontPasswordEnabled,
} from '~/lib/storefront-password';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Hydrogen request handler that internally
       * delegates to React Router for routing and rendering.
       */
      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const blocked = await gateStorefrontPassword(
        request,
        env,
        hydrogenContext.session,
      );
      if (blocked) {
        if (hydrogenContext.session.isPending) {
          blocked.headers.set(
            'Set-Cookie',
            await hydrogenContext.session.commit(),
          );
        }
        return blocked;
      }

      const response = await handleRequest(request);
      const headers = new Headers(response.headers);

      if (isStorefrontPasswordEnabled(env)) {
        applyStorefrontPasswordResponseHeaders(headers);
      }

      if (hydrogenContext.session.isPending) {
        headers.set('Set-Cookie', await hydrogenContext.session.commit());
      }

      const nextResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

      if (nextResponse.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response: nextResponse,
          storefront: hydrogenContext.storefront,
        });
      }

      return nextResponse;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
