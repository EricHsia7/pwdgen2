
function vjson_type(thing, path, place) {
  if (typeof thing === 'string') {
    return vjson_string(thing, path, place)
  }
  if (typeof thing === 'number') {
    return vjson_number(thing, path, place)
  }
  if (typeof thing === 'boolean') {
    return vjson_boolean(thing, path, place)
  }
  if (typeof thing === 'object' && Array.isArray(thing)) {
    return vjson_array(thing, path, place)
  }
  if (typeof thing === 'object' && !Array.isArray(thing)) {
    return vjson_object(thing, path, place)
  }
}

function vjson_string(string, path, place) {
  var element = document.createElement('div')
  element.classList.add('vjson_string')
  if (place === 'object') {
    key = path[path.length - 1]
  }
  if (place === 'array') {
    key = path[path.length - 1]
  }
  var input = document.createElement('input')
  input.setAttribute('value', string)
  input.setAttribute('onkeyup', `vjson_update_single_object(pattern_box_visual_json,json,event)`)
  input.setAttribute('onselectionchange', `vjson_update_single_object(pattern_box_visual_json,json,event)`)

  var key_elt = document.createElement('div')
  key_elt.classList.add('vjson_key')
  key_elt.innerText = key
  element.innerHTML = key_elt.outerHTML + input.outerHTML
  element.setAttribute('path', path.join('/'))
  element.setAttribute('type', 'string')
  return element.outerHTML
}

function vjson_number(num, path, place) {
  var element = document.createElement('div')
  element.classList.add('vjson_number')
  if (place === 'object') {
    key = path[path.length - 1]
  }
  if (place === 'array') {
    key = path[path.length - 1]
  }
  var input = document.createElement('input')
  input.setAttribute('value', num)
  input.setAttribute('onkeyup', `vjson_update_single_object(pattern_box_visual_json,json,event)`)
  input.setAttribute('onselectionchange', `vjson_update_single_object(pattern_box_visual_json,json,event)`)

  var key_elt = document.createElement('div')
  key_elt.classList.add('vjson_key')
  key_elt.innerText = key
  element.innerHTML = key_elt.outerHTML + input.outerHTML
  element.setAttribute('path', path.join('/'))
  element.setAttribute('type', 'number')
  return element.outerHTML
}

function vjson_boolean(boolean, path, place) {
  var element = document.createElement('div')
  element.classList.add('vjson_boolean')
  var opt_1 = document.createElement('option')
  opt_1.setAttribute('value', 'true')
  opt_1.innerText = 'true'
  var opt_2 = document.createElement('option')
  opt_2.setAttribute('value', 'false')
  opt_2.innerText = 'false'
  if (boolean) {
    opt_1.setAttribute('selected', 'selected')
  }
  else {
    opt_2.setAttribute('selected', 'selected')
  }
  var select = document.createElement('select')
  select.innerHTML = opt_1.outerHTML + opt_2.outerHTML
  select.setAttribute('onchange', `vjson_update_single_object(pattern_box_visual_json,json,event)`)

  if (place === 'object') {
    key = path[path.length - 1]
  }
  if (place === 'array') {
    key = path[path.length - 1]
  }
  var key_elt = document.createElement('div')
  key_elt.classList.add('vjson_key')
  key_elt.innerText = key
  element.innerHTML = key_elt.outerHTML + select.outerHTML
  element.setAttribute('path', path.join('/'))
  element.setAttribute('type', 'boolean')
  return element.outerHTML
}

function vjson_array(array, path, place) {
  var element = document.createElement('div')
  element.classList.add('vjson_array')

  if (place === 'object') {
    key = path[path.length - 1]
  }
  if (place === 'array') {
    key = path[path.length - 1]
  }
  var key_elt = document.createElement('div')
  key_elt.classList.add('vjson_key')
  key_elt.innerText = key
  element.innerHTML = key_elt.outerHTML
  var array_len = array.length
  for (var i = 0; i < array_len; i++) {
    element.innerHTML += vjson_type(array[i], path.concat([i]), 'array')
  }
  return element.outerHTML
}

function vjson_object(object, path, place) {
  var element = document.createElement('div')
  element.classList.add('vjson_object')

  if (place === 'object') {
    key = path[path.length - 1]
  }
  if (place === 'array') {
    key = path[path.length - 1]
  }

  var key_elt = document.createElement('div')
  key_elt.classList.add('vjson_key')
  key_elt.innerText = key
  element.innerHTML = key_elt.outerHTML
  for (var k in object) {
    element.innerHTML += vjson_type(object[k], path.concat([String(k)]), 'object')
  }
  return element.outerHTML
}

function setValueByPath(obj, path, value) {
  const keys = path.split('/');
  let currentObj = obj;

  for (let i = 1; i < keys.length; i++) {
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
      currentObj = currentObj[key];
    }
  }
}


function vjson_getValue(parent) {
  var type = parent.getAttribute('type')
  if (type === 'string') {
    return parent.querySelector('input').value
  }
  if (type === 'number') {
    var str = parent.querySelector('input').value
    if (parseInt(str) - parseFloat(str) < 0) {
      var num = parseFloat(str)
    }
    else {
      var num = parseInt(str)
    }
    return num
  }
  if (type === 'boolean') {
    var str = parent.querySelector('select').value
    if (str === 'true') {
      return true
    }
    if (str === 'false') {
      return false
    }
  }
}

function vjson_update_entire_object(root, json) {
  var all_elements = root.querySelectorAll('.vjson_string,.vjson_number,.vjson_boolean')
  var all_elements_len = all_elements.length
  for (var i = 0; i < all_elements_len; i++) {
    setValueByPath(json, all_elements[i].getAttribute('path'), vjson_getValue(all_elements[i]))
  }
}

function vjson_update_single_object(root, json, event) {
  var path = event.target.parentNode.getAttribute('path')
  setValueByPath(json, path, vjson_getValue(event.target.parentNode))
  console.log(JSON.stringify(json, null, 3))
}

const vjson = {
  vjson_type,
  vjson_string,
  vjson_number,
  vjson_boolean,
  vjson_array,
  vjson_object,
  setValueByPath,
  vjson_getValue,
  vjson_update_entire_object,
  vjson_update_single_object
}
export default vjson