// <pagina-web> … contenido … </pagina-web>
// Envuelve el contenido de cada página y pone alrededor lo demás según dónde estés (lo saca de la URL y de datos.js):
//   índice      → cabecera y pie; el contenido va tal cual (el campamento y las secciones)
//   expedición  → banda con el sendero de sus posts, ruta lateral y el texto del proyecto
//   entrada     → banda con el caminante en su parada, ruta lateral con las secciones, el texto y «siguiente parada»
//   otra (404)  → banda sin sendero con titulo="…" y etiqueta="…"
// En las entradas, lugar="escritorio" y clima="…" salen junto a la fecha.
import { Componente, definir, CUADERNO, donde, entradasDe, urlExp, urlEnt, fechaLarga, dos, esc } from './base.js';

const LUNA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

// Mateo en pequeño, con la mochila y su pin de Pokéball
const CAMINANTE = `<svg viewBox="0 0 60 110">
  <rect x="9" y="44" width="15" height="28" rx="5" fill="#c8673b"/>
  <circle cx="16.5" cy="58" r="4" fill="#fff"/><path d="M12.5 58 a4 4 0 0 1 8 0z" fill="#e0402f"/><circle cx="16.5" cy="58" r="1.3" fill="#fff" stroke="#2b201b" stroke-width=".8"/>
  <path d="M26 78 L22 102 M34 78 L38 102" stroke="#3a3f4f" stroke-width="8" stroke-linecap="round"/>
  <path d="M14 104 h12 M34 104 h12" stroke="#e9e4da" stroke-width="6" stroke-linecap="round"/>
  <path d="M20 46 Q30 38 42 46 L44 82 L18 82Z" fill="#34343d"/>
  <path d="M36 50 Q44 62 44 74" stroke="#26262d" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="27" y="34" width="8" height="10" rx="3" fill="#e4b393"/>
  <circle cx="32" cy="22" r="16" fill="#f3cbab"/>
  <g fill="#2b201b"><circle cx="20" cy="18" r="8"/><circle cx="26" cy="10" r="8"/><circle cx="35" cy="7" r="8"/><circle cx="43" cy="12" r="7"/><circle cx="17" cy="27" r="6"/><circle cx="40" cy="16" r="5"/><circle cx="46" cy="19" r="3.5"/></g>
  <ellipse cx="24" cy="26" rx="3.5" ry="4.5" fill="#e4b393"/>
  <ellipse cx="41" cy="26" rx="1.5" ry="2" fill="#2b201b"/><path d="M37 24 L45 23.6" stroke="#2b201b" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const PAISAJE = `<svg class="fondo" viewBox="0 0 1440 480" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <g class="estrellas"></g>
  <circle cx="1180" cy="120" r="46" fill="var(--sun)" opacity=".9"/>
  <path fill="var(--m1)" d="M0 330 L140 250 L260 290 L400 200 L520 270 L640 230 L780 150 L900 250 L1020 210 L1150 290 L1270 200 L1440 260 L1440 480 L0 480Z"/>
  <path fill="var(--m2)" d="M0 370 L170 300 L310 360 L460 290 L600 360 L760 320 L900 380 L1050 300 L1200 360 L1340 300 L1440 340 L1440 480 L0 480Z"/>
  <g class="pinos" fill="var(--m3)"></g>
  <path fill="var(--ground)" d="M0 410 Q360 380 720 396 T1440 390 L1440 480 L0 480Z"/>
</svg>`;

const NS = 'http://www.w3.org/2000/svg';
const corto = (t) => t.split(':')[0];

function cabecera(enIndice) {
  const ir = (id) => (enIndice ? `#${id}` : `/#${id}`);
  return `<header class="cabecera">
    <a class="brand" href="/"><b>${esc(CUADERNO.autor)}</b><span>${esc(CUADERNO.titulo.toLowerCase())}</span></a>
    <nav>
      <a href="${ir('sobre-mi')}" class="extra">sobre mí</a>
      <a href="${ir('proyectos')}">proyectos</a>
      <a href="${ir('posts')}">posts</a>
      <button class="tema" type="button"></button>
    </nav>
  </header>`;
}

const pie = () => `<footer class="pie" id="contacto">
  <span class="hand">${esc(CUADERNO.autor)} · ${esc(CUADERNO.titulo.toLowerCase())}</span>
  <span><a href="${esc(CUADERNO.contacto.url)}">${esc(CUADERNO.contacto.texto)}</a> · desde ${esc(CUADERNO.desde)}</span>
</footer>`;

