import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
import Xsearch from '../core/search'
import { LS, setPassword, addPassword, listSavedPassword, modifyPassword, removePassword, generateExportFile } from '../core/storage'
import icons from './icons'
import { openPatternCreator, closePatternCreator, generatePatternPreview, displayPatternComponentInfo, addIdentityToPattern, syncPatternCreatorJSONEditor, syncAndFormatPatternCreatorJSONEditor, initializePatternCreatorJSONEditor, removePatternComponentInfo, showComponentInEditor, addPatternWithCreator, displayAddPatternErrors, removeAddPatternErrors, switchEditor, go_to_documents } from './pattern-creator'
import { openPassword, closePassword, openAddPassword, closeAddPassword, addPasswordWithForm, printPatternPresets, applyPreset, openEditPassword, closeEditPassword, modifyPasswordWithEditor, deletePassword, confirmToDeletePassword } from './password'

var FontFaceObserver = require('fontfaceobserver');
const standaloneStatusBarColorHistory: number[] = [0, 0, 0]

window.search_evt = 0

window.lazyCSS = {
  loaded: {
    'googleFontsNotoSans': false,
    'googleFontsMaterialSymbols': false
  }
}

window.lazyPasswordListIcons = {
  unloaded: [],
  loaded: []
}


function lazyLoadPasswordListIcon(identity, url) {
  var item_elt = utilities.qe(`.password-list .password-item[pwd-id="${identity}"]`)
  var icon_elt = item_elt.querySelector('.password-item-website-icon')
  if (item_elt.getAttribute('icon') === '0') {
    var index = window.lazyPasswordListIcons.unloaded.indexOf(identity)
    if (index > -1) {
      window.lazyPasswordListIcons.unloaded.splice(index, 1)
      window.lazyPasswordListIcons.loaded.push(identity)
      item_elt.setAttribute('icon', '1')
      icon_elt.style.setProperty('--j-website-icon', `url(${url})`)
    }
  }
}

function lazyLoadPasswordListIcons_scrolling_handler(event): void {
  var isElementInViewport = function (container, element) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerLeft = containerRect.left;
    const containerBottom = containerRect.bottom;
    const containerRight = containerRect.right;
    const elementTop = elementRect.top;
    const elementLeft = elementRect.left;
    const elementBottom = elementRect.bottom;
    const elementRight = elementRect.right;
    const isInViewport = (
      elementTop >= containerTop &&
      elementLeft >= containerLeft &&
      elementBottom <= containerBottom &&
      elementRight <= containerRight
    );

    return isInViewport;
  }

  var container = utilities.qe('.main-page .contents-box'); // Replace 'container' with your container's ID or reference
  var allPasswordElt = utilities.qeAll('.main-page .contents-box .password-list .password-item')
  var allPasswordElt_len = allPasswordElt.length

  for (var o = 0; o < allPasswordElt_len; o++) {
    if (isElementInViewport(container, allPasswordElt[o])) {
      var this_id = allPasswordElt[o].getAttribute('pwd-id')
      if (!(window.lazyPasswordListIcons.unloaded.indexOf(this_id) > -1)) {
        window.lazyPasswordListIcons.unloaded.push(this_id)
      }
      interaction.main_page.lazyLoadPasswordListIcon(this_id, allPasswordElt[o].getAttribute('icon-url'))
    }
  }
}

function loadCSS(url: string, identity: string) {
  if (!window.lazyCSS.loaded[identity]) {
    var link = document.createElement('link')
    link.setAttribute('href', url)
    link.setAttribute('rel', 'stylesheet')
    document.head.appendChild(link)
    window.lazyCSS.loaded[identity] = true
  }
}

function loadFont(url: string, fontName: string, identity: string, loadedCallback: Function) {
  loadCSS(url, identity)
  if (typeof loadedCallback === 'function') {
    var font = new FontFaceObserver(fontName);
    font.load().then(function () {
      loadedCallback()
    });
  }
}

type showDisplay = 'none' | 'flex' | 'inline' | 'block' | 'inline-flex' | 'inline-block'
function show(element: HTMLElement, display: showDisplay, callback: Function | void) {
  var class_str = element.getAttribute('class')
  var style_str = element.getAttribute('style')
  element.setAttribute('class', class_str.replaceAll(/show-display-[a-z-]*[^\s]/gm, ''))
  element.setAttribute('style', String(style_str).replaceAll(/display[\s]*:{1,1}[\sa-z-]*;{1,1}[^\s]*/gm, ''))
  element.classList.add(`show-display-${display}`)
  if (typeof callback === 'function') {
    callback()
  }
}

