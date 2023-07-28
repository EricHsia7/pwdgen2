import { checkPassword, checkCommonWordPatterns } from 'src/core/check-password'
import fine_grained_password from 'src/core/fine-grained-password'
import Xsearch from './core/search'
import { LS, listSavedPassword, searchItemsbyname, upgradeData, setPassword, addPassword, importdatahandler } from './/core/storage'
import utilities from './core/utilities'
import bjson from 'src/core/blocks-json'
import words_list from './core/words-list'
import icons from './user-interfaces/icons'
import interaction from './user-interfaces/interaction'

import './user-interfaces/css/hljs.css'
import './user-interfaces/css/theme.css'
import './user-interfaces/css/index.css'
import './user-interfaces/css/container.css'
import './user-interfaces/css/button.css'
import './user-interfaces/css/options.css'
import './user-interfaces/css/prompt.css'
import './user-interfaces/css/details.css'
import './user-interfaces/css/pattern-creator.css'
import './user-interfaces/css/main-page/search.css'
import './user-interfaces/css/main-page/password-list.css'
import './user-interfaces/css/add-password/presets.css'
import './user-interfaces/css/fade.css'



//for development
const ErrorStackParser = require('error-stack-parser');
const StackTrace = require('stacktrace-js');

window.onerror = async function (message, source, lineno, colno, error) {
  StackTrace.fromError(error).then(function (stackTrace) {
    var parsedStackTrace = stackTrace.map(function (frame) {
      return {
        functionName: frame.functionName,
        fileName: frame.fileName,
        lineNumber: frame.lineNumber,
        columnNumber: frame.columnNumber,
      };
    });
    console.log('%c ----------', "color: #888;")
    parsedStackTrace.forEach(e => {
      console.log(`%c func: ${e.functionName}\npath: ${e.fileName}\nlocation: L${e.lineNumber} C${e.columnNumber}`, "color: rgba(255,0,0,1); background-color: rgba(255,0,0,0.09);");
    });
  });
};

/*
declare global {
interface Window {
password_page_icon_loaded: Boolean;
allhashtag: Object;
search_status: Number;
search_evt: Number;
search_sticky: Boolean;
container_scrollTop: Number;
pattern_creator_evt: Number;
pattern_json: Object;
pattern_editor_blocks_json: any
search_will_change_evt: Object
search_will_change_evt_list: Object
}
}
*/

window.password_page_icon_loaded = false
window.allhashtag = {}
window.search_status = 0
window.search_sticky = false
window.container_scrollTop = 0
window.pattern_creator_evt = 0
window.pattern_editor_blocks_json = utilities.qe('.pattern_editor_blocks_json')
window.search_will_change_evt = [0, 1]
window.search_will_change_evt_list = ['touchstart', 'touchend', 'mouseenter', 'mouseleave']


window.pwdgen2 = function () { //initialize
  utilities.qe(".search").addEventListener("click", function (e) {
    interaction.search.openSearch()
  })
  utilities.qe(".search-box .search input#search").addEventListener("focus", function (e) {
    interaction.search.openSearch()
  })

  utilities.qe('.main-page').addEventListener('scroll', function (e) {
    container_scrollTop = utilities.qe('.main-page').scrollTop
    var scale = 1
    if (container_scrollTop < 0) {
      scale = 1 + (Math.abs(container_scrollTop) / 500)
      if (scale > 1.3) {
        scale = 1.3
      }
    }
    utilities.qe('.main-page .title').style.setProperty('--scroll-scale', scale)
    if (container_scrollTop >= 50) {
      utilities.qe('.main-page .search-box').setAttribute('sticky', 'true')
      utilities.qe('.main-page .fixed-title-box').setAttribute('sticky', 'true')
      if (!(search_status === 1)) {
        interaction.standaloneStatusBarColor(1)

      }
      search_sticky = true
    }
    else {
      utilities.qe('.main-page .search-box').setAttribute('sticky', 'false')
      utilities.qe('.main-page .fixed-title-box').setAttribute('sticky', 'false')
      if (!(search_status === 1)) {
        interaction.standaloneStatusBarColor(3)
      }
      search_sticky = false
    }
    interaction.main_page.lazyLoadPasswordListIcons_scrolling_handler()
  })

  if (!utilities.checkTouchFeatures()) {
    search_will_change_evt = [2, 3]
  }

  utilities.qe(".search-box").addEventListener(search_will_change_evt_list[search_will_change_evt[0]], function () {
    utilities.qe(".search-box").setAttribute('will-change', '1')
    utilities.qe(".search").setAttribute('will-change', '1')
  })

  utilities.qe(".search-box").addEventListener(search_will_change_evt_list[search_will_change_evt[1]], function () {
    utilities.qe(".search-box").setAttribute('will-change', '0')
    utilities.qe(".search").setAttribute('will-change', '0')
  })

  utilities.qe("#importdata").addEventListener("change", importdatahandler, false)

  words_list.getWordsList()
  interaction.loadCSS('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap', 'googleFontsNotoSans')

  upgradeData()
  Xsearch.searchIndex = Xsearch.createSearchIndex()

  setTimeout(function () {
    interaction.main_page.printSavedPasswordList()
  }, 700);
}

export default window.pwdgen2