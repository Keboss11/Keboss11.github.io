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
  'en curso': { color: 'var(--accent)' },
  terminado: { color: 'var(--green)' },
  'en pausa': { color: 'var(--muted)' },
  'por explorar': { color: 'var(--muted)' },
};
export const estado = (nombre) => ESTADOS[nombre] ?? ESTADOS['en curso'];

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
  iso ? new Date(`${iso}T00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
export const fechaLarga = (iso) =>
  iso ? new Date(`${iso}T00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
export const dos = (n) => String(n).padStart(2, '0');
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Dibujos a mano reutilizados
export const FLECHA = '<svg viewBox="0 0 44 26" aria-hidden="true"><path d="M2 22 C 14 4, 30 2, 42 8 M42 8 l-9 -3 M42 8 l-5 8"/></svg>';

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
