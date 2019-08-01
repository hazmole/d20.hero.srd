"use strict";

const JSON_URL = "powereffects.json";
let list;

window.onload = async function load () {
	SortUtil.initHandleFilterButtonClicks();
	DataUtil.loadJSON(`data/${languageParser.getActiveLanguage()}/`+JSON_URL).then(onJsonLoad);
	//onJsonLoad(getFakeData());
};

async function onJsonLoad (data) {
	list = ListUtil.search({
		valueNames: ['name', 'type', "action", "range", "duration", "uniqueid", "eng_name"],
		listClass: "powereffects"
	});

	const subList = ListUtil.initSublist({
		valueNames: ["name", "type", "id"],
		listClass: "subpowereffects",
		getSublistRow: getSublistItem
	});
	ListUtil.initGenericPinnable();

	addAdvantages(data);
}

let entryList = [];
let Idx = 0;
function addAdvantages (data) {
	if (!data.powereffect || !data.powereffect.length) return;

	entryList = entryList.concat(data.powereffect);

	const entryTable = $("ul.powereffects");
	let tempString = "";
	for (; Idx < entryList.length; Idx++) {
		const entry = entryList[Idx];
		const name = entry.translate_name? entry.translate_name: entry.name;
		const type = entry.type;
		const rank = entry.rank;

		tempString += `
			<li class="row" ${FLTR_ID}="${Idx}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
				<a id="${Idx}" href="#${UrlUtil.autoEncodeHash(entry)}" title="${name}">
					<span class="name col-4">${name}</span>
					<span class="type col-2 text-align-center">${Renderer.getTypeFullText(entry.type)}</span>
					<span class="type col-2 text-align-center">${Renderer.powereffect.getActionText(entry.action)}</span>
					<span class="type col-2 text-align-center">${Renderer.powereffect.getRangeText(entry.range)}</span>
					<span class="type col-2 text-align-center">${Renderer.powereffect.getDurationText(entry.duration)}</span>
					
					<span class="uniqueid hidden">${entry.uniqueId ? entry.uniqueId : Idx}</span>
					<span class="eng_name hidden">${entry.name}</span>
				</a>
			</li>`;

	}
	const lastSearch = ListUtil.getSearchTermAndReset(list);
	entryTable.append(tempString);

	list.reIndex();
	list.sort("type");
	
	ListUtil.setOptions({
		itemList: entryList,
		getSublistRow: getSublistItem,
		primaryLists: [list]
	});
	//ListUtil.bindPinButton();
	//Renderer.hover.bindPopoutButton(entryList);
	//UrlUtil.bindLinkExportButton(filterBox);
	//ListUtil.bindDownloadButton();
	//ListUtil.bindUploadButton();

	History.init(true);
}