// La banda de arriba: paisaje, título y (en expediciones y entradas) el sendero con una parada por post
function banda({ etiqueta, enlace, titulo, meta, paradas, aqui }) {
  const x = (i) => 12 + (i * 76) / Math.max(1, paradas.length - 1);
  const sendero = paradas ? `<div class="sendero">
      <svg viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 92 Q240 70 480 88 T960 84 T1450 80" fill="none" stroke="#fff2d6" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".7"/></svg>
      ${paradas.map((p, i) => `<${p.url ? `a href="${p.url}"` : 'span'} class="parada ${p.url ? 'hecha' : 'pendiente'}${p.actual ? ' actual' : ''}" style="left:${x(i)}%" title="${esc(p.titulo)}">
        <span>${p.actual ? 'estás aquí' : p.url ? esc(corto(p.titulo)) : 'próximamente'}</span></${p.url ? 'a' : 'span'}>`).join('')}
      <div class="caminante" style="left:${x(Math.max(0, aqui))}%" aria-hidden="true">${CAMINANTE}</div>
    </div>` : '';
  return `<div class="banda">${PAISAJE}
    <div class="cabeza-post">
      ${etiqueta ? `<${enlace ? `a href="${enlace}"` : 'span'} class="exp">${esc(etiqueta)}</${enlace ? 'a' : 'span'}>` : ''}
      <h1>${esc(titulo)}</h1>
      ${meta ? `<div class="meta">${meta}</div>` : ''}
    </div>
    ${sendero}
  </div>`;
}

// Ruta lateral: los posts de la expedición; en una entrada, también sus secciones
function rutaLateral(exp, ent, h2s) {
  const lista = entradasDe(exp);
  return `<aside class="ruta" aria-label="Ruta de la expedición">
    <div class="titulo-ruta">LA RUTA DE ${esc(exp.titulo.toUpperCase())}</div>
    <ol>
      ${lista.map((e) => e === ent
        ? `<li class="actual"><span class="punto"></span><a href="#">${esc(corto(e.titulo))}</a>
            ${h2s.length ? `<ol class="secciones">${h2s.map((h) => `<li><a href="#${h.id}">${esc(h.textContent)}</a></li>`).join('')}</ol>` : ''}</li>`
        : `<li class="hecha"><span class="punto"></span><a href="${urlEnt(exp, e)}">${esc(corto(e.titulo))}</a></li>`).join('')}
      ${(exp.pendientes ?? []).map((t) => `<li class="pendiente"><span class="punto"></span>${esc(t)}<br><small>por escribir</small></li>`).join('')}
    </ol>
    <a class="volver" href="${ent ? urlExp(exp) : '/'}">← ${ent ? 'la expedición' : 'volver al campamento'}</a>
  </aside>`;
}

function siguiente(exp, lista, numero) {
  const ant = lista[numero - 2], sig = lista[numero], prox = exp.pendientes?.[0];
  return `<nav class="siguiente" aria-label="Otras paradas">
    ${ant ? `<a href="${urlEnt(exp, ant)}"><small>← PARADA ANTERIOR</small><strong>${esc(ant.titulo)}</strong></a>`
          : `<a href="${urlExp(exp)}"><small>← LA EXPEDICIÓN</small><strong>${esc(exp.titulo)}</strong></a>`}
    ${sig ? `<a class="der" href="${urlEnt(exp, sig)}"><small>SIGUIENTE PARADA →</small><strong>${esc(sig.titulo)}</strong></a>`
          : prox ? `<div class="der prox"><small>SIGUIENTE PARADA</small><strong>${esc(prox)}</strong><em>todavía por escribir</em></div>` : ''}
  </nav>`;
}

// ids para los h2 (para enlazarlos desde la ruta lateral)
function marcarSecciones(art, numerar) {
  const h2s = [...art.querySelectorAll(':scope > h2')];
  h2s.forEach((h, i) => {
    h.id ||= h.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    if (numerar) h.dataset.n = dos(i + 1);
  });
  return h2s;
}

