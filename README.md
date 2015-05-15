# EventEmitter

[![NPM Downloads](https://img.shields.io/npm/dm/event-keeper.png)](https://www.npmjs.com/package/event-keeper)

Just a super-simple Event Emitter for JavaScript using ECMAScript 6. Needed something similar for a project so I created this. Works with Browserify.

## Installation

You can either build the code yourself and include it in your project, or you can install via NPM:

`npm install event-keeper --save`

Which would then allow you to `require('event-keeper')` in Browserify and Node (Node is currently untested).

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
        this.middleware('someother-event', (data, next) => {
            /**
             * Middleware can also change the Event Data - just pass back the new Data in next()
             */
            data.hello = 'Mars';
            
            next(data);
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

## Removing Listeners/Middleware

You can remove all of the Listeners attached to an Event like so:

```js
/* Removes the Listeners for "some-event", can also accept an Array of Events */
ee.removeListeners('some-event');
```

This will not remove Middleware for an Event, and any new Listeners will still use the Middleware applied. If you'd like to delete Middleware, there are two ways to do this:

```js
/* Removes the Listeners for "some-event" and all it's Middleware */
ee.removeListeners('some-event', true);

/* Removes the Middleware for "some-event" but NOT it's Listeners, can also accept an Array of Events to delete Middleware from */
ee.removeMiddleware('some-event');
```

## Browserify

This works perfectly fine with Browserify. For example:

```js
var EventEmitter = require('event-keeper'),
    ee = new EventEmitter;

/* Called everytime the "some-event" event is emitted */
ee.on('some-event', (data) => {
    console.log('Hello ' + data.hello + '!');
});

ee.emit('some-event', {
    hello: 'World'
});
```

## Syntax

Listening to multiple Events is really easy. You can specify an array of events you want to listen to, or even a string of events separated by `,`, `,[space]` or `[space]`

## Planned Updates

- Option for naming Middleware and reusing it (Also allows for more specific Middleware removal)
- Add Tests
- Add Travis CI build testing
