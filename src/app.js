/**
* @Author: Gnanasuriyan
* Main entry of application
*/

(function() {
	
	var app = window.app = {};

	//Simplified version of $.ready in jQuery
	var domReady = function(cb) {
		if(document.readyState !== 'loading') {
			cb(); //the dom is alreay loaded...
		} else if(document.addEventListener) {
			document.addEventListener('DOMContentLoaded', cb);
		} else  {
			//for supporting IE <= 8
			document.attachEvent('onreadystatechange', function(){
				if (document.readyState === 'complete') cb();
			});
		}
	};

	domReady(function() {
		var el = document.getElementById('container');
		var controller = new app.ProgressBarController(new app.ProgressBarView(el), new app.ProgressBarModel());
		controller.init();
	});
})();