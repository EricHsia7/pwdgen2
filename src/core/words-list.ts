import searchItemsbyname from 'src/core/storage'
import utilities from './utilities'
import { LS } from './/core/storage'


function getWordsList() {
  if (!words_list.loaded) {
    if (LS.hasOwnProperty('pwdgen2_words_list_cache')) {
      var text = String(LS.getItem('pwdgen2_words_list_cache'))
      var array = text.split(/\n/g).forEach(e => {
        if (words_list.c.hasOwnProperty(e.substring(0, 3))) {
          words_list.c[e.substring(0, 3)].push(e)
        }
        else {
          words_list.c[e.substring(0, 3)] = [e]
        }
      })
      words_list.loaded = true
      return ''
    }
    var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLnA8hJhyZ8V7ZxrgeF6l7kIHahobdTqkXwdmEcBgbC0UNdSFCU1dy7wuFMOzuq_DBx49uzCjknOMJ/pub?gid=0&single=true&output=csv&' + new Date().getTime();
    var handleProgress = function (progress) {
      words_list.progress = progress
    }
    utilities.fetchWithProgress(url, handleProgress).then(function (text) {
      var array = text.split(/\n/g).forEach(e => {
        if (words_list.c.hasOwnProperty(e.substring(0, 3))) {
          words_list.c[e.substring(0, 3)].push(e)
        }
        else {
          words_list.c[e.substring(0, 3)] = [e]
        }
      })
      words_list.loaded = true
      LS.setItem('pwdgen2_words_list_cache', text)
    }).catch(error => {
      //console.error('Error fetching URL:', error);
    });
  }
}

const words_list = { 'loaded': false, 'progress': 0, 'c': {}, 'getWordsList': getWordsList }


export default words_list