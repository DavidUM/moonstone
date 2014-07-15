(function (enyo, scope) {
	/**
	 * Fires when the user changes the value of the toggle button, but not when the value is
	 * changed programmatically.
	 *
	 * @event moon.ToggleButton#event:onChange
	 * @type {Object}
	 * @property {Object} sender - The [component]{@link enyo.Component} that most recently
	 *	propagated the [event]{@link external:event}.
	 * @property {Object} event - An [object]{@link external:Object} containing
	 *	[event]{@link external:event} information.
	 * @public
	 */

	/**
	 * _moon.ToggleButton_, which extends [moon.Button](@ link moon.Button), is a button with two states,
	 * 'on' and 'off'.  When the ToggleButton is tapped, it switches its state and fires an _onChange_ event.
	 *
	 * One has the choice to show the same text (via the _content_ property) for both toggle states, or different
	 * text can be shown for each toggle state, utilizing the _toggleOnLabel_ and the _toggleOffLabel_. Note that
	 * both of these properties need to be set to display differentiating text, otherwise the _content_ property
	 * will be shown for the button text.
	 *
	 * @class moon.ToggleButton
	 * @extends moon.Button
	 * @public
	 * @ui
	 */
	enyo.kind(
		/** @lends  moon.ToggleButton.prototype */ {

		/**
		 * @private
		 */
		name: 'moon.ToggleButton',

		/**
		 * @private
		 */
		kind: 'moon.Button',

		/**
		 * @private
		 */
		published: {
			/**
			 * Boolean indicating whether toggle button is currently in the 'on' state
			 *
			 * @type {Boolean}
			 * @default false
			 * @memberof moon.ToggleButton.prototype
			 * @public
			 */
			value: false,
			/**
			 * Button text displayed in the 'on' state. If empty, will default to displaying _content_ as button text
			 *
			 * @type {String}
			 * @default ''
			 * @memberof moon.ToggleButton.prototype
			 * @public
			 */
			toggleOnLabel: '',
			/**
			 * Button text displayed in the 'off' state. If empty, will default to displaying _content_ as button text
			 *
			 * @type {String}
			 * @default ''
			 * @memberof moon.ToggleButton.prototype
			 * @public
			 */
			toggleOffLabel: ''
		},

		/*
		 * @private
		 */
		events: {
			onChange: ''
		},

		/*
		 * @private
		 */
		_rendered: false,

		/*
		 * @private
		 */
		classes: 'moon-toggle-button',

		/*
		 * @private
		 */
		create: function () {
			this.inherited(arguments);
			this.updateContent();
			this.updateVisualState();
		},

		/*
		 * @private
		 */
		rendered: function () {
			this.inherited(arguments);
			this.setActive(this.value);
			this.fireChangeEvent();
			this._rendered = true;
		},

		/*
		 * @private
		 */
		updateVisualState: function () {
			this.addRemoveClass('moon-toggle-button-on', this.value && !this.disabled);
		},

		/*
		 * @private
		 */
		disabledChanged: function () {
			this.inherited(arguments);
			this.updateVisualState();
		},

		/*
		 * @private
		 */
		valueChanged: function () {
			this.updateContent();
			this.updateVisualState();
			this.setActive(this.value);
			this.fireChangeEvent();
		},

		/*
		 * @private
		 */
		toggleOnLabelChanged: function () {
			this.updateContent();
		},

		/*
		 * @private
		 */
		toggleOffLabelChanged: function () {
			this.updateContent();
		},

		/*
		 * We override the inherited activeChanged method
		 *
		 * @private
		 */
		activeChanged: function () {
			if (this._rendered) {
				this.active = enyo.isTrue(this.active);
				this.setValue(this.active);
			}
			this.bubble('onActivate');
		},

		/*
		 * we override the inherited tap method
		 *
		 * @private
		 */
		tap: function () {
			if (this.disabled) {
				return true;
			} else {
				this.setValue(!this.value);
			}
		},

		/*
		 * @private
		 */
		updateContent: function () {
			if (!this.toggleOnLabel || !this.toggleOffLabel) {
				this.setContent(this.content);
			} else {
				this.setContent(this.value ? this.toggleOnLabel : this.toggleOffLabel);
			}
		},

		/*
		 * @private
		 */
		fireChangeEvent: function () {
			this.doChange({value: this.value});
		}
	});

})(enyo, this);
