import { MaterialSymbol } from '../../interface/icons';
import { Random } from '../../tools/random';
import { shuffle } from '../../tools/shuffle';

export interface PatternString {
  type: 'string';
  string: string;
}

export interface PatternRegex {
  type: 'regex';
  regex: string;
  quantity: number;
  repeat: boolean;
}

export interface PatternList {
  type: 'list';
  list: Array<string>;
  quantity: number;
  repeat: boolean;
}

export interface PatternGroup {
  type: 'group';
  group: Array<PatternComponent>;
  actions: Array<'flatten' | 'shuffle'>;
}

export type PatternComponent = PatternString | PatternRegex | PatternList | PatternGroup;

export interface Pattern {
  name: string;
  icon: MaterialSymbol;
  components: Array<PatternComponent>;
  id: string;
  default: boolean;
}

function generateFromPatternComponent(component: PatternComponent): string {
  const random = new Random();
  switch (component.type) {
    case 'string': {
      return component.string;
    }

    case 'regex': {
      const regexMatch = component.regex.match(/^\/(.*)\/([a-z]*)$/i);
      if (!regexMatch) return '';
      const regex = new RegExp(regexMatch[1], regexMatch[2]);

      const match = String.fromCharCode
        .apply(
          null,
          Array.from({ length: Math.pow(2, 16) }, (_, i) => i)
        )
        .match(regex);
      if (!match) return '';

      const charset = match.join('').split('');
      let charsetLength1 = charset.length - 1;

      const result = new Array(component.quantity).fill('');
      for (let i = 0; i < component.quantity; i++) {
        const index = Math.round(charsetLength1 * random.pull());
        result[i] = charset[index];
        if (component.repeat === false) {
          charset.splice(index, 1);
          charsetLength1--;
        }
      }
      return result.join('');
    }

    case 'list': {
      const list = component.list.slice(); // shallow copy
      let length1 = list.length - 1;

      const result = new Array(component.quantity).fill('');
      for (let i = 0; i < component.quantity; i++) {
        const index = Math.round(length1 * random.pull());
        result[i] = list[index];
        if (component.repeat === false) {
          list.splice(index, 1);
          length1--;
        }
      }
      return result.join('');
    }

    case 'group': {
      if (component?.actions) {
        const quantity = component.group.length;
        let result = new Array(quantity).fill('');
        for (let i = 0; i < quantity; i++) {
          result[i] = generateFromPatternComponent(component.group[i]);
        }
        const actions = component.actions;
        const actionsLength = actions.length;
        for (let j = 0; j < actionsLength; j++) {
          if (actions[j] === 'flatten') {
            result = result.join('').split('');
          } else if (actions[j] === 'shuffle') {
            result = shuffle(result, result.length);
          }
        }
        return result.join('');
      } else {
        const quantity = component.group.length;
        const result = new Array(quantity).fill('');
        for (let i = 0; i < quantity; i++) {
          result[i] = generateFromPatternComponent(component.group[i]);
        }
        return result.join('');
      }
    }

    default: {
      return '';
    }
  }
}

export function generateFromPattern(pattern: Pattern): string {
  const quantity = pattern.components.length;
  const result = new Array(quantity).fill('');
  for (let i = 0; i < quantity; i++) {
    result[i] = generateFromPatternComponent(pattern.components[i]);
  }
  return result.join('');
}
