// Build Page Functions (Do not change)
//=========================
let list;
var IS_LOCAL_TEST = false;
window.onload = async function load () {
	SortUtil.initHandleFilterButtonClicks();
	if(!IS_LOCAL_TEST) DataUtil.loadJSON(`data/${languageParser.getActiveLanguage()}/`+JSON_URL).then(onJsonLoad);
	else onJsonLoad(getFakeData());
};
async function onJsonLoad (data) {
	list = ListUtil.search({
		valueNames: DATA_LIST_ITEM_ARR.concat(["uniqueid", "eng_name"]),
		listClass: PAGE_LIST_CLASS
	});
	const subList = ListUtil.initSublist({
		valueNames: DATA_LIST_ITEM_ARR.concat(["id"]),
		listClass: PAGE_SUBLIST_CLASS,
		getSublistRow: getSublistItem
	});

	await Renderer.hover._doFillThenCall(UrlUtil.getCurrentPage(), null, "test", function(){});

	ListUtil.initGenericPinnable();
	addEntry(data);
	await ListUtil.pLoadState();
}
let entryList = [];
function addEntry (data) {
	if (!data[CUSTOM_TOKEN] || !data[CUSTOM_TOKEN].length) return;
	entryList = entryList.concat(data[CUSTOM_TOKEN]);
	// get entries HTML
	let tempString = "";
	for (var Idx = 0; Idx < entryList.length; Idx++) {
		var entry = entryList[Idx];
		tempString += getListItem(entry, Idx);
	}
	$("ul."+PAGE_LIST_CLASS).append(tempString);
	// Sort List
	list.reIndex();
	list.sort(DEFAULT_SORT);
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	if (lastSearch) list.search(lastSearch);
	// Set Options
	ListUtil.setOptions({
		itemList: entryList,
		getSublistRow: getSublistItem,
		primaryLists: [list]
	});
	// Bind Quick Buttons
	ListUtil.bindPinButton();
	Renderer.hover.bindPopoutButton(entryList);
	ListUtil.bindDownloadButton();
	ListUtil.bindUploadButton();
	// Init History
	History.init(true);
}
function getListItem (entry, id) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	return `
		<li class="row" ${FLTR_ID}="${id}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
			<a id="${id}" href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
				${getGeneralListItem(entry)}
				<span class="uniqueid hidden">${entry.uniqueId ? entry.uniqueId : id}</span>
				<span class="eng_name hidden">${entry.name}</span>
			</a>
		</li>`;
}
function getSublistItem (entry, pinId) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
				${getGeneralListItem(entry)}
				<span class="id hidden">${pinId}</span>
			</a>
		</li>`;
}
function loadhash (id) {
	const renderer = Renderer.get();
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
//=========================