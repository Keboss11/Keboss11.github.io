import { getCollection, type CollectionEntry } from 'astro:content';

export type Expedicion = CollectionEntry<'expediciones'>;
export type Entrada = CollectionEntry<'entradas'>;

// Los borradores se ven en local (npm run dev) pero no se publican.
const visible = (e: { data: { borrador: boolean } }) => !(import.meta.env.PROD && e.data.borrador);

export const ESTADOS = {
  'en curso': { sym: '~', color: 'var(--red)' },
  terminado: { sym: '✓', color: 'var(--green)' },
  'en pausa': { sym: '‖', color: 'var(--muted)' },
  'por explorar': { sym: '○', color: 'var(--muted)' },
} as const;

export const expDe = (e: Entrada) => e.id.split('/')[0];
export const slugDe = (e: Entrada) => e.id.split('/').slice(1).join('/');
export const urlExp = (id: string) => `/expediciones/${id}/`;
export const urlEnt = (e: Entrada) => `/expediciones/${expDe(e)}/${slugDe(e)}/`;

export async function expediciones() {
  return (await getCollection('expediciones', visible)).sort((a, b) => a.data.orden - b.data.orden);
}

export async function entradas(exp?: string) {
  const todas = await getCollection('entradas', visible);
  return (exp ? todas.filter((e) => expDe(e) === exp) : todas).sort((a, b) => a.data.numero - b.data.numero);
}

// Orden lineal de páginas: índice → expedición → sus entradas → siguiente expedición…
export async function orden() {
  const urls = ['/'];
  for (const x of await expediciones()) {
    urls.push(urlExp(x.id));
    for (const e of await entradas(x.id)) urls.push(urlEnt(e));
  }
  return urls;
}

export async function vecinos(url: string) {
  const urls = await orden();
  const idx = urls.indexOf(url);
  return {
    idx,
    prev: idx > 0 ? urls[idx - 1] : null,
    next: idx >= 0 && idx < urls.length - 1 ? urls[idx + 1] : null,
    pagina: Math.max(idx, 0) * 2 + 1,
  };
}

export const fecha = (d?: Date) =>
  d ? d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.') : '';

export const minutos = (texto = '') => Math.max(1, Math.round(texto.split(/\s+/).filter(Boolean).length / 200));

export const dos = (n: number) => String(n).padStart(2, '0');
