// Import required functions
import { LS, searchItemsbyname } from './storage';
import utilities from './utilities';
var _ = {};
_.cloneDeep = require('lodash/cloneDeep');

const pwd_pattern_default: object[] = [
  {
    default_pattern: true,
    pattern_name: 'Strong',
    pattern_icon: 'key',
    id: '_strong',
    pattern: [
      {
        type: 'group',
        group: [
          {
            type: 'regex',
            regex: '/[A-Z]/g',
            quantity: 32,
            repeat: true
          },
          {
            type: 'regex',
            regex: '/[a-z]/g',
            quantity: 32,
            repeat: true
          },
          {
            type: 'regex',
            regex: '/[0-9]/g',
            quantity: 32,
            repeat: true
          },
          {
            type: 'list',
            list: ['-', '!', '$', '%', '^', '&', '*', '(', ')', '_', '+', '|', '~', '=', '`', '{', '}', '\\', '[', ']', ':', ',', ';', "'", '<', '>', '?', ',', '.', '/'],
            quantity: 32,
            repeat: true
          }
        ],
        actions: ['shuffle']
      }
    ]
  },
  {
    default_pattern: true,
    pattern_name: 'Easy to read',
    pattern_icon: 'visibility',
    id: '_strong',
    pattern: [
      {
        type: 'group',
        group: [
          {
            type: 'regex',
            regex: '/[A-HKMNP-Z0-9a-hkmnp-z]/g',
            quantity: 8,
            repeat: true
          }
        ],
        actions: ['shuffle']
      },
      {
        type: 'string',
        string: '-'
      },
      {
        type: 'group',
        group: [
          {
            type: 'regex',
            regex: '/[A-HKMNP-Z0-9a-hkmnp-z]/g',
            quantity: 8,
            repeat: true
          }
        ],
        actions: ['shuffle']
      },
      {
        type: 'string',
        string: '-'
      },
      {
        type: 'group',
        group: [
          {
            type: 'regex',
            regex: '/[A-HKMNP-Z0-9a-hkmnp-z]/g',
            quantity: 8,
            repeat: true
          }
        ],
        actions: ['shuffle']
      }
    ]
  }
];

// Function to get all the patterns saved in the Local Storage
function listPatterns(returnLocalStorageKey) {
  var list = searchItemsbyname('pwdgen2_pattern_b_');
  var list_len = list.length;
  var result = [];
  for (var p = 0; p < list_len; p++) {
    if (LS.hasOwnProperty(list[p])) {
      result.push(Object.assign(JSON.parse(String(LS.getItem(list[p]))), returnLocalStorageKey ? { LocalStorageKey: list[p] } : {}));
    }
  }
  return result;
}

const pwd_pattern_custom = [];

// Function to get the default and saved patterns
const getPatterns = function (returnLocalStorageKey) {
  fine_grained_password.pwd_pattern_custom = fine_grained_password.listPatterns(returnLocalStorageKey);
  return pwd_pattern_default.concat(fine_grained_password.pwd_pattern_custom);
};

type date_component_date = 'today' | 'yesterday' | 'tomorrow' | string;

const date_component_regex = /(YYYY|yyyy|MM|M|DD|D|hh|h|mm|m|ss|s)/gm;
const date_component_date_time_stamp_regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}|))$/gm;
const date_component_date_offseting_time_regex = /today\#(\-|\+){1,1}([0-9]{1,})/gm;

