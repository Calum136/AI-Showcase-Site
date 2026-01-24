import { z } from 'zod';
import { insertMessageSchema, messages, resumeSchema, portfolioSchema, referencesSchema } from './schema';

export const errorSchemas = {
  internal: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  content: {
    resume: {
      method: 'GET' as const,
      path: '/api/content/resume',
      responses: {
        200: resumeSchema,
        404: errorSchemas.notFound,
      },
    },
    portfolio: {
      method: 'GET' as const,
      path: '/api/content/portfolio',
      responses: {
        200: portfolioSchema,
        404: errorSchemas.notFound,
      },
    },
    references: {
      method: 'GET' as const,
      path: '/api/content/references',
      responses: {
        200: referencesSchema,
        404: errorSchemas.notFound,
      },
    },
  },
  chat: {
    list: {
      method: 'GET' as const,
      path: '/api/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/messages',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        500: errorSchemas.internal,
      },
    }
  }
};
