"use strict";

const JSON_URL = "powereffects.json";
const CUSTOM_RENDERER = Renderer.powereffect;
const CUSTOM_TOKEN = "powereffect";
let list;

window.onload = async function load () {
	SortUtil.initHandleFilterButtonClicks();
	DataUtil.loadJSON(`data/${languageParser.getActiveLanguage()}/`+JSON_URL).then(onJsonLoad);
};

async function onJsonLoad (data) {
	list = ListUtil.search({
		valueNames: ['name', 'type', "action", "range", "duration", "uniqueid", "eng_name"],
		listClass: "powereffects"
	});

	const subList = ListUtil.initSublist({
		valueNames: ['name', 'type', "action", "range", "duration", "id"],
		listClass: "subpowereffects",
		getSublistRow: getSublistItem
	});
	ListUtil.initGenericPinnable();

	addEntry(data);

	await ListUtil.pLoadState();
}

let entryList = [];
let Idx = 0;
function addEntry (data) {
	if (!data[CUSTOM_TOKEN] || !data[CUSTOM_TOKEN].length) return;
	entryList = entryList.concat(data[CUSTOM_TOKEN]);

	// Add entries
	let tempString = "";
	for (; Idx < entryList.length; Idx++) {
		var entry = entryList[Idx];
		tempString += getListItem(entry, Idx);
	}
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	
	var entryTable = $("ul.powereffects");
	entryTable.append(tempString);

	list.reIndex();
	list.sort("type");
	
	ListUtil.setOptions({
		itemList: entryList,
		getSublistRow: getSublistItem,
		primaryLists: [list]
	});
	
	// Bind Quick Button
	ListUtil.bindPinButton();
	Renderer.hover.bindPopoutButton(entryList);
	ListUtil.bindDownloadButton();
	ListUtil.bindUploadButton();

	History.init(true);
}

// List item
function getListItem (entry, id) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = CUSTOM_RENDERER.getTypeFullText(entry.type);
	var action = CUSTOM_RENDERER.getActionText(entry.action);
	var range = CUSTOM_RENDERER.getRangeText(entry.range);
	var duration = CUSTOM_RENDERER.getDurationText(entry.duration);
	return `
		<li class="row" ${FLTR_ID}="${id}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
			<a id="${id}" href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
				<span class="name col-4">${name}</span>
				<span class="type col-2 text-align-center">${type}</span>
				<span class="action col-2 text-align-center">${action}</span>
				<span class="range col-2 text-align-center">${range}</span>
				<span class="duration col-2 text-align-center">${duration}</span>

				<span class="uniqueid hidden">${entry.uniqueId ? entry.uniqueId : id}</span>
				<span class="eng_name hidden">${entry.name}</span>
			</a>
		</li>`;
}
function getSublistItem (entry, pinId) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = CUSTOM_RENDERER.getTypeFullText(entry.type);
	var action = CUSTOM_RENDERER.getActionText(entry.action);
	var range = CUSTOM_RENDERER.getRangeText(entry.range);
	var duration = CUSTOM_RENDERER.getDurationText(entry.duration);
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
				<span class="name col-4">${name}</span>
				<span class="type col-2 text-align-center">${type}</span>
				<span class="action col-2 text-align-center">${action}</span>
				<span class="range col-2 text-align-center">${range}</span>
				<span class="duration col-2 text-align-center">${duration}</span>

				<span class="id hidden">${pinId}</span>
			</a>
		</li>
	`;
}

const renderer = Renderer.get();
function loadhash (id) {
	renderer.setFirstSection(true);

	const $content = $("#pagecontent").empty();
	const entry = entryList[id];

	$content.append(`
		${Renderer.utils.getBorderTr()}
		${CUSTOM_RENDERER.getCompactRenderedString(entry, true)}
		${Renderer.utils.getBorderTr()}
	`);

	ListUtil.updateSelected();
}
function loadsub (sub) {
	ListUtil.setFromSubHashes(sub);
}
