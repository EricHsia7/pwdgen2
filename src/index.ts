import { buildSearchIndex } from './core/search';
import { upgradeData, importdatahandler } from './core/storage';
import utilities, { documentQuerySelector } from './core/utilities';
import words_list from './core/words-list';
import interaction from './user-interfaces/interaction';
import Xshare from './core/share';

import './user-interfaces/css/hljs.css';
import './user-interfaces/css/theme.css';
import './user-interfaces/css/index.css';
import './user-interfaces/css/container.css';
import './user-interfaces/css/button.css';
import './user-interfaces/css/options.css';
import './user-interfaces/css/prompt.css';
import './user-interfaces/css/details.css';
import './user-interfaces/css/pattern-editor.css';
import './user-interfaces/css/pattern-manager.css';
import './user-interfaces/css/main-page/search.css';
import './user-interfaces/css/main-page/password-list.css';
import './user-interfaces/css/add-password/presets.css';
import './user-interfaces/css/show.css';

//for development

window.password_page_icon_loaded = false;
window.allhashtag = {};
window.search_status = 0;
window.search_sticky = false;
window.container_scrollTop = 0;
window.pattern_editor_evt = 0;
window.pattern_editor_blocks_json = documentQuerySelector('.pattern_editor_blocks_json');
window.search_will_change_evt = [0, 1];
window.search_will_change_evt_list = ['touchstart', 'touchend', 'mouseenter', 'mouseleave'];

window.pwdgen2 = function () {
  //initialize
  documentQuerySelector('.search').addEventListener('click', function (e) {
    interaction.search.openSearch();
  });
  documentQuerySelector('.search-box .search input#search').addEventListener('focus', function (e) {
    interaction.search.openSearch();
  });

  documentQuerySelector('.main-page').addEventListener('scroll', function (e) {
    container_scrollTop = documentQuerySelector('.main-page').scrollTop;
    var scale = 1;
    if (container_scrollTop < 0) {
      scale = 1 + Math.abs(container_scrollTop) / 500;
      if (scale > 1.3) {
        scale = 1.3;
      }
    }
    documentQuerySelector('.main-page .title').style.setProperty('--scroll-scale', scale);
    if (container_scrollTop >= 50) {
      documentQuerySelector('.main-page .search-box').setAttribute('sticky', 'true');
      documentQuerySelector('.main-page .fixed-title-box').setAttribute('sticky', 'true');
      documentQuerySelector('.main-page .fixed-title-box-mask').setAttribute('sticky', 'true');
      if (!(search_status === 1)) {
        interaction.SASBC(1);
      }
      search_sticky = true;
    } else {
      documentQuerySelector('.main-page .search-box').setAttribute('sticky', 'false');
      documentQuerySelector('.main-page .fixed-title-box').setAttribute('sticky', 'false');
      documentQuerySelector('.main-page .fixed-title-box-mask').setAttribute('sticky', 'false');
      if (!(search_status === 1)) {
        interaction.SASBC(3);
      }
      search_sticky = false;
    }
    interaction.main_page.lazyLoadPasswordListIcons_scrolling_handler();
  });

  documentQuerySelector('.password-page').addEventListener('scroll', function (e) {
    var scrollTop = documentQuerySelector('.password-page').scrollTop;
    if (scrollTop > 0) {
      documentQuerySelector('.password-page .fixed-title-box').setAttribute('scroll', '1');
      interaction.SASBC(1);
    } else {
      documentQuerySelector('.password-page .fixed-title-box').setAttribute('scroll', '0');
      interaction.SASBC(3);
    }
  });

  documentQuerySelector('.add-password-page').addEventListener('scroll', function (e) {
    var scrollTop = documentQuerySelector('.add-password-page').scrollTop;
    if (scrollTop > 0) {
      documentQuerySelector('.add-password-page .fixed-title-box').setAttribute('scroll', '1');
      interaction.SASBC(1);
    } else {
      documentQuerySelector('.add-password-page .fixed-title-box').setAttribute('scroll', '0');
      interaction.SASBC(3);
    }
  });

  documentQuerySelector('.edit-password-page').addEventListener('scroll', function (e) {
    var scrollTop = documentQuerySelector('.edit-password-page').scrollTop;
    if (scrollTop > 0) {
      documentQuerySelector('.edit-password-page .fixed-title-box').setAttribute('scroll', '1');
      interaction.SASBC(1);
    } else {
      documentQuerySelector('.edit-password-page .fixed-title-box').setAttribute('scroll', '0');
      interaction.SASBC(3);
    }
  });

  documentQuerySelector('.pattern_editor').addEventListener('scroll', function (e) {
    var scrollTop = documentQuerySelector('.pattern_editor').scrollTop;
    if (scrollTop > 0) {
      documentQuerySelector('.pattern_editor .fixed-title-box').setAttribute('scroll', '1');
      interaction.SASBC(1);
    } else {
      documentQuerySelector('.pattern_editor .fixed-title-box').setAttribute('scroll', '0');
      interaction.SASBC(3);
    }
  });

  if (!utilities.checkTouchFeatures()) {
    search_will_change_evt = [2, 3];
  }

  documentQuerySelector('#importdata').addEventListener('change', importdatahandler, false);

  words_list.getWordsList();
  interaction.loadFont('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap', 'Noto Sans', 'googleFontsNotoSans');

  upgradeData();
  buildSearchIndex();

  setTimeout(function () {
    interaction.main_page.printSavedPasswordList();
    Xshare.receiveSharedContentFromURL(location.href);
  }, 700);
};

export default window.pwdgen2;
