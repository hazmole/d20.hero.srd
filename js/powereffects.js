"use strict";

const JSON_URL = "powereffects.json";
const CUSTOM_RENDERER = Renderer.powereffect;
const CUSTOM_TOKEN = "powereffect";
const DATA_LIST_ITEM_ARR = ['name', 'type', "action", "range", "duration"];
const DEFAULT_SORT = "type";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = Renderer.general.getTypeFullText(entry.type);
	var type_class = getClassByType(entry.type);
	var action = CUSTOM_RENDERER.getActionText(entry.action);
	var range = Renderer.general.getRangeText(entry.range);
	var duration = CUSTOM_RENDERER.getDurationText(entry.duration);
	return `
			<span class="name col-4">${name}</span>
			<span class="type col-2 text-align-center ${type_class}">${type}</span>
			<span class="action col-2 text-align-center">${action}</span>
			<span class="range col-2 text-align-center">${range}</span>
			<span class="duration col-2 text-align-center">${duration}</span>
		`;
}
function getClassByType(type){
	switch(type){
		case "ATK": return "school_C";
		case "CTL": return "school_T";
		case "DEF": return "school_I";
		case "MOV": return "school_D";
		case "SEN": return "school_E";
		case "C": return "school_C";
		case "F": return "school_T";
		case "G": return "school_A";
		case "S": return "school_D";
		default: return "";
	}
}

function getFakeData(){
	return {};
}
