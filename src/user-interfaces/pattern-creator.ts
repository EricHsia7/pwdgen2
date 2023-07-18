import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
var _ = require('lodash');


window.pattern_creator_current_editor = 'blocks'

export function openPatternCreator(event) {
  interaction.fade(utilities.qe('.pattern_creator'), 'In', 'block')
  interaction.fade(utilities.qe('.pattern_creator_title'), 'In', 'flex')
  closeOptions(event)
  utilities.qe('.pattern').innerHTML = JSON.stringify(pattern_json, null, 2)
  utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2)
  hljs.highlightAll();
  if (pattern_creator_evt === 0) {
    pattern_creator_evt = 1
    utilities.qe('.pattern2').addEventListener('input', function (event) {
      utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
      hljs.highlightBlock(utilities.qe('.pattern'));
    });
    utilities.qe('.pattern2').addEventListener('blur', function (event) {
      try {
        utilities.qe('.pattern2').innerHTML = JSON.stringify(JSON.parse(document.querySelector('.pattern2').innerText), null, 2)
        hljs.highlightBlock(utilities.qe('.pattern2'));
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


export function generatePatternPreview() {
  var current_pattern = _.cloneDeep(pattern_json)
  var generation = fine_grained_password.generate(current_pattern.pattern, 'editor')
  var generation_len = generation.length
  for (var c = 0; c < generation_len; c++) {
    var component_id = fine_grained_password.generate([
      {
        type: 'string',
        string: 'pattern-creator-preview-component-'
      },
      {
        type: 'regex',
        regex: '/a-z0-9/g',
        quantity: 16,
        repeat: true
      }
    ], 'production')
    var this_component = generation[c]
    var html = `<div class="pattern_creator_preview_component" id="${component_id}" path="${path}" type="${this_component.component.type}"></div>`

  }

}


export function showPatternPreviewInfoCard(component_id: string, event: Event): string {
  var html = `<div class="pattern_creator_preview_component_info" type="${component.type}" path="${path}"><div class="pattern_creator_preview_component_info_head"><div class="pattern_creator_preview_component_info_name">${component.name}</div><div class="pattern_creator_preview_component_info_type">${component.type}</div></div><div class="pattern_creator_preview_component_info_location">${path}</div><div class="pattern_creator_preview_component_info_show_in_editor" onclick="showComponentInEditor('${component_id}')">Show in editor</div></div>`
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