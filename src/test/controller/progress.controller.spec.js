describe('Progress Controller', function () {

	it('controller constructor should need atleast two arguments', function () {
		expect(function(){
			new app.ProgressBarController ();
		}).toThrow(new Error('Minimum two arguments required'));
	});

});
