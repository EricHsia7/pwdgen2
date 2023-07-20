export interface RippleElement {
  id: string;
  classList: DOMTokenList;
  appendChild(child: Node): void;
  removeChild(child: Node): void;
}

export interface WindowWithDocument extends Window {
  document: Document;
}

function supportTouch(): boolean {
  return 'ontouchstart' in document.documentElement;
}

function addTo(
  selector: string,
  color: string,
  duration: number,
  callback?: Function | Function[]
): string {
  const Allelements = document.querySelectorAll(selector);

  if (Allelements.length === 0) {
    throw new Error(`Element was not found.`);
  }

  if (typeof callback === 'function') {
    callback = [callback];
  } else {
    if (!Array.isArray(callback) || callback.length === undefined) {
      callback = [];
    }
  }

  for (let k = 0; k < Allelements.length; k++) {
    ripple.__addToSingleElement(Allelements[k], color, duration, callback[k]);
  }

  return `Ripple effect was added to ${Allelements.length} element${Allelements.length > 1 ? 's' : ''}.`;
}

function __addToSingleElement(element: HTMLElement, color: string, duration: number, callback?: Function): void {
  const eventlistener = supportTouch() ? 'touchstart' : 'mousedown';
  element.addEventListener(eventlistener, (event) => {
    const idchars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let ripple_id = '';
    for (let i = 0; i < 16; i++) {
      const idrandomNumber = Math.floor(Math.random() * idchars.length);
      ripple_id += idchars.substring(idrandomNumber, idrandomNumber + 1);
    }

    const scroll_x = document.documentElement.scrollLeft;
    const scroll_y = document.documentElement.scrollTop;
    const x = event.pageX;
    const y = event.pageY;
    const element_rect = element.getBoundingClientRect();
    const element_x = element_rect.x + scroll_x;
    const element_y = element_rect.y + scroll_y;
    const element_width = element.clientWidth;
    const element_height = element.clientHeight;
    const relative_x = x - element_x;
    const relative_y = y - element_y;
    const ripple_size = Math.max(element_width, element_height);
    const ripple_boundary_x = relative_x - 0.5 * ripple_size;
    const ripple_boundary_y = relative_y - 0.5 * ripple_size;
    const distance_top = relative_y - 0;
    const distance_left = relative_x - 0;
    const distance_right = element_width - relative_x;
    const distance_bottom = element_height - relative_y;
    const distance_top_left_corner = Math.sqrt(Math.pow(distance_top, 2) + Math.pow(distance_left, 2));
    const distance_top_right_corner = Math.sqrt(Math.pow(distance_top, 2) + Math.pow(distance_right, 2));
    const distance_bottom_left_corner = Math.sqrt(Math.pow(distance_bottom, 2) + Math.pow(distance_left, 2));
    const distance_bottom_right_corner = Math.sqrt(Math.pow(distance_bottom, 2) + Math.pow(distance_right, 2));
    const ripple_zoom = Math.max(
      2,
      Math.max(distance_top_left_corner, distance_top_right_corner, distance_bottom_left_corner, distance_bottom_right_corner) /
      (ripple_size / 2)
    );

    let element_position = getComputedStyle(element).getPropertyValue('position');
    if (!(element_position === 'absolute') && !(element_position === 'fixed')) {
      element_position = 'relative';
    }

    const css = `.ripple-element-${ripple_id} {position:${element_position};overflow:hidden;width:${element_width}px;height:${element_height}px; outline:none; -webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-mask-image: -webkit-radial-gradient(white, black);mask-image: -webkit-radial-gradient(white, black);}.ripple-element-ripple-${ripple_id} {background:${color};width:${ripple_size}px; height:${ripple_size}px;border-radius:50%;position:absolute; top:${ripple_boundary_y}px; left:${ripple_boundary_x}px;transform:scale(0); opacity:0;animation-duration: ${duration}ms;animation-name: ripple-animation-opacity-${ripple_id},ripple-animation-zoom-${ripple_id};animation-iteration-count: forward;animation-timing-function:linear;}@keyframes ripple-animation-opacity-${ripple_id} {0% {opacity:0.15;}60% {opacity:0.15;}100% { opacity:0;} } @keyframes ripple-animation-zoom-${ripple_id} {0% {transform:scale(0.1)}65% {  transform:scale(${ripple_zoom})}100% {transform:scale(${ripple_zoom})}}`;

    element.classList.add(`ripple-element-${ripple_id}`);

    const css_style_element = document.createElement('style');
    css_style_element.innerHTML = css;
    css_style_element.id = `ripple-css-${ripple_id}`;
    element.appendChild(css_style_element);

    const ripple_element_ripple = document.createElement('div');
    ripple_element_ripple.id = `ripple-element-ripple-${ripple_id}`;
    ripple_element_ripple.classList.add(`ripple-element-ripple-${ripple_id}`);
    element.appendChild(ripple_element_ripple);

    if (typeof callback === 'function') {
      document.getElementById(`ripple-element-ripple-${ripple_id}`)?.addEventListener(
        'animationstart',
        () => {
          setTimeout(() => {
            callback!();

            const rippleElement = document.getElementById(`ripple-element-ripple-${ripple_id}`);
            const cssStyleElement = document.getElementById(`ripple-css-${ripple_id}`);
            if (rippleElement) {
              element.classList.remove(`ripple-element-${ripple_id}`);
              rippleElement.remove();
            }
            if (cssStyleElement) {
              cssStyleElement.remove();
            }
          }, duration * 1);
        },
        { once: true }
      );
    } else {
      document.getElementById(`ripple-element-ripple-${ripple_id}`)?.addEventListener(
        'animationend',
        () => {
          const rippleElement = document.getElementById(`ripple-element-ripple-${ripple_id}`);
          const cssStyleElement = document.getElementById(`ripple-css-${ripple_id}`);
          if (rippleElement) {
            element.classList.remove(`ripple-element-${ripple_id}`);
            rippleElement.remove();
          }
          if (cssStyleElement) {
            cssStyleElement.remove();
          }
        },
        { once: true }
      );
      setTimeout(() => {
        const rippleElement = document.getElementById(`ripple-element-ripple-${ripple_id}`);
        const cssStyleElement = document.getElementById(`ripple-css-${ripple_id}`);
        if (rippleElement) {
          element.classList.remove(`ripple-element-${ripple_id}`);
          rippleElement.remove();
        }
        if (cssStyleElement) {
          cssStyleElement.remove();
        }
      }, duration + 50);
    }
  });
}
/*
declare global {
  interface Window {
    ripple: typeof ripple;
  }
}
*/

const ripple = {
  supportTouch,
  addTo,
  __addToSingleElement,
};

export default ripple;