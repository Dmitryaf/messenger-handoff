import { afterEach, describe, expect, it } from 'vitest';

import type { RuntimeConfig } from '@/config/runtime-config.js';
import { createApp } from './app.js';

const config: RuntimeConfig = {
  databasePath: './data/test.sqlite',
  host: '127.0.0.1',
  logLevel: 'silent',
  nodeEnv: 'test',
  port: 3000,
};

const apps = new Set<ReturnType<typeof createApp>>();

afterEach(async () => {
  await Promise.all([...apps].map(async (app) => app.close()));
  apps.clear();
});

describe('HTTP service status', () => {
  it.each([
    ['/health', 'ok'],
    ['/ready', 'ready'],
  ])('returns %s status', async (url, status) => {
    const app = createApp(config);
    apps.add(app);

    const response = await app.inject({ method: 'GET', url });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status });
  });
});
