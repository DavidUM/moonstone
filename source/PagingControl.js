(function (enyo, scope) {
	/**
	* Fires when page boundary is reached.
	*
	* @event moon.PagingControl#event:onPaginate
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/

	/**
	* Fires when we've determined how large the bounceback effect should be.
	*
	* _event.scrollDelta_ contains a number representing the magnitude of the bounceback effect.
	*
	* @event moon.PagingControl#event:onPaginateScroll
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/

	/**
	* _moon.PagingControl_ is a paging control button derived from
	* [moon.IconButton]{@link moon.IconButton}. This control is not intended for use outside of
	* [moon.Scroller]{@link moon.Scroller}.
	*
	* @class moon.PagingControl
	* @extends moon.IconButton
	* @public
	*/
	enyo.kind(
		/** @lends moon.PagingControl.prototype */ {

		/**
		* @private
		*/
		name: "moon.PagingControl",

		/**
		* @private
		*/
		kind: "moon.IconButton",

		/**
		* @private
		*/
		classes: "moon-paging-button no-background",

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		published: {
			/**
			* The side of the control where the button will be.
			*
			* Supported values are "top", "right", "bottom", "left".
			*
			* @type {String}
			* @default null
			* @public
			*/
			side: null
		},

		/**
		* @private
		*/
		noBackground: true,

		/**
		* @private
		*/
		handlers: {
			onSpotlightFocused: "noop",
			onSpotlightKeyDown: "depress",
			onSpotlightKeyUp: "undepress",
			ondown: "down",
			onup: "endHold",
			onleave: "endHold",
			onhold: "hold",
			onActivate: "noop"
		},

		/**
		* @private
		*/
		events: {
			/**
			* {@link moon.PagingControl#event:onPaginate}
			*/
			onPaginate: '',

			/**
			* {@link moon.PagingControl#event:onPaginateScroll}
			*/
			onPaginateScroll: ''
		},

		/**
		* @private
		*/
		downTime: 0,

		/**
		* @private
		*/
		initialDelta: 2.5,

		/**
		* @private
		*/
		delta: 0,

		/**
		* @private
		*/
		maxDelta: 100,

		/**
		* @private
		*/
		tapDelta: 15,

		/**
		* @private
		*/
		bumpDeltaMultiplier: 3,

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.sideChanged();
		},

		/**
		* Stops scrolling animation and triggers _onPaginate_ event with a delta value for the
		* bounceback effect.
		*
		* @public
		*/
		hitBoundary: function() {
			this.stopHoldJob();
			this.downTime = null;
			this.doPaginate({scrollDelta: this.delta * this.bumpDeltaMultiplier});
			enyo.Spotlight.Accelerator.cancel();
		},

		/**
		* @private
		*/
		_iconMappings: {
			"top": "arrowlargeup",
			"bottom": "arrowlargedown",
			"left": "arrowlargeleft",
			"right": "arrowlargeright"
		},

		/**
		* Set this control's CSS class based on its _side_ value.
		*
		* @private
		*/
		sideChanged: function(inOld) {
			var s = this.getSide();
			this.removeClass(inOld);
			this.addClass(s);
			this.setIcon(this._iconMappings[s]);
		},

		/**
		* @private
		*/
		down: function(inSender, inEvent) {
			if (this.disabled) {
				return;
			}

			this.downTime = enyo.bench();
			this.delta = this.initialDelta;
		},

		/**
		* @private
		*/
		hold: function(inSender, inEvent) {
			if (this.disabled) {
				return;
			}

			this.startHoldJob();
		},

		/**
		* @private
		*/
		depress: function(inSender, inEvent) {
			this.inherited(arguments);
			// keydown events repeat (while mousedown/hold does not); simulate
			// hold behavior with mouse by catching the second keydown event
			if (inEvent.keyCode === 13) {
				if (!this.downCount) {
					this.down();
					this.downCount = 1;
				} else {
					this.downCount++;
				}
				if (this.downCount == 2) {
					this.hold();
				}
			}
		},

		/**
		* @private
		*/
		undepress: function(inSender, inEvent) {
			this.inherited(arguments);
			this.downCount = 0;
			this.endHold(inSender, inEvent);
		},

		/**
		* @private
		*/
		endHold: function(inSender, inEvent) {
			if (!this.downTime) {
				return;
			}

			this.stopHoldJob();
			this.sendPaginateEvent();
			this.downTime = null;
		},

		/**
		* @private
		*/
		startHoldJob: function() {
			this.stopHoldJob();

			var t0 = enyo.bench(),
				t = 0
			;

			var fn = this.bindSafely(function() {
				this.job = enyo.requestAnimationFrame(fn);

				t = (enyo.bench() - t0)/1000;
				this.delta = Math.min(this.maxDelta, this.delta + (0.1 * Math.pow(t, 1.1)));

				this.doPaginateScroll({scrollDelta: this.delta});
			});

			this.job = enyo.requestAnimationFrame(fn);
		},

		/**
		* @private
		*/
		stopHoldJob: function() {
			this.job = enyo.cancelRequestAnimationFrame(this.job);
		},

		/**
		* @private
		*/
		sendPaginateEvent: function() {
			var tapThreshold = 200,
				timeElapsed = enyo.bench() - this.downTime,
				delta = (timeElapsed <= tapThreshold) ? this.tapDelta : this.delta;

			this.doPaginate({scrollDelta: delta});
		},

		/**
		* Override default focused handling to make sure scroller doesn't scroll to this button.
		*
		* @private
		*/
		noop: function() { return true; }
	});

})(enyo, this);