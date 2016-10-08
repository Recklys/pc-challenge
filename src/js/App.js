var sass = require("../style/main.scss");
var Backbone = require("backbone");
var Marionette = require("backbone.marionette");
var SearchView = require("./views/SearchView");

//Store mostly config and setup stuff here
var App = Marionette.Application.extend({
	region: 'body',

	onStart: function() {
		this.showView(new SearchView());
	}
});

$(document).ready(function() {
	var app = new App();

	app.start();
});