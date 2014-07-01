debug = function() {}
debug = function() { console.log.apply(console, arguments); }

$.fn.plainContent = function() {
	if (arguments.length == 0) {
		return _getPlainContent.call(this);
	} else if (arguments.length == 1) {
		return _setPlainContent.call(this, arguments[0]);
	} else {
		throw "Invalid method usage.";
	}
}

function _getPlainContent() {
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

	// Strip HTML, leaving just the line breaked text.
	debug('Plain', temp.text());
	return $(temp).text();
}

function _setPlainContent(content) {
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
}
