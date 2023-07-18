import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
var _ = require('lodash');


window.pattern_creator_current_editor = 'blocks'

export function openPatternCreator(event) {
  interaction.fade(utilities.qe('.pattern_creator'), 'In', 'block')
  interaction.fade(utilities.qe('.pattern_creator_title'), 'In', 'flex')
  interaction.options.closeOptions(event)
  utilities.qe('.pattern').innerHTML = JSON.stringify(pattern_json, null, 2)
  utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2)
  hljs.highlightAll();
  if (pattern_creator_evt === 0) {
    pattern_creator_evt = 1
    utilities.qe('.pattern2').addEventListener('input', function (event) {
      utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
      hljs.highlightBlock(utilities.qe('.pattern'));
      utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
    });
    utilities.qe('.pattern2').addEventListener('blur', function (event) {
      try {
        utilities.qe('.pattern2').innerHTML = JSON.stringify(JSON.parse(document.querySelector('.pattern2').innerText), null, 2)
        hljs.highlightBlock(utilities.qe('.pattern2'));
        utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
      } catch (e) {
      }
      utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerHTML
    });
    utilities.qe('.pattern2').addEventListener('scroll', function (event) {
      window.requestAnimationFrame(function () {
        var st = utilities.qe('.pattern2').pageYOffset || utilities.qe('.pattern2').scrollTop
        utilities.qe('.pattern').scrollTop = st
      })
    });
  }
}

export function closePatternCreator() {
  interaction.fade(utilities.qe('.pattern_creator'), 'Out', 'none')
  interaction.fade(utilities.qe('.pattern_creator_title'), 'Out', 'none')
}


export function generatePatternPreview(): string {
  var current_pattern = _.cloneDeep(pattern_json)
  var generation = fine_grained_password.generate(current_pattern.pattern, 'editor')
  var generation_len = generation.length
  var html = []
  for (var c = 0; c < generation_len; c++) {
    var component_id = fine_grained_password.generate([
      {
        type: 'string',
        string: 'pattern-creator-preview-component-'
      },
      {
        type: 'regex',
        regex: '/[a-z0-9]/g',
        quantity: 16,
        repeat: true
      }
    ], 'production')

    var this_component = generation[c]
    var component_color = utilities.randomColorSet()
    var path = 'x'
    var component_elt = document.createElement('span')
    component_elt.classList.add('pattern_creator_preview_component')
    component_elt.id = component_id
    component_elt.setAttribute('path', path)
    component_elt.setAttribute('type', this_component.component.type)
    component_elt.style.setProperty('--j-component-color-text', component_color.text.str)
    component_elt.style.setProperty('--j-component-color-bg', component_color.text.bg)
    component_elt.innerText = this_component.result
    component_elt.setAttribute('onclick', `showPatternPreviewInfoCard('${component_id}',event)`)
    html.push(component_elt.outerHTML)
  }
  return html.join('')
}

export function showPatternPreviewInfoCard(component_id: string, event: Event): void {
  var elt = event.target
  var elt_rect = elt.getBoundingClientRect();
  var elt_x = elt_rect.x
  var elt_y = elt_rect.y
  var elt_w = elt.clientWidth;
  var elt_h = elt.clientHeight;
  var preview_elt = utilities.qe('.pattern_creator .generation_preview')
  var preview_elt_rect = preview_elt.getBoundingClientRect()
  var preview_elt_x = preview_elt_rect.x
  var preview_elt_y = preview_elt_rect.y
  var relative_x = elt_x - preview_elt_x
  var relative_y = elt_y - preview_elt_y + elt_h + 2
  var tmp_id = fine_grained_password.generate([
    {
      type: 'string',
      string: 'pattern-component-info-'
    },
    {
      type: 'regex',
      regex: '/[a-z0-9]/g',
      quantity: 16,
      repeat: true
    }
  ], 'production')
  var card_elt = document.createElement('div')
  card_elt.setAttribute('type', component.type)
  card_elt.setAttribute('path', path)
  card_elt.style.setProperty('--j-component-info-top', `${relative_y}px`)
  card_elt.style.setProperty('--j-component-info-left', `${relative_x}px`)
  card_elt.id = tmp_id
  card_elt.innerHTML = `<div class="pattern_creator_preview_component_info_head"><div class="pattern_creator_preview_component_info_name">${component.name}</div><div class="pattern_creator_preview_component_info_type">${component.type}</div></div><div class="pattern_creator_preview_component_info_location">${path}</div><div class="pattern_creator_preview_component_info_show_in_editor" onclick="showComponentInEditor('${component_id}')">Show in editor</div>`
  preview_elt.appendChild(card_elt)
}


export function searchPatternComponent(component_id: string) {
  var current_pattern = _.cloneDeep(pattern_json)
  var flatPattern = function (object: object, result: object) {
    if (typeof object === 'object' && Array.isArray(object)) {
      var object_len = object.length
      for (var i = 0; i < object_len; i++) {
        if (typeof object[i] === 'object' && !Array.isArray(object[i])) {
          result.push(flatPattern(object[i], result))
        }
        else {
          result.concat(object[i])
        }
      }
    }
    if (typeof object === 'object' && !Array.isArray(object)) {
      for (var i in object) {
        if (typeof object[i] === 'object' && !Array.isArray(object[i])) {
          result.push(flatPattern(object[i], result))
        }
        else {
          result.concat(object[i])
        }
      }
    }
  }

  var flattenPattern = flatPattern(current_pattern, [])
  var flattenPattern_len = flattenPattern.length
  var result = []
  for (var y = 0; y < flattenPattern_len; y++) {
    if (typeof flattenPattern[y] === 'object') {
      if (flattenPattern[y].hasOwnProperty('id')) {
        if (flattenPattern[y]['id'] === component_id) {
          result.push(flatPattern[y])
        }
      }
    }
  }
}