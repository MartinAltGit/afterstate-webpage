#!/usr/bin/env bash
set -euo pipefail

# Cloud Agent install step for the Afterstate Hydrogen storefront.
# Runs from the repository root after checkout. Must be idempotent.

# 1. Install JS dependencies from the committed lockfile.
npm ci

# 2. Playwright browser + system libraries for the e2e suite (tests/e2e).
#    Uses --with-deps so a fresh base image also gets the required system libs.
npx playwright install --with-deps chromium

# 3. Afterstate serves Mock.shop catalog data by default (no linked store).
#    Hydrogen still requires SESSION_SECRET to sign session cookies, so generate
#    a local dev-only value when the developer has not pulled real Oxygen env
#    vars into .env yet. Never overwrite an existing .env.
if [ ! -f .env ]; then
  printf 'SESSION_SECRET=%s\n' "$(openssl rand -hex 32)" > .env
fi
