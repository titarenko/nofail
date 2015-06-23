var _ = require('lodash');
var Promise = require('bluebird')

function failoverBuilder (fn, failureHandler) {
	if (!_.isFunction(fn)) {
		throw new Error('No function passed to make its failover version!');
	}
	// failure handler can be omitted
	failureHandler = _.isFunction(failureHandler) ? failureHandler : _.identity;
	return _.partial(failoverArrayProcessing, fn, failureHandler);
}

function failoverArrayProcessing (fn, failureHandler, array) {
	var result = Promise.resolve().then(_.partial(fn, array));

	if (!_.isArray(array)) {
		// if not array, behave like there is no wrapper
		return result;
	}
	
	var mapper = _.partial(failoverArrayProcessing, fn, failureHandler);
	var filter = _.partialRight(_.filter, function (item) {
		return item !== undefined;
	});

	return result.catch(function (error) {
		if (array.length < 2) {
			return Promise.resolve(failureHandler(error, array[0])).return();
		}

		var middle = Math.floor(array.length/2);
		var lower = array.slice(0, middle);
		var upper = array.slice(middle, array.length);

		return Promise
			.all([upper, lower].map(mapper))
			.then(filter) // remove results of failed calls
			.then(_.flatten); // flatten result of nested calls
	});
};

module.exports = failoverBuilder;
