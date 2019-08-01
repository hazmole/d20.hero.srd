"use strict";

const JSON_URL = "advantages.json";
const CUSTOM_RENDERER = Renderer.advantage;
const CUSTOM_TOKEN = "advantage";
let list;

window.onload = async function load () {
	SortUtil.initHandleFilterButtonClicks();
	DataUtil.loadJSON(`data/${languageParser.getActiveLanguage()}/`+JSON_URL).then(onJsonLoad);
};

async function onJsonLoad (data) {
	list = ListUtil.search({
		valueNames: ['name', 'type', "rank", "uniqueid", "eng_name"],
		listClass: "advantages"
	});

	const subList = ListUtil.initSublist({
		valueNames: ["name", 'type', "rank", "id"],
		listClass: "subadvantages",
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
	
	var entryTable = $("ul.advantages");
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
	var rank = entry.rank;
	return `
		<li class="row" ${FLTR_ID}="${id}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
			<a id="${id}" href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
				<span class="name col-7">${name}</span>
				<span class="type col-3 text-align-center">${type}</span>
				<span class="rank col-2 text-align-center">${rank? "V": ""}</span>
				
				<span class="uniqueid hidden">${entry.uniqueId ? entry.uniqueId : id}</span>
				<span class="eng_name hidden">${entry.name}</span>
			</a>
		</li>`;
}
function getSublistItem (entry, pinId) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	var type = CUSTOM_RENDERER.getTypeFullText(entry.type);
	var rank = entry.rank;
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
				<span class="name col-7">${name}</span>
				<span class="type col-3 text-align-center">${type}</span>
				<span class="rank col-2 text-align-center">${rank? "V": ""}</span>
				
				<span class="id hidden">${pinId}</span>
			</a>
		</li>`;
}

const renderer = Renderer.get();
function loadhash (id) {
	renderer.setFirstSection(true);

	const $content = $("#pagecontent").empty();
	const entry = entryList[id];

	$content.append(`
		${Renderer.utils.getBorderTr()}
		${CUSTOM_RENDERER.getCompactRenderedString(entry)}
		${Renderer.utils.getBorderTr()}
	`);

	ListUtil.updateSelected();
}
function loadsub (sub) {
	ListUtil.setFromSubHashes(sub);
}
