# Cuaderno de campo

Mi blog y portfolio personal: **https://keboss11.github.io**

Aquí cuento los proyectos que hago mientras los construyo. Cada proyecto es una **expedición** y cada post es una parada en su sendero: qué problema me encontré, cómo lo resolví y cómo quedó, con capturas, bocetos y los tropiezos del camino.

La portada es un campamento: la tienda lleva a «sobre mí», el tablón a los posts, el mapa a los proyectos y la radio al contacto.

## Cómo está hecho

HTML, CSS y JavaScript, sin frameworks ni paso de build. Las piezas reutilizables son **Web Components**, etiquetas propias como `<nota-margen>` o `<foto-polaroid>` que el navegador entiende directamente, y una lista en `datos.js` monta los índices y la navegación entre posts. Se publica con GitHub Pages tal cual está en la rama `main`.

Para verlo en local hace falta un servidor, porque los componentes son módulos:

```bash
python -m http.server 4321
```
