module.exports = Backbone.Collection.extend({
	model: require("js/models/SearchItem"),
	comparator: 'type'
});