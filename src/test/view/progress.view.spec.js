describe('Progress View', function () {

	var view;
	
	beforeEach(function() {
		var parentEl = document.createElement('div');
		view = new app.ProgressBarView(parentEl);
	});

	afterEach(function() {
      view = null;
    });

	
	it('should render a view without any exception', function () {
		var data = {
			buttons:[27,41,-35,-31],
			bars:[78,52,62,34],
			limit:160
		};
		view.render(data);
		expect(view.parentEl.getElementsByClassName('progress-bar').length).toBe(4);
		expect(view.parentEl.getElementsByClassName('bar-button').length).toBe(4);
	});


	it('it should update progress bar based on button click and selected bar', function() {
		var data = {
			buttons:[27,41,-35,-31],
			bars:[78,52,62,34],
			limit:160
		};
		view.render(data);
		var buttons = view.parentEl.getElementsByClassName('bar-button');
		var bars = view.parentEl.getElementsByClassName('progress-bar');
		var selectEl = view.parentEl.getElementsByTagName('select')[0];
		expect(bars[0].innerHTML).toBe('49%');
		expect(bars[1].innerHTML).toBe('33%');
		expect(bars[2].innerHTML).toBe('39%');
		expect(bars[3].innerHTML).toBe('22%');
		buttons[0].click();
		expect(bars[0].innerHTML).toBe('66%');
		buttons[1].click();
		expect(bars[0].innerHTML).toBe('92%');
		buttons[1].click();
		expect(bars[0].innerHTML).toBe('100%');
		buttons[2].click();
		expect(bars[0].innerHTML).toBe('79%');
		selectEl.value = 1;
		buttons[3].click();
		expect(bars[1].innerHTML).toBe('14%');
		selectEl.value = 2;
		buttons[1].click();
		expect(bars[2].innerHTML).toBe('65%');
		selectEl.value = 3;
		buttons[2].click();
		expect(bars[3].innerHTML).toBe('0%');
	});
});
