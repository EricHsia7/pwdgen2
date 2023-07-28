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

const standaloneStatusBarColorHistory: number[] = [0, 0, 0]

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
  interaction.standaloneStatusBarColor(3)
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
  prompt_message(`Copied ${k}.`)
}

function openSearchTransition() {
  var search_elt = utilities.qe('.main-page .search')
  search_elt.setAttribute('transition', '1')
  search_elt.setAttribute('status', '1')
  search_elt.setAttribute('sticky', 'true')
  var search_elt_rect = search_elt.getBoundingClientRect()
  var transition_elt = document.createElement('div')
  transition_elt.classList.add('search-transition')
  var temporary_id = fine_grained_password.generate([
    {
      type: 'string',
      string: 'st-'
    },
    {
      type: 'regex',
      regex: '/[a-z0-9]/g',
      quantity: 16,
      repeat: true
    }], 'production')
  transition_elt.style.setProperty('position', 'fixed')
  transition_elt.style.setProperty('top', `${search_elt_rect.top}px`)
  transition_elt.style.setProperty('left', `${search_elt_rect.left}px`)
  transition_elt.style.setProperty('width', `${search_elt_rect.width}px`)
  transition_elt.style.setProperty('height', `${search_elt_rect.height}px`)
  transition_elt.id = temporary_id
  var html = `<div class="search-icon"><svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M23.355 46.3479C16.8276 46.3479 11.3032 44.0849 6.78192 39.5587C2.26064 35.0325 0 29.571 0 23.174C0 16.777 2.26308 11.3154 6.78925 6.78925C11.3154 2.26308 16.7921 0 23.2192 0C29.6464 0 35.108 2.26308 39.604 6.78925C44.1 11.3154 46.3479 16.7815 46.3479 23.1876C46.3479 25.7735 45.9255 28.2735 45.0806 30.6874C44.2357 33.1014 42.9684 35.3645 41.2786 37.4767L63.1853 59.2023C63.7284 59.7186 64 60.3757 64 61.1737C64 61.9716 63.7284 62.6421 63.1853 63.1853C62.6421 63.7284 61.9716 64 61.1737 64C60.3757 64 59.7186 63.7284 59.2023 63.1853L37.3861 41.3692C35.5757 42.9382 33.4647 44.1603 31.0532 45.0354C28.6417 45.9104 26.0757 46.3479 23.355 46.3479ZM23.2645 40.9165C28.1678 40.9165 32.3357 39.1815 35.768 35.7115C39.2004 32.2414 40.9165 28.0622 40.9165 23.174C40.9165 18.2857 39.2004 14.1066 35.768 10.6365C32.3357 7.16643 28.1678 5.4314 23.2645 5.4314C18.3109 5.4314 14.1003 7.16643 10.6327 10.6365C7.16516 14.1066 5.4314 18.2857 5.4314 23.174C5.4314 28.0622 7.16516 32.2414 10.6327 35.7115C14.1003 39.1815 18.3109 40.9165 23.2645 40.9165Z" fill-rule="nonzero" opacity="1" stroke="none" /></svg></div><div class="search-transition-placeholder">Search</div>`
  transition_elt.innerHTML = html
  document.body.appendChild(transition_elt)
  var transition_elt_instance = utilities.qe(`.search-transition#${temporary_id}`)
 

  transition_elt_instance.addEventListener('transitionend', function () {
    transition_elt_instance.remove()
    utilities.qe(".search-box").setAttribute('transition', '0')
    Xsearch.searchIndex = Xsearch.createSearchIndex()
    interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
  }, { once: true })
  transition_elt_instance.setAttribute('transition', '1')
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

  }
  openSearchTransition()
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

function refreshPage() {
  var p = [{
    "type": "regex",
    "regex": "/[a-zA-Z0-9]/g",
    "quantity": 16,
    "repeat": true
  }]
  location.replace('https://erichsia7.github.io/pwdgen2/?v=' + fine_grained_password.generate(p, 'production'))
}

function importData() {
  utilities.qe('#importdata').click()
}

window.interaction = {
  prompt_message,
  prompt_asking,
  close_prompt_asking,
  fade,
  generateHashTagHTML,
  copyElement,
  copyDetails,
  standaloneStatusBarColor,
  standaloneStatusBarColorHistory,
  loadCSS,
  importData,
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