// Import required functions
import { shuffle } from '../tools/shuffle';
import { LS, searchItemsbyname } from './storage';
import utilities from './utilities';
const { cloneDeep } = require('lodash/cloneDeep');

const defaultPatterns: object[] = [
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
function listPatterns(returnLocalStorageKey: boolean) {
  const list = searchItemsbyname('pwdgen2_pattern_b_');
  const length = list.length;
  const result = [];
  for (let p = 0; p < length; p++) {
    if (LS.hasOwnProperty(list[p])) {
      result.push(Object.assign(JSON.parse(String(LS.getItem(list[p]))), returnLocalStorageKey ? { LocalStorageKey: list[p] } : {}));
    }
  }
  return result;
}

let customPatterns = [];

// Function to get the default and saved patterns
export function getPatterns(returnLocalStorageKey) {
  customPatterns = listPatterns(returnLocalStorageKey);
  return defaultPatterns.concat(customPatterns);
}

// Function to generate a string depending on the pattern
export function generate(options, mode) {
  // Use lodash to clone the options (pattern) to avoid syncing with the original list declared above → make the declared pattern usable repeatedly
  const pattern = cloneDeep(options);
  const original_pattern = cloneDeep(options);

  // Production mode: only return the results
  // Editor mode: return the results, component objects, and error messages
  if (mode === 'production') {
    var d: string = '';
  }
  if (mode === 'editor') {
    var d: Array = [];
  }

  const getCharsFromRegex = function (regex) {
    // Generate a long string
    const input: string = String.fromCharCode(...Array.from({ length: Math.pow(2, 16) }, (_, i) => i));
    // Use the input regular expression to select matched characters
    const matches: any = String(input).match(regex);
    // Join the items in the array
    const chars: string = matches ? matches.join('') : '';
    // Return the joined string
    return chars;
  };

  const patternLength: number = pattern.length;
  for (let e = 0; e < patternLength; e++) {
    const thisItem = pattern[e];
    const thisContent = thisItem[thisItem['type']];
    let result = '';

    switch (thisItem['type']) {
      case 'regex': {
        const randomNumbers = new Uint32Array(thisItem['quantity']);
        crypto.getRandomValues(randomNumbers);
        // Check if the regular expression is full (has expression and flags)
        const thisContentMatches = thisContent.match(/^\/(.*)\/([a-z]*)$/i);
        let string: string = '';
        // Get the character source/sample
        const chars = getCharsFromRegex(new RegExp(thisContentMatches[1], thisContentMatches[2])).split('');
        for (let r = 0; r < thisItem['quantity']; r++) {
          // Choose a character from the source
          const randomIndex: number = Math.round(((chars.length - 1) * randomNumbers[r]) / (2 ** 32 - 1));

          // Put the character to the end of the result
          string += chars[randomIndex];

          // If the configuration tells that repeating is not allowed, strike/remove the character from the source to avoid using repeatedly
          if (!thisItem.repeat) {
            chars.splice(randomIndex, 1);
          }
        }
        result = String(string);
        break;
      }
      case 'string':
        // Directly put the string to the end of the result
        result = String(thisContent);
        break;
      case 'list': {
        const randomNumbers = new Uint32Array(thisItem['quantity']);
        crypto.getRandomValues(randomNumbers);
        for (let r = 0; r < thisItem['quantity']; r++) {
          // Choose an item from the list
          const randomIndex: number = Math.round(((thisContent.length - 1) * randomNumbers[r]) / (2 ** 32 - 1));
          // Put the content of the item to the end of the result
          result += thisContent[randomIndex];
          if (!thisItem.repeat) {
            // If the configuration tells that repeating is not allowed, strike/remove the item from the list to avoid using repeatedly
            thisContent.splice(randomIndex, 1);
          }
        }
        break;
      }
      case 'group': {
        // Use recursive way to process the components in a group
        result = generate(thisContent, 'production');
        // Carry out the actions
        if (thisItem.hasOwnProperty('actions')) {
          const actions = thisItem['actions'];
          const actionsLength = actions.length;
          for (let j = 0; j < actionsLength; j++) {
            if (actions[j] === 'shuffle') {
              result = shuffle(result.split(''), result.length).join('');
              continue;
            }
          }
        }
      }
      default:
        break;
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

interface PatternError {
  message: string;
  type: 'lack' | 'internal' | 'type' | 'invalid value';
}

function checkPattern(pattern) {
  var json = cloneDeep(pattern);
  let result = 1;
  const errors: Array<PatternError> = [];

  const omitObject = function (object) {
    var obj = cloneDeep(object);
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

  function hasOwnProperty(object: object, property: string): 0 | 1 {
    if (typeof object === 'object') {
      if (object.hasOwnProperty(property)) {
        return 1;
      } else {
        errors.push({ message: `The property "${property}" is not found in ${omitObject(object)}.`, type: 'lack' });
        return 0;
      }
    }
    errors.push({ message: `Cannot check the property "${property}" due to a type error of ${String(object)}.`, type: 'internal' });
    return 0;
  }

  function check(object: object) {
    var result = 1;
    result *= hasOwnProperty(object, 'type');
    var type = object['type'];
    if (type === 'string' || type === 'regex' || type === 'list' || type === 'group') {
      result *= hasOwnProperty(object, object['type']);
    } else {
      errors.push({ message: `The type "${type}" in ${omitObject(object)} is not supported at this time.`, type: 'type' });
      result *= 0;
    }
    if (type === 'string') {
      if (!(typeof object['string'] === 'string')) {
        errors.push({ message: `Type of the property "string" in ${omitObject(object)} is not a string.`, type: 'type' });
        result *= 0;
      }
    }
    if (type === 'regex' || type === 'list') {
      result *= hasOwnProperty(object, 'quantity');
      result *= hasOwnProperty(object, 'repeat');
      if (!(typeof object['quantity'] === 'number')) {
        errors.push({ message: `Type of the property "quantity" in ${omitObject(object)} is not a number.`, type: 'type' });
        result *= 0;
      }
      if (!(typeof object['repeat'] === 'boolean')) {
        errors.push({ message: `Type of the property "repeat" in ${omitObject(object)} is not boolean (true or false).`, type: 'type' });
        result *= 0;
      }
    }
    if (type === 'list') {
      if (typeof object['list'] === 'object' && Array.isArray(object['list'])) {
        var list = object['list'];
        var list_len: number = list.length;
        for (var e = 0; e < list_len; e++) {
          if (!(typeof list[e] === 'string')) {
            errors.push({ message: `Type of the item ${e} in the list of ${omitObject(object)} is not a string.`, type: 'type' });
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
        errors.push({ message: `The type of the property "regex" in ${omitObject(object)} is not a string.`, type: 'type' });
        result *= 0;
      }
    }
    if (result === 1) {
      return true;
    } else {
      return false;
    }
  }

  if (typeof json === 'object') {
    result *= hasOwnProperty(json, 'pattern_name');
    result *= hasOwnProperty(json, 'pattern_icon');
    result *= hasOwnProperty(json, 'pattern');
    if (!(typeof json['pattern_name'] === 'string')) {
      errors.push({ message: `Type of the property "pattern_name" in ${omitObject(json)} is not a string.`, type: 'type' });
      result *= 0;
    }
    if (!(typeof json['pattern_icon'] === 'string')) {
      errors.push({ message: `Type of the property "pattern_icon" in ${omitObject(json)} is not a string.`, type: 'type' });
      result *= 0;
    }
    if (typeof json['pattern'] === 'object' && Array.isArray(json['pattern'])) {
      var pattern = json['pattern'];
      var pattern_len: number = pattern.length;
      for (var i = 0; i < pattern_len; i++) {
        result *= check(pattern[i]);
      }
    } else {
      errors.push({ message: `Type of the property "pattern" in ${omitObject(json)} is not an array.`, type: 'type' });
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
