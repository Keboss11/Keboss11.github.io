// <bloque-codigo lenguaje="kotlin" archivo="Main.kt"> … </bloque-codigo>
// Si el código lleva < o >, mételo dentro de <script type="text/plain"> … </script>
// para que el navegador no lo confunda con etiquetas HTML.
import { Componente, definir, esc } from './base.js';

const PALABRAS = new Set(`fun val var class interface object suspend return if else when for while do import package private public
protected internal override data const let function async await new this super true false null undefined def from in is as
try catch finally throw throws static void int long float double boolean char String Int Long Boolean Float Double Unit
export default extends implements enum struct fn pub mut use match self None True False lambda with yield break continue
switch case typeof instanceof sealed open abstract companion init get set`.split(/\s+/));

const COMENTA_ALMOHADILLA = new Set(['py', 'python', 'sh', 'bash', 'yaml', 'yml', 'rb', 'ruby', 'toml']);

function resaltarHtml(codigo) {
  const re = /(<!--[\s\S]*?-->)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(<\/?[\w-]+)|([\w-]+)(?==)/g;
  return trocear(codigo, re, (m) => (m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'a'));
}

function resaltarGeneral(codigo, lenguaje) {
  const almohadilla = COMENTA_ALMOHADILLA.has(lenguaje) ? '|#[^\\n]*' : '';
  const re = new RegExp(
    `(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/${almohadilla})` + // comentarios
    '|("(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)' + // textos
    '|(@[A-Za-z_]\\w*)' + // anotaciones
    '|\\b(\\d+(?:\\.\\d+)?)\\b' + // números
    '|\\b([A-Za-z_]\\w*)\\b(?=\\s*\\()' + // llamadas a funciones
    '|\\b([A-Za-z_]\\w*)\\b', // palabras
    'g',
  );
  return trocear(codigo, re, (m) => {
    if (m[1]) return 'c';
    if (m[2]) return 's';
    if (m[3]) return 'a';
    if (m[4]) return 'n';
    if (m[5]) return PALABRAS.has(m[5]) ? 'k' : 'f';
    return PALABRAS.has(m[6]) ? 'k' : null;
  });
}

function trocear(codigo, re, clase) {
  let html = '', ultimo = 0;
  for (const m of codigo.matchAll(re)) {
    const c = clase(m);
    if (!c) continue;
    html += esc(codigo.slice(ultimo, m.index)) + `<span class="${c}">${esc(m[0])}</span>`;
    ultimo = m.index + m[0].length;
  }
  return html + esc(codigo.slice(ultimo));
}

// Quita la sangría común y las líneas vacías del principio y del final
function limpiar(texto) {
  const lineas = texto.replace(/\t/g, '  ').split('\n');
  while (lineas.length && !lineas[0].trim()) lineas.shift();
  while (lineas.length && !lineas.at(-1).trim()) lineas.pop();
  const sangria = Math.min(...lineas.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lineas.map((l) => l.slice(sangria)).join('\n');
}

definir('bloque-codigo', class extends Componente {
  pintar() {
    const crudo = this.querySelector('script[type="text/plain"]')?.textContent ?? this.textContent;
    const codigo = limpiar(crudo);
    const lenguaje = (this.getAttribute('lenguaje') ?? '').toLowerCase();
    const archivo = this.getAttribute('archivo');
    const html = ['html', 'xml', 'svg'].includes(lenguaje) ? resaltarHtml(codigo) : resaltarGeneral(codigo, lenguaje);
    const etiqueta = archivo ?? (lenguaje ? lenguaje.toUpperCase() : '');
    this.innerHTML = `<pre class="codigo">${etiqueta ? `<span class="archivo">${esc(etiqueta)}</span>` : ''}<code>${html}</code></pre>`;
  }
});
