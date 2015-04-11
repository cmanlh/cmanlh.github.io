function parseData(data) {
	var splittedData = data.split("-");
	return {
		time : splittedData[0],
		title : splittedData[1]
	};
}

var db;
$(function() {
	new Database({
		name : "post",
		version : 1,
		callback : function(param) {
			if (param.isConnected == 1) {
				db = param.db;
				db.createObjectStore("list", {
					keyPath : "time"
				});
			} else if (param.isConnected == 2) {
				db = param.db;
				if (db.objectStoreNames.length == 0) {
					db.createObjectStore("list", {
						keyPath : "time"
					});
				}
				var transaction = db.transaction('list', "readwrite");
				transaction.oncomplete = function(e) {

				}
				var _objectStore = transaction.objectStore("list");
				var countReq = _objectStore.count();
				countReq.onsuccess = function() {
					if (countReq.result > 0) {
						var transaction2 = db.transaction('list', "readonly");
						var _objectStore2 = transaction2.objectStore("list");
						
						var request = _objectStore2.openCursor();
						request.onsuccess = function(event) {
						  var cursor = event.target.result;
						  if(cursor) {
								var data = cursor.value;
								$(".list").append(
										"<blockquote><h4 link='" + data.time + "'><a>" + data.title
												+ "</a></h4><small class='pull-right'>"
												+ new Date(parseInt(data.time, 10)).toLocaleString()
												+ "</small></blockquote>");
						    cursor.continue();
						  } else {
						    // no more results
						  }
						};
					} else {
						$.ajax({
							url : "https://api.github.com/repos/cmanlh/cmanlh.github.io/contents/post/html",
							success : function(data) {
								var transaction2 = db.transaction('list', "readwrite");
								var _objectStore2 = transaction2.objectStore("list");
								var cnt = data.length;
								for (var i = cnt - 1; i >= 0; i--) {
									var realData = parseData(data[i].name);
									$(".list").append(
											"<blockquote><h4 link='" + realData.time + "'><a>" + realData.title
													+ "</a></h4><small class='pull-right'>"
													+ new Date(parseInt(realData.time, 10)).toLocaleString()
													+ "</small></blockquote>");
									_objectStore2.add({
										time : realData.time,
										html : data[i].path,
										title : realData.title
									});
								}
							}
						});
					}
				}
			} else {
				console.log("open database failed!");
			}
		}
	});

	$(".closeBtn").on("click", function(e) {
		$(".list").toggleClass("show hidden");
		$(".article").toggleClass("show hidden");
	});

	$(".list").on("click", function(e) {
		var target;
		switch (e.target.tagName) {
		case "H4":
			target = e.target;
			break;
		case "SMALL":
			target = e.target.previousSibling;
			break;
		case "BLOCKQUOTE":
			target = e.target.firstChild;
			break;
		case "A":
			target = e.target.parentElement;
			break;
		default:
			target = null;
		}

		if (target) {
			var transaction = db.transaction('list', "readonly");
			var _objectStore = transaction.objectStore("list");
			var req = _objectStore.get($(target).attr("link"));
			req.onsuccess = function() {
				var data = req.result;
				$.ajax({
					url : "http://cmanlh.github.io/" + data.html,
					success : function(data) {
						$(".article h3").html(target.firstChild.innerHTML);
						$(".article small").html(target.nextSibling.innerHTML);
						$(".article .content").empty();
						$(".article .content").append(data);
						$(".list").toggleClass("show hidden");
						$(".article").toggleClass("show hidden");
					}
				});
			};
		}
	});
});