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
			"name": "Affliction",
			"type": "ATK",
			"action": "S",
			"range": "close",
			"duration": "instant",
			"cost": {
				"cost_value": 1,
				"cost_type": "per"
			},
			"entries": [
				"You can impose some debilitating condition or conditions on a target by making a close attack. You set the conditions your Affliction causes at each degree when you acquire it and they may not be changed. Higher degree conditions replace lower degree conditions and do not stack with them. See the possible conditions for each degree under the Affliction Resistance Check table. The target resists with Fortitude or Will defense (chosen when you take the effect):",
				{
					"type": "entries",
					"name": "Affliction Resistance Check",
					"entries": [
						"",
						"Fortitude or Will vs. DC [Affliction rank + 10]",
						{
							"type": "list",
							"items": [
								"{@b Success}: No effect.",
								"{@b Failure (one degree)}: The target is dazed, entranced, fatigued, hindered, impaired, or vulnerable (choose one). Potential descriptors include coughing or sneezing, creeping mental influence, drowsiness, euphoria, fear, itchiness, lethargy, nausea, pain, or tipsiness.",
								"{@b Failure (two degrees)}: The target is compelled, defenseless, disabled, exhausted, immobile, prone, or stunned (choose one). Potential descriptors include agonizing pain, confusion, ecstasy, momentary emotional or mental influence, paralysis, seizure, terror, or vomiting.",
								"{@b Failure (three degrees)}: The target is asleep, controlled, incapacitated, paralyzed, transformed or unaware (choose one)."
							]
						},
						
						"The target of an Affliction makes a resistance check at the end of each of his turns to remove first and second degree conditions. Third degree conditions require a minute of recovery time or outside aid, such as the Treatment skill or Healing effect (DC 10 + rank).",
						"The exact nature and descriptors of the Affliction are up to you, chosen when you acquire the effect, with the GM’s approval; some examples are provided, but feel free to make up your own."
					]
				}
			],
			"extras": [
				{
					"name": "Alternate Resistance",
					"entries": ["Some Afflictions may be initially resisted by Dodge, representing the need for quick reaction time or reflexes to avoid the effect. In this case, the later resistance checks to remove the Affliction’s conditions are typically still based on Fortitude or Will. For example, a target might make a Dodge check to avoid a blinding light or spray of liquid, but a Fortitude check to eliminate the effect if the initial Dodge fails. +0 cost per rank."]
				},
				{
					"name": "Concentration",
					"entries": ["Once you have hit with a Concentration Affliction, so long as you continue to take a standard action each turn to maintain the effect, the target must make a new resistance check against it, with no attack check required. +1 cost per rank."]
				},
				{
					"name": "Cumulative",
					"entries": ["Normally, an Affliction does not have a cumulative effect on the same target, so getting two results of one degree, one after the other, has no more or less effect than a single one degree result; you have to get a higher degree with a later attack, which replaces the initial result. A Cumulative Affliction adds any further degrees to the existing degrees on the target. For example, if you hit a target and impose a vulnerable condition (one degree), then attack again and get one degree on the effect, you impose the Affliction’s second degree condition. +1 cost per rank."]
				},
				{
					"name": "Extra Condition",
					"entries": ["Your Affliction imposes an additional condition per degree of success. So with one application of this extra, your Affliction imposes two conditions—such as dazed and hindered, or impaired and vulnerable—rather than just one. With two applications, it imposes three conditions, and so forth. Since mutually incompatible conditions are largely wasted, Afflictions with this extra often have the Limited Degree flaw as well. +1 cost per rank."]
				},
				{
					"name": "Progressive",
					"entries": ["This modifier causes an Affliction to increase incrementally without any effort from you. If the target fails a resistance check to end the Affliction, it not only persists, but increases in effect by one degree! So a target affected by the first degree of a Progressive Affliction who fails to resist progresses to the second degree of the effect at the start of his next round. A successful resistance check still ends the Affliction, as usual. +2 cost per rank."]
				}
			],
			"flaws": [
				{
					"name": "Instant Recovery",
					"entries": ["Similar to the Reversible extra, the target of an Affliction effect with this modifier recovers automatically, no check required, at the end of the round in which the duration ends. So, for example, an instant duration Affliction only lasts one round, while a sustained duration Affliction lasts until no longer sustained. –1 cost per rank."]
				},
				{
					"name": "Limited Degree",
					"entries": ["Your Affliction is limited to no more than two degrees of effect. With two applications of this modifier, it is limited to no more than one degree of effect. –1 cost per rank."]
				}
			],
		}
	]
};
}