// Se carga antes que nada para que el modo noche no parpadee al abrir la página.
try {
  document.documentElement.dataset.theme =
    localStorage.getItem('tema') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch (e) {}
