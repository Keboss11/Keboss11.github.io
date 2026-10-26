// Utilidades compartidas por todos los componentes.
import { CUADERNO, EXPEDICIONES } from '/datos.js';

export { CUADERNO };

export const enLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const visible = (x) => enLocal || !x.borrador;

export const expediciones = () => EXPEDICIONES.filter(visible);
export const entradasDe = (x) => (x?.entradas ?? []).filter(visible);
export const urlExp = (x) => `/expediciones/${x.id}/`;
export const urlEnt = (x, e) => `/expediciones/${x.id}/${e.id}/`;

export const ESTADOS = {
  'en curso': { sym: '~', color: 'var(--red)' },
  terminado: { sym: '✓', color: 'var(--green)' },
  'en pausa': { sym: '‖', color: 'var(--muted)' },
  'por explorar': { sym: '○', color: 'var(--muted)' },
};
export const estado = (nombre) => ESTADOS[nombre] ?? ESTADOS['en curso'];

// Orden lineal de páginas: índice → expedición → sus entradas → siguiente expedición…
export function orden() {
  const urls = ['/'];
  for (const x of expediciones()) {
    urls.push(urlExp(x));
    for (const e of entradasDe(x)) urls.push(urlEnt(x, e));
  }
  return urls;
}

export function ruta() {
  let p = decodeURI(location.pathname).replace(/index\.html$/, '');
  if (!p.endsWith('/')) p += '/';
  return p;
}

// Qué página es la actual: el índice, una expedición o una entrada
export function donde() {
  const [, tipo, idExp, idEnt] = ruta().split('/');
  if (!tipo) return { tipo: 'indice' };
  const exps = expediciones();
  const exp = tipo === 'expediciones' ? exps.find((x) => x.id === idExp) : undefined;
  if (!exp) return { tipo: 'otra' };
  const n = exps.indexOf(exp) + 1;
  if (!idEnt) return { tipo: 'expedicion', exp, n };
  const lista = entradasDe(exp);
  const ent = lista.find((e) => e.id === idEnt);
  return ent ? { tipo: 'entrada', exp, n, ent, numero: lista.indexOf(ent) + 1, lista } : { tipo: 'otra' };
}

export const fecha = (iso) =>
  iso ? new Date(`${iso}T00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.') : '';
export const dos = (n) => String(n).padStart(2, '0');
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Dibujos a mano reutilizados
export const FLECHA = '<svg viewBox="0 0 44 26" aria-hidden="true"><path d="M2 22 C 14 4, 30 2, 42 8 M42 8 l-9 -3 M42 8 l-5 8"/></svg>';
export const SUBRAYADO = '<svg class="under" viewBox="0 0 200 12" aria-hidden="true"><path d="M2 7 C 40 2, 80 11, 120 6 S 180 3, 198 7" stroke="var(--red)" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
export const BRUJULA = (clase = 'compass') => `<svg class="${clase}" viewBox="0 0 80 80" aria-hidden="true">
  <circle cx="40" cy="40" r="30"/><circle cx="40" cy="40" r="26" stroke-dasharray="2 4"/>
  <path d="M40 14 L46 40 L40 66 L34 40Z"/><path d="M40 14 L46 40 L34 40Z" style="fill:var(--red);stroke:none"/>
  <text x="37" y="9">N</text></svg>`;

// Base de los componentes: se dibujan una sola vez, aunque se muevan o se clonen.
export class Componente extends HTMLElement {
  connectedCallback() {
    if (this.dataset.listo) return;
    this.dataset.listo = '1';
    this.pintar();
  }
  pintar() {}
}

export const definir = (nombre, clase) => customElements.get(nombre) || customElements.define(nombre, clase);
