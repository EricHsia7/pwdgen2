import fine_grained_password from './fine-grained-password'
import utilities from './utilities'

export const LS = window.localStorage

export function searchItemsbyname(name) {
  var gh = []
  for (var t in window.localStorage) {
    if (String(t).indexOf(name) > -1) {
      gh.push(t)
    }
  }
  return gh
}

export function listSavedPassword() {
  var list = searchItemsbyname('pwdgen2_saved_b')
  var list_len = list.length
  var list_decrypted = []
  for (var k = 0; k < list_len; k++) {
    var this_item = JSON.parse(String(LS.getItem(list[k])))
    var url = ''
    var website_icon = 'var(--p-aeaeb2)'
    if (utilities.isValidURL(this_item.website)) {
      url = this_item.website
      if (!(this_item.website.indexOf('http://') > -1 || this_item.website.indexOf('https://') > -1)) {
        url = 'https://' + url
      }
      url_obj = new URL(url)
      url_obj.search = '';
      url_obj.protocol = 'http://'
      website_icon = `url(https://remote-ivory-bovid.faviconkit.com/${url_obj.toString().replace('http://', '')})`
    }
    list_decrypted.push({ website_icon: website_icon, website: this_item.website, password: utilities.deur(utilities.decryptString(this_item.encrypted_password, this_item.aes_iv)), username: this_item.username, note: this_item.note, time_stamp: this_item.time_stamp, id: this_item.id })
  }
  list_decrypted.sort(function (a, b) {
    return new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime()
  })

  return list_decrypted
}


export function upgradeData() {
  var id_pattern = [
    {
      type: "group",
      group: [
        {
          type: "regex",
          regex: "/[A-Za-z0-9]/g",
          quantity: 32,
          repeat: true
        }
      ],
      actions: ["shuffle"]
    }
  ]
  var list = searchItemsbyname('pwdgen2_saved_a')
  if (list.length <= 0) {
    return ''
  }
  var list_len = list.length
  var list_decrypted = []
  for (var k = 0; k < list_len; k++) {
    var this_item = String(LS.getItem(list[k])).split(':')
    var hash = list[k].split('_')[3]
    var pwtime = new Date()
    pwtime.setTime(this_item[2])
    var id = fine_grained_password.generate(id_pattern, 'production')
    var note = LS.getItem(`pwdgen2_saved_notes_cf_${hash}`) || ""
    list_decrypted.push({ website: "", encrypted_password: this_item[0], aes_iv: parseInt(this_item[1]), note: note, time_stamp: pwtime, id: id })
    LS.setItem(`pwdgen2_saved_b_${id}`, JSON.stringify(list_decrypted[list_decrypted.length - 1]))
    LS.removeItem(list[k])
  }
}

export function setPassword(password, username, time, website, note, id) {
  var encryption = utilities.encryptString(utilities.enur(password))
  var json = {
    website: website,
    username: username,
    encrypted_password: encryption[0],
    aes_iv: encryption[1],
    note: (note === "" ? null : btoa(utilities.enur(note))),
    time_stamp: time,
    id: id
  }
  LS.setItem('pwdgen2_saved_b_' + id, JSON.stringify(json))
}

export function addPassword(password, username, website, note) {
  var id_pattern = [
    {
      type: "group",
      group: [
        {
          type: "regex",
          regex: "/[A-Za-z0-9]/g",
          quantity: 32,
          repeat: true
        }
      ],
      actions: ["shuffle"]
    }
  ]
  var time = new Date()
  var id = fine_grained_password.generate(id_pattern, 'production')
  setPassword(password, username, time, website, note, id)
  return id
}