// Import required functions
import searchItemsbyname from 'src/core/storage';
import utilities from './utilities';
import { LS } from './storage';

function getWordsList() {
  if (!words_list.loaded) {
    if (LS.hasOwnProperty('pwdgen2_words_list_cache')) {
      var text = String(LS.getItem('pwdgen2_words_list_cache'));
      var array = text.split(/\n/g).forEach((e) => {
        if (words_list.c.hasOwnProperty(e.substring(0, 3))) {
          words_list.c[e.substring(0, 3)].push(e);
        } else {
          words_list.c[e.substring(0, 3)] = [e];
        }
      });
      words_list.loaded = true;
      return '';
    }
    var url: string = `https://erichsia7.github.io/pwdgen2/words_list/index.txt?${new Date().getTime()}`;
    var handleProgress = function (progress) {
      words_list.progress = progress;
    };
    utilities
      .fetchWithProgress(url, handleProgress)
      .then(function (text) {
        var array = text.split(/\n/g).forEach((e) => {
          if (words_list.c.hasOwnProperty(e.substring(0, 3))) {
            words_list.c[e.substring(0, 3)].push(e);
          } else {
            words_list.c[e.substring(0, 3)] = [e];
          }
        });
        words_list.loaded = true;
        LS.setItem('pwdgen2_words_list_cache', text);
      })
      .catch((error) => {
        //console.error('Error fetching URL:', error);
      });
  }
}

// Expose functions to the global scope
window.words_list = { loaded: false, progress: 0, c: {}, getWordsList: getWordsList };

export default window.words_list;
