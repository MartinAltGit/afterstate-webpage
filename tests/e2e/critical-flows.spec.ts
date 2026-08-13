import {expect, test, type Page, type Locator} from '@playwright/test';

/**
 * Critical storefront flows against Mock.shop / linked Hydrogen store.
 * Selectors prefer roles and visible copy (Afterstate, Shop, Cart, etc.).
 */

async function goHome(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Afterstate'}).first()).toBeVisible();
}

async function openShop(page: Page) {
  await page
    .getByRole('navigation', {name: 'Primary'})
    .getByRole('link', {name: 'Shop'})
    .click();
  await expect(page).toHaveURL(/\/(collections\/all|shop)/);
}

async function firstProductLink(page: Page): Promise<Locator> {
  const inMain = page.locator('main a[href*="/products/"]');
  if ((await inMain.count()) > 0) return inMain.first();
  return page.locator('a[href*="/products/"]').first();
}

async function openFirstProduct(page: Page) {
  const link = await firstProductLink(page);
  await expect(link).toBeVisible({timeout: 30_000});
  await link.click();
  await expect(page).toHaveURL(/\/products\//);
}

async function selectAvailableSizeIfPresent(page: Page) {
  const sizeFieldset = page
    .locator('fieldset')
    .filter({has: page.getByText(/size/i)})
    .first();
  if ((await sizeFieldset.count()) === 0) {
    test.info().annotations.push({
      type: 'note',
      description: 'No size options on this product',
    });
    return;
  }

  const unselected = sizeFieldset.locator(
    'button[aria-pressed="false"]:not([disabled])',
  );
  if ((await unselected.count()) > 0) {
    await unselected.first().click();
    return;
  }

  const any = sizeFieldset.getByRole('button').filter({hasNotText: /unavailable/i});
  if ((await any.count()) > 0) {
    await any.first().click();
  }
}

async function addToCart(page: Page) {
  const add = page.getByRole('button', {name: /add to cart/i}).first();
  await expect(add).toBeVisible();
  if (await add.isDisabled()) {
    test.skip(true, 'Add to cart disabled (sold out or options incomplete)');
  }
  await add.click();
}

async function openCartDrawer(page: Page) {
  await page.getByRole('button', {name: /^Cart/i}).first().click();
  await expect(
    page.getByRole('region', {name: 'Cart'}).or(page.locator('[aria-label="Cart"]')),
  ).toBeVisible({timeout: 15_000});
}

test.describe('Critical storefront flows', () => {
  test('1. homepage loads and shows Afterstate', async ({page}) => {
    await goHome(page);
    await expect(page.getByText('Afterstate').first()).toBeVisible();
  });

  test('2-4. navigation, shop/collection, and product page', async ({page}) => {
    await goHome(page);
    await openShop(page);

    const product = await firstProductLink(page);
    if ((await product.count()) === 0) {
      test.skip(true, 'No Afterstate catalog products published yet');
    }

    await expect.soft(product).toBeVisible({timeout: 30_000});

    await openFirstProduct(page);
    await expect(
      page.getByRole('button', {name: /add to cart|sold out/i}).first(),
    ).toBeVisible();
  });

  test('5-10. variant, cart add/qty/remove, discount, checkout', async ({
    page,
  }) => {
    await goHome(page);
    await openShop(page);
    const catalogProduct = await firstProductLink(page);
    if ((await catalogProduct.count()) === 0) {
      test.skip(true, 'No Afterstate catalog products published yet');
    }
    await openFirstProduct(page);

    await selectAvailableSizeIfPresent(page);

    const otherOptions = page
      .locator('fieldset')
      .filter({hasNot: page.getByText(/size/i)});
    if ((await otherOptions.count()) > 0) {
      const btn = otherOptions
        .first()
        .locator('button[aria-pressed="false"]:not([disabled])')
        .first();
      if ((await btn.count()) > 0) await btn.click();
    }

    await addToCart(page);

    const cartRegion = page
      .getByRole('region', {name: 'Cart'})
      .or(page.locator('[aria-label="Cart"]'));
    if (!(await cartRegion.isVisible().catch(() => false))) {
      await openCartDrawer(page);
    }

    await expect(
      page.getByText(/Qty\s+\d+/i).first(),
    ).toBeVisible({timeout: 20_000});

    const increase = page.getByRole('button', {name: /increase quantity/i});
    if ((await increase.count()) > 0) {
      await expect.soft(increase.first()).toBeEnabled();
      await increase.first().click();
      await expect
        .soft(page.getByText(/Qty\s+[2-9]/i).first())
        .toBeVisible({timeout: 10_000});
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'No quantity controls',
      });
    }

    const discount = page
      .getByLabel(/discount code/i)
      .or(page.getByPlaceholder(/^Code$/i));
    await expect.soft(discount.first()).toBeVisible();

    const checkout = page.getByRole('link', {name: /checkout/i});
    await expect.soft(checkout.first()).toBeVisible();

    const remove = page.getByRole('button', {name: /^Remove$/i});
    if ((await remove.count()) > 0) {
      await remove.first().click();
      await expect
        .soft(page.getByText(/your cart is empty/i))
        .toBeVisible({timeout: 15_000});
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'No remove control',
      });
    }
  });

  test('11. search page loads', async ({page}) => {
    await page.goto('/search');
    await expect(page).toHaveURL(/\/search/);
    await expect(page.getByRole('heading', {name: 'Search', level: 1})).toBeVisible();
    await expect(
      page.getByRole('main').getByRole('searchbox', {name: 'Search'}),
    ).toBeVisible({timeout: 15_000});
  });

  test('12. market selector present', async ({page}) => {
    await goHome(page);
    const trigger = page.getByRole('button', {name: /Market:/i}).or(
      page.locator('summary[aria-label^="Market:"]'),
    );
    await expect(trigger.first()).toBeVisible();
    await trigger.first().click();
    const menu = page.getByRole('listbox', {name: 'Market'});
    await expect(menu).toBeVisible();
    await expect.soft(menu.getByRole('link', {name: 'EU'})).toBeVisible();
    await expect.soft(menu.getByRole('link', {name: 'GB'})).toBeVisible();
    await expect.soft(menu.getByRole('link', {name: 'DE'})).toBeVisible();
  });

  test('13. invalid product returns 404', async ({page}) => {
    const response = await page.goto(
      '/products/this-product-definitely-does-not-exist-afterstate-e2e',
    );
    expect(response?.status()).toBeGreaterThanOrEqual(400);
    await expect
      .soft(page.getByText(/not found|404|page.*(exist|found)/i).first())
      .toBeVisible({timeout: 10_000});
  });

  test('14. sitemap responds', async ({request}) => {
    const candidates = ['/sitemap.xml', '/en-gb/sitemap.xml'];
    let ok = false;
    let lastStatus = 0;
    for (const path of candidates) {
      const res = await request.get(path);
      lastStatus = res.status();
      if (res.ok()) {
        const ct = res.headers()['content-type'] ?? '';
        expect.soft(ct).toMatch(/xml|text/i);
        const body = await res.text();
        expect.soft(body.length).toBeGreaterThan(0);
        ok = true;
        break;
      }
    }
    expect(ok, `sitemap.xml not OK (last status ${lastStatus})`).toBeTruthy();
  });

  test('15. robots.txt responds', async ({request}) => {
    const res = await request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/User-agent|Sitemap/i);
    expect(body).not.toMatch(/afterstate\.storeS/i);
    expect(body).not.toMatch(/Disallow:\s*\/policies\//);
  });

  test('16. product page includes JSON-LD structured data', async ({page}) => {
    await goHome(page);
    await openShop(page);
    const catalogProduct = await firstProductLink(page);
    if ((await catalogProduct.count()) === 0) {
      test.skip(true, 'No Afterstate catalog products published yet');
    }
    await openFirstProduct(page);

    const ld = page.locator('script[type="application/ld+json"]');
    const count = await ld.count();
    expect
      .soft(count, 'expected at least one application/ld+json script')
      .toBeGreaterThan(0);

    if (count > 0) {
      const raw = await ld.first().textContent();
      expect(raw?.trim().length).toBeGreaterThan(2);
      expect(() => JSON.parse(raw!)).not.toThrow();
    }
  });
});
