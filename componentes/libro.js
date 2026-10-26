// <cuaderno-libro>
//   <pagina-izquierda> … </pagina-izquierda>
//   <pagina-derecha> … </pagina-derecha>
// </cuaderno-libro>
//
// Monta el cuaderno alrededor de las dos páginas: cabecera, tapas, esquinas
// dobladas, cinta, números de página y la animación de pasar página.
import { CUADERNO, definir, orden, ruta, donde, esc, BRUJULA } from './base.js';

const movil = () => matchMedia('(max-width: 860px)').matches;
const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };

let sinAnim = leer('animaciones') ? leer('animaciones') === 'no' : matchMedia('(prefers-reduced-motion: reduce)').matches;

class CuadernoLibro extends HTMLElement {
  connectedCallback() {
    if (this.dataset.listo) return;
    const izq = this.querySelector(':scope > pagina-izquierda');
    const der = this.querySelector(':scope > pagina-derecha');
    const nodosIzq = izq ? [...izq.childNodes] : [];
    const nodosDer = der ? [...der.childNodes] : [];
    const titulo = `${CUADERNO.titulo.toUpperCase()} · Nº ${esc(CUADERNO.numero)}`;

    this.innerHTML = `
      <header class="top">
        <a class="brand" href="/">${titulo}</a>
        <nav><a href="/">índice</a><button id="anim" type="button"></button><button id="tema" type="button"></button></nav>
      </header>
      <main class="stage">
        <div class="pages" id="pages">
          <div class="page left" id="L"><div class="pc"></div><span class="pnum"></span></div>
          <div class="page right" id="R"><div class="seam"></div><div class="pc"></div><span class="pnum"></span></div>
          <a class="ribbon" href="/" aria-label="Volver al índice"></a>
        </div>
      </main>
      <p class="help">pasa página con la esquina doblada, las flechas ← → del teclado o deslizando en el móvil</p>`;

    this.pages = this.querySelector('#pages');
    this.L = this.querySelector('#L');
    this.R = this.querySelector('#R');
    this.L.querySelector('.pc').append(...nodosIzq);
    this.R.querySelector('.pc').append(...nodosDer);
    this.dataset.listo = '1';

    this.preferencias();
    this.actualizar();
    this.navegacion();
    this.tapa();
  }

  /* ---------- números de página, esquinas y título ---------- */
  actualizar() {
    const urls = orden();
    const idx = urls.indexOf(ruta());
    this.idx = idx;
    const pagina = Math.max(idx, 0) * 2 + 1;
    this.L.querySelector('.pnum').textContent = pagina;
    this.R.querySelector('.pnum').textContent = pagina + 1;

    this.pages.querySelectorAll(':scope > .dogear').forEach((d) => d.remove());
    const oreja = (clase, href, texto, aria) =>
      this.pages.insertAdjacentHTML('beforeend', `<a class="dogear ${clase}" href="${href}" aria-label="${aria}"><span>${texto}</span></a>`);
    if (idx > 0) oreja('prev', urls[idx - 1], '← atrás', 'Página anterior');
    if (idx >= 0 && idx < urls.length - 1) oreja('next', urls[idx + 1], 'pasa página →', 'Página siguiente');

    const d = donde();
    const nombre = d.ent?.titulo ?? d.exp?.titulo;
    if (nombre) document.title = `${nombre} · ${CUADERNO.titulo}`;
    else if (d.tipo === 'indice') document.title = `${CUADERNO.titulo} · ${CUADERNO.autor}`;
  }

