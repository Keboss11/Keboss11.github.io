// Componentes que se rellenan solos con datos.js
import {
  Componente, definir, CUADERNO, expediciones, entradasDe, urlExp, urlEnt, orden, donde,
  estado, fecha, dos, esc, FLECHA, SUBRAYADO,
} from './base.js';

const campos = (pares) =>
  `<div class="fields">${pares.filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => v === null ? `<span>${k}</span>` : `<span>${k}<b>${v}</b></span>`).join('')}</div>`;

/* ---------- índice ---------- */

// <campos-cuaderno></campos-cuaderno>
definir('campos-cuaderno', class extends Componente {
  pintar() { this.innerHTML = campos([['CUADERNO', `Nº ${esc(CUADERNO.numero)}`], ['DESDE', esc(CUADERNO.desde)]]); }
});

// <ficha-propietario></ficha-propietario>
definir('ficha-propietario', class extends Componente {
  pintar() {
    const c = CUADERNO;
    this.innerHTML = `<h3 class="tw" style="margin-top:6px">ESTE CUADERNO PERTENECE A</h3>
      <p class="owner">${esc(c.autor)}</p>
      <p>Si lo encuentras, devuélvelo a <a href="${esc(c.contacto.url)}">${esc(c.contacto.texto)}</a>. O léelo, que para eso está.</p>
      <span class="anno">${FLECHA}${esc(c.presentacion)}</span>`;
  }
});

// <indice-expediciones></indice-expediciones>
definir('indice-expediciones', class extends Componente {
  pintar() {
    const exps = expediciones();
    const urls = orden();
    const cabecera = `${campos([['ÍNDICE DE EXPEDICIONES', null]])}<h1 class="title">Proyectos</h1>${SUBRAYADO}`;
    if (!exps.length) {
      this.innerHTML = `${cabecera}<p class="empty">Páginas en blanco… la primera expedición está por empezar.</p>`;
      return;
    }
    this.innerHTML = `${cabecera}<ol class="toc">${exps.map((x) => {
      const n = entradasDe(x).length;
      const e = estado(x.estado);
      return `<li><a href="${urlExp(x)}"><span class="sym" style="color:${e.color}">${e.sym}</span><span class="name">${esc(x.titulo)}</span><span class="dots"></span><span class="pg">p. ${urls.indexOf(urlExp(x)) * 2 + 1}</span></a>
        <small>${esc(x.habitat)} · ${n} ${n === 1 ? 'entrada' : 'entradas'}</small></li>`;
    }).join('')}</ol>`;
  }
});

// <ultimas-entradas cuantas="5"></ultimas-entradas>
definir('ultimas-entradas', class extends Componente {
  pintar() {
    const todas = expediciones().flatMap((x) => entradasDe(x).map((e) => ({ x, e })));
    todas.sort((a, b) => b.e.fecha.localeCompare(a.e.fecha));
    const ultimas = todas.slice(0, Number(this.getAttribute('cuantas') ?? 5));
    if (!ultimas.length) { this.innerHTML = ''; return; }
    this.innerHTML = `<h3 class="tw">ÚLTIMAS ENTRADAS</h3><ul class="recent">${ultimas.map(({ x, e }) =>
      `<li><span class="tw">${fecha(e.fecha)}</span><a href="${urlEnt(x, e)}">${esc(e.titulo)}</a></li>`).join('')}</ul>`;
  }
});

/* ---------- expedición ---------- */

// <campos-expedicion></campos-expedicion>  (página izquierda)
definir('campos-expedicion', class extends Componente {
  pintar() {
    const { exp, n } = donde();
    this.innerHTML = campos([['EXPEDICIÓN', `Nº ${dos(n ?? 0)}`], ['INICIO', fecha(exp?.inicio)]]);
  }
});

