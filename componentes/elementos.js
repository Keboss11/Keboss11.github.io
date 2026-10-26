// Elementos de cuaderno que se usan dentro de las páginas.
import { Componente, definir, donde, estado, esc, FLECHA, SUBRAYADO, BRUJULA } from './base.js';

// <titulo-pagina>Texto</titulo-pagina>  (añade "pequeno" para títulos largos)
definir('titulo-pagina', class extends Componente {
  pintar() {
    const estilo = this.hasAttribute('pequeno') ? ' style="font-size:clamp(36px,3.8vw,48px)"' : '';
    this.innerHTML = `<h1 class="title"${estilo}>${this.innerHTML}</h1>${SUBRAYADO}`;
  }
});

// <titulo-seccion>MATERIAL</titulo-seccion>
definir('titulo-seccion', class extends Componente {
  pintar() { this.innerHTML = `<h3 class="tw">${this.innerHTML}</h3>`; }
});

// <nota-margen lado="derecha|izquierda" tinta="azul|roja|lapiz">texto</nota-margen>
definir('nota-margen', class extends Componente {
  pintar() {
    const lado = this.getAttribute('lado') === 'izquierda' ? 'izquierda' : 'derecha';
    this.classList.add('margen', lado);
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

// <ficha-especimen material="Kotlin, Compose"></ficha-especimen>
// titulo y habitat salen de datos.js si no los pones
definir('ficha-especimen', class extends Componente {
  pintar() {
    const { exp } = donde();
    const titulo = this.getAttribute('titulo') ?? exp?.titulo ?? '';
    const habitat = this.getAttribute('habitat') ?? exp?.habitat ?? '';
    const material = this.getAttribute('material');
    this.innerHTML = `<div class="specimen"><dl>
      <dt>ESPÉCIMEN</dt><dd>${esc(titulo)}</dd>
      ${habitat ? `<dt>HÁBITAT</dt><dd>${esc(habitat)}</dd>` : ''}
      ${material ? `<dt>MATERIAL</dt><dd>${esc(material)}</dd>` : ''}
    </dl></div>`;
  }
});

// <sello-estado></sello-estado>  (o estado="terminado" para forzarlo)
definir('sello-estado', class extends Componente {
  pintar() {
    const nombre = this.getAttribute('estado') ?? donde().exp?.estado ?? 'en curso';
    this.innerHTML = `<span class="stamp" style="--c:${estado(nombre).color}">${esc(nombre.toUpperCase())}</span>`;
  }
});

// <lista-material><li>…</li></lista-material>   → casillas marcadas
definir('lista-material', class extends Componente {
  pintar() { this.innerHTML = `<ul class="check">${this.innerHTML}</ul>`; }
});

// <lista-aprendido><li>…</li></lista-aprendido>  → apuntes a mano
definir('lista-aprendido', class extends Componente {
  pintar() { this.innerHTML = `<ul class="learned">${this.innerHTML}</ul>`; }
});

// <leyenda-estados></leyenda-estados>
definir('leyenda-estados', class extends Componente {
  pintar() {
    this.classList.add('legend');
    this.innerHTML = `<h3 class="tw">LEYENDA</h3><ul>
      <li><span class="sym">✓</span> expedición terminada</li><li><span class="sym">~</span> en curso</li>
      <li><span class="sym">‖</span> en pausa</li><li><span class="sym">○</span> por explorar</li></ul>`;
  }
});

// <brujula-dibujo></brujula-dibujo>
definir('brujula-dibujo', class extends Componente {
  pintar() { this.innerHTML = BRUJULA(); }
});
