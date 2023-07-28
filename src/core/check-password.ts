import words_list from './words-list'
import { LS } from './storage'

export function checkCommonWordPatterns(string) {
  if (!words_list.loaded) {
    words_list.getWordsList()
    return 0
  }
  string = string.toLowerCase()
  var len = string.length

  var matched = []
  for (var i = 0; i < len; i++) {
    if (words_list.c.hasOwnProperty(string.substring(i, i + 3))) {
      var arr = words_list.c[string.substring(i, i + 3)].slice()
      var arr_len = arr.length
      for (var r = 0; r < arr_len; r++) {
        if (string.indexOf(arr[r].trim()) !== -1 && matched.indexOf(arr[r]) < 0) {
          matched.push(arr[r])
        }
      }
    }
  }
  matched.sort(function (a, b) {
    return b.length - a.length
  })
  var matched_len = matched.length
  for (var g = 0; g < matched_len; g++) {
    string = string.replaceAll(matched[g].trim(), '')
  }
  return string.length / len
}

export function checkPassword(string, cache, id) {
  var getPoints = function (string) {
    const randomnessX = function (x) { return Math.min(100, Math.max(0, (8.31 - 1.89 * x + 0.0743 * Math.pow(x, 2) - 5.91 * Math.pow(10, -4) * Math.pow(x, 3)) / 35.89 * 100)) }

    var length = -42.7 + 29.7 * Math.log(string.length);
    var arr = string.split('')
    var arr_len = arr.length
    var randomness = 0
    var n_arr = []
    var json = {}
    var t = []
    for (var w = 0; w < arr_len; w++) {
      n_arr.push({ c: arr[w], i: w, u: String(arr[w]).charCodeAt(0) })
      json['u_' + String(arr[w]).charCodeAt(0)] = json.hasOwnProperty('u_' + String(arr[w]).charCodeAt(0)) ? json['u_' + String(arr[w]).charCodeAt(0)] + 1 : 1
    }
    n_arr.sort(function (a, b) {
      return a.u - b.u
    })

    for (var w = 0; w < arr_len; w++) {
      randomness += Math.abs(w - n_arr[w].i)
    }
    randomness = randomnessX(randomness / n_arr.length / (string.length / 2) * 100)
    var repeat = 0
    var repeat_len = 0
    for (var w in json) {
      repeat += json[w]
      repeat_len += 1
    }
    repeat = (1 - repeat / repeat_len / string.length) * 100

    t.push(string.match(/[A-Z]*/gm).join('').length)
    t.push(string.match(/[a-z]*/gm).join('').length)
    t.push(string.match(/[0-9]*/gm).join('').length)
    t.push(string.length - t[0] - t[1] - t[2])

    var t_avg = string.length / 4
    var t_s = 0
    for (var w = 0; w < 4; w++) {
      t_s += Math.pow(t[w] - t_avg, 2)
    }
    const ty: number = (1 - Math.min(Math.max(Math.sqrt(t_s / 4) / t_avg, 0), 1)) * 100

    var commonWords = checkCommonWordPatterns(string) * 100
    return [Math.min(Math.max(Math.floor((length * 3 + randomness * 1.7 + repeat * 2 + ty * 2 + commonWords * 2) / 10.7), 0), 100), Math.floor(length), Math.floor(randomness), Math.floor(repeat), Math.floor(ty), Math.floor(commonWords), t[0], t[1], t[2], t[3]]
  }

  var judgePoints = function (points) {
    var phrase = ''
    var r, g, b = 0
    if (points >= 85) {
      phrase = 'strong'
      r = 52
      g = 199
      b = 89
    }
    if (points >= 60 && points < 85) {
      phrase = 'average'
      r = 242
      g = 190
      b = 0
    }
    if (points >= 45 && points < 60) {
      phrase = 'fragile'
      r = 255
      g = 149
      b = 0
    }
    if (points < 45) {
      phrase = 'unsafe'
      r = 255
      g = 59
      b = 48
    }
    return [phrase, r, g, b]
  }

  var getReport = function (length_points, randomness_points, repeat_points, complexity_points, uniqueness_points, n1, n2, n3, n4) {

    var points_summary = 5
    // Initialize a set to store used instructions
    var used_instructions = new Set();
    // Length Instructions
    if (length_points <= 25 && !used_instructions.has("length_short")) {
      var Length_Instructions = "The length of this password is too short. Suggest you make it long enough.";
      used_instructions.add("length_short");
    } else if (length_points >= 26 && length_points <= 50 && !used_instructions.has("length_not_long")) {
      var Length_Instructions = "The length of this password isn't long enough. Suggest you make it longer.";
      used_instructions.add("length_not_long");
    } else if (length_points >= 51 && length_points <= 75 && !used_instructions.has("length_average")) {
      var Length_Instructions = "The length of this password is average. Recommend you make it longer.";
      used_instructions.add("length_average");
    } else if (length_points >= 76 && !used_instructions.has("length_long_enough")) {
      var Length_Instructions = "The length of this password is long enough, but please keep awareness of the security of your accounts.";
      used_instructions.add("length_long_enough");
      points_summary -= 1
    }

    // Randomness Instructions
    if (randomness_points <= 25 && !used_instructions.has("randomness_neat")) {
      var Randomness_Instructions = "The arrangement of characters in this password is too neat, so the password isn't random. Suggest you rearrange the characters.";
      used_instructions.add("randomness_neat");
    } else if (randomness_points >= 26 && randomness_points <= 50 && !used_instructions.has("randomness_not_messy")) {
      var Randomness_Instructions = "The arrangement of characters in this password isn't messy enough, so the password isn't random. Suggest you rearrange the characters.";
      used_instructions.add("randomness_not_messy");
    } else if (randomness_points >= 51 && randomness_points <= 75 && !used_instructions.has("randomness_average")) {
      var Randomness_Instructions = "The arrangement of characters in this password is randomly distributed on average. Recommend you rearrange the characters.";
      used_instructions.add("randomness_average");
    } else if (randomness_points >= 76 && !used_instructions.has("randomness_random")) {
      var Randomness_Instructions = "The arrangement of characters in this password is entirely random, but please keep awareness of the security of your accounts.";
      used_instructions.add("randomness_random");
      points_summary -= 1
    }

    // Repeat Instructions
    if (repeat_points <= 25 && !used_instructions.has("repeat_entirely")) {
      var Repeat_Instructions = "In this password, the characters are entirely repeated, which can pose a danger to your account. Suggest you regenerate a new one.";
      used_instructions.add("repeat_entirely");
    } else if (repeat_points >= 26 && repeat_points <= 50 && !used_instructions.has("repeat_repeated")) {
      var Repeat_Instructions = "In this password, the characters are repeated, which might cause potential dangers to your account. Suggest you regenerate a new one.";
      used_instructions.add("repeat_repeated");
    } else if (repeat_points >= 51 && repeat_points <= 75 && !used_instructions.has("repeat_slightly")) {
      var Repeat_Instructions = "In this password, the characters are slightly repeated, which is not a strict problem, but still suggest you regenerate a new one.";
      used_instructions.add("repeat_slightly");
    } else if (repeat_points >= 76 && !used_instructions.has("repeat_hardly")) {
      var Repeat_Instructions = "In this password, the characters are hardly repeated, but please keep awareness of the security of your accounts.";
      used_instructions.add("repeat_hardly");
      points_summary -= 1
    }

    // Complexity Instructions
    if (complexity_points <= 25 && !used_instructions.has("complexity_not_complex")) {
      var Complexity_Instructions = `This password consists of ${n1} uppercases, ${n2} lowercases, ${n3} digits, and ${n4} other types of characters. The types of characters in this password aren't complex and rich enough. Suggest you regenerate a new password that includes all the types of characters.`;
      used_instructions.add("complexity_not_complex");
    } else if (complexity_points >= 26 && complexity_points <= 50 && !used_instructions.has("complexity_not_complex_enough")) {
      var Complexity_Instructions = `This password consists of ${n1} uppercases, ${n2} lowercases, ${n3} digits, and ${n4} types of other characters. The types of characters in this password aren't complex and rich enough. Suggest you regenerate a new password that includes all the types of characters.`;
      used_instructions.add("complexity_not_complex_enough");
    } else if (complexity_points >= 51 && complexity_points <= 75 && !used_instructions.has("complexity_not_complex_enough_2")) {
      var Complexity_Instructions = `This password consists of ${n1} uppercases, ${n2} lowercases, ${n3} digits, and ${n4} other types of characters. The types of characters in this password aren't complex and rich enough. Recommend you regenerate a new password that includes all the types of characters.`;
      used_instructions.add("complexity_not_complex_enough_2");
    } else if (complexity_points >= 76 && !used_instructions.has("complexity_complex")) {
      var Complexity_Instructions = `This password consists of ${n1} uppercases, ${n2} lowercases, ${n3} digits, and ${n4} other types of characters. The types of characters in this password are complex and rich. But please keep awareness of the security of your accounts.`;
      used_instructions.add("complexity_complex");
      points_summary -= 1
    }
    // Uniqueness Instructions
    if (uniqueness_points <= 25 && !used_instructions.has("uniqueness_not_unique")) {
      var Uniqueness_Instructions = `This password includes many common words. Suggest you remove the words from this password to make it more secure.`
      used_instructions.add("complexity_not_complex");
    } else if (uniqueness_points >= 26 && uniqueness_points <= 50 && !used_instructions.has("uniqueness_not_unique_enough")) {
      var Uniqueness_Instructions = `This password includes some common words. Suggest you remove the words from this password to make it more secure.`
      used_instructions.add("complexity_not_complex_enough");
    } else if (uniqueness_points >= 51 && uniqueness_points <= 99 && !used_instructions.has("uniqueness_not_unique_enough_2")) {
      var Uniqueness_Instructions = `This password includes common words. Suggest you remove the words from this password to make it more secure.`
      used_instructions.add("complexity_not_complex_enough_2");
    } else if (uniqueness_points >= 100 && !used_instructions.has("uniqueness_unique")) {
      var Uniqueness_Instructions = `This password doesn't include common words collected in our list. But please keep awareness of the security of your accounts.`
      used_instructions.add("complexity_complex");
      points_summary -= 1
    }

    if (points_summary === 0) {
      points_summary = 'no'
    }

    var report = `According to the points, this password has ${points_summary} problem${(points_summary > 1 ? 's' : '')}.
All you have to do is follow the instructions:
1. ${Length_Instructions}
2. ${Randomness_Instructions}
3. ${Repeat_Instructions}
4. ${Complexity_Instructions}
5. ${Uniqueness_Instructions}`

    return report
  }

  if (cache) {
    var LS_key = `pwdgen2_saved_b_${id}`
    var LS_cache_key = `pwdgen2_check_cache_b_${id}`
    var nowtime = new Date().getTime()
    if (LS.hasOwnProperty(LS_cache_key)) {
      var cached_result_points = parseInt(String(LS.getItem(LS_cache_key)).split(':')[1])
      var cached_result_time_stamp = parseInt(String(LS.getItem(LS_cache_key)).split(':')[0])
      var ju = judgePoints(cached_result_points)
      if ((nowtime - cached_result_time_stamp) < 43200000) {
        return { 'points': cached_result_points, 'phrase': ju[0], 'color': { r: ju[1], g: ju[2], b: ju[3] }, 'details': null }
      }
      else {
        LS.removeItem(LS_cache_key)
      }
    }
  }
  var points = getPoints(string)
  var ju = judgePoints(points[0])
  var ju_length = judgePoints(points[1])
  var ju_randomness = judgePoints(points[2])
  var ju_repeat = judgePoints(points[3])
  var ju_complexity = judgePoints(points[4])
  var ju_uniqueness = judgePoints(points[5])
  if (cache) {
    LS.setItem(LS_cache_key, nowtime + ':' + points[0])
  }
  return {
    'points': points[0],
    'phrase': ju[0],
    'color':
    {
      r: ju[1],
      g: ju[2],
      b: ju[3]
    },
    'details': {
      len: {
        points: points[1],
        color:
          { r: ju_length[1], g: ju_length[2], b: ju_length[3] }
      },
      randomness: {
        points: points[2],
        color: {
          r: ju_randomness[1],
          g: ju_randomness[2],
          b: ju_randomness[3]
        }
      },
      repeat: {
        points: points[3],
        color: {
          r: ju_repeat[1],
          g: ju_repeat[2],
          b: ju_repeat[3]
        }
      },
      complexity: {
        points: points[4],
        color: {
          r: ju_complexity[1],
          g: ju_complexity[2],
          b: ju_complexity[3]
        }
      },
      uniqueness: {
        points: points[5],
        color: {
          r: ju_uniqueness[1],
          g: ju_uniqueness[2],
          b: ju_uniqueness[3]
        }
      }
      ,
      report: getReport(points[1], points[2], points[3], points[4], points[5], points[6], points[7], points[8], points[9])
    }
  }
}
