var Bb = require("backbone");
var Mn = require("backbone.marionette");
var ResultView = require("js/views/ResultView");
var SearchItemCollection = require("js/models/SearchItemCollection");
var Util = require("js/Util");

//SearchView for autocomplete
//Contains search box and results view
module.exports = Mn.CompositeView.extend({
	
	template: require("templates/Search.html"),
	className: 'search-container',
	productList: require("products.json"),

	childView: ResultView,
	childViewContainer: '.results',
	childViewOptions: function() {
		return {
			parentModel: this.model
		}
	},

	maxResults: 15,

	emptyView: Mn.View.extend({
		template: _.template('No results matched your query'),
		tagName: 'li'
	}),

	ui: {
		searchBox: '.search-box',
		resultsBox: '.results'
	},

	events: {
		'keyup @ui.searchBox': 'handleKeys',
		'blur @ui.searchBox': 'hideResults',
		'focusin @ui.searchBox': 'showResults'
	},

	initialize: function() {
		this.collection = new SearchItemCollection();
		this.model = new Bb.Model();

		this.listenTo(this.model, 'selection:new', this.setSelection);
	},

	onRender: function() {
		if (!this.collection.size()) this.hideResults();
	},

	//Set a single selection
	setSelection: function(sel) {
		if (this.currentSel) {
			this.currentSel.set('selected', false);
			this.currentSel = null;
		}

		if (sel) {
			sel.set('selected', true);
			this.currentSel = sel;
		}
	},

	hideResults: function(e) {
		this.ui.resultsBox.hide();
	},

	//Show, but only if search is entered
	showResults: function() {
		if (!_.isEmpty(this.ui.searchBox.val().trim())) {
			this.ui.resultsBox.show();
		}
	},

	/*
	 * Handle interaction from arrow or enter keys
	 * For all other keys pass to getResults
	 */
	handleKeys: function(e) {
		e.preventDefault();

		if ([13,38,40].indexOf(e.keyCode) !== -1) { //Check for dn/up arrows or enter
			var curSel = this.collection.findWhere({selected: true});

			switch (e.keyCode) {
				case 13: //Enter
					if (curSel) {
						window.open(curSel.get('url'));
					}
					break;
				case 38: //Up arrow
					if (curSel) {
						var index = this.collection.indexOf(curSel);

						if (index > 0) {
							this.setSelection(this.collection.at(index - 1));
						} else {
							this.setSelection(null);
						}
					} else {
						this.setSelection(this.collection.at(this.collection.size() - 1))
					}
					break;
				case 40: //Dn Arrow
					if (curSel) {
						var index = this.collection.indexOf(curSel);

						if (index < this.collection.size() - 1) {
							this.setSelection(this.collection.at(index + 1));
						} else {
							this.setSelection(null);
						}
					} else {
						this.setSelection(this.collection.at(0));
					}
					break;
			}
		} else {
			this.getResults();
		}
	},

	/*
	 * Handle collection changes in results list
	 */
	getResults: function() {
		var searchTerm = this.ui.searchBox.val();
		this.model.set('searchTerm', searchTerm);

		if (!_.isEmpty(searchTerm.trim())) {
			var results = this.filterResults(searchTerm);
			if (results.length) {
				this.collection.reset(results.slice(0, this.maxResults));
			} else {
				this.collection.reset();
			}

			this.showResults();
		} else {
			this.hideResults();
		}
	},

	/*
	 * Normally we'd be doing an ajax call,
	 * instead we're filtering the provided json.
	 * Also filter for dupes
	 * 
	 * @returns Mixed[] results
	 */
	filterResults: function(search) {
		var results = [],
			search = Util.escapeRegex(search.toLowerCase());

		_(this.productList.products).each(function(product) {
			if (product.name.toLowerCase().match(search)) {
				var existing = _(results).findWhere({
					name: product.name,
					url: product.url,
					type: product.type
				});

				if (!existing) results.push(product);
			}
		});

		return results;
	}

});