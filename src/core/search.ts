import utilities from './utilities';
import { listSavedPassword } from './storage';

function createSearchIndex() {
  var list = listSavedPassword();
  var list_len = list.length;
  Xsearch.searchIndex = { all: [], hashtags: [], date: [], len: [] };
  for (var r = 0; r < list_len; r++) {
    var all = [];
    all.push(list[r].password);
    all.push(list[r].website);
    all.push(list[r].note === null ? '' : utilities.deur(atob(list[r].note)));
    all.push(list[r].username);
    var date = new Date(list[r].time_stamp);
    all.push(utilities.timestr(date));
    var hashtags = utilities.gethashtags(all[2], true);
    var hashtags_len = hashtags.length;
    all.push(hashtags.join(' '));
    all.push('year:' + date.getFullYear());
    all.push('month:' + (date.getMonth() + 1));
    all.push('date:' + date.getDate());
    all.push('length:' + String(list[r].password).length);
    var all_unicode = utilities.unicode_arr(String(all.join('')).toLowerCase());
    var hashtags_unicode = utilities.unicode_arr(hashtags.join(''));
    Xsearch.searchIndex.all.push({
      id: list[r].id,
      password: all[0],
      website: all[1],
      note: all[2],
      username: all[3],
      date: all[4],
      len: all[9],
      all_unicode: all_unicode,
      hashtags: hashtags,
      hashtags_unicode: hashtags_unicode,
      all: all.join(' '),
      type: 0
    });
    for (var w = 0; w < hashtags_len; w++) {
      if (!(Xsearch.searchIndex.hashtags.indexOf(hashtags[w]) > -1)) {
        Xsearch.searchIndex.hashtags.push(hashtags[w]);
      }
    }
    for (var w = 6; w < 9; w++) {
      if (!(Xsearch.searchIndex.date.indexOf(all[w]) > -1)) {
        Xsearch.searchIndex.date.push(all[w]);
      }
    }
    if (!(Xsearch.searchIndex.len.indexOf(all[9]) > -1)) {
      Xsearch.searchIndex.len.push(all[9]);
    }
  }
  return Xsearch.searchIndex;
}

function search_passwords(query, index) {
  var index_hashtags_len = index.hashtags.length;
  var index_date_len = index.date.length;
  var index_len_len = index.len.length;
  var suggestions_hashtags = [];
  var suggestions_date = [];
  var suggestions_len = [];
  var suggestions = [];
  for (var h = 0; h < index_hashtags_len; h++) {
    if (index.hashtags[h].indexOf(query) > -1) {
      suggestions_hashtags.push({ type: 1, suggestion: index.hashtags[h], similarity: suggestions_hashtags.length < 10 ? utilities.jaroWinklerDistance(query, index.hashtags[h]) : 0 });
    }
  }
  for (var d = 0; d < index_date_len; d++) {
    if (index.date[d].indexOf(query) > -1) {
      suggestions_date.push({ type: 2, suggestion: index.date[d], similarity: suggestions_date.length < 10 ? utilities.jaroWinklerDistance(query, index.date[d]) : 0 });
    }
  }
  for (var d = 0; d < index_len_len; d++) {
    if (index.len[d].indexOf(query) > -1) {
      suggestions_date.push({ type: 4, suggestion: index.len[d], similarity: suggestions_len.length < 10 ? utilities.jaroWinklerDistance(query, index.len[d]) : 0 });
    }
  }
  if (suggestions_hashtags.length < 10 && suggestions_date.length < 10 && suggestions_len.length < 10) {
    suggestions = suggestions_hashtags
      .concat(suggestions_date)
      .concat(suggestions_len)
      .sort(function (a, b) {
        return b.similarity - a.similarity;
      });
  } else {
    suggestions = suggestions_hashtags.concat(suggestions_date).concat(suggestions_len).sort();
  }

  var query_unicode = utilities.unicode_arr(query);
  var query_unicode_len = query_unicode.length;
  var result = [];
  var index_len = index.all.length;
  for (var q = 0; q < index_len; q++) {
    var this_index = index.all[q];
    var unicode_check = false;
    for (var u = 0; u < query_unicode_len; u++) {
      if (this_index.all_unicode.indexOf(query_unicode[u]) > -1) {
        unicode_check = true;
        break;
      }
    }
    if (unicode_check === false) {
      continue;
    } else {
      var text_check = false;
      if (String(this_index.all).toLowerCase().indexOf(query) > -1) {
        text_check = true;
      } else {
        if (String(this_index.note).toLowerCase().indexOf(query) > -1) {
          text_check = true;
        } else {
          if (String(this_index.website).toLowerCase().indexOf(query) > -1) {
            text_check = true;
          } else {
            if (String(this_index.username).toLowerCase().indexOf(query) > -1) {
              text_check = true;
            } else {
              if (String(this_index.password).indexOf(query) > -1) {
                text_check = true;
              } else {
                if (String(this_index.date).indexOf(query) > -1) {
                  text_check = true;
                }
              }
            }
          }
        }
      }
    }
    if (text_check) {
      result.push(this_index);
    }
  }
  return { result: result, suggestions: suggestions.slice(0, 5), query: query };
}

const searchIndex: object = { all: [], hashtags: [], date: [], len: [] };

window.Xsearch = {
  createSearchIndex,
  search_passwords,
  searchIndex
};
export default window.Xsearch;
