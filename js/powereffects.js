"use strict";

const JSON_URL = "powereffects.json";
let list;

window.onload = async function load () {
	SortUtil.initHandleFilterButtonClicks();
	//DataUtil.loadJSON(`data/${languageParser.getActiveLanguage()}/`+JSON_URL).then(onJsonLoad);
	onJsonLoad(getFakeData());
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
					<span class="action col-2 text-align-center">${Renderer.powereffect.getActionText(entry.action)}</span>
					<span class="range col-2 text-align-center">${Renderer.powereffect.getRangeText(entry.range)}</span>
					<span class="duration col-2 text-align-center">${Renderer.powereffect.getDurationText(entry.duration)}</span>
					
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
			"name": "Weaken",
			"type": "ATK",
			"action": "S",
			"range": "close",
			"duration": "instant",
			"cost": {
				"value": 1,
				"type": "per"
			},
			"entries": [
				{
					"type": "insetResistCheck",
					"name": "Weaken Resistance Check",
					"func": "Fortitude or Will vs. DC [Weaken rank + 10]",
					"entries": [
						{
							"type": "list",
							"items": [
								"{@b Success}: No effect.",
								"{@b Failure}: The target loses character points from the affected trait equal to the difference between the check result and the DC, up to a maximum of the Weaken rank."
							]
						}
					]
				},
				"Multiple failed resistance checks against a Weaken effect are cumulative, up to a maximum of the Weaken rank, at which point the effect cannot weaken the trait further. Lost points return at a rate of 1 per round at the end of each of the target’s turns. Inanimate objects do not recover weakened Toughness; they must be repaired. Objects may or may not recover other weakened traits, at the GM’s discretion and depending on the effect’s descriptors.",
				{
					"type": "entries",
					"name": "Weakening Abilities",
					"entries": [
						"Abilities weakened below a rank of –5 become debilitated. See Debilitated Abilities for details of specific abilities at this point. It is not possible to weaken an ability past the point of debilitation. Any further uses of Weaken on the subject have no effect until the ability recovers to a rank of at least –5."
					]
				},
				{
					"type": "entries",
					"name": "Weakening Devices",
					"entries": [
						"Weaken with Affects Objects and the right descriptor(s) can lower the traits provided by a device (see the Removable flaw in Gadgets & Gear). For example, Weaken Magic could potentially drain the powers of a magical device as well as a target’s own magical powers. Likewise Weaken Electricity could affect an electrical device, and so on. This also applies to equipment, although it tends to have fewer traits to weaken, and the GM should feel free to disallow any Weaken effects that don’t make reasonable sense. For example, just because a Weaken Damage effect is possible doesn’t mean a character should be able to cause guns to do less damage; this sort of thing is better handled by an all-or-nothing effect like Nullify."
					]
				},
			],
			"extras": [
				{
					"name": "Affects Objects",
					"entries": ["Weaken with this modifier works on inanimate objects, although the effect can still only affect traits the objects possess. This is most often applied to Weaken Toughness for an effect that can weaken both creatures and objects. {@b +1 cost per rank, +0 for Affects Only Objects.}"],
					"cost": {
						"value": {"min":0, "max":1}, "type": "per", "hidden": true
					}
				},
				{
					"name": "Broad",
					"entries": ["You can Weaken any of a broad set of traits, one at a time suited to your effects descriptors. So you might be able to Weaken Abilities, for example, or Weaken Mental Effects. You choose which trait from the set is weakened when you use the effect."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Concentration",
					"entries": ["Once you have hit with a Concentration Weaken , so long as you continue to take a standard action each turn to maintain the effect, the target must make a new resistance check against it, with no attack check required."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Incurable",
					"entries": ["Weaken with this modifier cannot have its effects countered by another power (such as Restorative Healing) without the Persistent modifier; the target must recover from the Weaken normally."],
					"cost": {
						"value": 1, "type": "flat"
					}
				},
				{
					"name": "Precise",
					"entries": ["A Weaken effect capable of reducing more than one trait at once can have this modifier, allowing you to choose which traits are affected, while not affecting others. Note this differs from the Selective extra (following)."],
					"cost": {
						"value": 1, "type": "flat"
					}
				},
				{
					"name": "Progressive",
					"entries": ["A Progressive Weaken effect reduces the affected traits each round until the target successfully resists. Make a new resistance check for the target at the end of each turn; failure weakens the affected trait(s) further, while success stops the Progressive Weaken , but the target must still recover ranks already lost (at the rate of 1 point per turn)."],
					"cost": {
						"value": 2, "type": "per"
					}
				},
				{
					"name": "Selective",
					"entries": ["This extra is applied to an Area Weaken so it only affects some targets and not others. Combined with Precise (previously), you can use an Area Weaken to selectively affect only certain traits of certain targets."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Simultaneous",
					"entries": ["If applied to a Broad Weaken , this extra allows it to affect all of the traits in its set at the same time. Each trait loses the difference between the resistance check result and the DC in character points on a failed check. So a Simultaneous Weaken Fire Effects subtracts points from every fire effect the target possesses with a single attack. The effect must be Broad to apply this modifier."],
					"cost": {
						"value": 1, "type": "per"
					}
				}
			]
		}
	]
};
}