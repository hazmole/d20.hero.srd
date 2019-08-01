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
			"name": "Healing",
			"type": "G",
			"action": "S",
			"range": "close",
			"duration": "instant",
			"cost": {
				"value": 2,
				"type": "per"
			},
			"entries": [
				"You can heal Damage conditions by touching a subject and taking a standard action to make a DC 10 Healing check. Each degree of success healing one Damage condition, starting with the subject’s worst condition, and working down, as if the subject were recovering rapidly. If the subject is dying, the highest degree of success stabilizes the subject, removing the dying condition. If the Healing check fails, you must wait one minute or use extra effort in order to try again.",
				"You can also grant a subject a bonus equal to your Healing rank on resistance checks against effects with disease or poison descriptors. The bonus applies to the subject’s next resistance check against the effect.",
				"You can use Healing on yourself, provided you are still capable of taking the standard action needed.",
				"Healing does not work on subjects unable to recover on their own, such as creatures with no Stamina rank or inanimate objects."
			],
			"extras": [
				{
					"name": "Action",
					"entries": ["This extra reduces the action required for you to use Healing. You cannot use Healing more than once per turn regardless. To heal multiple subjects at once, apply the Area modifier."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Affects Objects",
					"entries": ["Your Healing can also “heal” damage to non-living subjects. You make a Healing check against the subject’s worst damage condition, as normal. "],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Area",
					"entries": ["Healing with this extra grants the same benefit to all subjects in the affected area. Area Empathic Healing (see this power’s Flaws) is an unwise combination, as the healer takes on all of the damage conditions of the affected subjects at once!"],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Energizing",
					"entries": ["You can heal the fatigued and exhausted conditions as well as damage conditions: DC 10, one degree of success for fatigued, two degrees of success for exhausted. However, you take on the removed conditions and cannot use Healing to eliminate your own fatigue (although you can still use victory points to recover from them). If the Healing check fails, you must wait the normal recovery time or use extra effort to try again."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Perception",
					"entries": ["Applied to Ranged Healing (following), perception Ranged Healing does not require an attack check to “touch” the subject."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Persistent",
					"entries": ["Your Healing can remove even Incurable effects (see the Incurable modifier)."],
					"cost": {
						"value": 1, "type": "flat"
					}
				},
				{
					"name": "Ranged",
					"entries": ["Ranged Healing requires an attack check to “touch” the subject with the Healing effect. The GM may waive the check for a willing subject holding completely still, but the subject is defenseless that round, making it an unwise decision in the midst of combat."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Restorative",
					"entries": ["Your Healing effect can restore character points removed by Weaken effects with the appropriate descriptors, such as injury, disease, or poison. You restore points equal to your rank to the affected trait(s)."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Resurrection",
					"entries": ["You can restore life to the dead! If the subject has been dead for fewer minutes than your Healing rank, makes a DC 20 Healing check. If successful, the patient’s condition becomes incapacitated, as if just stabilized. If the check fails, you can only try again using extra effort."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Selective",
					"entries": ["Area Healing may have this extra, allowing you to choose who in the area does and does not gain the benefits."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Stabilize",
					"entries": ["You don’t need to make a Healing check to stabilize a dying character, your Healing effect does so automatically, although it still requires the normal standard action."],
					"cost": {
						"value": 1, "type": "flat"
					}
				}
			],
			"flaws": [
				{
					"name": "Empathic",
					"entries": ["When you successfully cure someone else of a condition, you acquire the condition yourself and must recover from it normally. You can use Healing and Regeneration to cure your own conditions. You can have the Resurrection modifier for Healing, but if you successfully use it, you die! This may not be as bad as it seems if you have Immortality, allowing you to return to life (see the Immortality effect for details)."],
					"cost": {
						"value": -1, "type": "per"
					}
				},
				{
					"name": "Limited",
					"entries": ["Examples of ways in which Healing may be Limited include: One Type of Damage (such as energy or bludgeoning damage), Objects (in conjunction with Affects Objects), Others (you can’t use Healing on yourself), or Self (you can only use Healing on yourself)."],
					"cost": {
						"value": -1, "type": "per"
					}
				},
				{
					"name": "Temporary",
					"entries": ["The benefits of your Healing are temporary, lasting for one hour. The subject then regains any damage conditions you healed. These conditions stack with others the subject acquired since the initial healing, which may result in more severe damage or even death."],
					"cost": {
						"value": -1, "type": "per"
					}
				}
			]
		},
	]
};
}