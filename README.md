# nofail

Failover version builder for `fn(array)`. Promise-based.

## Installation

```bash
npm i nofail --save
```

## Usage

```js
var nofail = require('nofail');

function greet (names) {
	return names.map(function (name) {
		if (name === 'Bob') {
			throw new Error('Sorry Bob!');
		}
		return 'Hi ' + name;
	});
}

var greetFailover = nofail(greet, console.log);

greetFailover(['Melissa', 'Bob', 'Jess', 'Peter']).then(console.log)

// Sorry Bob!
// ...
// ['Hi Melissa', 'Hi Jess', 'Hi Peter']
```

## Motivation

Assume you are sending batch of items to certain web service (in a single request) and whole call fails. And the reason is that some of items do not pass remote validation. But we still want to make correct items be accepted, so we trying failover solution, which will try to send them, dividing initial batch into smaller ones.

## Mechanism

In case of failure, array is divided into two equisized (if possible) ones, then two function calls are made (each on corresponding subarray). If array is not dividable (length is less than 2), then failure handler is called providing an error and failover process ends. In the end, results are combined into single array to make same output as you would expect from initial function. P. S. Failure handler can be omitted (if you do not want to process failures).

## License

MIT
