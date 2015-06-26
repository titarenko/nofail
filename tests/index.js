var should = require('should');
var sinon = require('sinon');
var nofail = require('../');

function execute (names, failureHandler) {
	function greet (names) {
		return names.map(function (name) {
			if (name === null) {
				return null;
			}

			if (name === undefined) {
				return;
			}

			if (name === 'Bob') {
				throw new Error('Sorry Bob!');
			}

			return 'Hi ' + name;
		});
	}
	var greetFailover = nofail(greet, failureHandler);
	return greetFailover(names);
}

describe('nofail', function () {
	
	it('should omit erroneous results', function (done) {
		execute(['Melissa', 'Bob', 'Jess', 'Peter']).then(function (results) {
			results.should.have.lengthOf(3);
			results.should.containEql('Hi Melissa');
			results.should.not.containEql('Hi Bob');
			done();
		}).catch(done);
	});

	it('should call failure handler', function (done) {
		var failureHandler = sinon.spy();
		execute(['Melissa', 'Bob', 'Jess', 'Peter'], failureHandler).then(function () {
			failureHandler.called.should.eql(true);
			failureHandler.firstCall.args[0].should.be.instanceOf(Error);
			failureHandler.firstCall.args[1].should.eql('Bob');
			done();
		}).catch(done);
	});

	it('should not omit null (undefined) items', function (done) {
		execute(['Melissa', null, 'Jess', 'Peter', undefined]).then(function (results) {
			results.should.have.lengthOf(5);
			results.should.containEql('Hi Melissa');
			results.should.containEql(null);
			results.should.containEql(undefined);
			done();
		}).catch(done);
	});

	it('should return empty array if everything fails', function (done) {
		execute(['Bob', 'Bob']).then(function (results) {
			results.should.have.lengthOf(0);
			done();
		}).catch(done);
	});

});