definir('pagina-web', class extends Componente {
  pintar() {
    const d = donde();
    const contenido = [...this.childNodes];
    this.innerHTML = '';

    if (d.tipo === 'indice') {
      this.insertAdjacentHTML('beforeend', cabecera(true));
      const main = document.createElement('main');
      main.append(...contenido);
      this.append(main);
      this.insertAdjacentHTML('beforeend', pie());
    } else {
      const art = document.createElement('article');
      art.className = 'prose';
      art.append(...contenido);
      const { exp, ent } = d;
      let datosBanda, lateral = '';

      if (d.tipo === 'entrada') {
        const h2s = marcarSecciones(art, true);
        const palabras = art.textContent.split(/\s+/).filter(Boolean).length;
        const lugar = this.getAttribute('lugar'), clima = this.getAttribute('clima');
        datosBanda = {
          etiqueta: `${exp.titulo.toUpperCase()} · PARADA ${dos(d.numero)}`, enlace: urlExp(exp), titulo: ent.titulo,
          meta: [fechaLarga(ent.fecha), `${Math.max(1, Math.round(palabras / 220))} min de lectura`, lugar && `desde ${esc(lugar)}`, clima && esc(clima)]
            .filter(Boolean).map((m) => `<span>${m}</span>`).join(''),
          paradas: [...d.lista.map((e) => ({ titulo: e.titulo, url: urlEnt(exp, e), actual: e === ent })), ...(exp.pendientes ?? []).map((t) => ({ titulo: t }))],
          aqui: d.numero - 1,
        };
        lateral = rutaLateral(exp, ent, h2s);
        art.insertAdjacentHTML('beforeend', siguiente(exp, d.lista, d.numero));
      } else if (d.tipo === 'expedicion') {
        marcarSecciones(art, false);
        const lista = entradasDe(exp);
        datosBanda = {
          etiqueta: `EXPEDICIÓN ${dos(d.n)} · ${exp.habitat.toUpperCase()}`, titulo: exp.titulo,
          meta: `<span>desde el ${fechaLarga(exp.inicio)}</span><span>${lista.length} ${lista.length === 1 ? 'post' : 'posts'}</span>
            <span class="stamp" style="--c:var(--scene-ink)">${esc(exp.estado.toUpperCase())}</span>`,
          paradas: [...lista.map((e) => ({ titulo: e.titulo, url: urlEnt(exp, e) })), ...(exp.pendientes ?? []).map((t) => ({ titulo: t }))],
          aqui: lista.length - 1,
        };
        lateral = rutaLateral(exp, null, []);
      } else {
        datosBanda = { etiqueta: this.getAttribute('etiqueta'), titulo: this.getAttribute('titulo') ?? '' };
      }

      this.insertAdjacentHTML('beforeend', `<div class="progreso"></div>${cabecera(false)}${banda(datosBanda)}
        <div class="cuerpo${lateral ? '' : ' sin-ruta'}">${lateral}</div>${pie()}`);
      this.querySelector('.cuerpo').append(art);
      if (d.tipo === 'entrada') this.seguirLectura(art);
    }

    this.pintarPaisaje();
    this.activarCabecera();
    this.activarAparecer();
  }

  // estrellas y pinos de la banda, con un poco de azar para que no se vean en fila
  pintarPaisaje() {
    const fondo = this.querySelector('.banda svg.fondo');
    if (!fondo) return;
    const nuevo = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
    const estrellas = fondo.querySelector('.estrellas');
    for (let i = 0; i < 60; i++) estrellas.append(nuevo('circle', { cx: Math.random() * 1440, cy: Math.random() * 260, r: Math.random() * 1.4 + .4, fill: '#fff' }));
    const pinos = fondo.querySelector('.pinos');
    for (let x = -20; x < 1480; x += 30 + Math.random() * 50) {
      if (x > 260 && x < 1160 && Math.random() > .25) continue;
      const h = 50 + Math.random() * 60;
      pinos.append(nuevo('path', { d: `M${x} 412 l${-h * .3} 0 l${h * .3} ${-h} l${h * .3} ${h}z` }));
    }
  }

  // la cabecera es transparente sobre el paisaje y se vuelve sólida al bajar; el botón cambia día/noche
  activarCabecera() {
    const cab = this.querySelector('.cabecera');
    const escena = this.querySelector('.hero, .banda');
    const alScroll = () => cab.classList.toggle('solid', !escena || scrollY > escena.offsetHeight - 80);
    addEventListener('scroll', alScroll, { passive: true });
    alScroll();

    const root = document.documentElement;
    const boton = cab.querySelector('.tema');
    const pintar = () => {
      const noche = root.dataset.theme === 'dark';
      boton.innerHTML = noche ? SOL : LUNA;
      boton.setAttribute('aria-label', noche ? 'Cambiar a modo día' : 'Cambiar a modo noche');
    };
    boton.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('tema', root.dataset.theme); } catch (e) {}
      pintar();
    });
    pintar();
  }

  // barra de progreso arriba y la sección en la que estás marcada en la ruta lateral
  seguirLectura(art) {
    const barra = this.querySelector('.progreso');
    const h2s = [...art.querySelectorAll(':scope > h2')];
    const enlaces = [...this.querySelectorAll('.secciones a')];
    const alScroll = () => {
      const fin = art.offsetTop + art.offsetHeight - innerHeight;
      barra.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / fin))})`;
      let aqui = -1;
      h2s.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .4) aqui = i; });
      enlaces.forEach((a, i) => { a.classList.toggle('leida', i < aqui); a.classList.toggle('aqui', i === aqui); });
    };
    addEventListener('scroll', alScroll, { passive: true });
    alScroll();
  }

  // lo que lleva class="aparece" entra con un fundido al llegar a ello
  activarAparecer() {
    requestAnimationFrame(() => {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
      }), { threshold: .15 });
      this.querySelectorAll('.aparece').forEach((e, i) => { e.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(e); });
    });
  }
});
