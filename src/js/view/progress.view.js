/**
* @Author: Gnanasuriyan
* The progressbar view - will be gets updated once mode is getting changed. 
* The corresponding model is set via controller.
*/

(function(app){
	var _data = null;

	var render = function(parentEl) {
		parentEl.innerHTML = '<h3>Rendered from view</h3>';
	};


	var ProgressBarView = function(parentEl) {
		this.parentEl = parentEl;
	};

	ProgressBarView.prototype.render = function(data) {
		_data = data;
		render();	
	};

	app.ProgressBarView = ProgressBarView;
	
})(window.app);