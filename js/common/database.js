function Database(config) {
	var _indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	this.tx = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	this.keyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

	var request = _indexedDB.open(config.name);
	request.onupgradeneeded = function(e) {
		console.log("request.onupgradeneeded");
	}

	request.onsuccess = function(e) {
		config.callback.apply(request, {
			db : e.target.result,
			isConnected : true
		});
	}

	request.onerror = function(e) {
		config.callback.apply(request, {
			isConnected : false
		});
	}
}
