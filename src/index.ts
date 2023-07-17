import { checkPassword, checkCommonWordPatterns } from 'src/core/check-password'

import fine_grained_password from 'src/core/fine-grained-password'

import Xsearch from './search'

import { LS, listSavedPassword, searchItemsbyname, upgradeData, setPassword, addPassword } from './/core/storage'

import utilities from './/core/utilities'

import vjson from 'src/core/visual-json'

import words_list from './/core/words-list'

import icons from './user-interfaces/icons'

import interaction from './user-interfaces/interaction'


const password_page_icon_loaded: boolean = false
const allhashtag: object = {}
const search_status: number = 0
const search_evt: number = 0
const search_sticky: boolean = false
const container_scrollTop: number = 0
const pattern_creator_evt: number = 0
const pattern_json: object = {}
const pattern_box_visual_json = utilities.qe('.pattern_box_visual_json')



window.initialize = function () {
  utilities.qe(".search").addEventListener("click", function (e) {
    interaction.openSearch()
  })
  utilities.qe(".search-box .search input#search").addEventListener("focus", function (e) {
    interaction.openSearch()
  })

  upgradeData()
  printSavedPasswordList()

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
  var search_will_change_evt_list = ['touchstart', 'touchend', 'mouseenter', 'mouseleave']
  search_will_change_evt = [0, 1]
  if (!checkTouchFeatures()) {
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