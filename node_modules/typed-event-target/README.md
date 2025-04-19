# typed-event-target

This package provides a strongly typed `EventTarget` sub class. Provided types pass down to event listeners and place requirements on event dispatching.

## Usage

```bash
npm i typed-event-target
```

### TypedEventTarget

Extend `TypedEventTarget` to create your own event target with specific types, or just use it to add types to an existing event target.

<!-- example-link: ./src/readme-examples/my-event-target.example.ts -->

```TypeScript
import {TypedEventTarget} from 'typed-event-target';
import {MyEvent1, MyEvent2} from './typed-events.example.js';

export class MyTypedEventTarget extends TypedEventTarget<MyEvent1 | MyEvent2> {}
```

<!-- example-link: ./src/readme-examples/adding-types.example.ts -->

```TypeScript
import {TypedEventTarget} from 'typed-event-target';
import {MyEvent1, MyEvent2} from './typed-events.example.js';

export const nowWithTypes = new EventTarget() as TypedEventTarget<MyEvent1 | MyEvent2>;
```

In the end, `nowWithTypes` will be functionally equivalent to any new instance of `MyEventTarget` (`new MyEventTarget())` because `MyEventTarget` is a sub-class of `EventTarget` with nothing extra but type information. (Though of course, `nowWithTypes` won't be an instance of `MyEventTarget` because `MyEventTarget` is a separate run-time class.)

Instances of `TypedEventTarget` can be used just like any instance of `EventTarget`:

<!-- example-link: ./src/readme-examples/event-target-usage.example.ts -->

```TypeScript
import {MyTypedEventTarget} from './my-event-target.example.js';
import {MyEvent1} from './typed-events.example.js';

const myInstance = new MyTypedEventTarget();

function myListener(event: MyEvent1) {
    console.info(event);
}

myInstance.addEventListener(MyEvent1.type, myListener);
myInstance.dispatchEvent(new MyEvent1());
myInstance.removeEventListener(MyEvent1.type, myListener);
```

## Typed Events

You are free to add the `type` property information to your `Event` sub-classes (for passing into `TypedEventTarget`'s generic) however you wish, but this package provides an easy way to do so with `defineTypedEvent`:

<!-- example-link: ./src/readme-examples/typed-events.example.ts -->

```TypeScript
import {defineTypedEvent} from 'typed-event-target';

export class MyEvent1 extends defineTypedEvent('my-event-type-1') {}
export class MyEvent2 extends defineTypedEvent('my-event-type-2') {}
```

## Typed Custom Events

Typed custom events are also provided, so you can add type guards to the data included in your events. Note the extra `()` call after `defineTypedCustomEvent`. This is needed so you don't have to duplicate the Event type information as a function generic.

<!-- example-link: ./src/readme-examples/typed-custom-events.example.ts -->

```TypeScript
import {defineTypedCustomEvent} from 'typed-event-target';

export class MyEvent1 extends defineTypedCustomEvent<string>()('my-event-type-1') {}
export class MyEvent2 extends defineTypedCustomEvent<number>()('my-event-type-2') {}

console.info(new MyEvent1({detail: 'five'}));
console.info(new MyEvent2({detail: 5}));
```
