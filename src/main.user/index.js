"use strict";

import pageStyle from "../../dist/main.css";
import sourceDict from "./dict.json";

let intermediateKeys = [];
for (let key in sourceDict) {
	intermediateKeys.push(key);
};
for (let key of intermediateKeys) {
	switch (key) {
		case "US ":
		case "U.S. ": {
			break;
		};
		default: {
			sourceDict[key.toUpperCase()] = sourceDict[key];
			sourceDict[key.toLowerCase()] = sourceDict[key];
		};
	};
};

let generateText = (key) => {
	switch (typeof sourceDict[key]) {
		case "string": {
			return sourceDict[key];
			break;
		};
		case "object": {
			let textBuffer = [];
			for (let choices of sourceDict[key]) {
				let theChosenOne = choices[Math.floor(Math.random() * choices.length)];
				if (theChosenOne?.length > 0) {
					textBuffer.push(theChosenOne);
				};
			};
			return textBuffer.join(" ");
			break;
		};
	};
};

let candidateElements = [];
for (let pageElement of document.querySelectorAll("p, a")) {
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
	// The simpler approach
	for (let childNode of victimElement.childNodes) {
		if (childNode.nodeType === 3) {
			let victimText = childNode.data;
			for (let key in sourceDict) {
				switch (key) {
					case "President ": {
						let maxTries = Math.floor(Math.random() * 3);
						let titleBuffer = [];
						for (let i = 0; i <= maxTries; i ++) {
							titleBuffer.push(generateText(key));
						};
						victimText = victimText.replaceAll(key, `${titleBuffer.join(", ")} `);
						break;
					};
					default: {
						victimText = victimText.replaceAll(key, `${generateText(key)} `);
					};
				};
			};
			childNode.data = victimText;
		};
	};
};
