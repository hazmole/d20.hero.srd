

// JSON LOADING ========================================================================================================
DataUtil = {
	_loaded: {},

	async loadJSON (url, ...otherData) { // FIXME otherData doesn't get returned, as resolve() can only return a single value
		//const procUrl = UrlUtil.link(url);

		if (DataUtil._loaded[url]) {
			return DataUtil._loaded[url] // , otherData
		}

		const data = await new Promise((resolve, reject) => {
			function getRequest (toUrl) {
				const request = new XMLHttpRequest();
				request.open("GET", toUrl, true);
				request.overrideMimeType("application/json");
				request.onload = function () {
					try {
						const data = JSON.parse(this.response);
						DataUtil._loaded[toUrl] = data;
						resolve(data, otherData);
					} catch (e) {
						reject(new Error(`Could not parse JSON from ${toUrl}: ${e.message}`));
					}
				};
				request.onerror = (e) => reject(new Error(`Error during JSON request: ${e.target.status}`));
				return request;
			}

			const request = getRequest(url);
			/*
			if (procUrl !== url) {
				request.onerror = function () {
					const fallbackRequest = getRequest(url);
					fallbackRequest.send();
				};
			}*/
			try{
				request.send();
			} catch(e){
				console.log(e);
			}
		});

		await DataUtil.pDoMetaMerge(data);

		return data;
	},

	async multiLoadJSON (toLoads, onEachLoadFunction, onFinalLoadFunction) {
		if (!toLoads.length) onFinalLoadFunction([]);

		const datas = await Promise.all(toLoads.map(tl => DataUtil.loadJSON(tl.url)));
		if (onEachLoadFunction) {
			datas.forEach((data, i) => onEachLoadFunction(toLoads[i], data));
		}
		return onFinalLoadFunction(datas);
	},

	userDownload: function (filename, data) {
		if (typeof data !== "string") data = JSON.stringify(data, null, "\t");
		const $a = $(`<a href="data:text/json;charset=utf-8,${encodeURIComponent(data)}" download="${filename}.json" style="display: none;">DL</a>`);
		$(`body`).append($a);
		$a[0].click();
		$a.remove();
	},

	getCleanFilename (filename) {
		return filename.replace(/[^-_a-zA-Z0-9]/g, "_");
	},

	getCsv (headers, rows) {
		function escapeCsv (str) {
			return `"${str.replace(/"/g, `""`).replace(/ +/g, " ").replace(/\n\n+/gi, "\n\n")}"`;
		}

		function toCsv (row) {
			return row.map(str => escapeCsv(str)).join(",");
		}

		return `${toCsv(headers)}\n${rows.map(r => toCsv(r)).join("\n")}`;
	},

	userDownloadText (filename, string) {
		const $a = $(`<a href="data:text/plain;charset=utf-8,${encodeURIComponent(string)}" download="${filename}" style="display: none;">DL</a>`);
		$(`body`).append($a);
		$a[0].click();
		$a.remove();
	},

	pUserUpload () {
		return new Promise(resolve => {
			const $iptAdd = $(`<input type="file" accept=".json" style="position: fixed; top: -100px; left: -100px; display: none;">`).on("change", (evt) => {
				const input = evt.target;

				const reader = new FileReader();
				reader.onload = () => {
					const text = reader.result;
					const json = JSON.parse(text);
					resolve(json);
				};

				reader.readAsText(input.files[0]);
			}).appendTo($(`body`));
			$iptAdd.click();
		});
	},

	cleanJson (cpy) {
		cpy.name = cpy._displayName || cpy.name;
		DataUtil.__cleanJsonObject(cpy);
		return cpy;
	},

	__cleanJsonObject (obj) {
		if (typeof obj === "object") {
			if (obj instanceof Array) {
				obj.forEach(it => DataUtil.__cleanJsonObject(it));
			} else {
				Object.entries(obj).forEach(([k, v]) => {
					if (k.startsWith("_") || k === "uniqueId") delete obj[k];
					else DataUtil.__cleanJsonObject(v);
				});
			}
		}
	},

};