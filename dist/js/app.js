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


/**
* @Author: Gnanasuriyan
* The progressbar model - will take are of loading data from server. 
* The corresponding model is set via controller.
*/

var app = window.app || {};

app.ProgressBarModel = (function(){
	
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
		// ajax('mock/data.json', 'GET', true).then(function(resp) {
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

	return ProgressBarModel;

}())
/**
* @Author: Gnanasuriyan
* The progressbar view - will be gets updated once mode is getting changed. 
* The corresponding model is set via controller.
*/

var app = window.app || {};

app.ProgressBarView = (function(){
	var _data = null;

	//lets cache frequently manipulated DOM
	var cache = {

	};

	var render = function(parentEl) {
		// var domParser = new DOMParser();
		// var doc = domParser.parseFromString(buildBarHtml(), 'text/html');
		parentEl.innerHTML = buildBarHtml();
		attachEvents(parentEl);
	};

	var getBarStyle = function(width) {
		if(width === 100) {
			return 'width:100%;background-color:#ff0000;';
		} else {
			return 'width:' + width + '%;background-color:#007bff;';
		}
	}
	//we can use template engine.. but lets do it in our own way...
	var buildBarHtml = function() {
		var bars = _data.bars;
		var html = '';
		var selectHtml = '<select id="selected-bar">';
		for(var i=0, length=bars.length; i<length; i++) {
			var width = Math.ceil((bars[i]/_data.limit) * 100);
			if(width <0) {
				width = 0;
			}
			html +='<div class="progress mar-top-10">' +
					'<div class="progress-bar" style="' + getBarStyle(width) + '">' + width + '%</div>' + 
				'</div>';

			selectHtml += '<option value="' + i + '">#progress ' + (i + 1) + '</option>';
		}
		selectHtml += '</select>';

		var buttonHtml = buildButtons();

		var finalHtml = html + '<div class="mar-top-10 ">' + selectHtml + buttonHtml + '</div>';
		return finalHtml;
	};

	var buildButtons = function() {
		var buttons = _data.buttons;
		var html = '';
		for(var index in buttons) {
			html += '<button class="btn btn-primary bar-button" data-index=' + index + '>' + buttons[index] + '</button>';
		}
		html += '<h5>Limit: ' + _data.limit + '</h5>';
		return html;
	};

	var updateProgressBar = function(buttonEl, parentEl) {
		var index = parseInt(buttonEl.getAttribute('data-index'));
		if(!cache.selectedBar) {
			//cache.selectedBar = document.getElementById('selected-bar');
			cache.selectedBar = parentEl.getElementsByTagName('select')[0];
		}
		var selectedBar = parseInt(cache.selectedBar.value);
		if(!cache.bars) {
			cache.bars = parentEl.getElementsByClassName('progress-bar');
		}
		var barIndex = parseInt(cache.selectedBar.value);

		_data.bars[barIndex] = _data.bars[barIndex] + _data.buttons[index];
		if(_data.bars[barIndex] > _data.limit) {
			_data.bars[barIndex] = _data.limit;
		} else if(_data.bars[barIndex] < 0) {
			_data.bars[barIndex] = 0;
		}
		var width = Math.ceil((_data.bars[barIndex]/_data.limit) * 100);
		cache.bars[barIndex].style = getBarStyle(width);
		cache.bars[barIndex].innerHTML = width + '%';
	};

	var attachEvents = function(parentEl) {
		//lets add events..
		var buttons = parentEl.getElementsByClassName('bar-button');
		for(var i=0, length=buttons.length; i<length; i++) {
			on(buttons[i], 'click', function(){
				updateProgressBar(this, parentEl);
			});
		}
	};

	var on = function(el, eventName, cb) {
		if(el.addEventListener) {
			el.addEventListener(eventName, cb);
		} else if(el.attachEvent){
			el.attachEvent(eventName, cb);
		}
	};

	var ProgressBarView = function(parentEl) {
		this.parentEl = parentEl;
	};

	ProgressBarView.prototype.render = function(data) {
		_data = data;
		render(this.parentEl);	
	};


	return ProgressBarView;
	
}());