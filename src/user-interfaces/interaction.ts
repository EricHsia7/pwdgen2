import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
import Xsearch from '../core/search'
import { LS, setPassword, addPassword, listSavedPassword, modifyPassword, removePassword } from '../core/storage'
import icons from './icons'
import { openPatternCreator, closePatternCreator, generatePatternPreview, displayPatternComponentInfo, addIdentityToPattern, syncPatternCreatorJSONEditor, syncAndFormatPatternCreatorJSONEditor, initializePatternCreatorJSONEditor, removePatternComponentInfo, showComponentInEditor, addPatternWithCreator, displayAddPatternErrors, removeAddPatternErrors, switchEditor, go_to_documents } from './pattern-creator'
import { openPassword, closePassword, openAddPassword, closeAddPassword, addPasswordWithForm, printPatternPresets, applyPreset, openEditPassword, closeEditPassword, modifyPasswordWithEditor, deletePassword, confirmToDeletePassword } from './password'

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

function copyProperty(source: HTMLElement, target: HTMLElement, property: string): void {
  target.style.setProperty(property, source.style.getPropertyValue(property))
}

function loadCSS(url, identity) {
  if (!window.lazyCSS.loaded[identity]) {
    var link = document.createElement('link')
    link.setAttribute('href', url)
    link.setAttribute('rel', 'stylesheet')
    document.head.appendChild(link)
    window.lazyCSS.loaded[identity] = true
  }
}

type fadeType = 'In' | 'Out'
type fadeDisplay = 'none' | 'flex' | 'inline' | 'block' | 'inline-flex' | 'inline-block'
function fade(element: HTMLElement, type: fadeType, display: fadeDisplay, callback: Function | void) {
  var idchars = "0123456789abcdefghijklmnopqrstuvwxyz";
  var fade_id = "";
  for (var i = 0; i < 16; i++) {
    var idrandomNumber = Math.floor(Math.random() * idchars.length);
    fade_id += idchars.substring(idrandomNumber, idrandomNumber + 1);
  }
  var element_display = getComputedStyle(element).getPropertyValue('display')
  if (element_display === 'none') {
    if (display === 'flex') {
      element_display = 'flex'
    }
    else {
      element_display = 'block'
    }
  }
  var duration = 300
  var class_str = element.getAttribute('class')
  element.setAttribute('class', class_str.replaceAll(/fade-display-[a-z-]*[^\s]/gm, ''))
  var style_str = element.getAttribute('style')
  element.setAttribute('style', String(style_str).replaceAll(/display[\s]*:{1,1}[\sa-z-]*;{1,1}[^\s]*/gm, ''))
  element.classList.add(`fade${type}-${fade_id}`)
  var css = `.fadeIn-${fade_id} {display:${element_display};opacity:0} .fadeIn-${fade_id}-start{transition:${duration}ms;opacity:1;transition-timing-function:ease;} .fadeOut-${fade_id} {display:${element_display};opacity:1} .fadeOut-${fade_id}-start{transition:${duration}ms;opacity:0;transition-timing-function:linear;}`
  var css_style_element = document.createElement("style")
  css_style_element.innerHTML = css
  css_style_element.id = `fade-css-${fade_id}`
  element.appendChild(css_style_element)
  setTimeout(function () {
    element.classList.add(`fade${type}-${fade_id}-start`)
  }, 1)
  element.addEventListener('transitionend', function () {
    if (!(callback === undefined)) {
      if (typeof callback === "function") {
        callback()
      }
    }
    element.classList.remove(`fade${type}-${fade_id}-start`)
    element.classList.remove(`fade${type}-${fade_id}`)
    element.classList.add(`fade-display-${display}`)
    if (!(document.getElementById(`fade-css-${fade_id}`) === null)) {
      document.getElementById(`fade-css-${fade_id}`).remove()
    }
  }, { once: true })
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
  prompt_asking_elt.innerHTML = `<div class="prompt_asking_message">${message}</div><div class="prompt_asking_options"><div class="prompt_asking_option1" onclick="${option1_func};interaction.close_prompt_asking('${temporary_id}')">${option1}</div><div class="prompt_asking_option2" onclick="${option2_func};interaction.close_prompt_asking('${temporary_id}')">${option2}</div></div>`
  document.body.appendChild(mask_elt)
  document.body.appendChild(prompt_asking_elt)
  interaction.fade(utilities.qe(`body #${temporary_id}`), 'In', 'inline-flex')
  interaction.fade(utilities.qe(`body #${temporary_id}_mask`), 'In', 'block')
  utilities.qe(`body #${temporary_id}`).setAttribute('o', '1')
  interaction.standaloneStatusBarColor(2)
}

