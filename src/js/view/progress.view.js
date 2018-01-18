/**
* @Author: Gnanasuriyan
* The progressbar view - will be gets updated once mode is getting changed. 
* The corresponding model is set via controller.
*/

(function(app){
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

	var updateProgressBar = function() {
		var index = parseInt(this.getAttribute('data-index'));
		if(!cache.selectedBar) {
			cache.selectedBar = document.getElementById('selected-bar');
		}
		var selectedBar = parseInt(cache.selectedBar.value);
		if(!cache.bars) {
			cache.bars = document.getElementsByClassName('progress-bar');
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
		var buttons = document.getElementsByClassName('bar-button');
		for(var i=0, length=buttons.length; i<length; i++) {
			on(buttons[i], 'click', updateProgressBar);
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


	app.ProgressBarView = ProgressBarView;
	
})(window.app);