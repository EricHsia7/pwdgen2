import fine_grained_password from '../core/fine-grained-password';
import utilities from '../core/utilities';
var _ = require('lodash');
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
import icons from './icons';
import { LS } from '../core/storage';

window.pattern_editor_current_editor = 'json';
window.pattern_json = {
  pattern_name: 'Email',
  pattern_icon: 'alternate_email',
  pattern: [
    {
      type: 'regex',
      regex: '/[a-z]/g',
      quantity: 3,
      repeat: false
    },
    {
      type: 'group',
      group: [
        {
          type: 'regex',
          regex: '/[a-z]/g',
          quantity: 8,
          repeat: true
        },
        {
          type: 'regex',
          regex: '/[0-9]/g',
          quantity: 5,
          repeat: true
        }
      ],
      actions: ['shuffle']
    },
    {
      type: 'string',
      string: '@'
    },
    {
      type: 'regex',
      regex: '/[a-z]/g',
      quantity: 10,
      repeat: true
    },
    {
      type: 'string',
      string: '.'
    },
    {
      type: 'list',
      list: ['com', 'app', 'net', 'one', 'me'],
      quantity: 1,
      repeat: false
    }
  ]
};

window.pattern_json_generation = [];
export function initializePatternEditorJSONEditor(): void {
  interaction.pattern_editor.addIdentityToPattern();
  utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2);
  utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText;
  hljs.highlightElement(utilities.qe('.pattern2'));
  hljs.highlightElement(utilities.qe('.pattern'));
  utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
}

export function syncAndFormatPatternEditorJSONEditor(): void {
  try {
    pattern_json = JSON.parse(utilities.qe('.pattern2').innerText);
    interaction.pattern_editor.addIdentityToPattern();
    utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2);
    utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText;
    hljs.highlightElement(utilities.qe('.pattern2'));
    hljs.highlightElement(utilities.qe('.pattern'));
    utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
  } catch (e) {}
  utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerHTML;
  utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
}

export function syncPatternEditorJSONEditor() {
  try {
    utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText;
    pattern_json = JSON.parse(utilities.qe('.pattern2').innerText);
    hljs.highlightElement(utilities.qe('.pattern'));
    utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
  } catch (e) {}
}

export function openPatternEditor(event) {
  interaction.SASBC(0);
  interaction.show(utilities.qe('.pattern_editor'), 'block');
  interaction.options.closeOptions(event);
  interaction.pattern_editor.initializePatternEditorJSONEditor();
  if (pattern_editor_evt === 0) {
    pattern_editor_evt = 1;
    utilities.qe('.pattern2').addEventListener('input', function (event) {
      interaction.pattern_editor.syncPatternEditorJSONEditor();
    });
    utilities.qe('.pattern2').addEventListener('blur', function (event) {
      interaction.pattern_editor.syncAndFormatPatternEditorJSONEditor();
    });
    utilities.qe('.pattern2').addEventListener('scroll', function (event) {
      window.requestAnimationFrame(function () {
        var pattern2 = utilities.qe('.pattern_editor .pattern2');
        var pattern = utilities.qe('.pattern_editor .pattern');
        var scrollTop = pattern2.pageYOffset || pattern2.scrollTop;
        pattern.scrollTop = scrollTop;
        var scrollHeight: number = pattern2.scrollHeight;
        var clientHeight: number = pattern2.clientHeight;
        var maxScrollTop: number = scrollHeight - clientHeight;
        var translateY = scrollTop;
        if (scrollTop < 0 || scrollTop >= maxScrollTop) {
          if (scrollTop < 0) {
            translateY *= -1;
          } else {
            translateY = maxScrollTop - scrollTop;
          }
        } else {
          translateY = 0;
        }
        utilities.qe('.pattern_editor .pattern_editor_json pre code.pattern').style.setProperty('--js-pattern-overscroll-translate', `translateY(${translateY}px)`);
      });
    });
  }
}

export function closePatternEditor() {
  interaction.show(utilities.qe('.pattern_editor'), 'none');
  interaction.SASBC(3);
}

