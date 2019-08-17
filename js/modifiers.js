"use strict";

const JSON_URL = "modifiers.json";
const CUSTOM_RENDERER = Renderer.modifier;
const CUSTOM_TOKEN = "modifier";
const DATA_LIST_ITEM_ARR = ['name', 'type', "rank"];
const DEFAULT_SORT = "type";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = Renderer.general.getTypeFullText(entry.type);
	var cost = Renderer.general.getModifierCostText(entry, true);
	return `
			<span class="name col-5">${name}</span>
			<span class="type col-2 text-align-center">${type}</span>
			<span class="rank col-5 text-align-center">${cost}</span>
		`;
}
function getFakeData(){
	return {};
}
