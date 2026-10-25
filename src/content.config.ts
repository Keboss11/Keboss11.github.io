import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const estado = z.enum(['en curso', 'terminado', 'en pausa', 'por explorar']);

// Una expedición = un proyecto. Archivo: src/content/expediciones/<nombre>.md
const expediciones = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/expediciones' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      habitat: z.string(),
      estado: estado.default('en curso'),
      orden: z.number().default(99),
      inicio: z.coerce.date().optional(),
      material: z.array(z.string()).default([]),
      objetivo: z.string().optional(),
      repo: z.url().optional(),
      foto: image().optional(),
      pieFoto: z.string().optional(),
      pendientes: z.array(z.string()).default([]),
      borrador: z.boolean().default(false),
    }),
});

// Una entrada = un post. Archivo: src/content/entradas/<expedicion>/<nombre>.md
const entradas = defineCollection({
  loader: glob({ pattern: '*/[^_]*.md', base: './src/content/entradas' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      numero: z.number(),
      fecha: z.coerce.date(),
      resumen: z.string().optional(),
      lugar: z.string().optional(),
      clima: z.string().optional(),
      material: z.array(z.string()).default([]),
      aprendido: z.array(z.string()).default([]),
      notas: z.array(z.string()).default([]),
      boceto: image().optional(),
      pieBoceto: z.string().optional(),
      borrador: z.boolean().default(false),
    }),
});

export const collections = { expediciones, entradas };
