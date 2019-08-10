"use strict";

const JSON_URL = "skills.json";
const CUSTOM_RENDERER = Renderer.skill;
const CUSTOM_TOKEN = "skill";
const DATA_LIST_ITEM_ARR = ['name', 'ability', "untrain", "action"];
const DEFAULT_SORT = "name";
const PAGE_LIST_CLASS = "skills";
const PAGE_SUBLIST_CLASS = "subskills";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var ability = CUSTOM_RENDERER.getAbilityText(entry.ability);
	var untrain = entry.untrain? "V": "";
	var action = CUSTOM_RENDERER.getActionText(entry.action);

	return `
			<span class="name col-5">${name}</span>
			<span class="ability col-2 text-align-center">${ability}</span>
			<span class="untrain col-2 text-align-center">${untrain}</span>
			<span class="action col-3">${action}</span>
		`;
}
function getFakeData(){
	return {};
}
