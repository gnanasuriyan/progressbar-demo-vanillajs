
describe('Progress Model', function () {

	var model, doneFn;
	var timerCallback;
	beforeEach(function() {
		model = new app.ProgressBarModel();
		model.setApiUrl('mock/data.json');
		doneFn = jasmine.createSpy("success");
		jasmine.Ajax.install();
		timerCallback = jasmine.createSpy("timerCallback");
    	jasmine.clock().install();
	});

	afterEach(function() {
      jasmine.Ajax.uninstall();
      jasmine.clock().uninstall();
    });


	it('should fire event when we get new data', function () {
		expect(true).toBe(true);
	});

	
	it('minimum two arguments required for resgistering event', function () {
		expect(function(){
			model.on('loaded');
		}).toThrow(new Error('Minimum two arguments required'));
	});

	it('on should expect call back as function', function () {
		expect(function(){
			model.on('loaded', null);
		}).toThrow(new Error('The callback should be a function'));
	});

	it('ajax should load data', function () {
		model.load();
		expect(jasmine.Ajax.requests.mostRecent().url).toBe('mock/data.json');
		expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
		expect(doneFn).not.toHaveBeenCalled();
		jasmine.Ajax.requests.mostRecent().respondWith({
			status: 200,
			responseText: '{"buttons":[27,41,-35,-31],"bars":[78,52,62,34],"limit":160}'
		});
		doneFn();
		expect(doneFn).toHaveBeenCalled();
		var resp = JSON.parse(jasmine.Ajax.requests.mostRecent().response);
		expect(resp.buttons.length).toBe(4);
		expect(resp.bars.length).toBe(4);
		expect(resp.limit).toBe(160);
	});


});
