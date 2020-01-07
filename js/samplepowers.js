"use strict";

const JSON_URL = "samplepowers.json";
const CUSTOM_RENDERER = Renderer.powereffect;
const CUSTOM_TOKEN = "samplepower";
const DATA_LIST_ITEM_ARR = ['name', 'type', "action", "range", "duration"];
const DEFAULT_SORT = "type";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = Renderer.general.getTypeFullText(entry.type);
	var type_class = Renderer.general.getClassByType(entry.type);
	var action = CUSTOM_RENDERER.getActionText(entry.action);
	var range = Renderer.general.getRangeText(entry.range, true);
	var duration = CUSTOM_RENDERER.getDurationText(entry.duration);
	return `
			<span class="name col-4">${name}</span>
			<span class="type col-2 text-align-center ${type_class}">${type}</span>
			<span class="action col-2 text-align-center">${action}</span>
			<span class="range col-2 text-align-center">${range}</span>
			<span class="duration col-2 text-align-center">${duration}</span>
		`;
}

function getFakeData(){
	return {};
}
