debug = function() {}
//debug = function() { console.log.apply(console, arguments); }

$.fn.plainContent = function() {
	if (arguments.length == 0 || arguments.length == 1 && typeof(arguments[0]) == 'object') {
		return _getPlainContent.apply(this, arguments);
	} 
	else if (arguments.length <= 2 && typeof(arguments[0]) == 'string' && (arguments.length == 1 || typeof(arguments[1]) == 'object')) {
		return _setPlainContent.apply(this, arguments);
	}
	else {
		throw 'Invalid method usage.';
	}
}

function _getPlainContent(options) {
	// Get the content.
	var temp = $(this).clone();
	debug('Original', temp.html());

	// Cleanup superfluous elements.
	var tags = ['div', 'p'];
	tags.forEach(function(tag) {
		$(temp).find(tag + ':empty').remove();
		$(temp).find(tag + ' br:first-child').remove();
		$(temp).find(tag + ':empty').replaceWith('<br />');
	});
	$(temp).find('br[type=_moz]').remove();

	// Remove style attr (purely for debugging purposes).
	$(temp).find('*').attr('style', null);
	debug('Cleaned', temp.html());

	// Add line breaks where appropriate.
	$(temp).find('div:not(first-child)').before('\r\n');
	$(temp).find('p:not(first-child)').before('\r\n');
	$(temp).find('br').replaceWith('\r\n');
	debug('Line breaked', temp.html());
	
	// Replace some elements that aren't what they should be.
	$(temp).html($(temp).html().replace(/&nbsp;/g, ' '));

	// Replace the elements we want to keep with placeholders.
	var keep = options != undefined && options.keep || '';
	if (typeof(keep) == 'array') {
		keep = keep.join(',');
	}
	var kept = _replaceWithPlaceholders(temp, keep);

	// Get the text.
	var text = $(temp).text();

	// Put the placeholders back.
	text = _restorePlaceholders(text, kept);

	// Output.
	debug('Plain', text);
	return text;
}

function _setPlainContent(content, options) {
	// Create a temp object to gather the html objects.
	var temp = $('<div></div>');
	$(temp).html(content);

	// Replace the elements we want to keep with placeholders.
	var elements = _replaceWithPlaceholders(temp, '*');

	// Get the edited content.
	content = $(temp).html();
	
	// Shift the focus to the element we want to change.
	var oldFocus = document.activeElement;
	$(this).focus();

	// Set the content.
	$(this).html('');
	try {
		// This should work in most browsers.
		document.execCommand('insertText', false, content);
	}
	catch (e) {
		// IE is a special snowflake, as usual.
		// The div is needed, because else leading whitespace will be removed.
		document.selection.createRange().pasteHTML('<div id="removeme"></div>' + content);
		$(this).find('#removeme').remove();
	}

	// Restore the focus.
	$(oldFocus).focus();

	// Mozilla insists on adding these line breaks... and it also strips the
	// type=_moz part when accessing innerHTML.
	// Because of this, when getting/setting the html, the line break loses
	// it's type=_moz property, and it becomes a normal line break, breaking
	// the results in firefox.
	$(this).find('br[type=_moz]').remove();

	// Replace the placeholders with the html elements.
	$(this).html(_restorePlaceholders($(this).html(), elements));
}

function _replaceWithPlaceholders(base, selector) {
	var elements = [];
	$(base).find(selector).each(function() {
		var placeholder = '=PLACEHOLDER_' + Math.random() + '=';
		elements.push([placeholder, $(this)[0].outerHTML]);
		$(this).replaceWith(placeholder);
	});
	return elements;
}

function _restorePlaceholders(html, placeholders) {
	for (var i=0; i<placeholders.length; i++) {
		html = html.replace(placeholders[i][0], placeholders[i][1]);
	}
	return html;
}
