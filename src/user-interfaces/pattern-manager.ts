import utilities from '../core/utilities';
import fine_grained_password from '../core/fine-grained-password';

export function openPatternManager(event) {
  interaction.options.closeOptions(event);
  interaction.show(utilities.qe('.pattern_manager'), 'block');
}

export function closePatternManager() {
  interaction.show(utilities.qe('.pattern_manager'), 'none');
}