function prompt_message(message, duration) {
  if (isNaN(duration)) {
    duration = 1200
  }
  message = String(message)
  var all_prompt = utilities.qeAll('.prompt')
  if (!(all_prompt === null)) {
    var all_prompt_len = all_prompt.length
    for (var e = 0; e < all_prompt_len; e++) {
      all_prompt[e].remove()
    }
  }
  var duration_base: number = 180
  var translateY: number = -25
  var prompt_id: string = fine_grained_password.generate([
    {
      type: 'string',
      string: 'p_'
    },
    {
      type: 'regex',
      regex: '/[a-z0-9]/g',
      quantity: 16,
      repeat: true
    }
  ], 'production')
  var prompt_element = document.createElement('div')
  prompt_element.id = prompt_id
  prompt_element.classList.add('prompt')
  prompt_element.classList.add('prompt_animation_' + prompt_id)
  var prompt_center_element = document.createElement('div')
  prompt_center_element.classList.add('prompt_content')
  prompt_center_element.innerText = message
  prompt_element.appendChild(prompt_center_element)
  var prompt_css = `.prompt_animation_${prompt_id}{animation-timing-function:cubic-bezier(.21,.75,.1,.96);animation-name:prompt${prompt_id};animation-duration:${(duration + duration_base * 2)}ms;animation-fill-mode:forwards;animation-timing-function:ease-in-out}@keyframes prompt${prompt_id}{0%{opacity:0;transform:translateX(-50%) translateY(${translateY}px) scale(0.8);}${Math.floor((duration_base) / (duration + duration_base + 150) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px)) scale(1);}${Math.floor((duration_base + duration) / (duration + duration_base + 150) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px)) scale(1);}100%{opacity:0;transform:translateX(-50%) translateY(${translateY}px) scale(1);}}`
  var prompt_css_element = document.createElement('style')
  prompt_css_element.innerHTML = prompt_css
  prompt_element.appendChild(prompt_css_element)
  document.body.appendChild(prompt_element)
  document.getElementById(prompt_id).addEventListener('animationend', function () {
    if (!(document.getElementById(prompt_id) === null)) {
      document.getElementById(prompt_id).remove()
    }
  }, { once: true })
}

function prompt_asking(message: string, option1: string, option1_func: string, option2: string, option2_func: string) {
  var temporary_id = fine_grained_password.generate([
    {
      type: 'string',
      string: 'a-'
    },
    {
      type: "regex",
      regex: "/[a-z0-9]/g",
      quantity: 16,
      repeat: true
    }
  ], 'production')

  var mask_elt = document.createElement('div')
  mask_elt.classList.add('prompt_asking_mask')
  mask_elt.id = `${temporary_id}_mask`
  var prompt_asking_elt = document.createElement('div')
  prompt_asking_elt.classList.add('prompt_asking')
  prompt_asking_elt.id = temporary_id
  prompt_asking_elt.innerHTML = `<div class="prompt_asking_message">${message}</div><div class="prompt_asking_options"><div class="prompt_asking_option1" onclick="${option1_func};interaction.prompt.close_prompt_asking('${temporary_id}')">${option1}</div><div class="prompt_asking_option2" onclick="${option2_func};interaction.prompt.close_prompt_asking('${temporary_id}')">${option2}</div></div>`
  document.body.appendChild(mask_elt)
  document.body.appendChild(prompt_asking_elt)
  setTimeout(function () {
    utilities.qe(`body #${temporary_id}`).setAttribute('o', '1')
    utilities.qe(`body #${temporary_id}_mask`).setAttribute('o', '1')
  }, 1);
  interaction.standaloneStatusBarColor(2)
}

function close_prompt_asking(temporary_id) {
  utilities.qe(`body #${temporary_id}`).addEventListener('transitionend', function () {
    utilities.qe(`body #${temporary_id}`).remove()
  }, { once: true })
  utilities.qe(`body #${temporary_id}_mask`).addEventListener('transitionend', function () {
    utilities.qe(`body #${temporary_id}_mask`).remove()
  }, { once: true })
  utilities.qe(`body #${temporary_id}`).setAttribute('o', '0')
  utilities.qe(`body #${temporary_id}_mask`).setAttribute('o', '0')
  interaction.standaloneStatusBarColor(3)
}

