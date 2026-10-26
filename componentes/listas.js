// Listas que se rellenan solas con datos.js
import { Componente, definir, expediciones, entradasDe, urlExp, urlEnt, donde, estado, fecha, dos, esc } from './base.js';

const fila = (x, e, etiqueta) => `<a class="post aparece" href="${urlEnt(x, e)}">
  <time datetime="${e.fecha}">${fecha(e.fecha)}</time>
  <div><h3>${esc(e.titulo)}</h3>${e.resumen ? `<p>${esc(e.resumen)}</p>` : ''}</div>
  <span class="exp">${esc(etiqueta)}</span>
</a>`;

// <lista-proyectos></lista-proyectos>  (índice: una tarjeta por expedición, con sus paradas hechas y pendientes)
definir('lista-proyectos', class extends Componente {
  pintar() {
    const exps = expediciones();
    if (!exps.length) { this.innerHTML = '<p class="vacio">La primera expedición está por empezar.</p>'; return; }
    this.innerHTML = `<div class="proyectos">${exps.map((x) => {
      const n = entradasDe(x).length, p = x.pendientes?.length ?? 0;
      const puntos = Array.from({ length: n + p }, (_, i) => `<i class="${i < n ? 'hecho' : ''}"></i>`).join('<b></b>');
      return `<a class="proyecto aparece" href="${urlExp(x)}">
        <span class="stamp" style="--c:${estado(x.estado).color}">${esc(x.estado.toUpperCase())}</span>
        <span class="meta">${esc(x.habitat.toUpperCase())} · DESDE ${esc(fecha(x.inicio).toUpperCase())}</span>
        <h3>${esc(x.titulo)}</h3>
        <p>${n} ${n === 1 ? 'post' : 'posts'} · ${p} por escribir</p>
        <div class="puntos">${puntos}</div>
      </a>`;
    }).join('')}</div>`;
  }
});

// <ultimos-posts cuantas="5"></ultimos-posts>  (índice: los más recientes de todas las expediciones)
definir('ultimos-posts', class extends Componente {
  pintar() {
    const todas = expediciones().flatMap((x) => entradasDe(x).map((e) => ({ x, e })));
    todas.sort((a, b) => b.e.fecha.localeCompare(a.e.fecha));
    const ultimas = todas.slice(0, Number(this.getAttribute('cuantas') ?? 5));
    this.innerHTML = ultimas.length
      ? `<div class="posts">${ultimas.map(({ x, e }) => fila(x, e, x.titulo)).join('')}</div>`
      : '<p class="vacio">Todavía no hay posts.</p>';
  }
});

// <registro-expedicion></registro-expedicion>  (página de una expedición: sus posts y los pendientes)
definir('registro-expedicion', class extends Componente {
  pintar() {
    const { exp } = donde();
    if (!exp) return;
    const lista = entradasDe(exp);
    const pendientes = exp.pendientes ?? [];
    this.innerHTML = `<h2 id="paradas">Las paradas</h2>
      ${!lista.length && !pendientes.length ? '<p class="vacio">Todavía no hay posts en esta expedición.</p>' : ''}
      <div class="posts">
        ${lista.map((e, i) => fila(exp, e, `parada ${dos(i + 1)}`)).join('')}
        ${pendientes.map((t) => `<div class="post pendiente"><time>pronto</time><div><h3>${esc(t)}</h3></div><span class="exp">por escribir</span></div>`).join('')}
      </div>`;
  }
});