// Function to generate a string depending on the pattern
function generate(options, mode) {
  // Use lodash to clone the options (pattern) to avoid syncing with the original list declared above → make the declared pattern usable repeatedly
  const pattern = _.cloneDeep(options);
  const original_pattern = _.cloneDeep(options);

  // Production mode: only return the results
  // Editor mode: return the results, component objects, and error messages
  if (mode === 'production') {
    var d: string = '';
  }
  if (mode === 'editor') {
    var d: Array = [];
  }

  const get_chars_from_regex = function (regex) {
    // Generate a long string
    const input: string = String.fromCharCode(...Array.from({ length: Math.pow(2, 16) }, (_, i) => i));
    // Use the input regular expression to select matched characters
    const matches: any = String(input).match(regex);
    // Join the items in the array
    const chars: string = matches ? matches.join('') : '';
    // Return the joined string
    return chars;
  };

  const get_date_string_from_pattern = function (date: date_component_date, pattern: string) {
    //convert the date to a date object
    var date_obj = new Date();
    if (date === 'today') {
    }
    if (date === 'yesterday') {
      date_obj.setDate(date_obj.getDate() - 1);
    }
    if (date === 'tomorrow') {
      date_obj.setDate(date_obj.getDate() + 1);
    }
    if (!(date.match(date_component_date_time_stamp_regex) === null)) {
      date_obj = new Date(date);
    }
    if (!(date.match(date_component_date_offseting_time_regex) === null)) {
      var match = date_component_date_offseting_time_regex.exec(date);
      var cofficient = 0;
      if (match[1] === '+') {
        cofficient = 1;
      }
      if (match[1] === '-') {
        cofficient = -1;
      }
      var offset = cofficient * parseInt(match[2]);
      date_obj.setDate(date_obj.getDate() + offset);
    }
    //get the corresponding values of the date object
    var year = String(date_obj.getFullYear());
    var month = String(date_obj.getMonth() + 1); //the month in javascript counts from 0 to 11
    var date = String(date_obj.getDate());
    var hours = String(date_obj.getHours());
    var minutes = String(date_obj.getMinutes());
    var seconds = String(date_obj.getSeconds());
    //replace the qualified part in the pattern with gotten values
    return pattern.replaceAll(date_component_regex, function (match) {
      if (match === 'YYYY') {
        return year;
      }
      if (match === 'yyyy') {
        return year;
      }
      if (match === 'MM') {
        return month.padStart(2, '0');
      }
      if (match === 'M') {
        return month;
      }
      if (match === 'DD') {
        return date.padStart(2, '0');
      }
      if (match === 'D') {
        return date;
      }
      if (match === 'hh') {
        return hours.padStart(2, '0');
      }
      if (match === 'h') {
        return hours;
      }
      if (match === 'mm') {
        return minutes.padStart(2, '0');
      }
      if (match === 'm') {
        return minutes;
      }
      if (match === 'ss') {
        return seconds.padStart(2, '0');
      }
      if (match === 's') {
        return seconds;
      }
    });
  };

  const pattern_len: number = pattern.length;
  for (var e = 0; e < pattern_len; e++) {
    var this_item = pattern[e];
    var this_content = this_item[this_item['type']];
    var result = '';

    if (this_item['type'] === 'regex') {
      // Check if the regular expression is full (has expression and flags)
      var this_content_matches = this_content.match(/^\/(.*)\/([a-z]*)$/i);
      var string: string = '';
      // Get the character source/sample
      var chars = get_chars_from_regex(new RegExp(this_content_matches[1], this_content_matches[2])).split('');
      for (var r = 0; r < this_item['quantity']; r++) {
        // Choose a character from the source
        var random_index: number = Math.round((chars.length - 1) * Math.random());

        // Put the character to the end of the result
        string += chars[random_index];

        // If the configuration tells that repeating is not allowed, strike/remove the character from the source to avoid using repeatedly
        if (!this_item.repeat) {
          chars.splice(random_index, 1);
        }
      }
      result = String(string);
    }

    if (this_item['type'] === 'string') {
      // Directly put the string to the end of the result
      result = String(this_content);
    }

    if (this_item['type'] === 'list') {
      for (var r = 0; r < this_item['quantity']; r++) {
        // Choose an item from the list
        var random_index: number = Math.round((this_content.length - 1) * Math.random());
        // Put the content of the item to the end of the result
        result += this_content[random_index];
        if (!this_item.repeat) {
          // If the configuration tells that repeating is not allowed, strike/remove the item from the list to avoid using repeatedly
          this_content.splice(random_index, 1);
        }
      }
    }

    if (this_item['type'] === 'date') {
      result = get_date_string_from_pattern(this_item['date'], this_item['date_pattern']);
    }

    if (this_item['type'] === 'group') {
      // Use recursive way to process the components in a group
      result = fine_grained_password.generate(this_content, 'production');
      // Carry out the actions
      if (this_item.hasOwnProperty('actions')) {
        var actions = this_item['actions'];
        var actions_len = actions.length;
        for (var j = 0; j < actions_len; j++) {
          if (actions[j] === 'shuffle') {
            result = utilities.shuffleSelf(result.split(''), result.length).join('');
            continue;
          }
        }
      }
    }

    if (mode === 'production') {
      d += result;
    }
    if (mode === 'editor') {
      d.push({ result: result, component: original_pattern[e] });
    }
  }
  return d;
}

