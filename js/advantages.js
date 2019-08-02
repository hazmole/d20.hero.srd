"use strict";

const JSON_URL = "advantages.json";
const CUSTOM_RENDERER = Renderer.advantage;
const CUSTOM_TOKEN = "advantage";
const DATA_LIST_ITEM_ARR = ['name', 'type', "rank"];
const DEFAULT_SORT = "type";
const PAGE_LIST_CLASS = "advantages";
const PAGE_SUBLIST_CLASS = "subadvantages";
const IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = CUSTOM_RENDERER.getTypeFullText(entry.type);
	var rank = entry.rank? "V": "";
	return `
			<span class="name col-7">${name}</span>
			<span class="type col-3 text-align-center">${type}</span>
			<span class="rank col-2 text-align-center">${rank}</span>
		`;
}
function getFakeData(){
	return {};
}