// <encabezado-expedicion></encabezado-expedicion>  (página derecha: campos + título)
definir('encabezado-expedicion', class extends Componente {
  pintar() {
    const { exp } = donde();
    this.innerHTML = `${campos([['BITÁCORA', null], ['ENTRADAS', String(entradasDe(exp).length)]])}
      <h1 class="title">${esc(exp?.titulo ?? '')}</h1>${SUBRAYADO}`;
  }
});

// <registro-expedicion></registro-expedicion>  (lista de entradas + pendientes)
definir('registro-expedicion', class extends Componente {
  pintar() {
    const { exp } = donde();
    const lista = entradasDe(exp);
    const pendientes = exp?.pendientes ?? [];
    this.innerHTML = `<h3 class="tw">REGISTRO</h3>${!lista.length && !pendientes.length ? '<p class="empty">Todavía no hay entradas en esta expedición.</p>' : ''}
      <ol class="log">${lista.map((e, i) => `<li><span class="d">${fecha(e.fecha).slice(0, 5)}</span>
        <a href="${urlEnt(exp, e)}">Entrada ${dos(i + 1)} — ${esc(e.titulo)}</a>${e.resumen ? `<p>${esc(e.resumen)}</p>` : ''}</li>`).join('')}
      ${pendientes.map((t) => `<li class="todo"><span class="d">○</span><span class="t">${esc(t)} — por explorar</span></li>`).join('')}</ol>`;
  }
});

/* ---------- entrada ---------- */

// <campos-entrada lugar="escritorio" clima="lluvia ☂"></campos-entrada>  (página izquierda)
definir('campos-entrada', class extends Componente {
  pintar() {
    const { ent, numero } = donde();
    this.innerHTML = campos([
      ['Nº', dos(numero ?? 0)],
      ['FECHA', fecha(ent?.fecha)],
      ['LUGAR', esc(this.getAttribute('lugar') ?? '')],
      ['CLIMA', esc(this.getAttribute('clima') ?? '')],
      ['LECTURA', '<i class="min">1</i> min'],
    ]);
    // el tiempo de lectura se cuenta sobre el texto de la página derecha cuando ya está puesta
    const contar = () => {
      const art = document.querySelector('#R article');
      const palabras = art ? art.textContent.split(/\s+/).filter(Boolean).length : 0;
      const min = this.querySelector('.min');
      if (min) min.textContent = String(Math.max(1, Math.round(palabras / 200)));
    };
    requestAnimationFrame(contar);
    setTimeout(contar, 1300);
  }
});

// <encabezado-entrada></encabezado-entrada>  (página derecha: expedición, nº y título)
definir('encabezado-entrada', class extends Componente {
  pintar() {
    const { exp, ent, numero } = donde();
    if (!exp) return;
    this.innerHTML = `<div class="fields"><span><a href="${urlExp(exp)}">${esc(exp.titulo.toUpperCase())}</a></span><span>ENTRADA<b>${dos(numero)}</b></span></div>
      <h1 class="title" style="font-size:clamp(36px,3.8vw,48px)">${esc(ent.titulo)}</h1>${SUBRAYADO}`;
  }
});

// <navegacion-entradas></navegacion-entradas>  (anterior / siguiente dentro de la expedición)
definir('navegacion-entradas', class extends Componente {
  pintar() {
    const { exp, lista, numero } = donde();
    if (!exp) return;
    const ant = lista[numero - 2], sig = lista[numero];
    this.innerHTML = `<nav class="pager">
      ${ant ? `<a href="${urlEnt(exp, ant)}"><small>← ENTRADA ANTERIOR</small>${esc(ant.titulo)}</a>` : `<a href="${urlExp(exp)}"><small>← EXPEDICIÓN</small>${esc(exp.titulo)}</a>`}
      ${sig ? `<a href="${urlEnt(exp, sig)}" style="text-align:right"><small>SIGUIENTE ENTRADA →</small>${esc(sig.titulo)}</a>` : ''}
    </nav>`;
  }
});