function checkPatternQualification(pattern) {
  var json = _.cloneDeep(pattern);
  var result = 1;
  var errors: Array = [];

  const omitobject = function (object) {
    var obj = _.cloneDeep(object);
    if (typeof object === 'object' && !Array.isArray(object)) {
      for (var w in obj) {
        if (typeof obj[w] === 'object' && !Array.isArray(obj[w])) {
          obj[w] = '{...}';
        }
        if (typeof obj[w] === 'object' && Array.isArray(obj[w])) {
          obj[w] = '[...]';
        }
      }
      return JSON.stringify(obj);
    }
  };

  const check_hasOwnProperty = function (object, property) {
    if (typeof object === 'object') {
      if (object.hasOwnProperty(property)) {
        return 1;
      } else {
        errors.push({ message: `The property "${property}" is not found in ${omitobject(object)}.`, type: 'lack' });
        return 0;
      }
    }
    errors.push({ message: `Cannot check the property "${property}" due to a type error of ${String(object)}.`, type: 'internal' });
    return 0;
  };

  const check = function (object) {
    var result = 1;
    result *= check_hasOwnProperty(object, 'type');
    var type = object['type'];
    if (type === 'string' || type === 'regex' || type === 'list' || type === 'group' || type === 'date') {
      result *= check_hasOwnProperty(object, object['type']);
    } else {
      errors.push({ message: `The type "${type}" in ${omitobject(object)} is not supported at this time.`, type: 'type' });
      result *= 0;
    }
    if (type === 'string') {
      if (!(typeof object['string'] === 'string')) {
        errors.push({ message: `Type of the property "string" in ${omitobject(object)} is not a string.`, type: 'type' });
        result *= 0;
      }
    }
    if (type === 'regex' || type === 'list') {
      result *= check_hasOwnProperty(object, 'quantity');
      result *= check_hasOwnProperty(object, 'repeat');
      if (!(typeof object['quantity'] === 'number')) {
        errors.push({ message: `Type of the property "quantity" in ${omitobject(object)} is not a number.`, type: 'type' });
        result *= 0;
      }
      if (!(typeof object['repeat'] === 'boolean')) {
        errors.push({ message: `Type of the property "repeat" in ${omitobject(object)} is not boolean (true or false).`, type: 'type' });
        result *= 0;
      }
    }
    if (type === 'list') {
      if (typeof object['list'] === 'object' && Array.isArray(object['list'])) {
        var list = object['list'];
        var list_len: number = list.length;
        for (var e = 0; e < list_len; e++) {
          if (!(typeof list[e] === 'string')) {
            errors.push({ message: `Type of the item ${e} in the list of ${omitobject(object)} is not a string.`, type: 'type' });
            result *= 0;
          }
        }
      } else {
        errors.push({ message: 'Cannot get item due to type error or property not existing.', type: 'internal' });
        result *= 0;
      }
    }
    if (type === 'group') {
      if (typeof object['actions'] === 'object' && Array.isArray(object['actions'])) {
        var actions = object['actions'];
        var actions_len: number = actions.length;
        for (var e = 0; e < actions_len; e++) {
          if (!(typeof actions[e] === 'string')) {
            errors.push({ message: `An item in actions must be a string.`, type: 'type' });
            result *= 0;
          } else {
            if (!(actions[e] === 'shuffle')) {
              errors.push({ message: `Cannot use ${actions[e]} at this time due to an unsupported value.`, type: 'invalid value' });
              result *= 0;
            }
          }
        }
      }
      if (typeof object['group'] === 'object' && Array.isArray(object['group'])) {
        var group = object['group'];
        var group_len: number = group.length;
        for (var e = 0; e < group_len; e++) {
          result *= check(group[e]);
        }
      }
    }
    if (type === 'regex') {
      if (typeof object['regex'] === 'string') {
        if (!object['regex'].match(/^\/(.*)\/([a-z]*)$/i)) {
          errors.push({ message: `The regex in ${JSON.stringify(object)} is invalid on formats.`, type: 'invalid value' });
          result *= 0;
        }
      } else {
        errors.push({ message: `The type of the property "regex" in ${omitobject(object)} is not a string.`, type: 'type' });
        result *= 0;
      }
    }
    if (type === 'date') {
      result *= check_hasOwnProperty(object, 'date');
      result *= check_hasOwnProperty(object, 'date_pattern');
      if (typeof object['date'] === 'string') {
        if (!object['date'].match(date_component_date_offseting_time_regex)) {
          errors.push({ message: `The date in ${JSON.stringify(object)} is invalid on formats.`, type: 'invalid value' });
          result *= 0;
        }
      } else {
        errors.push({ message: `The type of the property "date" in ${omitobject(object)} is not a string.`, type: 'type' });
        result *= 0;
      }
      if (!(typeof object['date_pattern'] === 'string')) {
        errors.push({ message: `The type of the property "date_pattern" in ${omitobject(object)} is not a string.`, type: 'type' });
        result *= 0;
      }
    }
    if (result === 1) {
      return true;
    } else {
      return false;
    }
  };

  if (typeof json === 'object') {
    result *= check_hasOwnProperty(json, 'pattern_name');
    result *= check_hasOwnProperty(json, 'pattern_icon');
    result *= check_hasOwnProperty(json, 'pattern');
    if (!(typeof json['pattern_name'] === 'string')) {
      errors.push({ message: `Type of the property "pattern_name" in ${omitobject(json)} is not a string.`, type: 'type' });
      result *= 0;
    }
    if (!(typeof json['pattern_icon'] === 'string')) {
      errors.push({ message: `Type of the property "pattern_icon" in ${omitobject(json)} is not a string.`, type: 'type' });
      result *= 0;
    }
    if (typeof json['pattern'] === 'object' && Array.isArray(json['pattern'])) {
      var pattern = json['pattern'];
      var pattern_len: number = pattern.length;
      for (var i = 0; i < pattern_len; i++) {
        result *= check(pattern[i]);
      }
    } else {
      errors.push({ message: `Type of the property "pattern" in ${omitobject(json)} is not an array.`, type: 'type' });
      result *= 0;
    }
  } else {
    errors.push({ message: `Type of the thing you want to check is not an object.`, type: 'internal' });
    result *= 0;
  }
  if (result === 1) {
    result = true;
  } else {
    result = false;
  }
  return { errors: errors, result: result };
}

// Expose functions to the global scope
window.fine_grained_password = {
  pwd_pattern_custom,
  generate,
  listPatterns,
  getPatterns,
  checkPatternQualification
};

export default window.fine_grained_password;