function standaloneStatusBarColor(a) {
  var c = '#f2f2f7'
  var d = '#000000'
  if (a === 1) {
    c = '#ffffff'
    d = '#0a0a0a'
  }
  if (a === 2) {
    c = utilities.blendColors('#f2f2f7', 'rgba(0,0,0,0.45)')
    d = utilities.blendColors('#0a0a0a', 'rgba(0,0,0,0.45)')
  }
  if (a === 3) {
    var a2 = interaction.standaloneStatusBarColorHistory[interaction.standaloneStatusBarColorHistory.length - 2] | 0
    interaction.standaloneStatusBarColorHistory.splice(standaloneStatusBarColorHistory.length - 1, 1)
    interaction.standaloneStatusBarColor(a2)
    return ''
  }
  utilities.qe('head meta[kji="light"]').setAttribute('content', c)
  utilities.qe('head meta[kji="dark"]').setAttribute('content', d)
  if (!(interaction.standaloneStatusBarColorHistory[interaction.standaloneStatusBarColorHistory.length - 1] === a)) {
    //if (!(a === 2)) {
    interaction.standaloneStatusBarColorHistory.push(a)
    //}
    // else {
    //}
  }
  if (interaction.standaloneStatusBarColorHistory.length > 15) {
    interaction.standaloneStatusBarColorHistory = interaction.standaloneStatusBarColorHistory.slice(interaction.standaloneStatusBarColorHistory.length - 11, interaction.standaloneStatusBarColorHistory.length - 1)
  }
}



function generateHashTagHTML(plain_text) {
  var hashtags = utilities.gethashtags(plain_text, false)
  var hashtags_len = hashtags.length
  for (var w = 0; w < hashtags_len; w++) {
    plain_text = plain_text.replaceAll(hashtags[w], `<span class="hashtag">${hashtags[w]}</span>`)
  }
  return plain_text
}



function copyElement(selector) {
  if (utilities.qe(selector).tagName === "INPUT" || utilities.qe(selector).tagName === "TEXTAREA") {
    var copyText = utilities.qe(selector).value;
  }
  else {
    var copyText = utilities.qe(selector).textContent;
  }

  var textArea = document.createElement("textarea");
  textArea.value = copyText;
  textArea.setAttribute('readonly', 'readonly')
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}

function copyDetails(k) {
  interaction.copyElement(`.password-page .details-item-value[k="${k}"] input`)
  if (k === 'createdat') {
    k = 'create time'
  }
  interaction.prompt.prompt_message(`Copied ${k}.`)
}


function openSearch() {
  if (search_evt === 0) {
    utilities.qe(".search input#search").addEventListener("selectionchange", function (e) {
      interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
    })
    utilities.qe(".search input#search").addEventListener("keyup", function (e) {
      interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
    })
    utilities.qe(".search input#search").addEventListener("cut", function (e) {
      interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
    })
    utilities.qe(".search input#search").addEventListener("paste", function (e) {
      interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
    })
    utilities.qe(".search input#search").addEventListener("copy", function (e) {
      interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
    })

    document.addEventListener("selectionchange", function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
      }
    })
    document.addEventListener("keyup", function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
      }
    })
    document.addEventListener("cut", function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
      }
    })
    document.addEventListener("paste", function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
      }
    })
    document.addEventListener("copy", function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
      }
    })
    search_evt = 1
  }
  utilities.qe('.main-page .blur-mask').setAttribute('status', '1')
  utilities.qe('.main-page .fixed-title-box').setAttribute('status', '1')
  utilities.qe(".main-page .search-output-box").setAttribute('status', '1')
  utilities.qe(".main-page .search-box").setAttribute('status', '1')
  utilities.qe(".main-page .search-box").setAttribute('sticky', 'true')
  Xsearch.searchIndex = Xsearch.createSearchIndex()
  interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
  interaction.standaloneStatusBarColor(1)
  search_status = 1
}

function closeSearch() {
  utilities.qe('.main-page .blur-mask').setAttribute('status', '0')
  utilities.qe('.main-page .fixed-title-box').setAttribute('status', '0')
  utilities.qe(".main-page .search-output-box").setAttribute('status', '0')
  utilities.qe(".main-page .search-box").setAttribute('status', '0')
  utilities.qe(".main-page .search-box").setAttribute('sticky', search_sticky)
  utilities.qe('.main-page .search input#search').value = ''
  if (!search_sticky) {
    interaction.standaloneStatusBarColor(3)
  }
  search_status = 0
}

