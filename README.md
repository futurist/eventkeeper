# EventEmitter

Just a super-simple Event Emitter for JavaScript using ECMAScript 5 and 6. Needed something similar for a project so I created this.

## Usage

Really simple to use; include the code/file and create a new instance of `EventEmitter`. For example:

```js
var ee = new EventEmitter;

ee.on('some-event', function(data) {
    console.log('Hello ' + data.hello + '!');
});

ee.emit('some-event', {
    hello: 'World'
});
```

If you're using the ES6 version, you can also extend the `EventEmitter` Class. For example:

```js
class HelloWorld extends EventEmitter {

    constructor() {
        super();
    }
    
    someMethod() {
        this.on('some-event', (data) => {
            console.log('Hello ' + data.hello + '!');
        });
        this.on([ 'some-event', 'someother-event' ], (data) => {
            console.log('Hello second ' + data.hello + '!');
        });
    }
    
    execute() {
        this.emit('someother-event', {
            hello: 'World'
        });
    }

}
```

## Syntax

Listening to multiple Events is really easy. You can specify an array of events you want to listen to, or even a string of events separated by `,`, `, ` or ` `