export function addIdentityToPattern(): void {
  var p = function (pattern) {
    var pattern_len = pattern.length;
    for (var j = 0; j < pattern_len; j++) {
      var this_item = pattern[j];
      if (!this_item.hasOwnProperty('id')) {
        this_item.id = fine_grained_password.generate(
          [
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
          ],
          'production'
        );
      }
      if (this_item.type === 'string' || this_item === 'regex' || this_item === 'list') {
      } else {
        if (this_item.type === 'group') {
          this_item['group'] = p(this_item['group']);
        }
      }

      pattern.splice(j, 1, this_item);
    }
    return pattern;
  };
  if (pattern_json.hasOwnProperty('pattern')) {
    pattern_json.pattern = p(pattern_json.pattern);
  }
}

export function generatePatternPreview(): string {
  if (pattern_json.hasOwnProperty('pattern')) {
    var generation = fine_grained_password.generate(pattern_json.pattern, 'editor');
    var generation_len = generation.length;
    pattern_json_generation = generation;
    var html = [];
    for (var c = 0; c < generation_len; c++) {
      var this_component = generation[c];
      var component_color = utilities.randomColorSet();
      var path = '--';
      var component_id = fine_grained_password.generate(
        [
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
        ],
        'production'
      );
      var component_elt = document.createElement('span');
      component_elt.classList.add('pattern_editor_preview_component');
      component_elt.id = this_component.component.id ? this_component.component.id : component_id;
      component_elt.setAttribute('path', path);
      component_elt.setAttribute('type', this_component.component.type);
      component_elt.style.setProperty('--js-component-color-light-text', component_color.light.text.str);
      component_elt.style.setProperty('--js-component-color-light-bg', component_color.light.bg.str);
      component_elt.style.setProperty('--js-component-color-dark-text', component_color.dark.text.str);
      component_elt.style.setProperty('--js-component-color-dark-bg', component_color.dark.bg.str);
      component_elt.innerText = this_component.result;
      component_elt.setAttribute('onclick', `interaction.pattern_editor.displayPatternComponentInfo('${this_component.component.id ? this_component.component.id : component_id}',event)`);
      html.push(component_elt.outerHTML);
    }
    return html.join('');
  } else {
    return 'Invalid pattern';
  }
}

export function displayPatternComponentInfo(component_id: string, event: Event): void | string {
  event.preventDefault();
  interaction.SASBC(2);
  var type_icon = {
    regex: icons.icon_regular_expression,
    string: icons.icon_text,
    group: '',
    list: ''
  };
  var existing_info = utilities.qeAll('body .pattern_editor_preview_component_info');
  var existing_info_len = existing_info.length;
  for (var e = 0; e < existing_info_len; e++) {
    removePatternComponentInfo(existing_info[e].id, event);
  }
  var elt = event.target;
  var temporary_id = fine_grained_password.generate(
    [
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
    ],
    'production'
  );
  var component = pattern_json_generation.filter((j) => (j.component.id === component_id ? true : false));
  if (component.length < 1) {
    return '';
  } else {
    component = Object.assign(component[0].component, { content: component[0].result });
  }
  var items = [];
  var tostr = function (content) {
    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
      return content;
    }
    if (typeof content === 'object' && !Array.isArray(content)) {
      return JSON.stringify(content);
    }
    if (typeof content === 'object' && Array.isArray(content)) {
      return content.map((r) => tostr(r)).join(', ');
    }
    return '--';
  };
  for (var i in component) {
    var input_elt = document.createElement('input');
    input_elt.setAttribute('value', tostr(component[i]));
    input_elt.setAttribute('readonly', 'readonly');
    items.push(`<div class="pattern_editor_preview_component_info_item"><div class="pattern_editor_preview_component_info_item_title">${i}</div><div class="pattern_editor_preview_component_info_item_value">${input_elt.outerHTML}</div></div>`);
  }
  var card_elt = document.createElement('div');
  var path = '--';
  card_elt.classList.add('pattern_editor_preview_component_info');
  card_elt.id = temporary_id;
  card_elt.innerHTML = `<div class="pattern_editor_preview_component_info_title">Component</div><div class="pattern_editor_preview_component_info_list_container"><div class="pattern_editor_preview_component_info_list">${items.join('')}</div></div><div class="pattern_editor_preview_component_info_button_box"><div class="pattern_editor_preview_component_info_show_in_editor" onclick="interaction.pattern_editor.showComponentInEditor('${temporary_id}','${component.id}',event)">Find</div><div class="pattern_editor_preview_component_info_close" onclick="interaction.pattern_editor.removePatternComponentInfo('${temporary_id}',event)">Close</div></div>`;
  var mask_elt = document.createElement('div');
  mask_elt.classList.add('pattern_editor_preview_component_info_mask');
  mask_elt.id = `${temporary_id}-mask`;
  mask_elt.setAttribute(`onclick`, `interaction.pattern_editor.removePatternComponentInfo('${temporary_id}',event)`);
  document.body.appendChild(mask_elt);
  document.body.appendChild(card_elt);
  setTimeout(function () {
    utilities.qe(`#${temporary_id}`).setAttribute('o', '1');
    utilities.qe(`#${temporary_id}-mask`).setAttribute('o', '1');
  }, 1);
}

