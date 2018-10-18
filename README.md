# Vue Class Decorator

[![npm](https://img.shields.io/npm/v/vue-class-decorator.svg)](https://www.npmjs.com/package/vue-class-decorator)

This library is modified base on [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

& Fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component), so please read its README before using this library.

## License

MIT License

## Install

```bash
npm i -S vue-class-decorator
```

## Usage

There are 7 decorators and 1 function (Mixin):

* `@Emit` (**from** `vue-property-decorator`)
* `@Inject` (**from** `vue-property-decorator`)
* `@Model` (**from** `vue-property-decorator`)
* `@Prop` (**from** `vue-property-decorator`)
* `@Provide` (**from** `vue-property-decorator`)
* `@Watch` (**from** `vue-property-decorator`)
* `@Component` (**from** `vue-class-component`)
* `Mixins` (the helper function named `mixins` defined at `vue-class-component`)
* `@Filter`
* `@On`
* `@Cache`
* `@NoCache`

### `@Prop(options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Prop } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) propA!: number
  @Prop({ default: 'default value' }) propB!: string
  @Prop([String, Boolean]) propC: string | boolean
}
```

is equivalent to

```js
export default {
  props: {
    propA: {
      type: Number
    },
    propB: {
      default: 'default value'
    },
    propC: {
      type: [String, Boolean]
    },
  }
}
```

**Note that:**

* `reflect-metada` isn't used in this library and setting `emitDecoratorMetadata` to `true` means nothing.
* Each prop's default value need to be defined as same as the example code shown in above.

### `@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {})` decorator

```ts
import { Vue, Component, Model } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) checked!: boolean
}
```

is equivalent to

```js
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean
    },
  },
}
```

### `@Watch(path: string, options: WatchOptions = {})` decorator

```ts
import { Vue, Component, Watch } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) { }
}
```

is equivalent to

```js
export default {
  watch: {
    'child': {
      handler: 'onChildChanged',
      immediate: false,
      deep: false
    },
    'person': {
      handler: 'onPersonChanged',
      immediate: true,
      deep: true
    }
  },
  methods: {
    onChildChanged(val, oldVal) { },
    onPersonChanged(val, oldVal) { }
  }
}
```

### `@Emit(event?: string)` decorator

The functions decorated by `@Emit` `$emit` their return value followed by their original arguments. If the return value is a promise, it is resolved before being emitted.

If the name of the event is not supplied via the `event` argument, the function name is used instead. In that case, the camelCase name will be converted to kebab-case.

```ts
import { Vue, Component, Emit } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  count = 0

  @Emit()
  addToCount(n: number) {
    this.count += n
  }

  @Emit('reset')
  resetCount() {
    this.count = 0
  }

  @Emit()
  returnValue() {
    return 10
  }

  @Emit()
  promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}
```

is equivalent to

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })

      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}
```

### `@Provide(key?: string | symbol)` / `@Inject(options?: { from?: InjectKey, default?: any } | InjectKey)` decorator

```ts
import { Component, Inject, Provide, Vue } from 'vue-class-decorator'

const symbol = Symbol('baz')

@Component
export class MyComponent extends Vue {
  @Inject() foo!: string
  @Inject('bar') bar!: string
  @Inject({ from: 'optional', default: 'default' }) optional!: string
  @Inject(symbol) baz!: string


  @Provide() foo = 'foo'
  @Provide('bar') baz = 'bar'
}
```

is equivalent to

```js
const symbol = Symbol('baz')

export const MyComponent = Vue.extend({

  inject: {
    foo: 'foo',
    bar: 'bar',
    'optional': { from: 'optional', default: 'default' },
    [symbol]: symbol
  },
  data () {
    return {
      foo: 'foo',
      baz: 'bar'
    }
  },
  provide () {
    return {
      foo: this.foo,
      bar: this.baz
    }
  }
})
```

### `@Filter(name?: string)` decorator

```ts
import { Vue, Component, Filter } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  @Filter('date')
  DateFilter(val: string) { }

  @Filter()
  date2(val: string) { }
}
```

is equivalent to

```js
export default {
  filter: {
    date(val) {},
    date2(val) {}
  }
}
```

### `@Cache(cache: boolean)` decorator

```ts
import { Vue, Component, Cache } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  @Cache()
  get random () {
    return Math.random()
  }

  // the computed property will not be cached
  @Cache(false)
  get random2 () {
    return Math.random()
  }
}
```

### `@NoCache` decorator

This is the alias for `@Cache(false)`

```ts
import { Vue, Component, NoCache } from 'vue-class-decorator'

@Component
export default class YourComponent extends Vue {
  // the computed property will not be cached
  @NoCache
  get random () {
    return Math.random()
  }
}
```

## See also

[vuex-class](https://github.com/ktsn/vuex-class/)
