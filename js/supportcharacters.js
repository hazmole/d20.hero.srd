"use strict";

const JSON_URL = "supportcharacters.json";
const CUSTOM_RENDERER = Renderer.archetype;
const CUSTOM_TOKEN = "supportcharacter";
const DATA_LIST_ITEM_ARR = ['name', 'type'];
const DEFAULT_SORT = "type";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = Renderer.general.getTypeFullText(entry.type);
	var subtype = entry.subtype? Renderer.general.getSubTypeText(entry.subtype): null;
	var type_class = Renderer.general.getClassByType(entry.type);
	return `
			<span class="name col-7">${name}</span>
			<span class="type col-5 text-align-center ${type_class}">${type + (subtype? (", "+subtype): "")}</span>
		`;
}
function getFakeData(){
	return {};
}
