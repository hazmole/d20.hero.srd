"use strict";

const JSON_URL = "archetypes.json";
const CUSTOM_RENDERER = Renderer.archetype;
const CUSTOM_TOKEN = "archetype";
const DATA_LIST_ITEM_ARR = ['name'];
const DEFAULT_SORT = "name";
IS_LOCAL_TEST = !false;

// List item
function getGeneralListItem (entry) {
	var name = entry.translate_name? entry.translate_name: entry.name;
	return `
			<span class="name col-12">${name}</span>
		`;
}
function getFakeData(){
	return {
	"archetype": [
		{
			"name": "Battlesuit",
			"attribute": {
				"str": 12,
				"sta": 1,
				"agl": 1,
				"dex": 2,
				"ftg": 8,
				"int": 5,
				"awe": 2,
				"pre": 0
			},
			"defense": {
				"dodge": 8,
				"fortitude": 6,
				"parry": 8,
				"toughness": 12,
				"will": 8
			},
			"init": 1,
			"skill": [
				{
					"name": "Expertise",
					"suboption": "(Choose one of Business, Engineering, or Science)",
					"rank": 5
				},
				{
					"name": "Insight",
					"rank": 4
				},
				{
					"name": "Perception",
					"rank": 5
				},
				{
					"name": "Persuasion",
					"rank": 4
				},
				{
					"name": "Technology",
					"rank": 8
				}
			],
			"advantages": [
				{
					"name": "Accurate Attack"
				},
				{
					"name": "Improvised Tools"
				},
				{
					"name": "Inventor"
				},
				{
					"name": "Ranged Attack",
					"rank": 4
				},
				{
					"name": "Second Chance",
					"suboption": "Technology checks"
				}
			],
			"powers": [
				{
					"name": "Battlesuit",
					"content": [
						{
							"type": "modifier",
							"name": "Removable",
							"rank": 21,
							"cost": -21
						},
						{
							"type": "power",
							"name": "Armor",
							"cost": 22,
							"content": [
								{
									"type": "effect",
									"name": "Protection",
									"rank": 11,
									"content": [
										{
											"type": "modifier",
											"name": "Impervious"
										}
									]
								}
							]
						},
						{
							"type": "power",
							"name": "Boot Jets",
							"cost": 16,
							"content": [
								{
									"type": "effect",
									"name": "Flight",
									"rank": 8,
									"note": "500 MPH"
								}
							]
						},
						{
							"type": "power",
							"name": "Comm System",
							"cost": 8,
							"content": [
								{
									"type": "effect",
									"name": "Radio Communication",
									"ref_name": "Communication",
									"rank": 2
								}
							]
						},
						{
							"type": "power",
							"name": "Life Support System",
							"cost": 10,
							"content": [
								{
									"type": "effect",
									"name": "Immunity",
									"rank": 10
								}
							]
						},
						{
							"type": "power",
							"name": "Sensors",
							"cost": 12,
							"content": [
								{
									"type": "effect",
									"name": "Sensors",
									"suboption": "Accurate Radio Extended 3 [radar], Darkvision, Direction Sense, Distance Sense, Infravision, Time Sense, Ultra-Hearing",
									"rank": 12
								}
							]
						},
						{
							"type": "array",
							"content": [
								{
									"type": "power",
									"name": "Servo Motors",
									"cost": 24,
									"content": [
										{
											"type": "effect",
											"name": "Enhanced Strength",
											"ref_name": "Enhanced Trait",
											"rank": 12
										}
									]
								},
								{
									"type": "modifier",
									"name": "Alternate Effect",
									"rank": 1
								},
								{
									"type": "power",
									"name": "Force Beams",
									"cost": 1,
									"content": [
										{
											"type": "effect",
											"name": "Damage",
											"rank": 12,
											"content": [
												{
													"type": "modifier",
													"name": "Ranged",
													"ref_name": "Increased Range",
													"rank": 1
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "power",
							"name": "Tactical Computer",
							"cost": 12,
							"content": [
								{
									"type": "effect",
									"name": "Enhanced Dodge",
									"ref_name": "Enhanced Trait",
									"rank": 2
								},
								{
									"type": "effect",
									"name": "Enhanced Fighting",
									"ref_name": "Enhanced Trait",
									"rank": 4
								},
								{
									"type": "effect",
									"name": "Enhanced Ranged Attack",
									"ref_name": "Enhanced Trait",
									"rank": 2
								}
							]
						}
					]
				}
			],
			"offense": [
				{
					"name": "Force Beam",
					"bonus": 8,
					"range": "Ranged",
					"effect": "Damage 12"
				},
				{
					"name": "Unarmed",
					"bonus": 8,
					"range": "Close",
					"effect": "Damage 12"
				}
			]
		}
	]
};
}
