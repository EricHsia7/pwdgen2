import utilities from '../core/utilities'


function loadCSS(url, part) {
  if (!(utilities.qeAll(`html head link[part="${part}"]`).length > 0)) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('part', part)
    document.head.appendChild(link);
  }
}

window.sty = {
  loadCSS
}

export default sty