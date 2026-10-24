// Navegación con animación de pasar página.
// Sin JavaScript, el cuaderno funciona igual con enlaces normales.

const pages = document.getElementById('pages') as HTMLElement;
const L = document.getElementById('L') as HTMLElement;
const R = document.getElementById('R') as HTMLElement;
const root = document.documentElement;
const movil = () => matchMedia('(max-width: 860px)').matches;

const leer = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const guardar = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };

/* ---------- preferencias ---------- */
const prefAnim = leer('animaciones');
let sinAnim = prefAnim ? prefAnim === 'no' : matchMedia('(prefers-reduced-motion: reduce)').matches;
const botonAnim = document.getElementById('anim') as HTMLButtonElement;
const pintarAnim = () => { botonAnim.textContent = `${movil() ? 'anim.' : 'animaciones:'} ${sinAnim ? 'no' : 'sí'}`; };
pintarAnim();
botonAnim.addEventListener('click', () => { sinAnim = !sinAnim; guardar('animaciones', sinAnim ? 'no' : 'si'); pintarAnim(); });

const botonTema = document.getElementById('tema') as HTMLButtonElement;
const pintarTema = () => { botonTema.textContent = root.dataset.theme === 'dark' ? 'día' : 'noche'; };
pintarTema();
botonTema.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  guardar('tema', root.dataset.theme);
  pintarTema();
});

/* ---------- la hoja que gira ---------- */
let terminar: (() => void) | null = null;

function cara(clase: string, elementos: HTMLElement[]) {
  const f = document.createElement('div');
  f.className = `face ${clase}`;
  for (const el of elementos) {
    const c = el.cloneNode(true) as HTMLElement;
    c.removeAttribute('id');
    f.append(c);
  }
  const sombra = document.createElement('i');
  sombra.className = 'shade';
  f.append(sombra);
  return f;
}

function hoja(sobre: HTMLElement, origen: 'left' | 'right', frente: HTMLElement, dorso: HTMLElement) {
  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  const top = pages.getBoundingClientRect().top;
  const alto = Math.min(pages.clientHeight - sobre.offsetTop * 2, Math.max(innerHeight - top, 400));
  Object.assign(leaf.style, {
    left: `${sobre.offsetLeft}px`, top: `${sobre.offsetTop}px`,
    width: `${sobre.offsetWidth}px`, height: `${alto}px`,
    transformOrigin: `${origen} center`,
  });
  leaf.append(frente, dorso);
  pages.append(leaf);
  return leaf;
}

function girar(leaf: HTMLElement, desde: number, hasta: number, fin?: () => void) {
  const opts: KeyframeAnimationOptions = { duration: 950, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' };
  const anim = leaf.animate([
    { transform: `rotateY(${desde}deg)` },
    { transform: `rotateY(${(desde + hasta) / 2}deg) scaleY(1.015)`, offset: 0.5 },
    { transform: `rotateY(${hasta}deg)` },
  ], opts);
  leaf.querySelectorAll('.shade').forEach((s) => s.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], opts));
  const acabar = () => { leaf.remove(); terminar = null; fin?.(); };
  terminar = () => { anim.cancel(); acabar(); };
  anim.onfinish = acabar;
}

function pasar(nuevoL: HTMLElement, nuevoR: HTMLElement, dir: 'fwd' | 'back') {
  terminar?.();
  const poner = (el: HTMLElement, nuevo: HTMLElement) => { el.innerHTML = nuevo.innerHTML; };
  if (sinAnim) { poner(L, nuevoL); poner(R, nuevoR); return; }

  if (movil()) {
    // una sola hoja: la página entera se va (o vuelve) por la izquierda
    if (dir === 'fwd') {
      const leaf = hoja(R, 'left', cara('front', [R, L]), cara('back bare', []));
      poner(L, nuevoL); poner(R, nuevoR);
      girar(leaf, 0, -180);
    } else {
      const leaf = hoja(R, 'left', cara('front', [nuevoR, nuevoL]), cara('back bare', []));
      girar(leaf, -180, 0, () => { poner(L, nuevoL); poner(R, nuevoR); });
    }
    return;
  }
  if (dir === 'fwd') {
    const leaf = hoja(R, 'left', cara('front', [R]), cara('back', [nuevoL]));
    poner(R, nuevoR);
    girar(leaf, 0, -180, () => poner(L, nuevoL));
  } else {
    const leaf = hoja(L, 'right', cara('front', [L]), cara('back', [nuevoR]));
    poner(L, nuevoL);
    girar(leaf, 0, 180, () => poner(R, nuevoR));
  }
}

