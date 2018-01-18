/**
* @Author: Gnanasuriyan
* The progress bar controller will takes care communication between view and model.
*/

(function(app){

	var ProgressBarController = function(progressBarView, progressBarModel) {
		if(arguments.length < 2) {
			throw new Error('Minimum two arguments required');
		}
		this.progressBarView = progressBarView;
		this.progressBarModel = progressBarModel;
	};

	//Initialize controller
	ProgressBarController.prototype.init = function() {
		//just make our controller to listen for model change events
		this.progressBarModel.on('loaded', this.updateView.bind(this));
		this.progressBarModel.load();
	};

	ProgressBarController.prototype.updateView = function(data) {
		this.progressBarView.render(data);
	};

	app.ProgressBarController = ProgressBarController;

})(window.app);
