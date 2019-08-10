"use strict";

const JSON_URL = "conditions.json";
const CUSTOM_RENDERER = Renderer.condition;
const CUSTOM_TOKEN = "condition";
const DATA_LIST_ITEM_ARR = ['name', 'type', "contain"];
const DEFAULT_SORT = "type";
const PAGE_LIST_CLASS = "conditions";
const PAGE_SUBLIST_CLASS = "subconditions";
IS_LOCAL_TEST = false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = Renderer.general.getTypeFullText(entry.type);
	var contain = "";

	if(entry.contain && entry.contain.length>0){
		var arr = entry.contain.map( condition_name => {
			var cache_con = Renderer.hover._getFromCache(UrlUtil.getCurrentPage(), null, condition_name);
			if(!cache_con) return "";
			var display_name = cache_con.translate_name? cache_con.translate_name: cache_con.name;
			return display_name;
		});
		contain = arr.join(", ");
	}

	return `
			<span class="name col-3">${name}</span>
			<span class="type col-2 text-align-center">${type}</span>
			<span class="contain col-7">${contain}</span>
		`;
}
function getFakeData(){
	return {};
}