function close_prompt_asking(temporary_id) {
  utilities.qe(`body #${temporary_id}`).setAttribute('o', '0')
  interaction.fade(utilities.qe(`body #${temporary_id}`), 'Out', 'none', function () {
    utilities.qe(`body #${temporary_id}`).remove()
  })
  interaction.fade(utilities.qe(`body #${temporary_id}_mask`), 'Out', 'none', function () {
    utilities.qe(`body #${temporary_id}_mask`).remove()
  })
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
  else {
    interaction.standaloneStatusBarColor(0)
  }
}

function standaloneStatusBarColor(a) {
  var c = '#f2f2f7'
  var d = '#0a0a0b'
  if (a === 1) {
    c = '#ffffff'
    d = '#1c1c1e'
  }
  if (a === 2) {
    c = utilities.blendColors('#f2f2f7', 'rgba(0,0,0,0.45)')
    d = utilities.blendColors('#0a0a0b', 'rgba(0,0,0,0.45)')
  }
  utilities.qe('head meta[kji="light"]').setAttribute('content', c)
  utilities.qe('head meta[kji="dark"]').setAttribute('content', d)
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
  prompt_message(`Copied ${k}.`)
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
  }

  utilities.qe(".search-box").setAttribute('status', '1')
  utilities.qe(".search-box").setAttribute('sticky', 'true')
  utilities.qe(".search-box").setAttribute('transition', '1')
  utilities.qe(".search-box").addEventListener('transitionend', function () {
    utilities.qe(".search-box").setAttribute('transition', '0')
    Xsearch.searchIndex = Xsearch.createSearchIndex()
    interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
  }, { once: true })
  if (search_status === 0) {
    interaction.fade(utilities.qe('.search-output-box'), 'In', 'block')
    utilities.qe('.search-output-box').style.setProperty('--j-search-output-box-y', (utilities.qe(".search-box").offsetTop + 60) + 'px')
    utilities.qe(".search-output-box").setAttribute('status', '1')
  }
  interaction.standaloneStatusBarColor(1)
  search_status = 1
}

function closeSearch() {
  utilities.qe(".search-box").setAttribute('status', '0')
  utilities.qe(".search-output-box").setAttribute('status', '0')
  utilities.qe(".search-box").setAttribute('sticky', search_sticky)
  utilities.qe(".search-box").setAttribute('transition', '1')
  utilities.qe(".search-box").addEventListener('transitionend', function () {
    utilities.qe(".search-box").setAttribute('transition', '0')
  }, { once: true })
  utilities.qe('.search input#search').value = ''
  if (search_status === 1) {
    utilities.qe('.search-output-box').setAttribute('status', '0')
    interaction.fade(utilities.qe('.search-output-box'), 'Out', 'none')
  }
  if (!search_sticky) {
    interaction.standaloneStatusBarColor(0)
  }
  search_status = 0
}

function printSearch(search, element) {
  var html = []
  var array = (search.suggestions.length >= 1 ? [{ type: 3, title: "Suggestions" }] : []).concat(search.suggestions).concat(search.result.length >= 1 ? [{ type: 3, title: "Results" }] : []).concat(search.result)
  var array_len = array.length
  for (var i = 0; i < array_len; i++) {
    var t = array[i]
    if (t.type === 0) {
      var display_title = t.date
      var display_preview = (String(t.note).length > 0) ? (t.note).replaceAll(/\n/g, " ") : "note-free"
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

function refreshPage() {
  var p = [{
    "type": "regex",
    "regex": "/[a-zA-Z0-9]/g",
    "quantity": 16,
    "repeat": true
  }]
  location.replace('https://erichsia7.github.io/pwdgen2/?v=' + fine_grained_password.generate(p, 'production'))
}


window.interaction = {
  copyProperty,
  prompt_message,
  prompt_asking,
  close_prompt_asking,
  fade,
  generateHashTagHTML,
  copyElement,
  copyDetails,
  standaloneStatusBarColor,
  loadCSS,
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