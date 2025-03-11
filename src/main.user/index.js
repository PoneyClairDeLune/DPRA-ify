"use strict";

import TextMatcher from "../textMatcher/index.mjs";

import pageStyle from "../../dist/main.css";
import sourceDict from "./dict.json";

let intermediateKeys = [];
for (let key in sourceDict) {
	intermediateKeys.push(key);
};
for (let key of intermediateKeys) {
	switch (key) {
		case "US ":
		case "U.S. ":
		case "Donald ":
		case "J. ":
		case "Trump ": {
			break;
		};
		case "President ": {
			sourceDict[key.toUpperCase()] = sourceDict[key];
			break;
		};
		default: {
			sourceDict[key.toUpperCase()] = sourceDict[key];
			sourceDict[key.toLowerCase()] = sourceDict[key];
		};
	};
};

let generateText = (key, maxOccurance = 1) => {
	switch (typeof sourceDict[key]) {
		case "string": {
			return sourceDict[key];
			break;
		};
		case "object": {
			let parentBuffer = [];
			let selectedTries = Math.floor(Math.random() * maxOccurance);
			for (let i = 0; i <= selectedTries; i ++) {
				let textBuffer = [];
				for (let choices of sourceDict[key]) {
					let theChosenOne = choices[Math.floor(Math.random() * choices.length)];
					if (theChosenOne?.length > 0) {
						textBuffer.push(theChosenOne);
					};
				};
				parentBuffer.push(textBuffer.join(" "));
			};
			return parentBuffer.join(", ");
			break;
		};
	};
};

(() => {
	let newE = document.createElement("style");
	newE.classList.add("dpra-css");
	newE.innerHTML = pageStyle;
	document.head.append(newE);
})();

let candidateElements = [];
for (let pageElement of document.querySelectorAll("p, a, h1, h2, h3, h4, h5, h6, li, strong")) {
	let isQualified = false;
	for (let childNode of pageElement.childNodes) {
		if (childNode.nodeType === 3) {
			//console.debug(childNode);
			for (let key in sourceDict) {
				if (childNode.data.indexOf(key) !== -1) {
					isQualified = true
				};
				if (isQualified) {
					break;
				};
			};
		};
		if (isQualified) {
			break;
		};
	};
	if (isQualified) {
		candidateElements.push(pageElement);
	};
};

for (let victimElement of candidateElements) {
	let originalChildren = [];
	for (let originalChild of victimElement.childNodes) {
		originalChildren.push(originalChild);
	};
	while (victimElement.childNodes.length > 0) {
		victimElement.childNodes[0].remove();
	};
	// The simpler approach
	for (let childNode of originalChildren) {
		if (childNode.nodeType === 3) {
			//let victimText = childNode.data;
			let allMatches = TextMatcher.match(childNode.data, sourceDict);
			for (let e of allMatches) {
				console.debug(e);
				if (e.isMatch) {
					// Use the rich approach
					let newElement = document.createElement("span");
					if (location.href.indexOf("/articles/") !== -1) {
						newElement.classList.add("dpra-text");
					};
					switch (e.data) {
						case "President ":
						case "PRESIDENT ": {
							newElement.append(`${generateText(e.data, 4)} `);
							break;
						};
						default: {
							newElement.append(`${generateText(e.data)} `);
						};
					};
					victimElement.append(newElement);
				} else {
					victimElement.append(document.createTextNode(e.data));
				};
			};
			/* for (let key in sourceDict) {
				if (victimText.indexOf(key) == -1) {
					continue;
				};
				switch (key) {
					case "President ":
					case "PRESIDENT ": {
						let victimBuffer = victimText.split(key);
						victimText = "";
						for (let i = 0; i < victimBuffer.length; i ++) {
							if (i > 0) {
								victimText += `${generateText(key, 3)} `;
							};
							victimText += victimBuffer[i];
						};
						break;
					};
					case "president ": {
						console.debug("This shouldn't have matched.");
						break;
					};
					default: {
						victimText = victimText.replaceAll(key, `${generateText(key)} `);
					};
				};
				}; */
			//console.debug(`${childNode.data}\n${victimText}`);
			//childNode.data = victimText;
		} else {
			victimElement.append(childNode);
		};
	};
};
