import utilities from '../core/utilities';
import fine_grained_password from '../core/fine-grained-password';
import icons from './icons';

export function printPatterns() {
  var list = fine_grained_password.getPatterns(true);
  var list_len = list.length;
  var html = [];
  for (var i = 0; i < list_len; i++) {
    var this_item = list[i];
    var id = fine_grained_password.generate(
      [
        {
          type: 'string',
          string: 'pattern-list-item'
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
    var ls_key = this_item.LocalStorageKey
    html.push(`<div class="pattern-item" id="${id}"><div class="pattern-item-icon"><span class="material-symbols-rounded">${this_item.pattern_icon}</span></div><div class="pattern-item-title">${this_item.pattern_name}</div><div class="pattern-item-action" onclick="interaction.pattern_manager.openPatternOptions('${ls_key}','${id}',event)">${icons.icon_more_options}</div></div>`);
  }
  utilities.qe('.pattern_manager .contents-box .pattern-list').innerHTML = html.join('');
}

export function openPatternManager(event) {
  interaction.show(utilities.qe('.pattern_manager'), 'block');
  interaction.options.closeOptions(event);
  interaction.pattern_manager.printPatterns();
  if (!lazyCSS.loaded.googleFontsMaterialSymbols) {
    interaction.loadFont('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0', 'Material Symbols Rounded', 'googleFontsMaterialSymbols', function () {
      utilities.qe('.add-password-page .password-generator-presets').setAttribute('font', '1');
      utilities.qe('.pattern_manager .pattern-list').setAttribute('font', '1');
    });
  }
}

export function closePatternManager() {
  interaction.show(utilities.qe('.pattern_manager'), 'none');
}

export function openPatternOptions(ls_key, id, event) {
  var optionItemString = function (title, list_n, border, name, group, icon, onclick) {
    return `<li onclick="${onclick}" style="--options-list-n:${list_n};" y="${name}" group="0" d="1" b="${border}"><div class="l_options_title">${title}</div><div class="l_options_icon">${icon}</div></li>`;
  };
  var button = utilities.qe(`.pattern_manager .contents-box .pattern-list .pattern-item#${id} .pattern-item-action`);
  var button_rect = button.getBoundingClientRect();
  var button_left = button_rect.left;
  var button_top = button_rect.top;
  var button_width = button_rect.width;
  var button_height = button_rect.height;
  var options_width = Math.min(Math.max(100, window.innerWidth - 20), 230);
  var options_height = 50 * 3;
  var options_left = button_left + button_width - options_width;
  var options_top = button_top + button_height + 5;
  if (options_top + options_height > window.innerHeight) {
    options_top = button_top - options_height - 5;
  }
  var id = fine_grained_password.generate(
    [
      {
        type: 'string',
        string: 'pattern-list-item'
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
  var options_elt = document.createElement('div');
  options_elt.id = id;
  options_elt.classList.add('pattern_item_options');
  options_elt.style.setProperty('--js-pattern-item-options-top', `${options_top}px`);
  options_elt.style.setProperty('--js-pattern-item-options-left', `${options_left}px`);
  options_elt.innerHTML += optionItemString('Edit', 0, 0, 'editpattern', 0, icons.icon_edit, `interaction.pattern_manager.openEditPattern('${ls_key}',event)`);
  options_elt.innerHTML += optionItemString('Delete', 0, 1, 'deletepattern', 0, icons.icon_delete, `interaction.prompt.prompt_asking('Confirm to proceed to delete the pattern permanently.','Confirm','interaction.pattern_manager.deletePattern(\`${ls_key}\`)','Cancel','interaction.prompt.prompt_message(\`Canceled delection.\`)');interaction.options.closeOptions(event)`);
  options_elt.innerHTML += optionItemString('Share', 0, 0, 'sharepattern', 0, icons.icon_share, `interaction.pattern_manager.sharePattern('${ls_key}',event)`);
  document.body.appendChild(options_elt);
}
