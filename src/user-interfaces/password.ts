import utilities from '../core/utilities'
import { LS ,modifyPassword} from '../core/storage'
import icons from './icons'
import fine_grained_password from '../core/fine-grained-password'


export function openPassword(id, fadeCallback) {
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

export function closePassword() {
  interaction.fade(utilities.qe('.password-page'), 'Out', 'none', function () {
    utilities.qe('.password-page').scrollTop = 0
  })
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
}


export function openAddPassword(event) {
  interaction.fade(utilities.qe('.add-password-page'), 'In', 'block', function () {
    interaction.loadCSS('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,300,0,0', 'googleFontsMaterialSymbols')
  })

  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(0)
  }
  interaction.add_password.printPatternPresets('add-password-page')
  utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value = fine_grained_password.generate(fine_grained_password.getPatterns()[0].pattern, 'production')
  utilities.qe('.add-password-page .add-list .add-item-value[k="username"] input').value = ''
  utilities.qe('.add-password-page .add-list .add-item-value[k="website"] input').value = ''
  interaction.options.closeOptions(event)
}

export function closeAddPassword() {
  interaction.fade(utilities.qe('.add-password-page'), 'Out', 'none')
  if (search_sticky || search_status === 1) {
    interaction.standaloneStatusBarColor(1)
  }
}

export function addPasswordWithForm() {
  var password = utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value || ''
  var username = utilities.qe('.add-password-page .add-list .add-item-value[k="username"] input').value || ''
  var website = utilities.qe('.add-password-page .add-list .add-item-value[k="website"] input').value || ''
  var addedpassword = addPassword(password, username, website, '')
  interaction.prompt_message('Added password.', 1200)
  interaction.add_password.closeAddPassword()
  interaction.password_page.openPassword(addedpassword, function () {
    interaction.main_page.printSavedPasswordList()
  })
}

export function printPatternPresets(place) {
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

export function applyPreset(index) {
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


export function openEditPassword() {
  interaction.fade(utilities.qe('.edit-password-page'), 'In', 'block')
  
}
