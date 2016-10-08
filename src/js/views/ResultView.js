var Mn = require("backbone.marionette");
var Util = require("js/Util");

//View for a single result item
module.exports = Mn.View.extend({
	template: require('templates/Result.html'),
	tagName: 'li',

	classMapping: {
		'CREDIT_CARD': 'bubble-ultra-light',
		'BANK': 'bubble-light',
		'INVESTMENT': 'bubble-med',
		'LOAN': 'bubble-dark',
		'MORTGAGE': 'bubble-ultra-dark',
	},

	events: {
		'mousedown': 'openInNewWindow',
		'mouseover': 'makeSelected'
	},

	ui: {
		itemLink: '.item a',
		type: '.type'
	},

	initialize: function(options) {
		this.parentModel = options.parentModel;

		this.listenTo(this.model, 'change:selected', this.setSelected);
	},

	onRender: function() {
		this.highlightSearchTerm();
		this.setTypeClass();
		this.setSelected();
	},

	makeSelected: function() {
		this.parentModel.trigger('selection:new', this.model);
	},

	setSelected: function() {
		this.$el.toggleClass('selected', this.model.get('selected'));
	},

	setTypeClass: function() {
		if (this.classMapping[this.model.get('type')]) {
			this.ui.type.addClass(this.classMapping[this.model.get('type')]);
		}
	},

	openInNewWindow: function(e) {
		e.preventDefault();
		window.open(this.model.get('url'));
	},

	//Show search term highlight in result
	highlightSearchTerm: function() {
		if (this.parentModel.has('searchTerm')) {
			var term = this.parentModel.get('searchTerm'),
				name = this.model.get('name');

			var searchRegex = new RegExp('(' + Util.escapeRegex(term) + ')', 'ig');

			this.ui.itemLink.html(name.replace(searchRegex, '<span class="highlight">$&</span>'));
		}
	}
});