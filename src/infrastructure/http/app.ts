import Fastify, { type FastifyInstance } from 'fastify';

import type { RuntimeConfig } from '@/config/runtime-config.js';

export function createApp(config: RuntimeConfig): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.logLevel,
    },
  });

  app.get('/health', () => ({ status: 'ok' }));
  app.get('/ready', () => ({ status: 'ready' }));

  return app;
}
