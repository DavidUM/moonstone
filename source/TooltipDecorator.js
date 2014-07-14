(function (enyo, scope) {
	/**
	 * A control that activates a [moon.Tooltip](#moon.Tooltip). It surrounds a
	 * control such as a button and displays the tooltip when the control generates
	 * an _onEnter_ event:
	 *
	 * ```
	 * {kind: 'moon.TooltipDecorator', components: [
	 *	{kind: 'moon.Button', content: 'Tooltip'},
	 *	{kind: 'moon.Tooltip', content: 'I am a tooltip for a button.'}
	 * ]}
	 * ```
	 *
	 * Here is an example with a [moon.Input](@link moon.Input) control and a decorator around the input:
	 *
	 * ```
	 * {kind: 'moon.TooltipDecorator', components: [
	 *	{kind: 'moon.InputDecorator', components: [
	 *		{kind: 'moon.Input', placeholder: 'Just an input...'}
	 *	]},
	 *	{kind: 'moon.Tooltip', content: 'I am just a tooltip for an input.'}
	 * ]}
	 * ```
	 *
	 * Automatic hiding and showing of tooltips may be disabled by calling _mute()_ or by bubbling the
	 * _onRequestMuteTooltip_ event; it may be re-enabled by calling _unmute()_ or by bubbling the
	 * _onRequestUnmuteTooltip_ event.
	 *
	 * @class moon.TooltipDecorator
	 * @extends enyo.Control
	 * @public
	 * @ui
	 */
	enyo.kind(
		/** @lends  moon.TooltipDecorator.prototype */ {

		/**
		 * @private
		 */
		name: 'moon.TooltipDecorator',

		/**
		 * @private
		 */
		defaultKind: 'moon.Button',

		/**
		 * @private
		 */
		classes: 'moon-contextual-popup-decorator',

		/**
		 * @private
		 */
		handlers: {
			onenter: 'enter',
			onleave: 'leave',
			onSpotlightFocused: 'spotFocused',
			onSpotlightBlur: 'spotBlur',
			onRequestMuteTooltip: 'mute',
			onRequestUnmuteTooltip: 'unmute'
		},

		/**
		 * @private
		 */
		published: {
			/**
			 * Boolean indicating whether tooltips are automatically shown when the activator is hovered over
			 *
			 * @type {Boolean}
			 * @default true
			 * @memberof moon.TooltipDecorator.prototype
			 * @public
			 */
			autoShow: true
		},

		/**
		 * Disables automatic tooltip showing/hiding.
		 *
		 * @public
		 */
		mute: function () {
			this.setAutoShow(false);
		},

		/**
		 * Re-enables automatic tooltip showing/hiding after being muted.
		 *
		 * @public
		 */
		unmute: function () {
			this.setAutoShow(true);
		},

		/**
		 * @private
		 */
		autoShowChanged: function () {
			if (!this.autoShow) {
				this.requestHideTooltip();
			}
		},

		/**
		 * @private
		 */
		enter: function () {
			this.requestShowTooltip();
		},

		/**
		 * @private
		 */
		leave: function () {
			this.requestHideTooltip();
		},

		/**
		 * @private
		 */
		spotFocused: function () {
			this.requestShowTooltip();
		},

		/**
		 * @private
		 */
		spotBlur: function () {
			this.requestHideTooltip();
		},

		/**
		 * @private
		 */
		tap: function () {
			this.requestHideTooltip();
		},

		/**
		 * @private
		 */
		requestShowTooltip: function () {
			if (this.autoShow && !enyo.Spotlight.isFrozen()) {
				this.waterfallDown('onRequestShowTooltip');
			}
		},

		/**
		 * @private
		 */
		requestHideTooltip: function () {
			this.waterfallDown('onRequestHideTooltip');
		}
	});

})(enyo, this);
