import { LS, searchItemsbyname } from './storage'
import utilities from './utilities'
var _ = require('lodash');

const pwd_pattern_default: object = [
  {
    "pattern_name": "Strong",
    "pattern_icon": "key",
    "id": "_strong",
    "pattern": [
      {
        "type": "group",
        "group": [
          {
            "type": "regex",
            "regex": "/[A-Z]/g",
            "quantity": 32,
            "repeat": true
          },
          {
            "type": "regex",
            "regex": "/[a-z]/g",
            "quantity": 32,
            "repeat": true
          },
          {
            "type": "regex",
            "regex": "/[0-9]/g",
            "quantity": 32,
            "repeat": true
          },
          {
            "type": "list",
            "list": [
              "-",
              "!",
              "$",
              "%",
              "^",
              "&",
              "*",
              "(",
              ")",
              "_",
              "+",
              "|",
              "~",
              "=",
              "`",
              "{",
              "}",
              "\\",
              "[",
              "]",
              ":",
              ",",
              ";",
              "'",
              "<",
              ">",
              "?",
              ",",
              ".",
              "/"
            ],
            "quantity": 32,
            "repeat": true
          }
        ],
        "actions": [
          "shuffle"
        ]
      }
    ]
  },
  {
    "pattern_name": "Easy to read",
    "pattern_icon": "visibility",
    "id": "_strong",
    "pattern": [
      {
        "type": "group",
        "group": [
          {
            "type": "regex",
            "regex": "/[A-HKMNP-Z0-9a-hkmnp-z]/g",
            "quantity": 8,
            "repeat": true
          }
        ],
        "actions": [
          "shuffle"
        ]
      },
      {
        "type": "string",
        "string": "-"
      },
      {
        "type": "group",
        "group": [
          {
            "type": "regex",
            "regex": "/[A-HKMNP-Z0-9a-hkmnp-z]/g",
            "quantity": 8,
            "repeat": true
          }
        ],
        "actions": [
          "shuffle"
        ]
      },
      {
        "type": "string",
        "string": "-"
      },
      {
        "type": "group",
        "group": [
          {
            "type": "regex",
            "regex": "/[A-HKMNP-Z0-9a-hkmnp-z]/g",
            "quantity": 8,
            "repeat": true
          }
        ],
        "actions": [
          "shuffle"
        ]
      }
    ]
  }
]

function listPatterns() {
  var list = searchItemsbyname('pwdgen2_pattern_b_')
  var list_len = list.length
  var result = []
  for (var p = 0; p < list_len; p++) {
    if (LS.hasOwnProperty(list[p])) {
      result.push(JSON.parse(String(LS.getItem(list[p]))))
    }
  }
  return result
}
const pwd_pattern_custom: object = []

const getPatterns = function (): object {
  fine_grained_password.pwd_pattern_custom = fine_grained_password.listPatterns()
  return pwd_pattern_default.concat(fine_grained_password.pwd_pattern_custom)
}

function generate(options: object, mode: string): string | object {
  const pattern: object = _.cloneDeep(options);
  const original_pattern: object = _.cloneDeep(options)
  if (mode === 'production') {
    var d: string = ""
  }
  if (mode === 'editor') {
    var d: Array = []
  }

  const get_chars_from_regex = function (regex) {
    const input = String.fromCharCode(...Array.from({ length: Math.pow(2, 16) }, (_, i) => i));
    const matches = String(input).match(regex);
    const chars = matches ? matches.join('') : '';
    return chars
  }
  const pattern_len = pattern.length
  for (var e = 0; e < pattern_len; e++) {
    var this_item = pattern[e]
    var this_content = this_item[this_item['type']]
    var result = ''
    if (this_item['type'] === "regex") {
      var this_content_matches = this_content.match(/^\/(.*)\/([a-z]*)$/i);
      var string = ''
      var chars = get_chars_from_regex(new RegExp(this_content_matches[1], this_content_matches[2])).split('')
      for (var r = 0; r < this_item['quantity']; r++) {
        var random_index = Math.round((chars.length - 1) * Math.random())
        string += chars[random_index]
        if (!this_item.repeat) {
          chars.splice(random_index, 1)
        }
      }
      result = String(string)
    }
    if (this_item['type'] === "string") {
      result = String(this_content)
    }
    if (this_item['type'] === "list") {
      for (var r = 0; r < this_item['quantity']; r++) {
        var random_index = Math.round((this_content.length - 1) * Math.random())
        result += this_content[random_index]
        if (!this_item.repeat) {
          this_content.splice(random_index, 1)
        }
      }
    }
    if (this_item['type'] === "group") {
      result = fine_grained_password.generate(this_content, 'production')
      if (this_item.hasOwnProperty('actions')) {
        var actions = this_item['actions']
        var actions_len = actions.length
        for (var j = 0; j < actions_len; j++) {
          if (actions[j] === 'shuffle') {
            result = utilities.shuffleSelf(result.split(''), result.length).join('')
            continue;
          }
        }
      }
    }
    if (mode === 'production') {
      d += result
    }
    if (mode === 'editor') {
      d.push({ result: result, component: original_pattern[e] })
    }
  }
  return d
}

