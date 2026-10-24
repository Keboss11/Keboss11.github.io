---
# ENTRADA = un post dentro de una expedición.
# Copia este archivo a src/content/entradas/<expedicion>/<01-nombre>.md
# <expedicion> es el nombre del archivo de la expedición (sin .md).

titulo: Título de la entrada
numero: 1                     # orden dentro de la expedición
fecha: 2026-01-01
resumen: Una línea que aparece en el registro de la expedición.
lugar: escritorio             # opcional
clima: lluvia ☂               # opcional
material: [Retrofit, corrutinas]
aprendido:
  - Algo que aprendiste
# boceto: ./bocetos/arquitectura.png  # imagen para la página izquierda
# pieBoceto: Fig. 1 — por dónde viajan los datos
borrador: true                # cámbialo a false para publicarla
---

Texto de la entrada en Markdown. Puedes usar <mark>fosforito</mark> y `código en línea`.

## Un apartado

> Las citas se convierten en anotaciones a mano, en azul.

<div class="nota"><b>¡OJO!</b> Nota amarilla con clip, para avisos y errores.</div>

```kotlin
// Los bloques de código salen en una ficha pegada con cinta
fun hola() = "mundo"
```

![Las imágenes salen como polaroid](./capturas/pantalla.png)

<figure class="polaroid">
  <img src="/capturas/pantalla.png" alt="Captura">
  <figcaption>Polaroid con pie de foto (imagen en public/capturas/)</figcaption>
</figure>
