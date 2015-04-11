function Database(config) {
	var _indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	this.tx = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	this.keyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

	var request = _indexedDB.open(config.name, config.version);
	request.onupgradeneeded = function(e) {
		config.callback.call(this, {
			db : e.target.result,
			isConnected : 1
		});
	}

	request.onsuccess = function(e) {
		config.callback.call(this, {
			db : e.target.result,
			isConnected : 2
		});
	}

	request.onerror = function(e) {
		config.callback.call(this, {
			isConnected : 3
		});
	}
}
