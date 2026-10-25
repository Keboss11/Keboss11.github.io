# Cuaderno de campo

Blog/portfolio con forma de cuaderno de campo: cada **expedición** es un proyecto y cada **entrada** es un post sobre cómo lo construí. Se navega pasando páginas (con animación) y se publica solo en GitHub Pages: **https://keboss11.github.io**

Hecho con [Astro](https://astro.build). Sin datos: es una plantilla para rellenar.

## Ponerlo en marcha

```bash
npm install
npm run dev
```

Abre http://localhost:4321. Los cambios se ven al guardar.

## Escribir

| Quiero…                  | Hago…                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| Cambiar mi nombre, etc.  | Editar `src/config.ts`                                                                    |
| Añadir un proyecto       | Copiar `plantillas/expedicion.md` a `src/content/expediciones/<nombre>.md`               |
| Añadir un post           | Copiar `plantillas/entrada.md` a `src/content/entradas/<nombre-expedicion>/<01-titulo>.md` |
| Guardar algo sin publicar | Poner `borrador: true` (se ve en local, no en la web)                                    |

Las imágenes pueden ir junto al Markdown (rutas relativas, `./fotos/x.png`) o en `public/` (rutas absolutas, `/x.png`).

### Ejemplo completo

En `src/content/expediciones/ejemplo.md` y `src/content/entradas/ejemplo/01-anatomia-de-una-entrada.md` hay una expedición y un post de ejemplo que explican cada elemento y cómo se escribe. Están publicados en la web. Cópialos como punto de partida y bórralos cuando ya no te hagan falta.

### Elementos de cuaderno dentro del Markdown

- `<aside class="margen derecha">…</aside>` → anotación a mano en el lado derecho (el texto la rodea).
- `<aside class="margen izquierda">…</aside>` → lo mismo, en el lado izquierdo. Añade `roja` o `lapiz` para cambiar la tinta.
- `notas:` en los datos de la entrada → anotaciones con flecha en la página izquierda.
- `> texto` → anotación escrita a mano, en azul, en su propia línea.
- `~~texto~~` → tachado a mano. `<span class="circulo">texto</span>` → rodeado con un círculo.
- `<mark>texto</mark>` → subrayado con fosforito.
- `<div class="nota">…</div>` → nota amarilla con clip.
- Bloques de código con ```` ``` ```` → ficha pegada con cinta (con colores).
- `![alt](imagen.png)` → foto tipo polaroid.
- `---` → línea de corte discontinua.

### Orden de las páginas

Índice → expedición 1 → sus entradas (por `numero`) → expedición 2 → … Las esquinas dobladas y las flechas ← → del teclado siguen ese orden.

## Publicar

Cada `git push` a `main` publica la web automáticamente (`.github/workflows/deploy.yml`). Puedes ver el progreso en la pestaña **Actions** del repositorio.

## Estructura

```
src/
  config.ts            datos generales del cuaderno
  content.config.ts    campos de expediciones y entradas
  content/             ← aquí escribes
  layouts/Cuaderno.astro   el libro (doble página)
  pages/               índice, expedición, entrada y 404
  scripts/cuaderno.ts  animación de pasar página, tapa, tema y teclado
  styles/cuaderno.css  toda la estética
plantillas/            archivos de ejemplo para copiar
```
