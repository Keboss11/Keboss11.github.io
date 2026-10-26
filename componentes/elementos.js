// Elementos que se usan dentro de los posts y de las páginas de proyecto.
import { Componente, definir, donde, estado, esc, FLECHA } from './base.js';

// <nota-margen tinta="azul|roja|lapiz">texto</nota-margen>
// Va justo antes del párrafo al que acompaña. En pantallas anchas sale en la columna de la derecha.
definir('nota-margen', class extends Componente {
  pintar() {
    this.classList.add('margen');
    const tinta = this.getAttribute('tinta');
    if (tinta === 'roja' || tinta === 'lapiz') this.classList.add(tinta);
    this.setAttribute('role', 'note');
  }
});

// <nota-clip titulo="¡OJO!">texto</nota-clip>
definir('nota-clip', class extends Componente {
  pintar() {
    this.classList.add('nota');
    const t = this.getAttribute('titulo');
    if (t) this.insertAdjacentHTML('afterbegin', `<b>${esc(t)}</b> `);
  }
});

// <nota-flecha>anotación a mano con flecha</nota-flecha>
definir('nota-flecha', class extends Componente {
  pintar() {
    this.classList.add('anno');
    this.insertAdjacentHTML('afterbegin', FLECHA);
  }
});

// <foto-polaroid src="/img/x.png" pie="Pie de foto" giro="-3"></foto-polaroid>
definir('foto-polaroid', class extends Componente {
  pintar() {
    const pie = this.getAttribute('pie');
    this.classList.add('polaroid');
    if (this.hasAttribute('giro')) this.style.transform = `rotate(${parseFloat(this.getAttribute('giro'))}deg)`;
    this.setAttribute('role', 'figure');
    this.innerHTML = `<img src="${esc(this.getAttribute('src'))}" alt="${esc(this.getAttribute('alt') ?? pie ?? '')}" loading="lazy">${pie ? `<p>${esc(pie)}</p>` : ''}`;
  }
});

// <foto-pegatina src="/img/x.png" pie="Pie" giro="-6"></foto-pegatina>
// Para imágenes sin fondo (PNG transparente): sin marco, con borde blanco de pegatina.
// <div class="pegatinas"> pone varias en fila, también en el móvil.
definir('foto-pegatina', class extends Componente {
  pintar() {
    const pie = this.getAttribute('pie');
    this.classList.add('pegatina');
    if (this.hasAttribute('giro')) this.style.transform = `rotate(${parseFloat(this.getAttribute('giro'))}deg)`;
    this.setAttribute('role', 'figure');
    this.innerHTML = `<img src="${esc(this.getAttribute('src'))}" alt="${esc(this.getAttribute('alt') ?? pie ?? '')}" loading="lazy">${pie ? `<p>${esc(pie)}</p>` : ''}`;
  }
});

// <video-campo src="/videos/x.mp4" pie="Pie" vertical></video-campo>   vídeo propio
// <video-campo youtube="dQw4w9WgXcQ" pie="Pie"></video-campo>          vídeo de YouTube
// <video-campo pie="Pie" vertical></video-campo>                       hueco «vídeo pendiente»
// vertical → marco de móvil (9:16); sin él, 16:9. Un vídeo vertical en marco horizontal sale con bandas negras.
// poster="/img/x.png" pone una portada al vídeo propio.
definir('video-campo', class extends Componente {
  pintar() {
    const pie = this.getAttribute('pie');
    const src = this.getAttribute('src');
    const yt = this.getAttribute('youtube');
    this.classList.add('video', this.hasAttribute('vertical') ? 'vertical' : 'horizontal');
    this.setAttribute('role', 'figure');
    let pantalla;
    if (src) {
      const poster = this.getAttribute('poster');
      pantalla = `<video src="${esc(src)}" controls preload="metadata" playsinline${poster ? ` poster="${esc(poster)}"` : ''}></video>`;
    } else if (yt) {
      pantalla = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}" title="${esc(pie ?? 'Vídeo')}" loading="lazy"
        allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      this.classList.add('pendiente');
      pantalla = `<div class="hueco"><span class="play" aria-hidden="true">▶</span><span>vídeo pendiente</span></div>`;
    }
    this.innerHTML = `<div class="pantalla">${pantalla}</div>${pie ? `<p>${esc(pie)}</p>` : ''}`;
  }
});

// <boceto-dibujo src="/img/x.svg" pie="Fig. 1 — …"></boceto-dibujo>
definir('boceto-dibujo', class extends Componente {
  pintar() {
    const pie = this.getAttribute('pie');
    this.innerHTML = `<figure class="sketch"><img src="${esc(this.getAttribute('src'))}" alt="${esc(pie ?? 'Boceto')}" loading="lazy">${pie ? `<figcaption class="fig">${esc(pie)}</figcaption>` : ''}</figure>`;
  }
});

// <sello-estado></sello-estado>  (o estado="terminado" para forzarlo)
definir('sello-estado', class extends Componente {
  pintar() {
    const nombre = this.getAttribute('estado') ?? donde().exp?.estado ?? 'en curso';
    this.innerHTML = `<span class="stamp" style="--c:${estado(nombre).color}">${esc(nombre.toUpperCase())}</span>`;
  }
});

// <lista-material><li>…</li></lista-material>   → tarjeta «En la mochila»
const MOCHILA = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="12" width="28" height="32" rx="8" fill="#c8673b"/><rect x="15" y="26" width="18" height="12" rx="3" fill="#a24f2c"/><path d="M18 12 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#7a3a1f" stroke-width="3"/></svg>';
definir('lista-material', class extends Componente {
  pintar() {
    this.classList.add('mochila');
    this.innerHTML = `${MOCHILA}<b>${esc(this.getAttribute('titulo') ?? 'EN LA MOCHILA')}</b><ul>${this.innerHTML}</ul>`;
  }
});

// <lista-aprendido><li>…</li></lista-aprendido>  → post-it «Lo aprendido»
definir('lista-aprendido', class extends Componente {
  pintar() {
    this.classList.add('aprendido');
    this.innerHTML = `<b>${esc(this.getAttribute('titulo') ?? 'LO APRENDIDO')}</b><ul>${this.innerHTML}</ul>`;
  }
});
