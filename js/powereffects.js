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
			"name": "Insubstantial",
			"type": "G",
			"action": "F",
			"range": "personal",
			"duration": "sustained",
			"cost": {
				"value": 5,
				"type": "per"
			},
			"entries": [
				"You can assume a less solid form, with each Insubstantial rank becoming progressively less solid. You do not gain the ability to assume lower-ranked Insubstantial forms at higher ranks, but you can acquire a lower-ranked form as an Alternate Effect of a higher-ranked one. You can switch between normal and Insubstantial form at will as a free action once per round. The default is that substantial is your “normal” form, but the GM may permit you to make Insubstantial your “normal” form, in which case remaining solid is a sustained duration for you!",
				"Insubstantial offers four ranks of effect:",
				{
					"type": "entries",
					"name": "Rank 1 – Fluid",
					"entries": [
						"You become a fluid mass. You can flow through any sort of opening, under (or around) doors, through keyholes and pipes, and so forth. You cannot pass through watertight seals. You can automatically flow out of any restraint—such as a snare or grab—that is not watertight. So you cannot flow out of a bubble completely enclosing you, for example, but anything less cannot hold you. You can exert your normal Strength and can still push or carry objects, although your manual dexterity may be limited (at the GM’s discretion).",
						"A fluid character may attempt to catch a falling person or object, cushioning the fall with the character’s flexible form. This requires a move action, and reduces the falling damage by the cushioning character’s Toughness bonus (representing flexibility in this case). Both characters must make resistance checks against the remaining damage. Higher rank insubstantial forms—lacking physical Strength—cannot attempt this."
					]
				},
				{
					"type": "entries",
					"name": "Rank 2 – Gaseous",
					"entries": [
						"You become a cloud of gas or fine particles. You have no effective Strength in gaseous form, but have Immunity to Physical Damage. Energy and area attacks still affect you normally. You can flow through any opening that is not airtight. You can use your various other effects normally."
					]
				},
				{
					"type": "entries",
					"name": "Rank 3 – Energy",
					"entries": [
						"You become coherent energy. You have no effective Strength, but have Immunity to Physical Damage. Energy attacks (other than the energy making up your form, to which you have Immunity) damage you normally. You can pass through solid objects permeable to your type of energy, but energy resistant barriers, like heavy shielding or force fields, block your movement."
					]
				},
				{
					"type": "entries",
					"name": "Rank 4 – Incorporeal",
					"entries": [
						"You become an incorporeal phantom. You can pass through solid matter at your normal speed and you have Immunity to Physical and Energy Damage. Sensory effects (other than tactile) and those targeting Will still work on you, as do effects with the Affects Insubstantial modifier. Choose one other reasonably common effect or descriptor that works on you while you are incorporeal. You have no effective Strength and cannot affect the physical world, except with effects with the Affects Corporeal modifier. Your sensory effects work normally.",
						"Unless you have Immunity to Suffocation, you must hold your breath while passing through a solid object, and you can suffocate. If you revert to solid form while inside a solid object for any reason, you suffer damage equal to the object’s Toughness, resisted by your Fortitude. If not incapacitated by the damage, you’re immediately ejected from the object into the nearest open space. If you are incapacitated, you’re trapped inside the object and your condition worsens to dying on the following round (making it very difficult for aid to reach you)."
					]
				},
				{
					"type": "entries",
					"name": "Insubstantial Descriptors",
					"entries": [
						"Note that the fluid, gaseous, etc., rank names are themselves essentially descriptors for the different Insubstantial effects. A character with Insubstantial 1 might instead be a stretchable, rubbery form rather than a liquid, for example, while one with Insubstantial 2 could transform into a swarm of insects rather than a gas."
					]
				}
			],
			"extras": [
				{
					"name": "Affects Corporeal",
					"entries": ["This extra is required for any effect that works on corporeal targets while you are incorporeal. See the description of this extra for details and cost."],
				},
				{
					"name": "Affects Others",
					"entries": ["This modifier allows you to extend your Insubstantial effect to another character by touch, taking them Insubstantial with you. If you ever withdraw the effect while someone is inside a solid object, see the effect’s description for the unpleasant results."],
					"cost": {
						"value": {"min":0, "max":1}, "type": "per"
					}
				},
				{
					"name": "Attack",
					"entries": ["Applied to Insubstantial, this extra makes it into a close range effect able to turn targets Insubstantial. You must be able to physically touch the target to make an Insubstantial Attack, meaning it must have the Affects Corporeal modifier to use it while you are incorporeal. This modifier is most effective for ranks 2 through 4, since the victim loses some or all ability to interact with the physical world. The default resistance for an Insubstantial Attack is Dodge, although it can be Fortitude or Will, as best suits the effect’s descriptors. You need to grab a target in order to drag them inside a solid object unless the target is already defenseless. You and the target are not insubstantial to each other. The cost is +0 per rank if it is an Insubstantial Attack only, +1 cost per rank if you can both be Insubstantial and make an attack to make others Insubstantial."],
					"cost": {
						"value": {"min":0, "max":1}, "type": "per"
					}
				},
				{
					"name": "Continuous",
					"entries": ["Extending the effect’s duration to continuous allows you to remain Insubstantial until you choose to return to your corporeal form."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Innate",
					"entries": ["Use this modifier if your character’s form is naturally or innately Insubstantial, particularly if the effect is permanent in duration."],
					"cost": {
						"value": 1, "type": "flat"
					}
				},
				{
					"name": "Precise",
					"entries": ["This modifier allows you to selectively make some portions of your body insubstantial while keeping others substantial (or vice versa). This allows you to do things like reach through a wall, solidify your hand to pick up an object or tap someone on the shoulder (or punch them in the face), and become incorporeal again to withdraw it on the following round."],
					"cost": {
						"value": 1, "type": "flat"
					}
				},
				{
					"name": "Progressive",
					"entries": ["You can assume lower ranked forms of Insubstantial, but you must progress through them in order to reach the higher-ranked ones. For example if you have Progressive Insubstantial 3, you can assume fluid, gaseous, or energy forms, but to assume energy form, you must first progress through fluid and gaseous, becoming less and less substantial. Since you can only activate the effect once per turn, it takes you three turns to get there."],
					"cost": {
						"value": 0, "type": "per"
					}
				},
				{
					"name": "Reaction",
					"entries": ["Becoming Insubstantial is normally a free action, meaning you can’t switch to an Insubstantial form when surprised or otherwise unable to take action. At the GM’s option, applying the Action extra to use Insubstantial as a reaction allows you to switch forms “reflexively” in response to such hazards, even if it is not your turn."],
					"cost": {
						"value": 1, "type": "per"
					}
				},
				{
					"name": "Subtle",
					"entries": ["This extra makes your Insubstantial nature less noticeable to observers. Rank 1 requires a Perception check (DC 20) to detect that you are Insubstantial, while 2 ranks mean you look entirely normal in Insubstantial form (which may cause opponents to waste effort on you, not knowing you are immune to their attacks, for example)."],
					"cost": {
						"value": {"min":1, "max":2}, "type": "flat"
					}
				}
			],
			"flaws": [
				{
					"name": "Absent Strength",
					"entries": ["This flaw applies only to rank 1 Insubstantial and removes your effective Strength while in that form, leaving you with limited ability to affect the physical world like the higher ranks of the effect."],
					"cost": {
						"value": -1, "type": "flat"
					}
				},
				{
					"name": "Permanent",
					"entries": ["You are always Insubstantial; you cannot assume solid form, although your Insubstantial effect can still be Nullified unless it is also Innate."],
					"cost": {
						"value": 0, "type": "per"
					}
				}
			]
		},
	]
};
}