function highlightKeywordWithLimitedContext(originalString, keyword, contextLength) {
  const regex = new RegExp(keyword, 'gi');
  const matches = [];
  var match;
  while ((match = regex.exec(originalString)) !== null) {
    matches.push(match);
  }
  contextLength -= keyword.length
  contextLength = Math.floor(contextLength / 2)
  const contextStart = contextLength;
  const contextEnd = contextLength;

  var highlightedString = originalString;
  for (var i = matches.length - 1; i >= 0; i--) {
    const startIndex = matches[i].index;
    const endIndex = matches[i].index + keyword.length;
    const contextStartIndex = Math.max(0, startIndex - contextStart);
    const contextEndIndex = Math.min(originalString.length, endIndex + contextEnd);
    const prefix = contextStartIndex > 0 ? '...' : '';
    const postfix = contextEndIndex < originalString.length ? '...' : '';
    const context = originalString.substring(contextStartIndex, contextEndIndex);
    const highlightedContext = context.replace(regex, match => `<span class="search-bold">${match}</span>`);
    highlightedString = prefix + highlightedContext + postfix
  }
  return highlightedString
}

function printSearch(search, element) {
  var html = []
  var array = (search.suggestions.length >= 1 ? [{ type: 3, title: "Suggestions" }] : []).concat(search.suggestions).concat(search.result.length >= 1 ? [{ type: 3, title: "Results" }] : []).concat(search.result)
  var array_len = array.length
  for (var i = 0; i < array_len; i++) {
    var t = array[i]
    if (t.type === 0) {
      var display_title = t.date
      var display_preview = (String(t.all).length > 0) ? highlightKeywordWithLimitedContext((t.all).replaceAll(/\n/g, " "), search.query, 15) : "note-free"
      var display_icon = icons.icon_password
      var elt_class = "search-item"
      var elt_action = `interaction.password_page.openPassword('${t.id}')`
    }
    if (t.type === 1) {
      var display_title = String(t.suggestion).substring(1)
      var display_preview = ""
      var display_icon = icons.icon_hashtag
      var elt_class = "search-suggestion"
      var elt_action = `interaction.search.setSearchQuery('${t.suggestion}')`
    }
    if (t.type === 2) {
      var display_title = t.suggestion
      var display_preview = ""
      var display_icon = icons.icon_date
      var elt_class = "search-suggestion"
      var elt_action = `interaction.search.setSearchQuery('${t.suggestion}')`
    }
    if (t.type === 3) {
      var display_title = t.title
      var display_preview = ""
      var display_icon = ""
      var elt_class = "search-category"
      var elt_action = ""
    }
    if (t.type === 4) {
      var display_title = t.suggestion
      var display_preview = ""
      var display_icon = icons.icon_text
      var elt_class = "search-suggestion"
      var elt_action = `interaction.search.setSearchQuery('${t.suggestion}')`
    }
    var t_html = `<div class="${elt_class}" onclick="${elt_action}"><div class="${elt_class}-icon">${display_icon}</div><div class="${elt_class}-title">${display_title}</div><div class="${elt_class}-preview">${display_preview}</div></div>`
    html.push(t_html)
  }
  element.innerHTML = html.join('')
}

function updateSearch(query, index) {
  var search = Xsearch.search_passwords(String(query).toLowerCase(), index)
  interaction.search.printSearch(search, utilities.qe(".search-output"))
}

function setSearchQuery(q) {
  utilities.qe(".search input#search").value = q
  updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
}



function printSavedPasswordList(): void {
  var list = listSavedPassword()
  var list_len = list.length
  var html = []
  for (var k = 0; k < list_len; k++) {
    var tags = []
    html.push(`<div class="password-item" onclick="interaction.password_page.openPassword('${list[k].id}')" pwd-id="${list[k].id}" icon="0" icon-url="${list[k].website_icon}"><div class="password-item-website-icon" style="--j-website-icon:var(--p-e5e5ea)"></div><div class="password-item-title">${utilities.timestr(new Date(list[k].time_stamp))}</div><div class="password-item-tags">${tags}</div><div class="password-open-icon">${icons.icon_arrow}</div></div>`)
  }
  utilities.qe(".password-list").innerHTML = html.join('')
  interaction.main_page.lazyLoadPasswordListIcons_scrolling_handler()
}



