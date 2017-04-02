const EventEmitter = require('./../src/EventEmitter').default;
let ee = null;

beforeEach(() => {
    ee = new EventEmitter();
});

test('binds listener to single specific event', () => {
    let called = false;

    ee.on('test-event', () => called = true);
    ee.emit('test-event');

    expect(called).toBe(true);
});

test('binds multiple listeners to single specific event', () => {
    let firstCalled = false;
    let secondCalled = false;

    ee.on('test-event', () => firstCalled = true);
    ee.on('test-event', () => secondCalled = true);
    ee.emit('test-event');

    expect(firstCalled).toBe(true);
    expect(secondCalled).toBe(true);
});

test('binds listener to multiple events', () => {
    let callCount = 0;

    ee.on([
        'test-event',
        'test-event-2',
    ], () => callCount++);
    ee.emit('test-event');
    ee.emit('test-event-2');

    expect(callCount).toBe(2);
});

test('event is ignored when middleware fails', () => {
    let called = false;

    ee.on('test-event', () => called = true);
    ee.middleware('test-event', (data, next) => {
        // Fail
    });
    ee.emit('test-event');

    expect(called).toBe(false);
});

test('event is triggered when middleware succeeds', () => {
    let called = false;

    ee.on('test-event', () => called = true);
    ee.middleware('test-event', (data, next) => next());
    ee.emit('test-event');

    expect(called).toBe(true);
});

test('event data is mutated through middleware', () => {
    let called = false;
    let hello = '';

    ee.on('test-event', data => {
        called = true;
        hello = data.hello;
    });
    ee.middleware('test-event', (data, next) => {
        data = {
            hello: 'world',
        };

        next(data);
    });
    ee.emit('test-event');

    expect(called).toBe(true);
    expect(hello).toBe('world');
});

test('listeners are removed for a specific event', () => {
    let called = false;

    ee.on('test-event', () => called = true);
    ee.removeListeners('test-event');
    ee.emit('test-event');

    expect(called).toBe(false);
});

test('all listeners are removed', () => {
    let firstCalled = false;
    let secondCalled = false;

    ee.on('test-event', () => firstCalled = true);
    ee.on('test-event-2', () => secondCalled = true);
    ee.removeListeners();
    ee.emit('test-event');
    ee.emit('test-event-2');

    expect(firstCalled).toBe(false);
    expect(secondCalled).toBe(false);
});

test('middleware is removed for a specific event', () => {
    let called = false;

    ee.on('test-event', () => called = true);
    ee.middleware('test-event', (data, next) => {
        // Fail
    });
    ee.removeMiddleware('test-event');
    ee.emit('test-event');

    expect(called).toBe(true);
});

test('all middleware is removed', () => {
    let firstCalled = false;
    let secondCalled = false;

    ee.on('test-event', () => firstCalled = true);
    ee.on('test-event-2', () => secondCalled = true);
    ee.middleware('test-event', (data, next) => {
        // Fail
    });
    ee.middleware('test-event-2', (data, next) => {
        // Fail
    });
    ee.removeMiddleware();
    ee.emit('test-event');
    ee.emit('test-event-2');

    expect(firstCalled).toBe(true);
    expect(secondCalled).toBe(true);
});

test('middleware is ignored for silent event', () => {
    let called = false;

    ee.on('test-event', () => called = true);
    ee.middleware('test-event', (data, next) => {
        // Fail
    });
    ee.emit('test-event', null, true);

    expect(called).toBe(true);
});

test('only listen to a specific event once', () => {
    let callCount = 0;

    ee.once('test-event', () => callCount++);
    ee.emit('test-event');
    ee.emit('test-event');

    expect(callCount).toBe(1);
});
