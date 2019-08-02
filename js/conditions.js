"use strict";

const JSON_URL = "conditions.json";
const CUSTOM_RENDERER = Renderer.condition;
const CUSTOM_TOKEN = "condition";
const DATA_LIST_ITEM_ARR = ['name', 'type', "contain"];
const DEFAULT_SORT = "type";
const PAGE_LIST_CLASS = "conditions";
const PAGE_SUBLIST_CLASS = "subconditions";
const IS_LOCAL_TEST = !false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = (entry.type);
	var contain_1 = "";
	return `
			<span class="name col-3">${name}</span>
			<span class="type col-2 text-align-center">${type}</span>
			<span class="contain col-7">${contain_1}</span>
		`;
}
function getFakeData(){
	return {
		"condition": [
			{
				"name": "Compelled",
				"type": "basic",
				"entries": [
					"A compelled character is directed by an outside force, but struggling against it; the character is limited to free actions and a single standard action per turn, chosen by another, controlling, character. As usual, this standard action can be traded for a move or even free action. Controlled supersedes compelled."
				]
			},
			{
				"name": "Asleep",
				"type": "combine",
				"entries": [
					"While asleep, a character is defenseless, stunned, and unaware. A hearing Perception check with three or more degrees of success wakes the character and removes all these conditions, as does any sudden movement (such as shaking the sleeping character) or any effect allowing a resistance check."
				]
			}
		]
	};
}
