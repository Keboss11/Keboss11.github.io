// <lobby-campamento></lobby-campamento>
// La portada: el campamento con Mateo junto a la hoguera. Cada objeto lleva a una sección del índice
// (la tienda a «sobre mí», la radio al contacto, el tablón a los posts y el mapa a los proyectos)
// y al pasar por encima el post-it de arriba da un adelanto sacado de datos.js.
import { Componente, definir, CUADERNO, expediciones, entradasDe } from './base.js';

const NS = 'http://www.w3.org/2000/svg';
const FLECHA_ABAJO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
const FLECHA_DCHA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const ESCENA = `<svg class="escena" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" role="group" aria-label="Campamento: elige a dónde ir">
  <defs>
    <radialGradient id="g-fuego"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset=".4" stop-color="#ff7a3d" stop-opacity=".35"/><stop offset="1" stop-color="#ff7a3d" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-tienda"><stop offset="0" stop-color="#ffd27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-sol"><stop offset=".55" stop-color="var(--sun)"/><stop offset=".6" stop-color="var(--sun)" stop-opacity=".25"/><stop offset="1" stop-color="var(--sun)" stop-opacity="0"/></radialGradient>
    <linearGradient id="g-llama" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff6a2b"/><stop offset=".6" stop-color="#ffae3b"/><stop offset="1" stop-color="#ffe08a"/></linearGradient>
  </defs>

  <g class="estrellas" id="estrellas"></g>
  <g class="capa" data-p="4"><circle cx="1110" cy="190" r="110" fill="url(#g-sol)"/></g>

  <g class="capa" data-p="8">
    <path fill="var(--m1)" d="M0 520 L120 430 L230 470 L360 360 L470 440 L560 400 L700 300 L830 410 L940 370 L1060 450 L1180 340 L1310 430 L1440 380 L1440 800 L0 800Z"/>
    <path fill="var(--sun)" opacity=".55" d="M700 300 L740 330 L722 336 L705 322 L690 340 L668 328Z M1180 340 L1215 365 L1195 368 L1180 356 L1166 372 L1150 362Z"/>
  </g>
  <g class="capa" data-p="14">
    <path fill="var(--m2)" d="M0 560 L150 470 L280 540 L420 450 L560 540 L700 480 L860 560 L1000 470 L1140 540 L1290 460 L1440 530 L1440 800 L0 800Z"/>
  </g>
  <g class="capa" data-p="22" id="pinos-fondo" fill="var(--m3)"></g>
  <g class="capa" data-p="30">
    <path fill="var(--ground)" d="M0 640 Q360 600 720 620 T1440 610 L1440 800 L0 800Z"/>
    <ellipse class="resplandor" cx="800" cy="660" rx="380" ry="120" fill="url(#g-fuego)"/>

    <!-- tienda: sobre mí -->
    <a class="sitio" href="#sobre-mi" data-k="sobre" aria-label="Sobre mí">
      <g class="obj">
        <ellipse cx="320" cy="668" rx="190" ry="16" fill="#000" opacity=".18"/>
        <path d="M160 668 L320 430 L480 668Z" fill="#c8673b"/>
        <path d="M320 430 L480 668 L410 668Z" fill="#a24f2c"/>
        <ellipse class="luz-tienda" cx="320" cy="610" rx="120" ry="70" fill="url(#g-tienda)" style="opacity: var(--glow)"/>
        <path d="M282 668 L320 520 L358 668Z" fill="#ffd27a" class="luz-tienda"/>
        <path d="M320 520 L282 668 L262 668 Q300 590 320 520Z" fill="#8a3f22"/>
        <path d="M320 430 L320 410" stroke="#5a3a24" stroke-width="5" stroke-linecap="round"/>
        <path d="M320 412 l26 8 l-26 8z" fill="#f3e3a0"/>
        <path d="M160 668 L120 690 M480 668 L520 690" stroke="#e6d6b2" stroke-width="2" opacity=".7"/>
      </g>
      <path class="flecha" d="M168 410 Q205 380 250 470 m-14 -8 l14 8 l3 -16"/>
      <text class="anota" x="70" y="395">sobre mí</text>
    </a>

    <!-- radio: contacto -->
    <a class="sitio" href="#contacto" data-k="contacto" aria-label="Contacto">
      <g class="obj">
        <rect x="470" y="628" width="86" height="46" rx="4" fill="#8a5d3b"/>
        <path d="M470 645 h86 M470 660 h86" stroke="#6d4a2e" stroke-width="2"/>
        <rect x="482" y="592" width="62" height="38" rx="7" fill="#3e5c6e"/>
        <circle cx="499" cy="611" r="10" fill="#26404f"/><circle cx="499" cy="611" r="4" fill="#9fc2d4"/>
        <rect x="515" y="601" width="22" height="7" rx="2" fill="#ffd27a"/>
        <rect x="515" y="614" width="22" height="3" rx="1" fill="#26404f"/>
        <path d="M538 592 L560 548" stroke="#26404f" stroke-width="3" stroke-linecap="round"/>
        <circle cx="560" cy="548" r="4" fill="#e05a3a"/>
        <path class="ondas" d="M572 540 q8 8 0 16 M580 532 q14 16 0 32" fill="none" stroke="var(--scene-ink)" stroke-width="2" stroke-linecap="round"/>
      </g>
      <path class="flecha" d="M540 470 Q500 500 512 580 m-10 -12 l10 12 l8 -14"/>
      <text class="anota" x="500" y="455">contacto</text>
    </a>

    <!-- yo -->
    <g aria-hidden="true" id="yo">
      <rect x="586" y="626" width="150" height="34" rx="16" fill="#6d4a2e"/>
      <ellipse cx="736" cy="643" rx="10" ry="17" fill="#b98a5b"/><ellipse cx="736" cy="643" rx="5" ry="9" fill="none" stroke="#8a5d3b" stroke-width="1.5"/>
      <path d="M640 620 L700 616 Q714 616 714 630 L716 638 L640 640Z" fill="#3a3f4f"/>
      <path d="M694 618 L716 618 L722 676 L702 676Z" fill="#3a3f4f"/>
      <path d="M696 672 h34 q8 0 8 8 v4 h-42z" fill="#e9e4da"/><path d="M696 680 h42" stroke="#c9423a" stroke-width="3"/>
      <path d="M612 628 C606 590 616 552 636 540 L664 540 C684 552 690 590 684 628Z" fill="var(--sudadera)"/>
      <path d="M618 552 Q646 530 674 550 L664 562 Q646 550 628 562Z" fill="var(--sudadera2)"/>
      <path d="M652 554 l-2 20 M662 554 l2 18" stroke="#9a9aa3" stroke-width="2" stroke-linecap="round"/>
      <g class="cabeza">
        <rect x="641" y="516" width="16" height="24" rx="6" fill="#e4b393"/>
        <circle cx="652" cy="490" r="34" fill="#f3cbab"/>
        <g fill="#2b201b">
          <circle cx="622" cy="480" r="18"/><circle cx="632" cy="462" r="18"/><circle cx="650" cy="453" r="18"/>
          <circle cx="669" cy="457" r="16"/><circle cx="684" cy="470" r="12"/><circle cx="614" cy="500" r="13"/>
          <circle cx="620" cy="516" r="9"/><circle cx="664" cy="471" r="11"/><circle cx="678" cy="480" r="9"/><circle cx="688" cy="487" r="6"/>
          <circle cx="606" cy="486" r="7"/><circle cx="640" cy="440" r="7"/><circle cx="662" cy="440" r="6"/>
        </g>
        <ellipse cx="632" cy="500" rx="7" ry="9" fill="#e4b393"/>
        <path d="M666 490 L680 489" stroke="#2b201b" stroke-width="2" stroke-linecap="round"/>
        <ellipse class="ojo" cx="673" cy="503" rx="2.8" ry="3.8" fill="#2b201b"/>
        <path d="M665 499 L681 498" stroke="#2b201b" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M686 506 q3 3 0 5" stroke="#d29a7a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M676 521 q4 -2 8 0" stroke="#a0614a" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
      <path d="M664 556 Q690 590 712 570" stroke="var(--sudadera)" stroke-width="17" fill="none" stroke-linecap="round"/>
      <g transform="rotate(-18 712 566)">
        <rect x="690" y="550" width="48" height="34" rx="3" fill="#7d5a37"/>
        <rect x="693" y="552" width="42" height="29" rx="2" fill="#f6f0df"/>
        <path d="M699 560 h28 M699 566 h22 M699 572 h26" stroke="#b5a98d" stroke-width="1.5"/>
      </g>
      <g class="lapiz"><path d="M712 560 L736 540" stroke="#e8b84a" stroke-width="5" stroke-linecap="round"/><path d="M712 560 l-3 3" stroke="#2e2620" stroke-width="3"/></g>
      <path d="M672 560 Q700 600 720 572" stroke="var(--sudadera2)" stroke-width="15" fill="none" stroke-linecap="round"/>
      <!-- la taza de la bola de dragón -->
      <path class="vapor" d="M600 640 q-5 -8 0 -16 t0 -16" stroke="#fff2d6" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path class="vapor b" d="M610 642 q-5 -8 0 -16 t0 -16" stroke="#fff2d6" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M616 656 a7 7 0 1 1 0 12" stroke="#f4f0e8" stroke-width="3.5" fill="none"/>
      <rect x="592" y="648" width="26" height="30" rx="4" fill="#f4f0e8"/>
      <circle cx="605" cy="662" r="7" fill="#f39a1e"/><circle cx="605" cy="662" r="2" fill="#d6331f"/>
    </g>

    <!-- hoguera -->
    <g aria-hidden="true">
      <path d="M760 676 L846 650 M760 650 L846 676" stroke="#5a3a24" stroke-width="12" stroke-linecap="round"/>
      <g fill="#7b7466"><circle cx="752" cy="676" r="9"/><circle cx="772" cy="682" r="8"/><circle cx="834" cy="682" r="8"/><circle cx="854" cy="676" r="9"/></g>
      <path class="llama" d="M803 664 C770 640 782 600 800 570 C806 600 834 610 826 640 C822 656 814 662 803 664Z" fill="url(#g-llama)"/>
      <path class="llama b" d="M790 664 C772 650 776 626 786 612 C792 632 806 638 802 656Z" fill="#ff8a3d"/>
      <path class="llama c" d="M806 664 C796 652 800 632 812 618 C816 636 830 646 818 660Z" fill="#ffd36b"/>
      <g fill="#ffcf6b" id="chispas"></g>
    </g>

    <!-- tablón: posts -->
    <a class="sitio" href="#posts" data-k="posts" aria-label="Posts">
      <g class="obj">
        <ellipse cx="1020" cy="672" rx="110" ry="10" fill="#000" opacity=".18"/>
        <path d="M950 500 L938 672 M1090 500 L1102 672" stroke="#5a3a24" stroke-width="9" stroke-linecap="round"/>
        <rect x="922" y="472" width="196" height="140" rx="6" fill="#7a5531"/>
        <rect x="932" y="482" width="176" height="120" rx="3" fill="#c49763"/>
        <g transform="rotate(-6 970 530)"><rect x="944" y="496" width="56" height="58" fill="#f6e7a6"/><path d="M952 512 h38 M952 522 h30 M952 532 h36" stroke="#a4925a" stroke-width="2"/></g>
        <g transform="rotate(5 1046 528)"><rect x="1012" y="494" width="64" height="74" fill="#fffdf7"/><rect x="1018" y="500" width="52" height="46" fill="#7fa1b8"/><path d="M1018 546 l18 -20 l12 12 l8 -8 l14 16z" fill="#4f7a3a"/></g>
        <g transform="rotate(-3 1080 570)"><rect x="1062" y="552" width="40" height="40" fill="#f5c4b3"/><path d="M1068 566 h26 M1068 576 h18" stroke="#b07a66" stroke-width="2"/></g>
        <g transform="rotate(4 975 580)"><rect x="950" y="562" width="52" height="32" fill="#e8f0d8"/><path d="M956 574 h38 M956 582 h28" stroke="#8aa36d" stroke-width="2"/></g>
        <g fill="#d9472b"><circle cx="972" cy="500" r="4.5"/><circle cx="1044" cy="498" r="4.5"/><circle cx="1082" cy="556" r="4.5"/><circle cx="976" cy="566" r="4.5"/></g>
      </g>
      <path class="flecha" d="M1060 420 Q1040 440 1036 466 m-10 -12 l10 12 l10 -11"/>
      <text class="anota" x="1050" y="410">posts</text>
    </a>

    <!-- mapa: proyectos -->
    <a class="sitio" href="#proyectos" data-k="proyectos" aria-label="Proyectos">
      <g class="obj">
        <ellipse cx="1245" cy="680" rx="100" ry="10" fill="#000" opacity=".18"/>
        <path d="M1170 628 L1160 680 M1320 628 L1330 680" stroke="#5a3a24" stroke-width="9" stroke-linecap="round"/>
        <rect x="1150" y="614" width="190" height="16" rx="4" fill="#7a5531"/>
        <path d="M1166 614 L1180 566 L1222 578 L1264 562 L1308 574 L1326 614Z" fill="#efe1bd"/>
        <path d="M1222 578 L1214 614 M1264 562 L1268 614" stroke="#cdb98a" stroke-width="1.5"/>
        <path d="M1186 600 q20 -18 40 -6 t40 -12 t32 4" fill="none" stroke="#c8582f" stroke-width="2.5" stroke-dasharray="4 5"/>
        <path d="M1292 578 l10 10 m0 -10 l-10 10" stroke="#c8582f" stroke-width="3" stroke-linecap="round"/>
        <path d="M1196 590 l6 -12 l6 12z M1236 584 l5 -10 l5 10z" fill="#4f7a3a"/>
      </g>
      <path class="flecha" d="M1310 470 Q1300 520 1270 552 m4 -14 l-4 14 l14 -2"/>
      <text class="anota" x="1250" y="458">proyectos</text>
    </a>
  </g>
  <g class="capa" data-p="44" id="pinos-delante" fill="var(--tree)"></g>
</svg>`;

