/**
* @Author: Gnanasuriyan
* The progressbar model - will take are of loading data from server. 
* The corresponding model is set via controller.
*/

(function(app){
	
	var apiUrl = 'http://pb-api.herokuapp.com/bars';

	//Just keep as simple as possible for now..
	//make it as private function..
	var ajax = function(url, method, isAsync) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					resolve(this.responseText);
				}
			};

			xhr.open(method.toUpperCase(), url, isAsync);
			xhr.send();
		});
	};

	var ProgressBarModel = function() {
		this.data = null;
		this.registers = {};
	};

	ProgressBarModel.prototype.load = function() {
		//ajax('mock/data.json', 'GET', true).then(function(resp) {
		ajax(apiUrl, 'GET', true).then(function(resp) {
			this.data = JSON.parse(resp);
			this.fireEvent('loaded');
		}.bind(this));
	};

	ProgressBarModel.prototype.on = function(event, cb, scope) {
		if(arguments.length < 2) {
			throw new Error('Minimum two arguments required');
		}
		if(!this.registers.hasOwnProperty(event)) {
			this.registers[event] = [];
		}
		if(toString.call(cb) === '[object Function]') {
			this.registers[event].push({
				method: cb,
				scope: scope
			});	
		} else {
			throw new Error('The callback should be a function');
		}
		
	};

	ProgressBarModel.prototype.fireEvent = function(event) {
		if(this.registers.hasOwnProperty(event)) {
			var registeredGuys =  this.registers[event];

			for(var index in registeredGuys) {
				var meta = registeredGuys[index];
				if(meta.scope) {
					meta.method.call(meta.scope, this.data);
				} else {
					meta.method(this.data);
				}
			}
		}
	};

	ProgressBarModel.prototype.setApiUrl = function(url) {
		apiUrl = url;
	};

	ProgressBarModel.prototype.getData = function() {
		return this.data;
	};

	app.ProgressBarModel = ProgressBarModel;

})(window.app);