(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
	typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
	(global = global || self, factory(global.VueDecorator = {}, global.Vue));
}(this, function (exports, Vue) { 'use strict';

	Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var vueClassComponent_common = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var Vue$$1 = _interopDefault(Vue);

	var reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata;
	function copyReflectionMetadata(to, from) {
	    forwardMetadata(to, from);
	    Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
	        forwardMetadata(to.prototype, from.prototype, key);
	    });
	    Object.getOwnPropertyNames(from).forEach(function (key) {
	        forwardMetadata(to, from, key);
	    });
	}
	function forwardMetadata(to, from, propertyKey) {
	    var metaKeys = propertyKey
	        ? Reflect.getOwnMetadataKeys(from, propertyKey)
	        : Reflect.getOwnMetadataKeys(from);
	    metaKeys.forEach(function (metaKey) {
	        var metadata = propertyKey
	            ? Reflect.getOwnMetadata(metaKey, from, propertyKey)
	            : Reflect.getOwnMetadata(metaKey, from);
	        if (propertyKey) {
	            Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
	        }
	        else {
	            Reflect.defineMetadata(metaKey, metadata, to);
	        }
	    });
	}

	var fakeArray = { __proto__: [] };
	var hasProto = fakeArray instanceof Array;
	function createDecorator(factory) {
	    return function (target, key, index) {
	        var Ctor = typeof target === 'function'
	            ? target
	            : target.constructor;
	        if (!Ctor.__decorators__) {
	            Ctor.__decorators__ = [];
	        }
	        if (typeof index !== 'number') {
	            index = undefined;
	        }
	        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
	    };
	}
	function mixins() {
	    var Ctors = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        Ctors[_i] = arguments[_i];
	    }
	    return Vue$$1.extend({ mixins: Ctors });
	}
	function isPrimitive(value) {
	    var type = typeof value;
	    return value == null || (type !== 'object' && type !== 'function');
	}
	function warn(message) {
	    if (typeof console !== 'undefined') {
	        console.warn('[vue-class-component] ' + message);
	    }
	}

	function collectDataFromConstructor(vm, Component) {
	    // override _init to prevent to init as Vue instance
	    var originalInit = Component.prototype._init;
	    Component.prototype._init = function () {
	        var _this = this;
	        // proxy to actual vm
	        var keys = Object.getOwnPropertyNames(vm);
	        // 2.2.0 compat (props are no longer exposed as self properties)
	        if (vm.$options.props) {
	            for (var key in vm.$options.props) {
	                if (!vm.hasOwnProperty(key)) {
	                    keys.push(key);
	                }
	            }
	        }
	        keys.forEach(function (key) {
	            if (key.charAt(0) !== '_') {
	                Object.defineProperty(_this, key, {
	                    get: function () { return vm[key]; },
	                    set: function (value) { vm[key] = value; },
	                    configurable: true
	                });
	            }
	        });
	    };
	    // should be acquired class property values
	    var data = new Component();
	    // restore original _init to avoid memory leak (#209)
	    Component.prototype._init = originalInit;
	    // create plain data object
	    var plainData = {};
	    Object.keys(data).forEach(function (key) {
	        if (data[key] !== undefined) {
	            plainData[key] = data[key];
	        }
	    });
	    if (process.env.NODE_ENV !== 'production') {
	        if (!(Component.prototype instanceof Vue$$1) && Object.keys(plainData).length > 0) {
	            warn('Component class must inherit Vue or its descendant class ' +
	                'when class property is used.');
	        }
	    }
	    return plainData;
	}

	var $internalHooks = [
	    'data',
	    'beforeCreate',
	    'created',
	    'beforeMount',
	    'mounted',
	    'beforeDestroy',
	    'destroyed',
	    'beforeUpdate',
	    'updated',
	    'activated',
	    'deactivated',
	    'render',
	    'errorCaptured' // 2.5
	];
	function componentFactory(Component, options) {
	    if (options === void 0) { options = {}; }
	    options.name = options.name || Component._componentTag || Component.name;
	    // prototype props.
	    var proto = Component.prototype;
	    Object.getOwnPropertyNames(proto).forEach(function (key) {
	        if (key === 'constructor') {
	            return;
	        }
	        // hooks
	        if ($internalHooks.indexOf(key) > -1) {
	            options[key] = proto[key];
	            return;
	        }
	        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
	        if (descriptor.value !== void 0) {
	            // methods
	            if (typeof descriptor.value === 'function') {
	                (options.methods || (options.methods = {}))[key] = descriptor.value;
	            }
	            else {
	                // typescript decorated data
	                (options.mixins || (options.mixins = [])).push({
	                    data: function () {
	                        var _a;
	                        return _a = {}, _a[key] = descriptor.value, _a;
	                    }
	                });
	            }
	        }
	        else if (descriptor.get || descriptor.set) {
	            // computed properties
	            (options.computed || (options.computed = {}))[key] = {
	                get: descriptor.get,
	                set: descriptor.set
	            };
	        }
	    });
	    (options.mixins || (options.mixins = [])).push({
	        data: function () {
	            return collectDataFromConstructor(this, Component);
	        }
	    });
	    // decorate options
	    var decorators = Component.__decorators__;
	    if (decorators) {
	        decorators.forEach(function (fn) { return fn(options); });
	        delete Component.__decorators__;
	    }
	    // find super
	    var superProto = Object.getPrototypeOf(Component.prototype);
	    var Super = superProto instanceof Vue$$1
	        ? superProto.constructor
	        : Vue$$1;
	    var Extended = Super.extend(options);
	    forwardStaticMembers(Extended, Component, Super);
	    if (reflectionIsSupported) {
	        copyReflectionMetadata(Extended, Component);
	    }
	    return Extended;
	}
	var reservedPropertyNames = [
	    // Unique id
	    'cid',
	    // Super Vue constructor
	    'super',
	    // Component options that will be used by the component
	    'options',
	    'superOptions',
	    'extendOptions',
	    'sealedOptions',
	    // Private assets
	    'component',
	    'directive',
	    'filter'
	];
	function forwardStaticMembers(Extended, Original, Super) {
	    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
	    Object.getOwnPropertyNames(Original).forEach(function (key) {
	        // `prototype` should not be overwritten
	        if (key === 'prototype') {
	            return;
	        }
	        // Some browsers does not allow reconfigure built-in properties
	        var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
	        if (extendedDescriptor && !extendedDescriptor.configurable) {
	            return;
	        }
	        var descriptor = Object.getOwnPropertyDescriptor(Original, key);
	        // If the user agent does not support `__proto__` or its family (IE <= 10),
	        // the sub class properties may be inherited properties from the super class in TypeScript.
	        // We need to exclude such properties to prevent to overwrite
	        // the component options object which stored on the extended constructor (See #192).
	        // If the value is a referenced value (object or function),
	        // we can check equality of them and exclude it if they have the same reference.
	        // If it is a primitive value, it will be forwarded for safety.
	        if (!hasProto) {
	            // Only `cid` is explicitly exluded from property forwarding
	            // because we cannot detect whether it is a inherited property or not
	            // on the no `__proto__` environment even though the property is reserved.
	            if (key === 'cid') {
	                return;
	            }
	            var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
	            if (!isPrimitive(descriptor.value) &&
	                superDescriptor &&
	                superDescriptor.value === descriptor.value) {
	                return;
	            }
	        }
	        // Warn if the users manually declare reserved properties
	        if (process.env.NODE_ENV !== 'production' &&
	            reservedPropertyNames.indexOf(key) >= 0) {
	            warn("Static property name '" + key + "' declared on class '" + Original.name + "' " +
	                'conflicts with reserved property name of Vue internal. ' +
	                'It may cause unexpected behavior of the component. Consider renaming the property.');
	        }
	        Object.defineProperty(Extended, key, descriptor);
	    });
	}

	function Component(options) {
	    if (typeof options === 'function') {
	        return componentFactory(options);
	    }
	    return function (Component) {
	        return componentFactory(Component, options);
	    };
	}
	Component.registerHooks = function registerHooks(keys) {
	    $internalHooks.push.apply($internalHooks, keys);
	};

	exports.default = Component;
	exports.createDecorator = createDecorator;
	exports.mixins = mixins;
	});

	var vueClassComponent_common$1 = unwrapExports(vueClassComponent_common);
	var vueClassComponent_common_1 = vueClassComponent_common.createDecorator;
	var vueClassComponent_common_2 = vueClassComponent_common.mixins;

	// code copied from Vue/src/shared/util.js
	var hyphenateRE = /\B([A-Z])/g;
	var hyphenate = function (str) { return str.replace(hyphenateRE, "-$1").toLowerCase(); };
	function Emit(event) {
	    return function (_target, key, descriptor) {
	        if (typeof key === "string") {
	            key = hyphenate(key);
	        }
	        var original = descriptor.value;
	        descriptor.value = function emitter() {
	            var _this = this;
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            var emit = function (returnValue) {
	                if (returnValue !== undefined) {
	                    args.unshift(returnValue);
	                }
	                _this.$emit.apply(_this, [event || key].concat(args));
	            };
	            var returnValue = original.apply(this, args);
	            if (isPromise(returnValue)) {
	                returnValue.then(function (returnValue) {
	                    emit(returnValue);
	                });
	            }
	            else {
	                emit(returnValue);
	            }
	        };
	    };
	}
	function isPromise(obj) {
	    return obj instanceof Promise || (obj && typeof obj.then === "function");
	}

	function Inject(options) {
	    return vueClassComponent_common_1(function (componentOptions, key) {
	        if (typeof componentOptions.inject === "undefined") {
	            componentOptions.inject = {};
	        }
	        if (!Array.isArray(componentOptions.inject)) {
	            componentOptions.inject[key] = options || key;
	        }
	    });
	}

	function Model(event, options) {
	    if (options === void 0) { options = {}; }
	    return vueClassComponent_common_1(function (componentOptions, k) {
	        (componentOptions.props || (componentOptions.props = {}))[k] = options;
	        componentOptions.model = { prop: k, event: event || k };
	    });
	}

	function Prop(options) {
	    if (options === void 0) { options = {}; }
	    return vueClassComponent_common_1(function (componentOptions, k) {
	        (componentOptions.props || (componentOptions.props = {}))[k] = options;
	    });
	}

	function Provide(key) {
	    return vueClassComponent_common_1(function (componentOptions, k) {
	        var provide = componentOptions.provide;
	        if (typeof provide !== "function" || !provide.managed) {
	            var original_1 = componentOptions.provide;
	            provide = componentOptions.provide = function () {
	                var rv = Object.create((typeof original_1 === "function" ? original_1.call(this) : original_1) || null);
	                // tslint:disable-next-line:forin
	                for (var i in provide.managed) {
	                    rv[provide.managed[i]] = this[i];
	                }
	                return rv;
	            };
	            provide.managed = {};
	        }
	        provide.managed[k] = key || k;
	    });
	}

	function Watch(path, options) {
	    if (options === void 0) { options = {}; }
	    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
	    return vueClassComponent_common_1(function (componentOptions, handler) {
	        if (typeof componentOptions.watch !== "object") {
	            componentOptions.watch = Object.create(null);
	        }
	        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
	    });
	}

	function Filter(name) {
	    return vueClassComponent_common_1(function (componentOptions, handler) {
	        if (typeof componentOptions.filters !== "object") {
	            componentOptions.filters = Object.create(null);
	        }
	        var methods = componentOptions.methods;
	        componentOptions.filters[name || handler] = methods[handler];
	        delete methods[handler];
	    });
	}

	// code copied from Vue/src/shared/util.js
	var hyphenateRE$1 = /\B([A-Z])/g;
	var hyphenate$1 = function (str) { return str.replace(hyphenateRE$1, "-$1").toLowerCase(); };
	function On(event, reserve) {
	    if (reserve === void 0) { reserve = true; }
	    return vueClassComponent_common_1(function (componentOptions, key) {
	        var mounted = componentOptions.mounted;
	        var methods = componentOptions.methods;
	        var handler = methods[key];
	        componentOptions.mounted = function () {
	            this.$on(event || hyphenate$1(key), handler);
	            if (typeof mounted === "function") {
	                mounted.call(this);
	            }
	        };
	        if (!reserve) {
	            delete methods[key];
	        }
	    });
	}

	// code copied from Vue/src/shared/util.js
	var hyphenateRE$2 = /\B([A-Z])/g;
	var hyphenate$2 = function (str) { return str.replace(hyphenateRE$2, "-$1").toLowerCase(); };
	function Once(event, reserve) {
	    if (reserve === void 0) { reserve = true; }
	    return vueClassComponent_common_1(function (componentOptions, key) {
	        var mounted = componentOptions.mounted;
	        var methods = componentOptions.methods;
	        var handler = methods[key];
	        componentOptions.mounted = function () {
	            this.$once(event || hyphenate$2(key), handler);
	            if (typeof mounted === "function") {
	                mounted.call(this);
	            }
	        };
	        if (!reserve) {
	            delete methods[key];
	        }
	    });
	}

	function HookFactory(stage) {
	    return function _stage(order, args) {
	        if (args === void 0) { args = []; }
	        if (Array.isArray(order)) {
	            args = order;
	            order = undefined;
	        }
	        return vueClassComponent_common_1(function (componentOptions, key) {
	            var _stage = componentOptions[stage];
	            if (typeof _stage !== "function" || !_stage.todos) {
	                // tslint:disable-next-line:no-empty
	                var original_1 = componentOptions[stage] ? componentOptions[stage] : function () { };
	                var methods_1 = componentOptions.methods;
	                _stage = componentOptions[stage] = function () {
	                    var _this = this;
	                    _stage.todos
	                        .filter(function (x) { return x[1]; })
	                        .sort(function (a, b) { return a[1] - b[1]; })
	                        .map(function (x) {
	                        var _a;
	                        return (_a = methods_1[x[0]]).call.apply(_a, [_this].concat(x[2]));
	                    });
	                    _stage.todos
	                        .filter(function (x) { return !x[1]; })
	                        .map(function (x) {
	                        var _a;
	                        return (_a = methods_1[x[0]]).call.apply(_a, [_this].concat(x[2]));
	                    });
	                    original_1.call(this);
	                };
	                _stage.todos = [];
	            }
	            _stage.todos.push([key, order, args]);
	        });
	    };
	}
	var BeforeCreate = HookFactory("beforeCreate");
	var Created = HookFactory("created");
	var BeforeMount = HookFactory("beforeMount");
	var Mounted = HookFactory("mounted");
	var BeforeUpdate = HookFactory("beforeUpdate");
	var Updated = HookFactory("updated");
	var Activated = HookFactory("activated");
	var Deactivated = HookFactory("deactivated");
	var BeforeDestroy = HookFactory("beforeDestroy");
	var Destroyed = HookFactory("destroyed");
	var ErrorCaptured = HookFactory("errorCaptured");

	function Cache(cache) {
	    if (cache === void 0) { cache = true; }
	    return vueClassComponent_common_1(function (options, key) {
	        // component options should be passed to the callback
	        // and update for the options object affect the component
	        var computed = options.computed;
	        computed[key].cache = cache;
	    });
	}
	var NoCache = Cache(false);

	var FunctionalVue = Vue.extend({
	    functional: true
	});

	var _ = Object.create({
	    vue_class_decorator_placeholder: true
	});
	function IfPlaceholder(test) {
	    if (test === undefined || test === null) {
	        return false;
	    }
	    return !!test.vue_class_decorator_placeholder;
	}

	exports.Vue = Vue;
	exports.Component = vueClassComponent_common$1;
	exports.Mixins = vueClassComponent_common_2;
	exports.Emit = Emit;
	exports.Inject = Inject;
	exports.Model = Model;
	exports.Prop = Prop;
	exports.Provide = Provide;
	exports.Watch = Watch;
	exports.Filter = Filter;
	exports.On = On;
	exports.Once = Once;
	exports.BeforeCreate = BeforeCreate;
	exports.Created = Created;
	exports.BeforeMount = BeforeMount;
	exports.Mounted = Mounted;
	exports.BeforeUpdate = BeforeUpdate;
	exports.Updated = Updated;
	exports.Activated = Activated;
	exports.Deactivated = Deactivated;
	exports.BeforeDestroy = BeforeDestroy;
	exports.Destroyed = Destroyed;
	exports.ErrorCaptured = ErrorCaptured;
	exports.Cache = Cache;
	exports.NoCache = NoCache;
	exports.FunctionalVue = FunctionalVue;
	exports._ = _;
	exports.IfPlaceholder = IfPlaceholder;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