function checkPatternQualification(pattern: object): boolean {
  var json = _.cloneDeep(pattern)
  var result = 1
  var errors: Array = []
  const pushError = function (content) {
    if (typeof content === 'object' && !Array.isArray(content)) {
      return JSON.stringify(content)
    }
    if (typeof content === 'object' && Array.isArray(content)) {
      return content.join(', ')
    }
    return content
  }
  const check_hasOwnProperty = function (object: object, property: string): boolean {
    if (typeof obj === 'object') {
      if (object.hasOwnProperty(property)) {
        return 1
      }
      else {
        pushError(object)
        return 0
      }
    }
    pushError(object)
    return 0
  }
  var check = function (object: object) {
    var result = 1
    result *= check_hasOwnProperty(object, 'type')
    var type = object['type']
    if (type === 'string' || type === 'regex' || type === 'list' || type === 'group') {
      result *= check_hasOwnProperty(object, object['type'])
    }
    if (type === 'regex' || type === 'list') {
      result *= check_hasOwnProperty(object, 'quantity')
      result *= check_hasOwnProperty(object, 'repeat')
      if (!(typeof object['quantity'] === 'number')) {
        pushError(object)
        result *= 0
      }
    }
    if (type === 'list') {
      if (typeof object['list'] === 'object' && Array.isArray(object['list'])) {
        var list = object['list']
        var list_len = list.length
        for (var e = 0; e < list_len; e++) {
          if (!(typeof list[e] === 'string')) {
            pushError(object)
            result *= 0
          }
        }
      }
      else {
        pushError(object)
        result *= 0
      }
    }
    if (type === 'group') {
      if (typeof object['actions'] === 'object' && Array.isArray(object['actions'])) {
        var actions = object['actions']
        var actions_len = actions.length
        for (var e = 0; e < actions_len; e++) {
          if (!(typeof actions[e] === 'string')) {
            pushError(object)
            result *= 0
          }
          else {
            if (!(actions[e] === 'shuffle')) {
              pushError(object)
              result *= 0
            }
          }
        }
      }
      if (typeof object['group'] === 'object' && Array.isArray(object['group'])) {
        var group = object['group']
        var group_len = group.length
        for (var e = 0; e < group_len; e++) {
          result *= check(group[e])
        }
      }
    }
    if (type === "regex") {
      if (typeof object['regex'] === 'string') {
        if (!object['regex'].match(/^\/(.*)\/([a-z]*)$/i)) {
          pushError(object)
          result *= 0
        }
      } else {
        pushError(object)
        result *= 0
      }
    }
    if (result === 1) {
      return false
    }
    else {
      return true
    }
  }

  if (typeof object === 'object') {
    result *= check_hasOwnProperty(json, 'pattern_name')
    result *= check_hasOwnProperty(json, 'pattern_icon')
    result *= check_hasOwnProperty(json, 'pattern')
    if (!(typeof object['pattern_name'] === 'string')) {
      pushError(object)
      result *= 0
    }
    if (!(typeof object['pattern_icon'] === 'string')) {
      pushError(object)
      result *= 0
    }
    if (typeof object['pattern'] === 'object') {
      result *= check(json['pattern'])
    } else {
      pushError(object)
      result *= 0
    }
  }
  else {
    pushError(object)
    result *= 0
  }
  return result
}

window.fine_grained_password = {
  pwd_pattern_custom,
  generate,
  listPatterns,
  getPatterns,
  checkPatternQualification
}

export default window.fine_grained_password