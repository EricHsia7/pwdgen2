import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
var _ = require('lodash');
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
import icons from './icons'


window.pattern_creator_current_editor = 'json'
window.pattern_json = {
  "pattern_name": "Email",
  "pattern_icon": "alternate_email",
  "pattern": [
    {
      "type": "regex",
      "regex": "/[a-z]/g",
      "quantity": 3,
      "repeat": false
    },
    {
      "type": "group",
      "group": [
        {
          "type": "regex",
          "regex": "/[a-z]/g",
          "quantity": 8,
          "repeat": true
        },
        {
          "type": "regex",
          "regex": "/[0-9]/g",
          "quantity": 5,
          "repeat": true
        }
      ],
      "actions": [
        "shuffle"
      ]
    },
    {
      "type": "string",
      "string": "@"
    },
    {
      "type": "regex",
      "regex": "/[a-z]/g",
      "quantity": 10,
      "repeat": true
    },
    {
      "type": "string",
      "string": "."
    },
    {
      "type": "list",
      "list": [
        "com",
        "app",
        "net",
        "one",
        "me"
      ],
      "quantity": 1,
      "repeat": false
    }
  ]
}

window.pattern_json_generation = []
export function initializePatternCreatorJSONEditor(): void {
  interaction.pattern_creator.addIdentityToPattern()
  utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2)
  utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
  hljs.highlightElement(utilities.qe('.pattern2'));
  hljs.highlightElement(utilities.qe('.pattern'));
  utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
}

export function syncAndFormatPatternCreatorJSONEditor(): void {
  try {
    pattern_json = JSON.parse(utilities.qe('.pattern2').innerText)
    interaction.pattern_creator.addIdentityToPattern()
    utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2)
    utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
    hljs.highlightElement(utilities.qe('.pattern2'));
    hljs.highlightElement(utilities.qe('.pattern'));
    utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
  } catch (e) {
  }
  utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerHTML
  utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
}

export function syncPatternCreatorJSONEditor() {
  try {
    utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText
    pattern_json = JSON.parse(utilities.qe('.pattern2').innerText)
    hljs.highlightElement(utilities.qe('.pattern'));
    utilities.qe('.pattern_creator .generation_preview').innerHTML = generatePatternPreview()
  }
  catch (e) {

  }
}

export function openPatternCreator(event) {
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(0)
  }
  interaction.fade(utilities.qe('.pattern_creator'), 'In', 'block')
  interaction.options.closeOptions(event)
  interaction.pattern_creator.initializePatternCreatorJSONEditor()
  if (pattern_creator_evt === 0) {
    pattern_creator_evt = 1
    utilities.qe('.pattern2').addEventListener('input', function (event) {
      interaction.pattern_creator.syncPatternCreatorJSONEditor()
    });
    utilities.qe('.pattern2').addEventListener('blur', function (event) {
      interaction.pattern_creator.syncAndFormatPatternCreatorJSONEditor()
    });
    utilities.qe('.pattern2').addEventListener('scroll', function (event) {
      window.requestAnimationFrame(function () {
        var pattern2 = utilities.qe('.pattern_creator .pattern2')
        var pattern = utilities.qe('.pattern_creator .pattern')
        var scrollTop = pattern2.pageYOffset || pattern2.scrollTop
        pattern.scrollTop = scrollTop
        var scrollHeight: number = pattern2.scrollHeight;
        var clientHeight: number = pattern2.clientHeight;
        var maxScrollTop: number = scrollHeight - clientHeight
        var translateY = scrollTop
        if (scrollTop < 0 || scrollTop >= maxScrollTop) {
          if (scrollTop < 0) {
            translateY *= -1
          }
          else {
            translateY = (maxScrollTop - scrollTop)
          }
        }
        else {
          translateY = 0
        }
        utilities.qe('.pattern_creator .pattern_editor_json pre code.pattern').style.setProperty('--j-pattern-overscroll-translate', `translateY(${translateY}px)`)
      })
    });
  }
}

export function closePatternCreator() {
  interaction.fade(utilities.qe('.pattern_creator'), 'Out', 'none')
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
}

