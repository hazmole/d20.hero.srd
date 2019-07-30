const path = require('path');
const fs = require('fs');

var language_arr = ["tw","en"];
var language_json = {};
for(var idx in language_arr){
	var lang_token = language_arr[idx];
	try{
		language_json[lang_token] = require("../lang/lang_"+lang_token+".json");
	}catch(e){
	}
}

var js_file = "const LANG="+JSON.stringify(language_json)+";";
const my_path = path.join("../lang/", "lang.bundle.js");
fs.writeFileSync(my_path, js_file, "utf8");

console.log("Bundle Lang.js");