/**
	_moon.TextArea_ is a Moonstone-styled TextArea control, derived from
	<a href="#enyo.TextArea">enyo.TextArea</a>. Typically, a _moon.TextArea_ is
	placed inside a <a href="#moon.InputDecorator">moon.InputDecorator</a>, which
	provides styling, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.TextArea", onchange: "inputChange"}
		]}

	For more information, see the documentation on
	[Text Fields](https://github.com/enyojs/enyo/wiki/Text-Fields) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "moon.TextArea",
	kind: "enyo.TextArea",
	classes: "moon-textarea",
	events: {
		//* Fires when the text area is changing
		onChanging: ""
	},
	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
	},
	left: function(inEvent) {
		if (!this.hasNode() || this.node.selectionStart === 0) {
			return false;
		}
		return true;
	},
	right: function(inEvent) {
		if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
			return false;
		}
		return true;
	},
	up: function(inEvent) {
		return this.left(inEvent);
	},
	down: function(inEvent) {
		return this.right(inEvent);
	},
	valueChanged: function() {
		this.inherited(arguments);
		if (this.value) {
			this.doChanging();
		}
	}
});
