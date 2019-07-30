"use strict";

class LanguageParser {
	constructor () {
		this.currentLang = LanguageParser.LANG_TW;
		this.loadStyleFromCookie();
		this.lang = {};
		this.loadLanguageJSON();
	}

	const LP = this;

	FMT = function(key){
		var lang = this.currentLang;
		if(!this.lang[lang]) return key;
		if(!this.lang[lang][key.toLowerCase()]) return key;
		return this.lang[lang][key.toLowerCase()];
	}
	loadLanguageJSON = function(){
		var JSON_URL = "lang/lang_"+this.currentLang+".json";
		DataUtil.loadJSON(JSON_URL).then(this.onJsonLoad.bind(this));
	}

	onJsonLoad = function(data){
		this.lang[this.currentLang] = data;
		console.log(data);
		console.log(this.lang[this.currentLang]);
	}


	// Set Language
	setActiveLanguage (lang) {
		this.currentLang = lang;
		LanguageParser.createCookie(this.currentLang);
	}
	getActiveLanguage () {
		return this.currentLang;
	}

	loadStyleFromCookie () {
		this.cookie = LanguageParser.readCookie();
		this.cookie = this.cookie ? this.cookie : LanguageParser.LANG_TW;
		this.setActiveLanguage(this.cookie);
	}
	static createCookie (value) {
		LanguageParser.storage.setItem(LanguageParser.LANG_STORAGE, value);
	}
	static readCookie () {
		return LanguageParser.storage.getItem(LanguageParser.LANG_STORAGE);
	}
}

LanguageParser.LANG_STORAGE = "LanguageParser_lang";
LanguageParser.LANG_TW = "tw";
LanguageParser.LANG_EN = "en";

try {
	LanguageParser.storage = window.localStorage;
} catch (e) { // cookies are disabled
	LanguageParser.storage = {
		getItem () {
			return LanguageParser.LANG_TW;
		},

		setItem (k, v) {}
	}
}
const languageParser = new LanguageParser();
window.addEventListener("unload", function () {
	const title = languageParser.getActiveLanguage();
	LanguageParser.createCookie(title);
});