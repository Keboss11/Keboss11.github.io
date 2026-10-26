# Cuaderno de campo

Blog/portfolio con forma de campamento: cada **expedición** es un proyecto y cada **entrada** es un post sobre cómo lo construí. La portada es un campamento interactivo (la tienda lleva a «sobre mí», el tablón a los posts, el mapa a los proyectos y la radio al contacto) y cada post es una parada en el sendero de su expedición. Se publica en GitHub Pages: **https://keboss11.github.io**

Hecho con **HTML, CSS y JavaScript**, sin frameworks ni build. Las piezas reutilizables son **Web Components**: etiquetas propias como `<nota-margen>` o `<foto-polaroid>` que el navegador entiende directamente.

## Verlo en local

Los componentes son módulos de JavaScript, así que hace falta un servidor (abrir el archivo con doble clic no funciona):

```bash
python -m http.server 4321
```

Abre http://localhost:4321. Al guardar un archivo, recarga la página.

## Escribir

| Quiero…                    | Hago…                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Cambiar mi nombre, etc.    | Editar `CUADERNO` en `datos.js`; el texto de «Sobre mí» está en `index.html`                |
| Añadir un proyecto         | Apuntarlo en `datos.js` y copiar `plantillas/expedicion/` a `expediciones/<id>/`            |
| Añadir un post             | Apuntarlo en `datos.js` (dentro de su expedición) y copiar `plantillas/entrada/` a `expediciones/<id>/<id-entrada>/` |
| Guardar algo sin publicar  | Poner `borrador: true` en `datos.js` (se ve en localhost, no en la web)                     |
| Añadir imágenes            | Guardarlas en `img/<id>/` y usarlas con ruta absoluta: `/img/<id>/foto.png`                 |
| Añadir un vídeo            | Guardarlo en `videos/<id>/` y usar `<video-campo src="/videos/<id>/demo.mp4">`, o subirlo a YouTube y usar `youtube="ID"` |

`datos.js` es la lista de lo que existe: con ella se montan las listas del índice, el sendero y la ruta de cada expedición, y la parada anterior y siguiente de cada post. Los `pendientes` de una expedición salen como paradas discontinuas «por escribir». El contenido de cada página está en su `index.html`.

La expedición `ejemplo` y su entrada `01-anatomia-de-una-entrada` explican cada componente con su código. Están marcadas como `borrador`, así que solo se ven en local: ábrelas en http://localhost:4321/expediciones/ejemplo/ cuando necesites la referencia.

## Componentes

### Estructura de cada página

```html
<pagina-web lugar="el escritorio" clima="domingo de lluvia">
  … el contenido …
</pagina-web>
```

`<pagina-web>` mira la URL y `datos.js` y pone todo lo demás: la cabecera con el botón de día/noche, la banda con el paisaje y el título, el sendero con el caminante, la ruta lateral, la parada anterior/siguiente y el pie. `lugar` y `clima` (opcionales) salen junto a la fecha de un post. En la 404 se usa con `etiqueta="…"` y `titulo="…"`.

### Se rellenan solos con `datos.js`

| Componente                 | Dónde              | Qué pone                                        |
| -------------------------- | ------------------ | ----------------------------------------------- |
| `<lobby-campamento>`       | índice             | El campamento interactivo de la portada         |
| `<lista-proyectos>`        | índice             | Una tarjeta por expedición, con su sello y sus paradas |
| `<ultimos-posts>`          | índice             | Los 5 posts más recientes (`cuantas="3"`)       |
| `<registro-expedicion>`    | expedición         | Sus posts y sus pendientes                      |
| `<sello-estado>`           | donde quieras      | Sello «EN CURSO», «TERMINADO»…                  |

### Para escribir

```html
<lista-material><li>…</li></lista-material>          <!-- tarjeta «En la mochila» (titulo="EL EQUIPO" la renombra) -->
<lista-aprendido><li>…</li></lista-aprendido>        <!-- post-it «Lo aprendido» -->
<nota-margen tinta="roja">Nota a mano al margen</nota-margen>  <!-- tinta: azul (por defecto), roja, lapiz -->
<nota-flecha>Anotación con flecha, en su propia línea</nota-flecha>
<nota-clip titulo="¡OJO!">Nota amarilla con clip</nota-clip>
<foto-polaroid src="/img/x.png" pie="Pie de foto" giro="-3"></foto-polaroid>
<div class="duo"> dos <foto-polaroid> una al lado de la otra </div>
<foto-pegatina src="/img/x.png" pie="Pie" giro="-5"></foto-pegatina>  <!-- PNG sin fondo, sin marco y con borde de pegatina -->
<div class="pegatinas"> varias <foto-pegatina> en fila, también en el móvil </div>
<video-campo src="/videos/x.mp4" pie="Pie" vertical></video-campo>  <!-- o youtube="ID"; sin ninguno, hueco «vídeo pendiente» -->
<boceto-dibujo src="/img/x.svg" pie="Fig. 1 — …"></boceto-dibujo>

<bloque-codigo lenguaje="kotlin" archivo="Main.kt"><script type="text/plain">
  fun main() = println("hola")
</script></bloque-codigo>
```

Dentro del contenido también tienen estilo: `<h2>` (con su número, y aparecen en la ruta lateral), `<h3>`, `<mark>` (fosforito), `<del>` (tachado), `<span class="circulo">`, `<img>`, `<hr>`, listas y tablas.

En `<bloque-codigo>`, mete el código dentro de `<script type="text/plain">` para poder escribir `<` y `>` tal cual. Los colores se ponen solos.

## Publicar

GitHub Pages sirve los archivos tal cual desde la rama `main`: haz commit y `git push`, y en uno o dos minutos está en la web.

## Estructura

```
index.html                 el campamento, sobre mí, proyectos y últimos posts
404.html                   página no encontrada
datos.js                   ← lista de expediciones y entradas
expediciones/<id>/index.html               ← portada de un proyecto
expediciones/<id>/<id-entrada>/index.html  ← un post
componentes/               los Web Components
  pagina.js                cabecera, banda con el sendero, ruta lateral y pie
  lobby.js                 el campamento de la portada
  elementos.js             notas, polaroids, mochila…
  listas.js                lo que se rellena con datos.js
  codigo.js                bloques de código con colores
estilos/web.css            toda la estética
img/                       imágenes
videos/                    vídeos de los posts
plantillas/                páginas en blanco para copiar
```

La versión anterior, hecha con Astro, está guardada en la etiqueta `version-astro` de git.
