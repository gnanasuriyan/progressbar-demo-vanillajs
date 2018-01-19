/**
* @Author: Gnanasuriyan
* The progress bar controller will takes care communication between view and model.
*/


var app = window.app || {};

app.ProgressBarController = (function () {

	function ProgressBarController (progressBarView, progressBarModel) {
		if (arguments.length < 2) { 
			throw new Error('Minimum two arguments required');
		}
		this.progressBarView = progressBarView;
		this.progressBarModel = progressBarModel;
 	}
 	
	//Initialize controller
	ProgressBarController.prototype.init = function () {
		this.progressBarModel.on('loaded', this.updateView.bind(this));
		this.progressBarModel.load();
 	};

	ProgressBarController.prototype.updateView = function (data) {
		this.progressBarView.render(data);
 	};

	return ProgressBarController;

}());