  /* ---------- tema y animaciones ---------- */
  preferencias() {
    const root = document.documentElement;
    const anim = this.querySelector('#anim');
    const tema = this.querySelector('#tema');
    this.pintarAnim = () => { anim.textContent = `${movil() ? 'anim.' : 'animaciones:'} ${sinAnim ? 'no' : 'sí'}`; };
    const pintarTema = () => { tema.textContent = root.dataset.theme === 'dark' ? 'día' : 'noche'; };
    this.pintarAnim();
    pintarTema();
    anim.addEventListener('click', () => { sinAnim = !sinAnim; guardar('animaciones', sinAnim ? 'no' : 'si'); this.pintarAnim(); });
    tema.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      guardar('tema', root.dataset.theme);
      pintarTema();
    });
    let eraMovil = movil();
    addEventListener('resize', () => { if (movil() !== eraMovil) { eraMovil = movil(); this.pintarAnim(); } });
  }

  /* ---------- la hoja que gira ---------- */
  cara(clase, elementos) {
    const f = document.createElement('div');
    f.className = `face ${clase}`;
    for (const el of elementos) {
      const c = el.cloneNode(true);
      c.removeAttribute('id');
      // recuerda hasta dónde estaba leída la página para que la hoja gire tal cual
      const scroll = el.querySelector('.pc')?.scrollTop ?? 0;
      if (scroll) c.querySelector('.pc').dataset.scroll = String(scroll);
      f.append(c);
    }
    f.insertAdjacentHTML('beforeend', '<i class="shade"></i>');
    return f;
  }

  hoja(sobre, origen, frente, dorso) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    const top = this.pages.getBoundingClientRect().top;
    // con scroll por página la hoja mide lo mismo que la página; si no, lo que se ve en pantalla
    const scrollPropio = getComputedStyle(sobre.querySelector('.pc') ?? sobre).overflowY === 'auto';
    const alto = scrollPropio ? sobre.offsetHeight : Math.min(this.pages.clientHeight - sobre.offsetTop * 2, Math.max(innerHeight - top, 400));
    Object.assign(leaf.style, {
      left: `${sobre.offsetLeft}px`, top: `${sobre.offsetTop}px`,
      width: `${sobre.offsetWidth}px`, height: `${alto}px`,
      transformOrigin: `${origen} center`,
    });
    leaf.append(frente, dorso);
    this.pages.append(leaf);
    leaf.querySelectorAll('[data-scroll]').forEach((pc) => { pc.scrollTop = Number(pc.dataset.scroll); });
    return leaf;
  }

  girar(leaf, desde, hasta, fin) {
    const opts = { duration: 950, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' };
    const anim = leaf.animate([
      { transform: `rotateY(${desde}deg)` },
      { transform: `rotateY(${(desde + hasta) / 2}deg) scaleY(1.015)`, offset: 0.5 },
      { transform: `rotateY(${hasta}deg)` },
    ], opts);
    leaf.querySelectorAll('.shade').forEach((s) => s.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], opts));
    const acabar = () => { leaf.remove(); this.terminar = null; fin?.(); };
    this.terminar = () => { anim.cancel(); acabar(); };
    anim.onfinish = acabar;
  }

  // Crea una página (como la de verdad) con contenido nuevo, para la animación
  pagina(lado, html) {
    const p = document.createElement('div');
    p.className = `page ${lado}`;
    p.innerHTML = `${lado === 'right' ? '<div class="seam"></div>' : ''}<div class="pc">${html}</div><span class="pnum"></span>`;
    return p;
  }

  pasar(htmlIzq, htmlDer, dir) {
    this.terminar?.();
    const { L, R } = this;
    const poner = (el, html) => { el.querySelector('.pc').innerHTML = html; el.querySelector('.pc').scrollTop = 0; };
    const nL = this.pagina('left', htmlIzq), nR = this.pagina('right', htmlDer);
    if (sinAnim) { poner(L, htmlIzq); poner(R, htmlDer); return; }

    if (movil()) {
      // una sola hoja: la página entera se va (o vuelve) por la izquierda
      if (dir === 'fwd') {
        const leaf = this.hoja(R, 'left', this.cara('front', [R, L]), this.cara('back bare', []));
        poner(L, htmlIzq); poner(R, htmlDer);
        this.girar(leaf, 0, -180);
      } else {
        const leaf = this.hoja(R, 'left', this.cara('front', [nR, nL]), this.cara('back bare', []));
        this.girar(leaf, -180, 0, () => { poner(L, htmlIzq); poner(R, htmlDer); });
      }
      return;
    }
    if (dir === 'fwd') {
      const leaf = this.hoja(R, 'left', this.cara('front', [R]), this.cara('back', [nL]));
      poner(R, htmlDer);
      this.girar(leaf, 0, -180, () => poner(L, htmlIzq));
    } else {
      const leaf = this.hoja(L, 'right', this.cara('front', [L]), this.cara('back', [nR]));
      poner(L, htmlIzq);
      this.girar(leaf, 0, 180, () => poner(R, htmlDer));
    }
  }

  /* ---------- navegación sin recargar ---------- */
  async ir(url, apilar) {
    let doc;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    } catch {
      location.href = url;
      return;
    }
    const izq = doc.querySelector('cuaderno-libro > pagina-izquierda');
    const der = doc.querySelector('cuaderno-libro > pagina-derecha');
    if (!izq || !der) { location.href = url; return; }

    const antes = this.idx;
    if (apilar) history.pushState({}, '', url);
    document.title = doc.title;
    const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (desc) document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    this.actualizar();
    const dir = this.idx >= 0 && antes >= 0 && this.idx < antes ? 'back' : 'fwd';

    scrollTo({ top: 0, behavior: 'instant' });
    this.pasar(izq.innerHTML, der.innerHTML, dir);
  }

  navegacion() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target || a.hasAttribute('download') || a.origin !== location.origin) return;
      if (/\.(?!html$)[a-z0-9]+$/i.test(a.pathname)) return; // archivos, no páginas
      if (a.pathname === location.pathname) { if (!a.hash) e.preventDefault(); return; }
      e.preventDefault();
      this.ir(a.href, true);
    });
    addEventListener('popstate', () => this.ir(location.href, false));

    const pulsar = (sel) => this.pages.querySelector(sel)?.click();
    addEventListener('keydown', (e) => {
      if (this.pages.classList.contains('closed') || e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') pulsar(':scope > .dogear.next');
      if (e.key === 'ArrowLeft') pulsar(':scope > .dogear.prev');
    });

    let x0 = null;
    this.pages.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    this.pages.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 70) pulsar(dx < 0 ? ':scope > .dogear.next' : ':scope > .dogear.prev');
    });
  }

  /* ---------- tapa: solo al entrar por el índice, una vez por visita ---------- */
  tapa() {
    const yaAbierto = (() => { try { return sessionStorage.getItem('abierto') === '1'; } catch { return true; } })();
    if (this.idx !== 0 || sinAnim || yaAbierto) return;
    const { pages, L, R } = this;
    pages.classList.add('closed');
    const frente = document.createElement('div');
    frente.className = 'face front bare';
    frente.innerHTML = `<div class="cover" role="button" tabindex="0" aria-label="Abrir el cuaderno">
        <i class="band"></i>
        <div class="label"><span class="tw">${CUADERNO.titulo.toUpperCase()} · Nº ${esc(CUADERNO.numero)}</span><b>${esc(CUADERNO.etiqueta)}</b><span class="hand">de ${esc(CUADERNO.autor)}</span></div>
        ${BRUJULA('compass')}
        <span class="hint">toca para abrir</span>
      </div>`;
    const leaf = this.hoja(R, 'left', frente, movil() ? this.cara('back bare', []) : this.cara('back', [L]));
    const abrir = () => {
      if (!pages.classList.contains('closed')) return;
      try { sessionStorage.setItem('abierto', '1'); } catch { /* da igual */ }
      pages.classList.replace('closed', 'opening');
      this.girar(leaf, 0, -180, () => pages.classList.remove('opening'));
    };
    leaf.addEventListener('click', abrir);
    leaf.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
    addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') abrir(); });
    leaf.querySelector('.cover')?.focus({ preventScroll: true });
  }
}

definir('cuaderno-libro', CuadernoLibro);
