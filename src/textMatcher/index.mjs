// TextMatcher from Rochelle
// Licensed under GNU LGPL 3.0

"use strict";

let TextMatchResult = class {
	isMatch = false;
	pos = 0;
	data;
	constructor (isMatch, pos, data) {
		this.isMatch = isMatch;
		this.pos = pos;
		this.data = data;
	};
};

let TextMatchResultArray = class extends Array {
	constructor (...arr) {
		super(...arr);
	};
	static sorter (a, b) {
		return a.pos - b.pos;
	};
	sort (customSorter) {
		if (!customSorter) {
			customSorter = TextMatchResultArray.sorter;
		};
		super.sort(customSorter);
	};
};

let TextMatcher = class {
	static buildMatchCache(arr) {
		let cacheObj = {};
		for (let e of arr) {
			cacheObj[e] = true;
		};
		return cacheObj;
	};
	static match(string, matchCache) {
		let result = new TextMatchResultArray();
		for (let key in matchCache) {
			let startIndex = 0, attempts = 0, lastIndex = -1;
			do {
				let matchWindow = string.substring(startIndex);
				let matchedIndex = matchWindow.indexOf(key);
				let currentIndex = matchedIndex + startIndex;
				//console.debug(`%o with "%o"\n%o`, matchedIndex + startIndex, key, matchWindow);
				if (matchedIndex === -1) {
					// Nothing matched
					break;
				} else if (currentIndex == lastIndex) {
					// Infinite loop detected
					break;
				} else {
					result.push(new TextMatchResult(true, currentIndex, key));
					startIndex += matchedIndex + key.length;
				};
				lastIndex = currentIndex;
				attempts ++;
			} while (startIndex >= 0 && startIndex < string.length && attempts < 16);
		};
		result.sort();
		let originalLength = result.length, currentIndex = 0;
		for (let i = 0; i < originalLength; i ++) {
			let e = result[i]
			result.push(new TextMatchResult(false, currentIndex, string.substring(currentIndex, e.pos)));
			currentIndex = e.pos + e.data.length;
		};
		if (currentIndex + 1 !== string.length) {
			result.push(new TextMatchResult(false, currentIndex, string.substring(currentIndex)));
		};
		result.sort();
		return result;
	};
};

export default TextMatcher;
