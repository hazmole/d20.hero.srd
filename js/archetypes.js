"use strict";

const JSON_URL = "archetypes.json";
const CUSTOM_RENDERER = Renderer.archetype;
const CUSTOM_TOKEN = "archetype";
const DATA_LIST_ITEM_ARR = ['name'];
const DEFAULT_SORT = "name";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	return `
			<span class="name col-12">${name}</span>
		`;
}
function getFakeData(){
	return {};
}
