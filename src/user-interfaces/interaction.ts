import fine_grained_password from '../core/fine-grained-password'
import utilities from '../core/utilities'
import Xsearch from '../core/search'
import { LS, setPassword, addPassword, listSavedPassword } from '../core/storage'
import icons from './icons'
import { checkPassword, checkCommonWordPatterns } from '../core/check-password'
import { openPatternCreator, closePatternCreator, generatePatternPreview, showPatternPreviewInfo, addIdentityToPattern, syncPatternCreatorJSONEditor, syncAndFormatPatternCreatorJSONEditor, initializePatternCreatorJSONEditor, removePatternPreviewInfo } from './pattern-creator'

function copyProperty(source: HTMLElement, target: HTMLElement, property: string): void {
  target.style.setProperty(property, source.style.getPropertyValue(property))
}

function fade(element, type, display, callback) {
  var idchars = "0123456789abcdefghijklmnopqrstuvwxyz";
  var fade_id = "";
  for (var i = 0; i < 8; i++) {
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
  var css = `.fadeIn-${fade_id} {display:${element_display};opacity:0} .fadeIn-${fade_id}-start{transition:${duration}ms;opacity:1;transition-timing-function:ease;} .fadeOut-${fade_id} {display:${element_display};opacity:1} .fadeOut-${fade_id}-start{transition:${duration}ms;opacity:0;transition-timing-function:ease;}`
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
  const idchars: string = "0123456789abcdefghijklmnopqrstuvwxyz";
  var prompt_id: string = "";
  for (var i = 0; i < 8; i++) {
    var idrandomNumber = Math.floor(Math.random() * idchars.length);
    prompt_id += idchars.substring(idrandomNumber, idrandomNumber + 1);
  }
  var prompt_element = document.createElement('div')
  prompt_element.id = prompt_id
  prompt_element.classList.add('prompt')
  prompt_element.classList.add('prompt_animation' + prompt_id)
  var prompt_center_element = document.createElement('div')
  prompt_center_element.classList.add('promptcenter')
  prompt_center_element.innerText = message
  prompt_element.appendChild(prompt_center_element)
  var prompt_css = `.prompt_animation${prompt_id}{animation-timing-function:cubic-bezier(.21,.75,.1,.96);animation-name:prompt${prompt_id};animation-duration:${(duration + duration_base * 2)}ms;animation-fill-mode:forwards;animation-timing-function:ease-in-out}@keyframes prompt${prompt_id}{0%{opacity:0;transform:translateX(-50%) translateY(${translateY}px) scale(0.8);}${Math.floor((duration_base) / (duration + duration_base + 150) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px)) scale(1);}${Math.floor((duration_base + duration) / (duration + duration_base + 150) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px)) scale(1);}100%{opacity:0;transform:translateX(-50%) translateY(${translateY}px) scale(1);}}`
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



function standaloneStatusBarColor(a) {
  var c = '#f2f2f7'
  var d = '#0a0a0b'
  if (a === 1) {
    c = '#ffffff'
    d = '#1c1c1e'
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
}



function openSearch() {
  Xsearch.searchIndex = Xsearch.createSearchIndex()
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
  })
  if (search_status === 0) {
    interaction.fade(utilities.qe('.search-output-box'), 'In', 'block')
    utilities.qe('.search-output-box').style.setProperty('--j-search-output-box-y', (utilities.qe(".search-box").offsetTop + 60) + 'px')
    utilities.qe(".search-output-box").setAttribute('status', '1')
  }
  interaction.standaloneStatusBarColor(1)
  search_status = 1
  interaction.search.updateSearch(utilities.qe(".search input#search").value, Xsearch.searchIndex)
}

function closeSearch() {
  utilities.qe(".search-box").setAttribute('status', '0')
  utilities.qe(".search-output-box").setAttribute('status', '0')
  utilities.qe(".search-box").setAttribute('sticky', search_sticky)
  utilities.qe(".search-box").setAttribute('transition', '1')
  utilities.qe(".search-box").addEventListener('transitionend', function () {
    utilities.qe(".search-box").setAttribute('transition', '0')
  })
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



function printSavedPasswordList() {
  var list = listSavedPassword()
  var list_len = list.length
  var html = []
  for (var k = 0; k < list_len; k++) {
    var tags = []
    html.push(`<div class="password-item" onclick="interaction.password_page.openPassword('${list[k].id}')"><div class="password-item-title">${utilities.timestr(new Date(list[k].time_stamp))}</div><div class="password-item-tags">${tags}</div><div class="password-open-icon">${icons.icon_arrow}</div></div>`)
  }
  utilities.qe(".password-list").innerHTML = html.join('')
}



function openOptions(r) {
  utilities.qe('.options_mask').style.setProperty('display', 'block')
  utilities.qe('.options').style.setProperty('display', 'inline-block')
  utilities.qe('.options').style.setProperty('--js-options-list-count', document.querySelectorAll('.options li[group="' + r + '"]').length)
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



function openPassword(id, fadeCallback) {
  interaction.fade(utilities.qe('.password-page'), 'In', 'block', fadeCallback)
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(0)
  }
  if (!password_page_icon_loaded) {
    password_page_icon_loaded = true
    var copy_btn = utilities.qeAll('.password-page .details-item-copy')
    var copy_btn_len = copy_btn.length
    for (var q = 0; q < copy_btn_len; q++) {
      copy_btn[q].innerHTML = icons.icon_copy
    }
  }
  if (LS.hasOwnProperty(`pwdgen2_saved_b_${id}`)) {
    var json = JSON.parse(String(LS.getItem(`pwdgen2_saved_b_${id}`)))
    var note_plain_text = (json.note === null ? '' : utilities.deur(atob(String(json.note))))
    var password = utilities.deur(utilities.decryptString(json.encrypted_password, json.aes_iv)) || ""
    utilities.qe('.password-page .details-item-value[k="username"] input').value = json.username || ""
    utilities.qe('.password-page .details-item-value[k="password"] input').value = password
    utilities.qe('.password-page .details-item-value[k="website"] input').value = json.website || ""
    utilities.qe('.password-page .details-item-value[k="createdat"] input').value = utilities.timestr(new Date(json.time_stamp)) || ""
    utilities.qe('.password-page .details-note-content').innerHTML = interaction.generateHashTagHTML(note_plain_text)

    var check = checkPassword(password, false, id)
    var setCheckResultItem = function (type, i, r, g, b, points, phrase) {
      var q = `.password-page .details-check-result .details-check-result-${type}[i="${i}"] .details-check-result-points`
      var qp = `.password-page .details-check-result .details-check-result-${type}[i="${i}"] .details-check-result-phrase`
      utilities.qe(q).innerText = points
      utilities.qe(q).style.setProperty('--j-check-color-r', r)
      utilities.qe(q).style.setProperty('--j-check-color-g', g)
      utilities.qe(q).style.setProperty('--j-check-color-b', b)
      utilities.qe(qp).innerText = phrase
    }
    setCheckResultItem('summary', 'summary', check.color.r, check.color.g, check.color.b, check.points, `This password is ${check.phrase}.`)
    setCheckResultItem('item', 'length', check.details.len.color.r, check.details.len.color.g, check.details.len.color.b, check.details.len.points, `Length`)
    setCheckResultItem('item', 'randomness', check.details.randomness.color.r, check.details.randomness.color.g, check.details.randomness.color.b, check.details.randomness.points, `Randomness`)
    setCheckResultItem('item', 'repeat', check.details.repeat.color.r, check.details.repeat.color.g, check.details.repeat.color.b, check.details.repeat.points, `Repeat`)
    setCheckResultItem('item', 'complexity', check.details.complexity.color.r, check.details.complexity.color.g, check.details.complexity.color.b, check.details.complexity.points, `Complexity`)
    setCheckResultItem('item', 'uniqueness', check.details.uniqueness.color.r, check.details.uniqueness.color.g, check.details.uniqueness.color.b, check.details.uniqueness.points, `Uniqueness`)

    utilities.qe(".password-page .details-check-result .details-check-result-report").innerText = check.details.report

  }
}

function closePassword() {
  interaction.fade(utilities.qe('.password-page'), 'Out', 'none', function () {
    utilities.qe('.password-page').scrollTop = 0
  })
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
}



function openAddPassword(event) {
  interaction.fade(utilities.qe('.add-password-page'), 'In', 'block')
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(0)
  }
  interaction.add_password.printPatternPresets('add-password-page')
  utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value = fine_grained_password.generate(fine_grained_password.getPatterns()[0].pattern, 'production')
  utilities.qe('.add-password-page .add-list .add-item-value[k="username"] input').value = ''
  utilities.qe('.add-password-page .add-list .add-item-value[k="website"] input').value = ''
  interaction.options.closeOptions(event)
}

function closeAddPassword() {
  interaction.fade(utilities.qe('.add-password-page'), 'Out', 'none')
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
}

function addPasswordWithForm() {
  var password = utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value || ''
  var username = utilities.qe('.add-password-page .add-list .add-item-value[k="username"] input').value || ''
  var website = utilities.qe('.add-password-page .add-list .add-item-value[k="website"] input').value || ''
  var addedpassword = addPassword(password, username, website, '')
  interaction.prompt_message('Added password', 1200)
  interaction.password_page.openPassword(addedpassword, function () {
    interaction.add_password.closeAddPassword()
    interaction.main_page.printSavedPasswordList()
  })
}

function printPatternPresets(place) {
  var html = []
  var list = fine_grained_password.getPatterns()
  var list_len = list.length
  for (var i = 0; i < list_len; i++) {
    var p = list[i]
    if (place === 'add-password-page') {
      var h = `<li class="preset" apply="${(i === 0 ? 1 : 0)}" index="${i}" onclick="interaction.add_password.applyPreset(${i})"><div class="preset_icon"><span class="material-symbols-rounded">${p.pattern_icon}</span></div><span class="preset_name">${p.pattern_name}</span></li>`
    }
    if (place === 'pattern-manager') {
      var h = `<li class="preset" index="${i}" onclick="interaction.add_password.applyPreset(${i})"><div class="preset_icon"><span class="material-symbols-rounded">${p.pattern_icon}</span></div><span class="preset_name">${p.pattern_name}</span></li>`
    }
    html.push(h)
  }
  if (place === 'add-password-page') {
    utilities.qe(".add-password-page .password-generator-presets").innerHTML = html.join('')
  }
}

function applyPreset(index) {
  var list = fine_grained_password.getPatterns()
  var preset = list[index]
  utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value = fine_grained_password.generate(preset.pattern, 'production')
  var all_preset = utilities.qeAll(".add-password-page .password-generator-presets .preset")
  var all_preset_len = (all_preset ? all_preset.length : 0)
  for (var o = 0; o < all_preset_len; o++) {
    all_preset[o].setAttribute('apply', '0')
  }
  var this_preset = utilities.qe(`.add-password-page .password-generator-presets .preset[index="${index}"]`)
  this_preset.setAttribute('apply', '1')
}



window.interaction = {
  copyProperty,
  prompt_message,
  fade,
  generateHashTagHTML,
  copyElement,
  copyDetails,
  standaloneStatusBarColor,
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
    showPatternPreviewInfo,
    addIdentityToPattern,
    syncPatternCreatorJSONEditor,
    syncAndFormatPatternCreatorJSONEditor,
    initializePatternCreatorJSONEditor,
    removePatternPreviewInfo
  },
  password_page: {
    openPassword,
    closePassword,
  },
  main_page: {
    printSavedPasswordList,
  }
}

export default window.interaction