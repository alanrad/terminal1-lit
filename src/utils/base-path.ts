let _basePath = '';

export function setBasePath(path: string) {
  _basePath = path.endsWith('/') ? path : `${path}/`;
}

export function getBasePath(subpath = '') {
  if (!_basePath) {
    const scripts = document.querySelectorAll<HTMLScriptElement>('script[data-t1]');
    if (scripts.length > 0) {
      const last = scripts[scripts.length - 1];
      const src = last.getAttribute('src') || '';
      _basePath = src.slice(0, src.lastIndexOf('/') + 1);
    }
  }
  return `${_basePath}${subpath}`;
}
