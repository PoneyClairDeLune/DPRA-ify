// src/textMatcher/index.mjs
"use strict";let TextMatchResult = class {
  isMatch = !1;
  pos = 0;
  data;
  constructor(isMatch, pos, data) {
    this.isMatch = isMatch, this.pos = pos, this.data = data;
  }
}, TextMatchResultArray = class extends Array {
  constructor(...arr) {
    super(...arr);
  }
  static sorter(a, b) {
    return a.pos - b.pos;
  }
  sort(customSorter) {
    customSorter || (customSorter = TextMatchResultArray.sorter), super.sort(customSorter);
  }
}, TextMatcher = class {
  static buildMatchCache(arr) {
    let cacheObj = {};
    for (let e of arr)
      cacheObj[e] = !0;
    return cacheObj;
  }
  static match(string, matchCache) {
    let result = new TextMatchResultArray();
    for (let key in matchCache) {
      let startIndex = 0, attempts = 0, lastIndex = -1;
      do {
        let matchedIndex = string.substring(startIndex).indexOf(key), currentIndex2 = matchedIndex + startIndex;
        if (matchedIndex === -1)
          break;
        if (currentIndex2 == lastIndex)
          break;
        result.push(new TextMatchResult(!0, currentIndex2, key)), startIndex += matchedIndex + key.length, lastIndex = currentIndex2, attempts++;
      } while (startIndex >= 0 && startIndex < string.length && attempts < 16);
    }
    result.sort();
    let originalLength = result.length, currentIndex = 0;
    for (let i = 0; i < originalLength; i++) {
      let e = result[i];
      result.push(new TextMatchResult(!1, currentIndex, string.substring(currentIndex, e.pos))), currentIndex = e.pos + e.data.length;
    }
    return currentIndex + 1 !== string.length && result.push(new TextMatchResult(!1, currentIndex, string.substring(currentIndex))), result.sort(), result;
  }
}, textMatcher_default = TextMatcher;
export {
  textMatcher_default as default
};
