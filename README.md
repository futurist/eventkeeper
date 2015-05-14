# EventEmitter

Just a super-simple Event Emitter for JavaScript using ECMAScript 6. Needed something similar for a project so I created this.

## Usage

Really simple to use; include the code/file and create a new instance of `EventEmitter`. For example:

```js
var ee = new EventEmitter;

/* Called everytime the "some-event" event is emitted */
ee.on('some-event', (data) => {
    console.log('Hello ' + data.hello + '!');
});

/* Called when "someother-event" is emitted, but only once */
ee.once('someother-event', (data) => {
    console.log('Hello other ' + data.hello + '!');
});

ee.emit('some-event', {
    hello: 'World'
});
ee.emit('someother-event', {
    hello: 'World'
});
```

You can also extend the `EventEmitter` in a Class:

```js
class HelloWorld extends EventEmitter {

    constructor() {
        super();
        
        this.on('some-event', (data) => {
            console.log('Hello ' + data.hello + '!');
        });
        this.once([ 'some-event', 'someother-event' ], (data) => {
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

## Middleware

It is possible to add "Middleware" to Events which will execute before the Event is fired. This Middleware will dictate whether or not the Event will actually be fired - and you can add multiple Middleware to events. For example:

```js
class HelloWorld extends EventEmitter {

    constructor() {
        super();
        
        /* Add the Middleware - doesn't have to be defined before listening to the Event */
        this.middleware('someother-event', (data, next) => {
            /**
             * Data passed to an Event is available in the Middleware as "data"
             */
            console.log('The second ' + data.hello + ' wants to get through...');
            
            /**
             * Calling next() passes the Middleware and the Event will continue to emit
             * (If all other Middleware assigned to the Event have also passed, if any),
             * for the Middleware to fail and for the Event to cancel the emit, don't call
             * the next() function!
             */
            next();
        });
        
        this.on('some-event', (data) => {
            console.log('Hello ' + data.hello + '!');
        });
        this.once([ 'some-event', 'someother-event' ], (data) => {
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

Listening to multiple Events is really easy. You can specify an array of events you want to listen to, or even a string of events separated by `,`, `,[space]` or `[space]`
