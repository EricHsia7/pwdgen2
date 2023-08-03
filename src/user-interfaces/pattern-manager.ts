import utilities from '../core/utilities';
import fine_grained_password from '../core/fine-grained-password';
import icons from './icons';

export function printPatterns() {
  var list = fine_grained_password.getPatterns();
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
    html.push(`<div class="pattern-item><div class="pattern-item-icon"><span class="material-symbols-rounded">${this_item.pattern_icon}</span></div><div class="pattern-item-title">${this_item.pattern_name}</div><div class="pattern-item-action">${icons.icon_more_options}</div></div>`);
  }
  utilities.qe('.pattern_manager .contents-box .patter-list').innerHTML = html.join('');
}

export function openPatternManager(event) {
  interaction.pattern_manager.printPatterns()
  interaction.options.closeOptions(event);
  interaction.show(utilities.qe('.pattern_manager'), 'block');
}

export function closePatternManager() {
  interaction.show(utilities.qe('.pattern_manager'), 'none');
}