export function removePatternComponentInfo(temporary_id: string, event: Event): void {
  event.preventDefault();
  interaction.SASBC(3);

  utilities.qe(`body .pattern_editor_preview_component_info#${temporary_id}`).addEventListener(
    'transitionend',
    function () {
      utilities.qe(`body .pattern_editor_preview_component_info#${temporary_id}`).remove();
    },
    { once: true }
  );
  utilities.qe(`body .pattern_editor_preview_component_info_mask#${temporary_id}-mask`).addEventListener(
    'transitionend',
    function () {
      utilities.qe(`body .pattern_editor_preview_component_info_mask#${temporary_id}-mask`).remove();
    },
    { once: true }
  );

  utilities.qe(`body .pattern_editor_preview_component_info#${temporary_id}`).setAttribute('o', '0');
  utilities.qe(`body .pattern_editor_preview_component_info_mask#${temporary_id}-mask`).setAttribute('o', '0');
}

export function showComponentInEditor(temporary_id: string, component_id: string, event: Event): void {
  if (pattern_editor_current_editor === 'blocks') {
  }
  if (pattern_editor_current_editor === 'json') {
    var query = `"${component_id}"`;
    var elt = utilities.qeAll('.pattern_editor .pattern_editor_box .pattern_editor_container[j="json"] .pattern2 .hljs-string');
    var elt_len = elt.length;
    var result_elt: Element;
    for (var i = 0; i < elt_len; i++) {
      if (String(elt[i].innerText).indexOf(query) > -1) {
        result_elt = elt[i];
        break;
      }
    }
    var pattern = utilities.qe('.pattern_editor .pattern_editor_box .pattern_editor_container[j="json"] .pattern');
    var pattern2 = utilities.qe('.pattern_editor .pattern_editor_box .pattern_editor_container[j="json"] .pattern2');
    var offsetTop = result_elt.offsetTop - pattern2.getBoundingClientRect().height / 2 - result_elt.getBoundingClientRect().height / 2;
    pattern2.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: 'smooth'
    });
    pattern.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }
  removePatternComponentInfo(temporary_id, event);
}

export function savePatternWithEditor(): void | string {
  var check = fine_grained_password.checkPatternQualification(pattern_json);
  if (!check.result) {
    /*interaction.prompt.prompt_message(`Cannot save pattern due to error${(check.errors.length > 1) ? 's' : ''}.`)*/
    interaction.pattern_editor.displaySavePatternErrors(check.errors);
    return '';
  }
  var string = JSON.stringify(pattern_json);
  var id = fine_grained_password.generate(
    [
      {
        type: 'regex',
        regex: '/[a-zA-Z0-9]/g',
        quantity: 32,
        repeat: true
      }
    ],
    'production'
  );
  LS.setItem(`pwdgen2_pattern_b_${id}`, string);
  interaction.prompt.prompt_message('Saved pattern.');
  interaction.pattern_editor.closePatternEditor();
}