// filtering function
function getSublistItem (feat, pinId) {
	return `
		<li class="row" ${FLTR_ID}="${pinId}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(feat)}" title="${feat.name}">
				<span class="name col-4">${feat.name}</span>
				<span class="ability col-4 ${feat._slAbility === STR_NONE ? "list-entry-none" : ""}">${feat._slAbility}</span>
				<span class="prerequisite col-4 ${feat._slPrereq === STR_NONE ? "list-entry-none" : ""}">${feat._slPrereq}</span>
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

	//const prerequisite = Renderer.feat.getPrerequisiteText(feat.prerequisite);
	//Renderer.feat.mergeAbilityIncrease(feat);
	const renderStack = [];
	renderer.recursiveRender({entries: entry.entries}, renderStack, {depth: 0});

	$content.append(`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getNameTr(entry)}
		${Renderer.powereffect.getInfoTr(entry)}
		<tr><td class="divider" colspan="6"><div></div></td></tr>
		<tr class='text'><td colspan='6'>${renderStack.join("")}</td></tr>
		${Renderer.powereffect.getModifierBlock(entry)}
		${Renderer.utils.getBorderTr()}
	`);

	ListUtil.updateSelected();
}

function loadsub (sub) {
	//filterBox.setFromSubHashes(sub);
	ListUtil.setFromSubHashes(sub);
}




function getFakeData(){
	return {
	"powereffect": [
		{
			"name": "Movement",
			"type": "MOV",
			"action": "F",
			"range": "personal",
			"duration": "sustained",
			"cost": {
				"value": 2,
				"type": "per"
			},
			"entries": [
				"You have a special form of movement. For each rank in this effect, choose one of the following options:",
				{
					"type": "entries",
					"name": "Dimension Travel",
					"entries": [
						"You can move instantly from one dimension to another as a move action. For 1 rank, you can move between your home dimension and one other. For 2 ranks you can move between any of a related group of dimensions (mystical dimensions, alien dimensions, etc). For 3 ranks you can travel to any dimension. You can carry up to 50 lbs. (mass rank 0) of additional material with you when you move. If you apply the Increased Mass modifier, you can carry additional mass up to your modifier rank."
					]
				},
				{
					"type": "entries",
					"name": "Environmental Adaptation",
					"entries": [
						"You’re adapted to a particular environment, such as underwater, zero gravity, and so forth (see Environmental Hazards for details). You suffer none of the normal unfavorable circumstance or movement penalties associated with that environment, moving and acting normally. You are still affected by environmental hazards like suffocation, exposure, and so forth. You need the Immunity effect to ignore such things."
					]
				},
				{
					"type": "entries",
					"name": "Permeate",
					"entries": [
						"You can pass through solid objects as if they weren’t there. For 1 rank, you can move at speed rank –2 through any physical object. For 2 ranks, you can move at speed rank –1 and for 3 ranks, you move at your normal speed through any obstacles. You cannot breathe while completely inside a solid object, so you either need Immunity to Suffocation or have to hold your breath. You may also need Penetrates Concealment Senses to know where you’re going, since you cannot see inside solid objects, either.",
						"Permeate is often Limited to a particular substance like earth, ice, or metal, for example. Permeate provides no protection against attacks, although you do gain cover while inside an object (see Cover). For the ability to allow things (including attacks) to pass through you, see Insubstantial effect."
					]
				},
				{
					"type": "entries",
					"name": "Safe fall",
					"entries": [
						"So long as you are capable of action, you can fall any distance without harm. You can also stop your fall at any point along a distance so long as there is a handhold or projection for you to grab (such as a ledge, flagpole, branch, etc.). If you have the Wall-crawling power (later in Movement), any surface you can climb provides you with a handhold.",
						"Safe Fall may be Limited to only when you are near a surface (such as the side of a building); you’re assumed to be using the surface to help slow your fall."
					]
				},
				{
					"type": "entries",
					"name": "Slithering",
					"entries": [
						"You can move while prone at your normal ground speed. You suffer no circumstance penalty for making attacks while prone."
					]
				},
				{
					"type": "entries",
					"name": "Space Travel",
					"entries": [
						"You can travel faster than the speed of light through the vacuum of space (but not in a planetary atmosphere). At rank 1 you can travel to other planets in a solar system. At rank 2, you can travel to other star systems, while at rank 3, you can visit distant star systems, perhaps even other galaxies! This effect does not provide protection from the rigors of outer space (for that, see Immunity effect)."
					]
				},
				{
					"type": "entries",
					"name": "Sure-footed",
					"entries": [
						"You’re better able to deal with obstacles and obstructions to movement. Reduce the speed penalty for moving through or around such obstacles by 1 for each rank of this effect. If you reduce the speed penalty to 0 or less, you are unaffected by that obstacle and move at full normal speed."
					]
				},
				{
					"type": "entries",
					"name": "Swinging",
					"entries": [
						"You can swing through the air at your normal ground speed rank, using a swing-line you provide or available lines and projections (tree limbs, flagpoles, vines, telephone- and powerlines, etc.)."
					]
				},
				{
					"type": "entries",
					"name": "Time Travel",
					"entries": [
						"You can move through time! For 1 rank, you can move between the present and another fixed point in time (such as 100 years into the past, or 1,000 years into the future). For 2 ranks you can move to any point in the past or any point in the future (but not both). For 3 ranks, you can travel to any point in time. Reaching alternate timelines or parallel worlds requires at least 2 ranks of Dimension-Travel. You can carry up to 50 lbs. (mass rank 0) of additional material with you when you time-travel. If you apply the Increased Mass modifier, you can carry additional mass up to your modifier rank."
					]
				},
				{
					"type": "entries",
					"name": "Trackless",
					"entries": [
						"You leave no trail and cannot be tracked using visual senses (although you can still be tracked using scent or other means). You can walk across the surface of soft sand or snow without leaving tracks and you have total concealment from tremorsense (see Concealment). Each additional rank renders you trackless to another sense type."
					]
				},
				{
					"type": "entries",
					"name": "Wall-crawling",
					"entries": [
						"You can climb walls and ceilings at your ground speed rank –1 with no chance of falling and no need for an Athletics check. You are still vulnerable while climbing, however. An additional rank of this effect means you climb at your full speed rank and are not vulnerable while climbing."
					]
				},
				{
					"type": "entries",
					"name": "Water-walking",
					"entries": [
						"You can stand or move at your normal ground speed on the surface of water, quicksand, and other liquids without sinking. If you fall prone for any reason, you sink into the liquid normally. With 2 ranks of this effect, you can also lie prone on a liquid surface without sinking; you only sink if you choose to."
					]
				},
				{
					"type": "inset",
					"name": "Under the Hood: Time, Space, And Dimension Travel",
					"entries": [
						"The Time, Space, and Dimension Travel effects of Movement are comparatively cheap considering what they do, primarily because such special movement capabilities are highly dependent on the plot and nature of the setting, and subject to a lot of Gamemaster oversight. Thus, they largely amount to supped-up Features, mainly allowing heroes to visit exotic locales.",
						"Temporal mechanics and the effects of time travel are left entirely up to the GM, who may choose to make Time Travel Limited, Uncontrolled, or Unreliable for player characters, or disallow it altogether, treating it solely as a plot-device in the setting.",
						"Space travel in the comic books rarely involves the laws of physics and tends to occur “at the speed of plot”. Characters and vehicles (such as alien starships) able to traverse the void of space do so primarily to facilitate adventures out among the stars. Exactly how fast characters travel through the void of space does not really matter; it is how long it takes them to get where they’re going that matters. So Space Travel is largely defined in terms of “how far can you go between scenes?” The same is true of the mechanism of travel, whether hyperspace, jump drive, faster-than-light “warp speed,” or what have you.",
						"The Gamemaster likewise decides on the existence and nature of other dimensions in the setting, what they are like, and who can reach them. Like Time Travel, the GM may require Dimension Travel be Limited, Uncontrolled, or Unreliable for player characters, or treat it solely as a plot-device rather than a defined effect."
					]
				}
			]
		},
	]
};
}