definir('lobby-campamento', class extends Componente {
  pintar() {
    const tactil = matchMedia('(hover: none)').matches;
    this.innerHTML = `<div class="hero-wrap">
      <div class="hero">${ESCENA}</div>
      <div class="desliza">desliza para explorar ${FLECHA_DCHA}</div>
      <div class="pista" aria-live="polite"><small>BIENVENIDO AL CAMPAMENTO</small><span>${tactil ? 'Toca algo del campamento para ir ahí.' : 'Pasa el ratón por el campamento y elige a dónde ir.'}</span></div>
      <a class="bajar" href="#sobre-mi">o baja ${FLECHA_ABAJO}</a>
    </div>`;
    this.decorar();
    this.activar();
  }

  // estrellas, pinos y chispas, con algo de azar
  decorar() {
    const nuevo = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
    const estrellas = this.querySelector('#estrellas');
    for (let i = 0; i < 90; i++) {
      const s = nuevo('circle', { cx: Math.random() * 1440, cy: Math.random() * 420, r: Math.random() * 1.6 + .4, fill: '#fff', class: 'estrella' });
      s.style.animationDelay = -Math.random() * 3 + 's';
      estrellas.append(s);
    }
    const pino = (x, y, h) => nuevo('path', { d: `M${x} ${y} l${-h * .32} 0 l${h * .2} ${-h * .35} l${-h * .12} 0 l${h * .18} ${-h * .32} l${-h * .08} 0 l${h * .14} ${-h * .33} l${h * .14} ${h * .33} l${-h * .08} 0 l${h * .18} ${h * .32} l${-h * .12} 0 l${h * .2} ${h * .35}z` });
    const fondo = this.querySelector('#pinos-fondo');
    for (let x = -20; x < 1480; x += 34 + Math.random() * 40) if (x < 120 || x > 1360 || Math.random() < .35) fondo.append(pino(x, 640 + Math.random() * 10, 70 + Math.random() * 70));
    const delante = this.querySelector('#pinos-delante');
    [[-30, 820, 330], [60, 830, 240], [1400, 820, 320], [1480, 830, 260]].forEach(([x, y, h]) => delante.append(pino(x, y, h)));
    const chispas = this.querySelector('#chispas');
    for (let i = 0; i < 12; i++) {
      const c = nuevo('circle', { cx: 790 + Math.random() * 26, cy: 610, r: Math.random() * 1.8 + 1, class: 'chispa' });
      c.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      c.style.animationDelay = -Math.random() * 2.6 + 's';
      c.style.animationDuration = 2 + Math.random() * 1.5 + 's';
      chispas.append(c);
    }
  }

  activar() {
    const hero = this.querySelector('.hero');
    // en el móvil la escena se desliza: empieza centrada en la hoguera
    requestAnimationFrame(() => { if (hero.scrollWidth > hero.clientWidth) hero.scrollLeft = (hero.scrollWidth - hero.clientWidth) * .45; });

    // parallax: cada capa se mueve más cuanto más cerca está
    const capas = [...this.querySelectorAll('.capa')];
    hero.addEventListener('pointermove', (e) => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      capas.forEach((c) => { const p = +c.dataset.p; c.style.transform = `translate(${-x * p}px, ${-y * p * .4}px)`; });
    });

    // el post-it de arriba cuenta qué hay en cada sitio
    const exps = expediciones();
    const posts = exps.flatMap((x) => entradasDe(x)).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const enCurso = exps.filter((x) => x.estado === 'en curso').length;
    const PISTAS = {
      sobre: ['LA TIENDA', 'Quién soy y por qué escribo esto.'],
      contacto: ['LA RADIO', CUADERNO.contacto.texto],
      posts: ['EL TABLÓN', posts[0] ? `Lo último: «${posts[0].titulo}»` : 'Aún no hay posts.'],
      proyectos: ['EL MAPA', `${exps.length} ${exps.length === 1 ? 'expedición' : 'expediciones'} · ${enCurso} en curso`],
    };
    const pista = this.querySelector('.pista');
    this.querySelectorAll('.sitio').forEach((s) => {
      const mostrar = () => {
        const [t, txt] = PISTAS[s.dataset.k];
        pista.querySelector('small').textContent = t;
        pista.querySelector('span').textContent = txt;
        pista.classList.remove('cambia'); void pista.offsetWidth; pista.classList.add('cambia');
      };
      s.addEventListener('pointerenter', mostrar);
      s.addEventListener('focus', mostrar);
    });
  }
});