function openOptions(r) {
  utilities.qe('.options_mask').style.setProperty('display', 'block')
  utilities.qe('.options').style.setProperty('display', 'inline-block')
  utilities.qe('.options').style.setProperty('--js-options-list-count', utilities.qeAll(`.options li[group="${r}"]`).length)
  var all_options = utilities.qeAll('.options li')
  var all_options_len = all_options.length
  for (var f = 0; f < all_options_len; f++) {
    all_options[f].setAttribute('d', '0')
  }

  var all_options_in_group = utilities.qeAll(`.options li[group="${r}"]`)
  var all_options_in_group_len = all_options_in_group.length
  for (var f = 0; f < all_options_in_group_len; f++) {
    all_options_in_group[f].setAttribute('d', '1')
  }

  setTimeout(function () {
    utilities.qe('.options').setAttribute('k', '1')
  }, 1)
  utilities.qe('#options_css').innerHTML = '.options li{display:none;}.options li[group="' + r + '"] {display:flex;}'
}

function closeOptions(event) {
  event.stopPropagation()
  utilities.qe('.options').setAttribute('k', '0')
  utilities.qe('.options').addEventListener('transitionend', function () {
    utilities.qe('.options').style.setProperty('display', 'none')
    utilities.qe('.options_mask').style.setProperty('display', 'none')
  }, { once: true })
}

function viewOnGithub() {
  window.open('https://github.com/EricHsia7/pwdgen2')
}

function refreshPage(event) {
  if (navigator.onLine) {
    var p = [{
      "type": "regex",
      "regex": "/[a-zA-Z0-9]/g",
      "quantity": 16,
      "repeat": true
    }]
    location.replace('https://erichsia7.github.io/pwdgen2/?v=' + fine_grained_password.generate(p, 'production'))
  } else {
    const offline_message: string = 'You’re offline, and updates are unavailable.'
    interaction.prompt.prompt_message(offline_message, 3000)
    interaction.options.closeOptions(event)
  }
}

function importData(event) {
  utilities.qe('#importdata').click()
  interaction.options.closeOptions(event)
}

function exportGeneratedFile(event) {
  var text = generateExportFile()
  var data = new Blob([text], { type: 'application/json' })
  var name = fine_grained_password.generate([
    {
      type: 'string',
      string: 'pwdgen2_export_'
    },
    {
      type: 'regex',
      regex: '/[A-Z0-9a-z]/g',
      quantity: 16,
      repeat: true
    }
  ], 'production')
  const fileObj = new File([data], name + '.json', { type: data.type })
  if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
    navigator.share({
      files: [fileObj]
    }).then(() => {
      interaction.options.closeOptions(event)
    }).catch((error) => {
    });
  }
  else {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = `${name}.json`;
    a.href = window.URL.createObjectURL(data);
    a.click()
    a.remove()
    interaction.options.closeOptions(event)
  }
}

window.interaction = {
  prompt: {
    prompt_message,
    prompt_asking,
    close_prompt_asking
  },
  show,
  generateHashTagHTML,
  copyElement,
  copyDetails,
  standaloneStatusBarColor,
  standaloneStatusBarColorHistory,
  loadCSS,
  loadFont,
  importData,
  exportGeneratedFile,
  search: {
    openSearch,
    closeSearch,
    updateSearch,
    setSearchQuery,
    printSearch
  },
  add_password: {
    openAddPassword,
    closeAddPassword,
    addPasswordWithForm,
    printPatternPresets,
    applyPreset
  },
  edit_password: {
    openEditPassword,
    closeEditPassword,
    modifyPasswordWithEditor
  },
  options: {
    openOptions,
    closeOptions,
    refreshPage,
    viewOnGithub
  },
  pattern_creator: {
    openPatternCreator,
    closePatternCreator,
    generatePatternPreview,
    displayPatternComponentInfo,
    addIdentityToPattern,
    syncPatternCreatorJSONEditor,
    syncAndFormatPatternCreatorJSONEditor,
    initializePatternCreatorJSONEditor,
    removePatternComponentInfo,
    showComponentInEditor,
    addPatternWithCreator,
    displayAddPatternErrors,
    removeAddPatternErrors,
    switchEditor,
    go_to_documents
  },
  password_page: {
    openPassword,
    closePassword,
    deletePassword,
    confirmToDeletePassword
  },
  main_page: {
    printSavedPasswordList,
    lazyLoadPasswordListIcon,
    lazyLoadPasswordListIcons_scrolling_handler
  }
}

export default window.interaction