export function displaySavePatternErrors(errors) {
  interaction.SASBC(2);
  var error_html = function (error) {
    var elt = document.createElement('div');
    elt.classList.add('pattern_editor_save_pattern_errors_list_item');
    var title_elt = document.createElement('div');
    title_elt.classList.add('pattern_editor_save_pattern_errors_list_item_title');
    title_elt.innerText = utilities.encodeSignsToHtmlEntities(error);
    elt.innerHTML = title_elt.outerHTML;
    return elt.outerHTML;
  };
  var errors_len = errors.length;
  var errors_html = [];
  for (var e = 0; e < errors_len; e++) {
    errors_html.push(error_html(errors[e]));
  }
  var temporary_id = fine_grained_password.generate(
    [
      {
        type: 'string',
        string: 'e-'
      },
      {
        type: 'regex',
        regex: '/[a-z0-9A-Z]/g',
        quantity: 16,
        repeat: true
      }
    ],
    'production'
  );
  var elt = document.createElement('div');
  elt.id = temporary_id;
  elt.classList.add('pattern_editor_save_pattern_errors');
  elt.innerHTML = `<div class="pattern_editor_save_pattern_errors_title">Occurred Error${errors.length > 1 ? 's' : ''}</div><div class="pattern_editor_save_pattern_errors_list_container"><div class="pattern_editor_save_pattern_errors_list">${errors_html.join('')}</div></div><div class="pattern_editor_save_pattern_errors_button_box"><div class="pattern_editor_save_pattern_errors_go_to_documents" onclick="interaction.pattern_editor.go_to_documents()">Go to docs</div><div class="pattern_editor_save_pattern_errors_close" onclick="interaction.pattern_editor.removeSavePatternErrors('${temporary_id}',event)">Close</div></div>`;
  var mask = document.createElement('div');
  mask.id = `${temporary_id}-mask`;
  mask.classList.add('pattern_editor_save_pattern_errors_mask');
  mask.setAttribute(`onclick`, `interaction.pattern_editor.removeSavePatternErrors('${temporary_id}',event)`);
  document.body.appendChild(mask);
  document.body.appendChild(elt);
  setTimeout(function () {
    utilities.qe(`#${temporary_id}`).setAttribute('o', '1');
    utilities.qe(`#${temporary_id}-mask`).setAttribute('o', '1');
  }, 1);
}

export function removeSavePatternErrors(temporary_id: string, event: Event): void {
  event.preventDefault();
  interaction.SASBC(3);
  utilities.qe(`body .pattern_editor_save_pattern_errors#${temporary_id}`).addEventListener(
    'transitionend',
    function () {
      utilities.qe(`body .pattern_editor_save_pattern_errors#${temporary_id}`).remove();
    },
    { once: true }
  );
  utilities.qe(`body .pattern_editor_save_pattern_errors_mask#${temporary_id}-mask`).addEventListener(
    'transitionend',
    function () {
      utilities.qe(`body .pattern_editor_save_pattern_errors_mask#${temporary_id}-mask`).remove();
    },
    { once: true }
  );
  utilities.qe(`body .pattern_editor_save_pattern_errors#${temporary_id}`).setAttribute('o', '0');
  utilities.qe(`body .pattern_editor_save_pattern_errors_mask#${temporary_id}-mask`).setAttribute('o', '0');
}

export function switchEditor(editor: string): void | string {
  if (editor === 'blocks') {
    interaction.pattern_editor.syncAndFormatPatternEditorJSONEditor();
    /* pending message */
    interaction.prompt.prompt_message('This editor is unavailable at this time.');
    return '';
  }
  pattern_editor_current_editor = editor;
  var check = fine_grained_password.checkPatternQualification(pattern_json);
  if (!check.result) {
    displaySavePatternErrors(check.errors);
    return '';
  }
  var all_editor_container = utilities.qe(`.pattern_editor_box .pattern_editor_container`);
  var editor_container = utilities.qe(`.pattern_editor_box .pattern_editor_container[j="${editor}"]`);
  var all_tab = utilities.qeAll(`.pattern_editor .pattern_editor_picker .pattern_editor_picker_option`);
  var tab = utilities.qe(`.pattern_editor .pattern_editor_picker .pattern_editor_picker_option[j="${editor}"]`);
  for (var i = 0; i < 2; i++) {
    all_tab[i].setAttribute('s', '0');
    all_editor_container.setAttribute('s', '0');
  }
  tab.setAttribute('s', '1');
  editor_container.setAttribute('s', '1');
}

export function go_to_documents() {
  window.open('https://github.com/EricHsia7/pwdgen2/tree/main#customizable-patterns');
}
