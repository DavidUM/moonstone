
/**
	_moon.VideoPlayer_ is a control that wraps an	<a href="#enyo.Video">enyo.Video</a>
	HTML5 video player to provide Moonstone-styled standard transport controls,
	optional app-specific controls, and an information bar for video information
	and player feedback.

	Client components added to the _components_ block are rendered into the video
	player's transport control area, and should generally be limited to instances
	of _moon.IconButton. If more than two are specified, they will be rendered
	into an "overflow" screen, reached by activating a button to the right of the
	controls.

	Example:

		{
			kind: "moon.VideoPlayer",
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				// Custom icons for app-specific features
				{kind: "moon.IconButton", src: "assets/feature1.png", ontap: "feature1"},
				{kind: "moon.IconButton", src: "assets/feature2.png", ontap: "feature2"},
				{kind: "moon.IconButton", src: "assets/feature3.png", ontap: "feature3"}
			]
		}

*/

enyo.kind({
	name: "moon.VideoPlayer",
	kind: "enyo.Control",
	// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
	classes: "moon-video-player", 
	published: {
		//* HTML5 video source URL
		src: "",
		//* Video aspect ratio, set as width:height
		aspectRatio: "16:9"
		
	},
	handlers: {
		onRequestPlay: "play",
		onRequestPause: "pause",
		onRequestRewind: "rewind",
		onRequestFastForward: "fastForward",
		onRequestJumpBack: "jumpBack",
		onRequestJumpForward: "jumpForward",
		onRequestJumpToStart: "jumpToStart",
		onRequestJumpToEnd: "jumpToEnd",
		onRequestTimeChange: "timeChange",
		onToggleFullscreen: "toggleFullscreen"
	},
    bindings: [],
	
	//* @protected

	_isPlaying: false,
	_autoCloseTimer: null,
	_holdPulseThreadhold: 300,
	_playerControls: [],
	
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video",
			ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded",
			onplay: "_play", onpause: "_pause", onprogress: "_progress"
		},
		{name: "client", kind: "moon.VideoControl.Fullscreen", playerControl: true},
		{kind: "moon.VideoControl.Inline", playerControl: true}
	],
	
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.setupPlayerControlBindings();
	},
	//* Return _this._playerControls_
	getPlayerControls: function() {
		var controls = this.children,
			returnControls = []
		;
		for (i = 0; i < controls.length; i++) {
			if (controls[i].playerControl) {
				returnControls.push(controls[i]);
			}
		}
		return returnControls;
	},
	//* Setup bindings for all player controls
	setupPlayerControlBindings: function() {
		var controls = this.getPlayerControls(), i;
		for (i = 0; i < controls.length; i++) {
			this.bindings.push({from: ".videoDateTime", 		to: ".$." + controls[i].name + ".videoDateTime"});
			this.bindings.push({from: ".videoTitle", 			to: ".$." + controls[i].name + ".videoTitle"});
			this.bindings.push({from: ".videoDescription", 		to: ".$." + controls[i].name + ".videoDescription"});
			this.bindings.push({from: ".videoChannel", 			to: ".$." + controls[i].name + ".videoChannel"});
			this.bindings.push({from: ".videoSubtitleLanguage", to: ".$." + controls[i].name + ".videoSubtitleLanguage"});
			this.bindings.push({from: ".videoDisplayMode", 		to: ".$." + controls[i].name + ".videoDisplayMode"});
			this.bindings.push({from: ".videoTimeRecorded", 	to: ".$." + controls[i].name + ".videoTimeRecorded"});
			this.bindings.push({from: ".video3d", 				to: ".$." + controls[i].name + ".video3d"});
		}
	},
	
	//* @public
	
	//* Toggle fullscreen on/off
	toggleFullscreen: function(inSender, inEvent) {
		if (this.isFullscreen()) {
			this.cancelFullscreen();
		} else {
			this.requestFullscreen();
		}
	},
	//* Facade _this.$.video.play_
	play: function(inSender, inEvent) {
		this.$.video.setCommand("play");
	},
	//* Facade _this.$.video.pause_
	pause: function(inSender, inEvent) {
		this.$.video.setCommand("pause");
	},
	//* Facade _this.$.video.rewind_
	rewind: function(inSender, inEvent) {
		this.$.video.setCommand("rewind");
	},
	//* Facade _this.$.video.jumpToStart_
	jumpToStart: function(inSender, inEvent) {
		this.$.video.setCommand("jumpToStart");
	},
	//* Facade _this.$.video.jumpBack_
	jumpBack: function(inSender, inEvent) {
		this.$.video.setCommand("jumpBack");
	},
	//* Facade _this.$.video.fastForward_
	fastForward: function(inSender, inEvent) {
		this.$.video.setCommand("fastForward");
	},
	//* Facade _this.$.video.jumpToEnd_
	jumpToEnd: function(inSender, inEvent) {
		this.$.video.setCommand("jumpToEnd");
	},
	//* Facade _this.$.video.jumpForward_
	jumpForward: function(inSender, inEvent) {
		this.$.video.setCommand("jumpForward");
	},
	//* Facade _this.$.video.setCurrentTime_
	setCurrentTime: function(inValue) {
		this.$.video.setCurrentTime(inValue);
	},


	//* @protected

	//* Responds to change in video source.
	srcChanged: function() {
		if (typeof this.src === "string" && this.src.length > 0 && this.$.video) {
			this.$.video.setSrc(this.src);
		}
	},
	
	//* Updates the video time.
	timeUpdate: function(inSender, inEvent) {
		this.waterfall("onTimeupdate", inEvent);
	},
	//* Called when video successfully loads video metadata
	metadataLoaded: function(inSender, inEvent) {
		this.updateAspectRatio();
	},
	//* Respond to _onRequestTimeChange_ event by setting current video time
	timeChange: function(inSender, inEvent) {
		this.setCurrentTime(inEvent.value);
	},
	//* Update the height/width based on the video's aspect ratio
	updateAspectRatio: function() {
		var node = this.hasNode(),
			videoAspectRatio = this.$.video.getAspectRatio().split(":"),
			ratio = 1
		;
		
		if (!node) {
			return;
		}
		
		// If height but no width defined, update width based on aspect ratio
		if (node.style.height && !node.style.width) {
			ratio = videoAspectRatio[0] / videoAspectRatio[1];
			this.applyStyle("width", ((parseInt(node.style.height, 10) * ratio)) + "px");
		// If width but no height defined, update height based on aspect ratio
		} else if (node.style.width && !node.style.height) {
			ratio = videoAspectRatio[1] / videoAspectRatio[0];
			this.applyStyle("height", ((parseInt(node.style.width, 10) * ratio)) + "px");
		}
	},

	///////// VIDEO EVENT HANDLERS /////////

	_play: function(inSender, inEvent) {
		this._isPlaying = true;
		this.playStateChanged();
	},
	_pause: function(inSender, inEvent) {
		this._isPlaying = false;
		this.playStateChanged();
	},
	_progress: function(inSender, inEvent) {
		this.waterfall("onBufferStateChanged", {timeStamp: inEvent.timeStamp});
	},
	playStateChanged: function() {
		this.addRemoveClass("playing", this._isPlaying);
		this.waterfall("onPlayStateChanged", {playing: this._isPlaying});
	}
});
