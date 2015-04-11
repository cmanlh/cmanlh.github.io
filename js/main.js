function parseData(data) {
	var splittedData = data.split("-");
	return {
		time : splittedData[0],
		title : splittedData[1]
	};
}

$(function() {
	var db;

	new Database({
		name : "post",
		callback : function(_db, isConnected) {
			if (isConnected) {
				db = _db;
				console.log(db);
				var objectStore = db.createObjectStore("list", {
					keyPath : "postTime"
				});
				console.log(objectStore);
				objectStore.count(function(cnt) {
					console.log("pass count");
					console.log(cnt);
				});
			} else {

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
			db.list.get($(target).attr("link"), function(data) {
				$.ajax({
					url : "http://cmanlh.github.io/" + data,
					success : function(data) {
						$(".article h3").html(target.firstChild.innerHTML);
						$(".article small").html(target.nextSibling.innerHTML);
						$(".article .content").empty();
						$(".article .content").append(data);
						$(".list").toggleClass("show hidden");
						$(".article").toggleClass("show hidden");
					}
				});
			});

		}
	});
});