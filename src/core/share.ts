import interaction from '../user-interfaces/interaction';
import utilities from './utilities';
import fine_grained_password from './fine-grained-password';

type shareDataType = 'pattern';
type shareDataFormat = 'json' | 'string';
function shareViaURL(type: shareDataType, from: string, data: string, format: shareDataFormat): void {
  var url = new URL('https://erichsia7.github.io/pwdgen2');
  url.searchParams.append('share', '1');
  url.searchParams.append('type', type);
  url.searchParams.append('from', from);
  url.searchParams.append('data', btoa(utilities.enur(data)));
  url.searchParams.append('format', format);

  if (navigator.canShare) {
    navigator.share({
      title: `Share ${type}`,
      text: `Share ${type}`,
      url: url.toString()
    });
  } else {
    interaction.copyText(url.toString());
    interaction.prompt.prompt_message('Copied link for sharing.');
  }
}

function receiveSharedContentFromURL(url: string) {
  url = new URL(url);
  var parameters = url.searchParams;
  var type = parameters.get('type');
  var from = parameters.get('from');
  var data = utilities.deur(atob(String(parameters.get('data'))));
  var format = parameters.get('format');
  var valid = false;
  var json = {};
  if (format === 'json') {
    try {
      json = JSON.parse(data);
      valid = true;
    } catch (e) {
      interaction.prompt.prompt_message('Invalid shared data.');
    }
  }
  if (valid) {
    if (type === 'pattern') {
      json = interaction.pattern_editor.removeIdentityFromPattern(json);
      var id = fine_grained_password.generate(
        [
          {
            type: 'string',
            string: 'pwdgen2_pattern_b_'
          },
          {
            type: 'regex',
            regex: '/[a-zA-Z0-9]/g',
            quantity: 32,
            repeat: true
          }
        ],
        'production'
      );
      if (!LS.hasOwnProperty(id)) {
        LS.setItem(id, JSON.stringify(json));
        interaction.prompt.prompt_message('Saved shared pattern.');
        interaction.pattern_manager.openPatternManager();
      }
    }
  }
}

window.share = {
  shareViaURL,
  receiveSharedContentFromURL
};

export default window.share;