export function addIdentityToPattern(): void {
  var p = function (pattern) {
    var pattern_len = pattern.length
    for (var j = 0; j < pattern_len; j++) {
      var this_item = pattern[j]
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
      if (this_item.type === 'string' || this_item === 'regex' || this_item === 'list') {

      }
      else {
        if (this_item.type === 'group') {
          this_item['group'] = p(this_item['group'])
        }
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
    pattern_json_generation = generation
    var html = []
    for (var c = 0; c < generation_len; c++) {
      var this_component = generation[c]
      var component_color = utilities.randomColorSet()
      var path = '--'
      var component_id = fine_grained_password.generate([
        {
          type: 'string',
          string: 'c-'
        },
        {
          type: 'regex',
          regex: '/[A-Za-z0-9]/g',
          quantity: 16,
          repeat: true
        }
      ], 'production')
      var component_elt = document.createElement('span')
      component_elt.classList.add('pattern_creator_preview_component')
      component_elt.id = this_component.component.id ? this_component.component.id : component_id
      component_elt.setAttribute('path', path)
      component_elt.setAttribute('type', this_component.component.type)
      component_elt.style.setProperty('--j-component-color-light-text', component_color.light.text.str)
      component_elt.style.setProperty('--j-component-color-light-bg', component_color.light.bg.str)
      component_elt.style.setProperty('--j-component-color-dark-text', component_color.dark.text.str)
      component_elt.style.setProperty('--j-component-color-dark-bg', component_color.dark.bg.str)
      component_elt.innerText = this_component.result
      component_elt.setAttribute('onclick', `interaction.pattern_creator.showPatternComponentInfo('${(this_component.component.id ? this_component.component.id : component_id)}',event)`)
      html.push(component_elt.outerHTML)
    }
    return html.join('')
  }
  else {
    return 'Invalid pattern'
  }
}

export function showPatternComponentInfo(component_id: string, event: Event): void | string {
  event.preventDefault()
  interaction.standaloneStatusBarColor(2)
  var type_icon = {
    regex: icons.icon_regular_expression,
    string: icons.icon_text,
    group: '',
    list: ''
  }
  var existing_info = utilities.qeAll('.pattern_creator .pattern_creator_preview_component_info')
  var existing_info_len = existing_info.length
  for (var e = 0; e < existing_info_len; e++) {
    removePatternComponentInfo(existing_info[e].id, event)
  }
  var elt = event.target
  /*
  var elt_rect = elt.getBoundingClientRect();
  var elt_x = elt_rect.x
  var elt_y = elt_rect.y
  var elt_w = elt_rect.width;
  var elt_h = elt_rect.height;
  */
  /*
  var pattern_creator_elt_rect = pattern_creator_elt.getBoundingClientRect()
  var pattern_creator_elt_x = pattern_creator_elt_rect.x
  var pattern_creator_elt_y = pattern_creator_elt_rect.y
  var relative_x = elt_x - pattern_creator_elt_x
  var relative_y = elt_y - pattern_creator_elt_y + elt_h + 3
 */
  var temporary_id = fine_grained_password.generate([
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
  var component = pattern_json_generation.filter(j => (j.component.id === component_id ? true : false))
  if (component.length < 1) {
    return ''
  }
  else {
    component = Object.assign(component[0].component, { content: component[0].result })
  }
  var items = []
  var tostr = function (content) {
    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
      return content
    }
    if (typeof content === 'object' && !Array.isArray(content)) {
      return JSON.stringify(content)
    }
    if (typeof content === 'object' && Array.isArray(content)) {
      return content.map(r => tostr(r)).join(', ')
    }
    return '--'
  }
  for (var i in component) {
    var input_elt = document.createElement('input')
    input_elt.setAttribute('value', tostr(component[i]))
    input_elt.setAttribute('readonly', 'readonly')
    items.push(`<div class="pattern_creator_preview_component_info_item"><div class="pattern_creator_preview_component_info_item_title">${i}</div><div class="pattern_creator_preview_component_info_item_value">${input_elt.outerHTML}</div></div>`)
  }
  var card_elt = document.createElement('div')
  var path = '--'
  /*
  card_elt.style.setProperty('--j-component-info-top', `${relative_y}px`)
  card_elt.style.setProperty('--j-component-info-left', `${10}px`)
  interaction.copyProperty(elt, card_elt, '--j-component-color-light-text')
  interaction.copyProperty(elt, card_elt, '--j-component-color-light-bg')
  interaction.copyProperty(elt, card_elt, '--j-component-color-dark-text')
  interaction.copyProperty(elt, card_elt, '--j-component-color-dark-bg')
  */
  card_elt.classList.add('pattern_creator_preview_component_info')
  card_elt.id = temporary_id
  card_elt.innerHTML = `<div class="pattern_creator_preview_component_info_title">Component</div><div class="pattern_creator_preview_component_info_list_container"><div class="pattern_creator_preview_component_info_list">${items.join('')}</div></div><div class="pattern_creator_preview_component_info_button_box"><div class="pattern_creator_preview_component_info_show_in_editor" onclick="interaction.pattern_creator.showComponentInEditor('${temporary_id}','${component.id}',event)">Find</div><div class="pattern_creator_preview_component_info_close" onclick="interaction.pattern_creator.removePatternComponentInfo('${temporary_id}',event)">Close</div></div>`
  var mask_elt = document.createElement('div')
  mask_elt.classList.add('pattern_creator_preview_component_info_mask')
  mask_elt.id = `${temporary_id}-mask`
  mask_elt.setAttribute(`on${utilities.checkTouchFeatures() ? 'touchstart' : 'mouseenter'}`, `interaction.pattern_creator.removePatternComponentInfo('${temporary_id}',event)`)
  document.body.appendChild(mask_elt)
  document.body.appendChild(card_elt)
  interaction.fade(utilities.qe(`#${temporary_id}`), 'In', 'block')
  interaction.fade(utilities.qe(`#${temporary_id}-mask`), 'In', 'block')
  utilities.qe(`#${temporary_id}`).setAttribute('o', '1')
}

export function showComponentInEditor(temporary_id: string, component_id: string, event: Event): void {
  if (pattern_creator_current_editor === 'blocks') {

  }
  if (pattern_creator_current_editor === 'json') {
    var query = `"${component_id}"`
    var elt = utilities.qeAll('.pattern_creator .pattern_editor_box .pattern_editor_container[j="json"] .pattern2 .hljs-string')
    var elt_len = elt.length
    var result_elt: Element
    for (var i = 0; i < elt_len; i++) {
      if (String(elt[i].innerText).indexOf(query) > -1) {
        result_elt = elt[i]
        break;
      }
    }
    var pattern = utilities.qe('.pattern_creator .pattern_editor_box .pattern_editor_container[j="json"] .pattern')
    var pattern2 = utilities.qe('.pattern_creator .pattern_editor_box .pattern_editor_container[j="json"] .pattern2')
    var offsetTop = result_elt.offsetTop - pattern2.getBoundingClientRect().height / 2 - result_elt.getBoundingClientRect().height / 2
    pattern2.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: "smooth"
    })
    pattern.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: "smooth"
    })
  }
  removePatternComponentInfo(temporary_id, event)
}

export function removePatternComponentInfo(temporary_id: string, event: Event): void {
  event.preventDefault()
  interaction.standaloneStatusBarColor(0)
  utilities.qe(`body #${temporary_id}`).setAttribute('o', '0')
  interaction.fade(utilities.qe(`body #${temporary_id}`), 'Out', 'none', function () {
    utilities.qe(`body #${temporary_id}`).remove()
  })
  interaction.fade(utilities.qe(`body #${temporary_id}-mask`), 'Out', 'none', function () {
    utilities.qe(`body #${temporary_id}-mask`).remove()
  })
}

export function addPatternWithCreator(): boolean {
  if (fine_grained_password.checkPatternQualification(pattern_json)) {
    return false
  }
  var string: string = JSON.stringify(pattern_json)

  return true
}