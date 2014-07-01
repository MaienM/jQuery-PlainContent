function startTests() {
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
}

function startTest(testfile) {
	// Load the testfile.
	$.ajax('./tests/' + testfile)
	.done(function(content) {
		QUnit.test(testfile, function(assert) {
			// Create dom element and set value.
			var elem = $('<div contenteditable></div>');
			$('body').append(elem);
			$(elem).plainContent(content)

			// Check parsed data.
			var result = $(elem).plainContent();
			assert.equal(result, content, 'Plain content matches source content');

			// Remove dom element.
			if (result == content) $(elem).remove();
		});
	})
	.fail(function(data) {
		QUnit.test(testfile, function(assert) {
			assert.equal(false, 'Getting testfile contents');
		});
	});
}

$(startTests);