/* ---------- navegación ---------- */
const idx = (el: HTMLElement | null) => Number(el?.dataset.idx ?? -1);

async function ir(url: string, apilar: boolean) {
  let doc: Document;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    doc = new DOMParser().parseFromString(await res.text(), 'text/html');
  } catch {
    location.href = url;
    return;
  }
  const nuevas = doc.getElementById('pages');
  const nL = doc.getElementById('L');
  const nR = doc.getElementById('R');
  if (!nuevas || !nL || !nR) { location.href = url; return; }

  const actual = idx(pages), destino = idx(nuevas);
  const dir = destino >= 0 && actual >= 0 && destino < actual ? 'back' : 'fwd';
  if (apilar) history.pushState({}, '', url);
  document.title = doc.title;
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
  if (desc) document.querySelector('meta[name="description"]')?.setAttribute('content', desc);

  pages.dataset.idx = String(destino);
  pages.querySelectorAll(':scope > .dogear').forEach((d) => d.remove());
  nuevas.querySelectorAll(':scope > .dogear').forEach((d) => pages.append(d.cloneNode(true)));

  scrollTo({ top: 0, behavior: 'instant' });
  pasar(nL, nR, dir);
}

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target || a.hasAttribute('download') || a.origin !== location.origin) return;
  if (/\.[a-z0-9]+$/i.test(a.pathname)) return; // archivos, no páginas
  if (a.pathname === location.pathname) { if (!a.hash) e.preventDefault(); return; }
  e.preventDefault();
  ir(a.href, true);
});
addEventListener('popstate', () => ir(location.href, false));

const pulsar = (sel: string) => (pages.querySelector(sel) as HTMLElement | null)?.click();
addEventListener('keydown', (e) => {
  if (pages.classList.contains('closed') || (e.target as HTMLElement).closest('input, textarea, select')) return;
  if (e.key === 'ArrowRight') pulsar(':scope > .dogear.next');
  if (e.key === 'ArrowLeft') pulsar(':scope > .dogear.prev');
});

let x0: number | null = null;
pages.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
pages.addEventListener('touchend', (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  x0 = null;
  if (Math.abs(dx) > 70) pulsar(dx < 0 ? ':scope > .dogear.next' : ':scope > .dogear.prev');
});

let eraMovil = movil();
addEventListener('resize', () => { if (movil() !== eraMovil) { eraMovil = movil(); pintarAnim(); } });

/* ---------- tapa: solo al entrar por el índice, una vez por visita ---------- */
const yaAbierto = (() => { try { return sessionStorage.getItem('abierto') === '1'; } catch { return true; } })();
if (idx(pages) === 0 && !sinAnim && !yaAbierto) {
  const tpl = document.getElementById('tpl-tapa') as HTMLTemplateElement;
  pages.classList.add('closed');
  const frente = document.createElement('div');
  frente.className = 'face front bare';
  frente.append(tpl.content.cloneNode(true));
  const leaf = hoja(R, 'left', frente, movil() ? cara('back bare', []) : cara('back', [L]));
  const abrir = () => {
    if (!pages.classList.contains('closed')) return;
    try { sessionStorage.setItem('abierto', '1'); } catch { /* da igual */ }
    pages.classList.replace('closed', 'opening');
    girar(leaf, 0, -180, () => pages.classList.remove('opening'));
  };
  leaf.addEventListener('click', abrir);
  leaf.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
  addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') abrir(); });
  (leaf.querySelector('.cover') as HTMLElement | null)?.focus({ preventScroll: true });
}
