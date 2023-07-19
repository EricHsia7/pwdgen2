import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
var _ = require('lodash');
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));


window.pattern_creator_current_editor = 'blocks'
window.pattern_json = {}

export function openPatternCreator(event) {
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(0)
  }
  interaction.fade(utilities.qe('.pattern_creator'), 'In', 'block')
  interaction.fade(utilities.qe('.pattern_creator_title'), 'In', 'flex')
  interaction.options.closeOptions(event)
  utilities.qe('.pattern').innerHTML = JSON.stringify(pattern_json, null, 2)
  utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2)
  hljs.highlightAll();
  if (pattern_creator_evt === 0) {
    pattern_creator_evt = 1
    utilities.qe('.pattern2').addEventListener('input', function (event) {
      try {
        utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
        hljs.highlightBlock(utilities.qe('.pattern'));
        pattern_json = JSON.parse(utilities.qe('.pattern2').innerText)
        utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
      }
      catch (e) {

      }
    });
    utilities.qe('.pattern2').addEventListener('blur', function (event) {
      try {
        pattern_json = JSON.parse(utilities.qe('.pattern2').innerText)
        interaction.pattern_creator.addIdentityToPattern()
        utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2)
        utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
        hljs.highlightBlock(utilities.qe('.pattern2'));
        hljs.highlightBlock(utilities.qe('.pattern'));
        utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
      } catch (e) {
      }
      utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerHTML
      utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
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
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
}

export function addIdentityToPattern(): void {
  var p = function (pattern) {
    var pattern_len = pattern.length
    for (var j = 0; j < pattern_len; j++) {
      var this_item = pattern[j]
      if (this_item.type === 'string' || this_item === 'regex' || this_item === 'list') {
        if (!this_item.hasOwnProperty('id')) {
          this_item.id = fine_grained_password.generate([
            {
              type: "string",
              string: "c-"
            },
            {
              type: "regex",
              regex: "/[A-Za-z0-9]/g",
              quantity: 16,
              repeat: true
            }
          ], 'production')
          
        }
      }
      if (this_item.type === 'group') {
this_item['group'] = p(this_item['group']))
      }
pattern.splice(j, 1, this_item)
    }
    return pattern
  }
  if (pattern_json.hasOwnProperty('pattern')) {
    pattern_json.pattern = p(pattern_json.pattern)
  }
}

export function generatePatternPreview(): string {
  if (pattern_json.hasOwnProperty('pattern')) {
    var generation = fine_grained_password.generate(pattern_json.pattern, 'editor')
    var generation_len = generation.length
    var html = []
    for (var c = 0; c < generation_len; c++) {
      var this_component = generation[c]
      var component_color = utilities.randomColorSet()
      var path = 'x'
      var component_id = fine_grained_password.generate([
        {
          type: 'string',
          string: 'component-'
        },
        {
          type: 'regex',
          regex: '/[a-z0-9]/g',
          quantity: 16,
          repeat: true
        }
      ], 'production')
      var component_elt = document.createElement('span')
      component_elt.classList.add('pattern_creator_preview_component')
      component_elt.id = component_id
      component_elt.setAttribute('path', path)
      component_elt.setAttribute('type', this_component.component.type)
      component_elt.style.setProperty('--j-component-color-light-text', component_color.light.text.str)
      component_elt.style.setProperty('--j-component-color-light-bg', component_color.light.bg.str)
      component_elt.style.setProperty('--j-component-color-dark-text', component_color.dark.text.str)
      component_elt.style.setProperty('--j-component-color-dark-bg', component_color.dark.bg.str)
      component_elt.innerText = this_component.result
      component_elt.setAttribute('onclick', `interaction.pattern_creator.showPatternPreviewInfoCard('${component_id}',event)`)
      html.push(component_elt.outerHTML)
    }
    return html.join('')
  }
  else {
    return 'Invalid pattern'
  }
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
  var component = fine_grained_password.generate(pattern_json.pattern, 'editor').filter(j => (j.component.id === component_id ? true : false))
  if (component < 1) {
    return ''
  }
  else {
    component = component[0]
  }
  var card_elt = document.createElement('div')
  card_elt.setAttribute('type', component.type)
  card_elt.setAttribute('path', path)
  card_elt.style.setProperty('--j-component-info-top', `${relative_y}px`)
  card_elt.style.setProperty('--j-component-info-left', `${relative_x}px`)
  card_elt.id = tmp_id
  card_elt.innerHTML = `<div class="pattern_creator_preview_component_info_head"><div class="pattern_creator_preview_component_info_name">${component.name}</div><div class="pattern_creator_preview_component_info_type">${component.type}</div></div><div class="pattern_creator_preview_component_info_location">${path}</div><div class="pattern_creator_preview_component_info_show_in_editor" onclick="showComponentInEditor('${component_id}')">Show in editor</div>`
  preview_elt.appendChild(card_elt)
}


