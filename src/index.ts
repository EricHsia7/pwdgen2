import { checkPassword, checkCommonWordPatterns } from 'src/core/check-password'
import fine_grained_password from 'src/core/fine-grained-password'
import Xsearch from './search'
import { LS, listSavedPassword, searchItemsbyname, upgradeData, setPassword, addPassword } from './/core/storage'
import utilities from './/core/utilities'
import vjson from 'src/core/visual-json'
import words_list from './/core/words-list'
import icons from './user-interfaces/icons'
import interaction from './user-interfaces/interaction'
import sty from './user-interfaces/style'

import './user-interfaces/css/hljs.css'
import './user-interfaces/css/theme.css'
import './user-interfaces/css/index.css'
import './user-interfaces/css/container.css'
import './user-interfaces/css/button.css'
import './user-interfaces/css/options.css'
import './user-interfaces/css/pattern-creator.css'
import './user-interfaces/css/prompt.css'
import './user-interfaces/css/details.css'
import './user-interfaces/css/main-page/search.css'
import './user-interfaces/css/main-page/password-list.css'
import './user-interfaces/css/add-password/presets.css'
import './user-interfaces/css/fade.css'


window.password_page_icon_loaded = false
window.allhashtag = {}
window.search_status = 0
window.search_evt = 0
window.search_sticky = false
window.container_scrollTop = 0
window.pattern_creator_evt = 0
window.pattern_json = {}
window.pattern_box_visual_json = utilities.qe('.pattern_box_visual_json')
window.search_will_change_evt = [0, 1]
window.search_will_change_evt_list = ['touchstart', 'touchend', 'mouseenter', 'mouseleave']


window.initialize = function () {
  utilities.qe(".search").addEventListener("click", function (e) {
    interaction.openSearch()
  })
  utilities.qe(".search-box .search input#search").addEventListener("focus", function (e) {
    interaction.openSearch()
  })

  upgradeData()
  interaction.printSavedPasswordList()

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
        interaction.standaloneStatusBarColor(0)
      }
      search_sticky = false
    }
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
  words_list.getWordsList()
}

export default window.initialize