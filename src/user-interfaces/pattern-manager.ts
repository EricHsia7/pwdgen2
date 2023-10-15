import utilities from '../core/utilities';
import fine_grained_password from '../core/fine-grained-password';
import icons from './icons';
import { LS } from '../core/storage';

export function printPatterns(): void {
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
    var ls_key = this_item.LocalStorageKey;
    html.push(`<div class="pattern-item" id="${id}"><div class="pattern-item-icon"><span class="material-symbols-rounded">${this_item.pattern_icon}</span></div><div class="pattern-item-title">${this_item.pattern_name}</div><div class="pattern-item-action" onclick="interaction.pattern_manager.showPatternOptions('${ls_key}','${id}',event)">${icons.icon_more_options}</div></div>`);
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

export function showPatternOptions(ls_key: string, id: string, even: Event): void {
  var optionItemString = function (title: string, list_n: number, border: number, name: string, group: number, icon: string, onclick: string): string {
    return `<li onclick="${onclick}" style="--options-list-n:${list_n};" y="${name}" group="${group}"  b="${border}"><div class="l_options_title">${title}</div><div class="l_options_icon">${icon}</div></li>`;
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
  var optiona_transform_origin = 'top right';
  if (options_top + options_height > window.innerHeight) {
    options_top = button_top - options_height - 5;
    optiona_transform_origin = 'bottom right';
  }
  var temporary_id = fine_grained_password.generate(
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
  options_elt.id = temporary_id;
  options_elt.classList.add('pattern_item_options');
  options_elt.style.setProperty('--js-pattern-item-options-top', `${options_top}px`);
  options_elt.style.setProperty('--js-pattern-item-options-left', `${options_left}px`);
  options_elt.style.setProperty('--js-options-list-count', 3);
  options_elt.style.setProperty('--js-options-origin', optiona_transform_origin);
  options_elt.innerHTML += optionItemString('Edit', 0, 0, 'editpattern', 0, icons.icon_edit, `interaction.pattern_manager.removePatternOptions('${temporary_id}',event);interaction.pattern_editor.openPatternEditor('edit','${ls_key}',event,'${temporary_id}')`);
  options_elt.innerHTML += optionItemString('Delete', 1, 1, 'deletepattern', 0, icons.icon_delete, `interaction.pattern_manager.removePatternOptions('${temporary_id}',event);interaction.prompt.prompt_asking('Confirm to proceed to delete the pattern permanently.','Confirm',function() {interaction.pattern_manager.deletePattern(\`${ls_key}\`)},'Cancel',function() {interaction.prompt.prompt_message(\`Canceled delection.\`);interaction.options.closeOptions(event)});`);
  options_elt.innerHTML += optionItemString('Share', 2, 1, 'sharepattern', 0, icons.icon_share, `interaction.pattern_manager.removePatternOptions('${temporary_id}',event);interaction.pattern_manager.sharePattern('${ls_key}',event)`);
  var mask_elt = document.createElement('div');
  mask_elt.classList.add('pattern_item_options_mask');
  mask_elt.id = `${temporary_id}_mask`;
  mask_elt.setAttribute(`on${utilities.checkTouchFeatures() ? 'touchstart' : 'mousedown'}`, `interaction.pattern_manager.removePatternOptions('${temporary_id}',event)`);
  document.body.appendChild(mask_elt);
  document.body.appendChild(options_elt);

  interaction.show(utilities.qe(`.pattern_item_options#${temporary_id}`), 'inline-block');
  interaction.show(utilities.qe(`.pattern_item_options_mask#${temporary_id}_mask`), 'block');

  setTimeout(function () {
    utilities.qe(`.pattern_item_options#${temporary_id}`).setAttribute('k', '1');
  }, 1);
}

export function removePatternOptions(temporary_id: string, event: Event): void {
  utilities.stopProp(event);
  utilities.qe(`.pattern_item_options#${temporary_id}`).setAttribute('k', '0');
  utilities.qe(`.pattern_item_options#${temporary_id}`).addEventListener(
    'transitionend',
    function () {
      utilities.qe(`.pattern_item_options#${temporary_id}`).remove();
      utilities.qe(`.pattern_item_options_mask#${temporary_id}_mask`).remove();
    },
    { once: true }
  );
}

export function sharePattern(ls_key: string): void {
if(LS.hasOwnProperty(ls_key)){
  var json = String(LS.getItem(ls_key))
  
}
}

export function deletePattern(ls_key: string): void {
  if (LS.hasOwnProperty(ls_key)) {
    LS.removeItem(ls_key);
    interaction.prompt.prompt_message('Deleted pattern.', 1200);
    interaction.pattern_manager.printPatterns();
  }
}
