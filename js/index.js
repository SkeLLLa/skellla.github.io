/**
 * Created by m03geek on 11/10/15.
 */
(function (w) {
	var config = {
		templates: {
			urlPrefix: 'templates/'
		}
	};

	w.utils = {
		loadTemplate: function (name, callback) {
			$.get(config.templates.urlPrefix + name, function (data) {
				callback(null, data)
			}).fail(function () {
				callback('Error');
			});
		},
		getParameterByName: function (name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	};

	w.handlers = {
		alert: function () {
			var a = new RegExp("github");
			alert(a.test(w.location.href));
		}
	};
})(window);
