# nofail

Failover version builder for `fn(array)`. Promise-based.

## Installation

```bash
npm i nofail --save
```

## Usage

```js
var nofail = require('nofail');

// assume it is remote endpoint implementation, which is called using HTTP request
function greet (names) {
	// this is 'validation'
	if (_.contains(names, 'Bob')) {
		throw new Error('Sorry Bob!');
	}
	// this is 'batch processing'
	return names.map(function (name) {
		return 'Hi ' + name;
	});
}

function failureHandler (error, item) {
	console.log(item, 'is causing', error.toString(), 'error');
}

var greetFailover = nofail(greet, failureHandler);

greetFailover(['Melissa', 'Bob', 'Jess', 'Peter']).then(console.log)

// Bob is causing Sorry Bob! error
// ['Hi Melissa', 'Hi Jess', 'Hi Peter']
```

## Motivation

Assume you are sending batch of items to certain web service (in a single request) and whole call fails. And the reason is that some of items do not pass remote validation. But you still want to make correct items to be accepted, so you are trying failover solution, which will try to send them, dividing initial batch into smaller ones until everything but erroneous is accepted by remote server.

## Mechanism

In case of failure, array is divided into two equisized (if possible) ones, then two function calls are made (each on corresponding subarray). If array is not dividable (length is less than 2), then failure handler is called providing an error and failover process ends. In the end, results are combined into single array to make same output as you would expect from initial function. P. S. Failure handler can be omitted (if you do not want to process failures).

## License

MIT
