export const FontAwesome = {
  load() {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = 'https://use.fontawesome.com/releases/v5.3.1/css/all.css';
    link.integrity = 'sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU';
    link.crossOrigin = 'anonymous';

    document.head.appendChild(link);
  }
}
