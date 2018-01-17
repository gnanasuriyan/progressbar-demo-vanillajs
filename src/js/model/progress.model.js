/**
* @Author: Gnanasuriyan
* The progressbar model - will take are of loading data from server. 
* The corresponding model is set via controller.
*/

(function(app){
	

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
		this.data = {};
		this.registers = {};
	};

	ProgressBarModel.prototype.load = function() {
		//some problem with http://pb-api.herokuapp.com/bars - may CORS issue - needs to look
		ajax('mock/data.json', 'GET', true).then(function(resp) {
			this.data = JSON.parse(resp);
			this.fireEvent('loaded');
		}.bind(this));
	};

	ProgressBarModel.prototype.on = function(event, cb, scope) {
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

	app.ProgressBarModel = ProgressBarModel;

})(window.app);