# Cuaderno de campo

Blog/portfolio con forma de cuaderno de campo: cada **expedición** es un proyecto y cada **entrada** es un post sobre cómo lo construí. Se navega pasando páginas (con animación) y se publica en GitHub Pages: **https://keboss11.github.io**

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
| Cambiar mi nombre, etc.    | Editar `CUADERNO` en `datos.js`                                                             |
| Añadir un proyecto         | Apuntarlo en `datos.js` y copiar `plantillas/expedicion/` a `expediciones/<id>/`            |
| Añadir un post             | Apuntarlo en `datos.js` (dentro de su expedición) y copiar `plantillas/entrada/` a `expediciones/<id>/<id-entrada>/` |
| Guardar algo sin publicar  | Poner `borrador: true` en `datos.js` (se ve en localhost, no en la web)                     |
| Añadir imágenes            | Guardarlas en `img/<id>/` y usarlas con ruta absoluta: `/img/<id>/foto.png`                 |
| Añadir un vídeo            | Guardarlo en `videos/<id>/` y usar `<video-campo src="/videos/<id>/demo.mp4">`, o subirlo a YouTube y usar `youtube="ID"` |

`datos.js` es la lista de lo que existe: con ella se montan el índice, el registro de cada expedición, el orden al pasar página y los números de página. El contenido de cada página está en su `index.html`.

La expedición `ejemplo` y su entrada `01-anatomia-de-una-entrada` explican cada componente con su código. Están marcadas como `borrador`, así que solo se ven en local: ábrelas en http://localhost:4321/expediciones/ejemplo/ cuando necesites la referencia.

## Componentes

### Estructura de cada página

```html
<cuaderno-libro>
  <pagina-izquierda> … </pagina-izquierda>
  <pagina-derecha> … </pagina-derecha>
</cuaderno-libro>
```

`<cuaderno-libro>` pone todo lo demás: cabecera, tapa, esquinas dobladas, cinta, números de página, modo noche y la animación de pasar página.

### Se rellenan solos con `datos.js`

| Componente                 | Dónde              | Qué pone                                        |
| -------------------------- | ------------------ | ----------------------------------------------- |
| `<campos-cuaderno>`        | índice, izquierda  | Nº de cuaderno y año                            |
| `<ficha-propietario>`      | índice, izquierda  | «Este cuaderno pertenece a…»                    |
| `<indice-expediciones>`    | índice, derecha    | Lista de proyectos con su estado y página       |
| `<ultimas-entradas>`       | índice, derecha    | Las 5 entradas más recientes (`cuantas="3"`)    |
| `<campos-expedicion>`      | expedición, izq.   | Nº de expedición y fecha de inicio              |
| `<encabezado-expedicion>`  | expedición, der.   | Bitácora, nº de entradas y título               |
| `<registro-expedicion>`    | expedición, der.   | Entradas y pendientes                           |
| `<sello-estado>`           | donde quieras      | Sello «EN CURSO», «TERMINADO»…                  |
| `<campos-entrada>`         | entrada, izquierda | Nº, fecha, lectura (+ `lugar` y `clima`)        |
| `<encabezado-entrada>`     | entrada, derecha   | Expedición, nº y título                         |
| `<navegacion-entradas>`    | entrada, derecha   | Entrada anterior / siguiente                    |

### Para escribir

```html
<nota-margen lado="derecha" tinta="roja">Nota a mano en el lateral</nota-margen>  <!-- tinta: azul (por defecto), roja, lapiz -->
<nota-flecha>Anotación con flecha, en su propia línea</nota-flecha>
<nota-clip titulo="¡OJO!">Nota amarilla con clip</nota-clip>
<foto-polaroid src="/img/x.png" pie="Pie de foto" giro="-3"></foto-polaroid>
<video-campo src="/videos/x.mp4" pie="Pie" vertical></video-campo>  <!-- o youtube="ID"; sin ninguno, hueco «vídeo pendiente» -->
<boceto-dibujo src="/img/x.svg" pie="Fig. 1 — …"></boceto-dibujo>
<ficha-especimen material="Kotlin, Compose"></ficha-especimen>
<titulo-pagina>Título con subrayado</titulo-pagina>
<titulo-seccion>MATERIAL</titulo-seccion>
<lista-material><li>…</li></lista-material>
<lista-aprendido><li>…</li></lista-aprendido>
<leyenda-estados></leyenda-estados>
<brujula-dibujo></brujula-dibujo>

<bloque-codigo lenguaje="kotlin" archivo="Main.kt"><script type="text/plain">
  fun main() = println("hola")
</script></bloque-codigo>
```

Dentro de `<article class="prose">` también tienen estilo de cuaderno: `<h2>`, `<h3>`, `<mark>` (fosforito), `<del>` (tachado), `<span class="circulo">`, `<img>`, `<hr>`, listas y tablas.

En `<bloque-codigo>`, mete el código dentro de `<script type="text/plain">` para poder escribir `<` y `>` tal cual. Los colores se ponen solos.

## Publicar

GitHub Pages sirve los archivos tal cual desde la rama `main`: haz commit y `git push`, y en uno o dos minutos está en la web.

## Estructura

```
index.html                 índice
404.html                   página no encontrada
datos.js                   ← lista de expediciones y entradas
expediciones/<id>/index.html               ← portada de un proyecto
expediciones/<id>/<id-entrada>/index.html  ← un post
componentes/               los Web Components
  libro.js                 el cuaderno y la animación
  elementos.js             notas, polaroids, fichas…
  listas.js                lo que se rellena con datos.js
  codigo.js                bloques de código con colores
estilos/cuaderno.css       toda la estética
img/                       imágenes
videos/                    vídeos de los posts
plantillas/                páginas en blanco para copiar
```

La versión anterior, hecha con Astro, está guardada en la etiqueta `version-astro` de git.
