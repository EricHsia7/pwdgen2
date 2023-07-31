type BjsonValue = string | number | boolean | BjsonArray | BjsonObject;

type BjsonArray = BjsonValue[];

interface BjsonObject {
  [key: string]: BjsonValue;
}

function bjson_type(thing: BjsonValue, path: string[], place: 'object' | 'array'): string {
  if (typeof thing === 'string') {
    return bjson_string(thing, path, place);
  }
  if (typeof thing === 'number') {
    return bjson_number(thing, path, place);
  }
  if (typeof thing === 'boolean') {
    return bjson_boolean(thing, path, place);
  }
  if (typeof thing === 'object' && Array.isArray(thing)) {
    return bjson_array(thing, path, place);
  }
  if (typeof thing === 'object' && !Array.isArray(thing)) {
    return bjson_object(thing as BjsonObject, path, place);
  }
  throw new Error('Unsupported BJSON value type');
}

function bjson_string(value: string, path: string[], place: 'object' | 'array'): string {
  var element = document.createElement('div');
  element.classList.add('bjson_string');
  if (place === 'object') {
    key = path[path.length - 1];
  }
  if (place === 'array') {
    key = path[path.length - 1];
  }
  var input = document.createElement('input');
  input.setAttribute('value', value);
  input.setAttribute('onkeyup', `bjson_update_single_object(pattern_editor_blocks_json, json, event)`);
  input.setAttribute('onselectionchange', `bjson_update_single_object(pattern_editor_blocks_json, json, event)`);

  var keyElement = document.createElement('div');
  keyElement.classList.add('bjson_key');
  keyElement.innerText = key;
  element.innerHTML = keyElement.outerHTML + input.outerHTML;
  element.setAttribute('path', path.join('/'));
  element.setAttribute('type', 'string');
  return element.outerHTML;
}

function bjson_number(value: number, path: string[], place: 'object' | 'array'): string {
  var element = document.createElement('div');
  element.classList.add('bjson_number');
  if (place === 'object') {
    key = path[path.length - 1];
  }
  if (place === 'array') {
    key = path[path.length - 1];
  }
  var input = document.createElement('input');
  input.setAttribute('value', value.toString());
  input.setAttribute('onkeyup', `bjson_update_single_object(pattern_editor_blocks_json, json, event)`);
  input.setAttribute('onselectionchange', `bjson_update_single_object(pattern_editor_blocks_json, json, event)`);

  var keyElement = document.createElement('div');
  keyElement.classList.add('bjson_key');
  keyElement.innerText = key;
  element.innerHTML = keyElement.outerHTML + input.outerHTML;
  element.setAttribute('path', path.join('/'));
  element.setAttribute('type', 'number');
  return element.outerHTML;
}

function bjson_boolean(value: boolean, path: string[], place: 'object' | 'array'): string {
  var element = document.createElement('div');
  element.classList.add('bjson_boolean');
  var opt_1 = document.createElement('option');
  opt_1.setAttribute('value', 'true');
  opt_1.innerText = 'true';
  var opt_2 = document.createElement('option');
  opt_2.setAttribute('value', 'false');
  opt_2.innerText = 'false';
  if (value) {
    opt_1.setAttribute('selected', 'selected');
  } else {
    opt_2.setAttribute('selected', 'selected');
  }
  var select = document.createElement('select');
  select.innerHTML = opt_1.outerHTML + opt_2.outerHTML;
  select.setAttribute('onchange', `bjson_update_single_object(pattern_editor_blocks_json, json, event)`);

  if (place === 'object') {
    key = path[path.length - 1];
  }
  if (place === 'array') {
    key = path[path.length - 1];
  }
  var keyElement = document.createElement('div');
  keyElement.classList.add('bjson_key');
  keyElement.innerText = key;
  element.innerHTML = keyElement.outerHTML + select.outerHTML;
  element.setAttribute('path', path.join('/'));
  element.setAttribute('type', 'boolean');
  return element.outerHTML;
}

function bjson_array(array: BjsonArray, path: string[], place: 'object' | 'array'): string {
  var element = document.createElement('div');
  element.classList.add('bjson_array');

  if (place === 'object') {
    key = path[path.length - 1];
  }
  if (place === 'array') {
    key = path[path.length - 1];
  }
  var keyElement = document.createElement('div');
  keyElement.classList.add('bjson_key');
  keyElement.innerText = key;
  element.innerHTML = keyElement.outerHTML;
  var arrayLength = array.length;
  for (var i = 0; i < arrayLength; i++) {
    element.innerHTML += bjson_type(array[i], path.concat([i.toString()]), 'array');
  }
  return element.outerHTML;
}

function bjson_object(object: BjsonObject, path: string[], place: 'object' | 'array'): string {
  var element = document.createElement('div');
  element.classList.add('bjson_object');

  var key = place === 'object' ? path[path.length - 1] : path[path.length - 1];
  var keyElement = document.createElement('div');
  keyElement.classList.add('bjson_key');
  keyElement.innerText = key;
  element.innerHTML = keyElement.outerHTML;
  for (var k in object) {
    element.innerHTML += bjson_type(object[k], path.concat([k]), 'object');
  }
  return element.outerHTML;
}

function setValueByPath(obj: BjsonObject, path: string, value: BjsonValue): void {
  const keys = path.split('/');
  let currentObj = obj;

  for (var i = 1; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      if (Array.isArray(currentObj[key]) && key !== '') {
        const index = parseInt(keys[i + 1]);
        currentObj[key][index] = value;
      } else {
        currentObj[key] = value;
      }
    } else {
      if (!currentObj[key]) {
        if (Number.isInteger(parseInt(keys[i + 1]))) {
          currentObj[key] = [];
        } else {
          currentObj[key] = {};
        }
      }
      currentObj = currentObj[key] as BjsonObject;
    }
  }
}

function bjson_getValue(parent: HTMLElement): BjsonValue {
  var type = parent.getAttribute('type');
  if (type === 'string') {
    return parent.querySelector('input').value;
  }
  if (type === 'number') {
    var str = parent.querySelector('input').value;
    var num = parseInt(str) - parseFloat(str) < 0 ? parseFloat(str) : parseInt(str);
    return num;
  }
  if (type === 'boolean') {
    var str = parent.querySelector('select').value;
    return str === 'true';
  }
  throw new Error('Unsupported BJSON value type');
}

function bjson_update_entire_object(root: HTMLElement, json: BjsonObject): void {
  var allElements = root.querySelectorAll(`.bjson_string, .bjson_number, .bjson_boolean`);
  var allElementsLen = allElements.length;
  for (var i = 0; i < allElementsLen; i++) {
    setValueByPath(json, allElements[i].getAttribute(`path`)!, bjson_getValue(allElements[i]));
  }
}

function bjson_update_single_object(root: HTMLElement, json: BjsonObject, event: Event): void {
  var path = (event.target as HTMLElement).parentNode!.getAttribute(`path`)!;
  setValueByPath(json, path, bjson_getValue((event.target as HTMLElement).parentNode!));
  console.log(JSON.stringify(json, null, 3));
}

window.bjson = {
  bjson_type,
  bjson_string,
  bjson_number,
  bjson_boolean,
  bjson_array,
  bjson_object,
  setValueByPath,
  bjson_getValue,
  bjson_update_entire_object,
  bjson_update_single_object
};

export default window.bjson;
