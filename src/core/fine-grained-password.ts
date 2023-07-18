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
      result = fine_grained_password.generate(this_content, mode)
      var actions = this_item['actions']
      var actions_len = actions.length
      for (var j = 0; j < actions_len; j++) {
        if (actions[j] === 'shuffle') {
          if (mode === 'production') {
            result = utilities.shuffleSelf(result.split(''), result.length).join('')
          }
          if (mode === 'editor') {
            result = utilities.shuffleSelf(result.result.split(''), result.result.length).join('')
          }
          continue;
        }
      }
    }
    if (mode === 'production') {
      d += result
    }
    if (mode === 'editor') {
      d.push({ result: result, component: this_item })
    }
  }
  return d
}

window.fine_grained_password = {
  pwd_pattern_custom,
  generate,
  listPatterns,
  getPatterns
}

export default window.fine_grained_password