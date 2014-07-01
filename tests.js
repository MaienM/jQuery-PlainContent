// Extra tests, in the form of [name, input, setoptions, output, getoptions]
var tests = []

function startTests() {
	// Get the test files.
	$.ajax({
		url: './tests/list.json',
		dataType: 'json'
	})
	.done(function(testfiles) {
		_.each(testfiles, startTest);
	})
	.fail(function(data) {
		QUnit.test('Getting tests list', function(assert) {
			assert.ok(false, 'Getting tests list');
		});
	});

	// Perform the inline tests.
	_.each(tests, function(testdata) {
		doTest.apply(this, testdata);
	});
}

function startTest(testfile) {
	// Load the testfile.
	$.ajax('./tests/' + testfile)
	.done(function(content) {
		doTest(testfile, content, {}, content, {});
	})
	.fail(function(data) {
		QUnit.test(testfile, function(assert) {
			assert.equal(false, 'Getting testfile contents');
		});
	});
}

function doTest(name, input, setopts, output, getopts) {
	QUnit.test(name, function(assert) {
		// Create dom element and set value.
		var elem = $('<div contenteditable></div>');
		$('body').append(elem);
		$(elem).plainContent(input, setopts)

		// Check parsed data.
		var result = $(elem).plainContent(getopts);
		assert.equal(result, output, 'Output matches expected output');

		// Remove dom element.
		if (result == output) $(elem).remove();
	});
}

tests.push([
	'101-keep-tags',
	'Hello<span class="keep"></span>world',
	{},
	'Hello<span class="keep"></span>world',
	{
		'keep': '.keep',
	}
]);

$(startTests);
