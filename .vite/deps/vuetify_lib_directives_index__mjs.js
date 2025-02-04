import {
  VTooltip
} from "./chunk-BZHJXAPC.js";
import {
  ClickOutside
} from "./chunk-3BUFVB5Q.js";
import "./chunk-ZAL6CBZH.js";
import "./chunk-4TX3OV3G.js";
import {
  Intersect
} from "./chunk-SCOPPOCF.js";
import "./chunk-D3VMBXOB.js";
import "./chunk-FTNIKNZL.js";
import {
  Ripple
} from "./chunk-QNNQBKZ4.js";
import "./chunk-IOMX4THI.js";
import "./chunk-2OF4BO7E.js";
import "./chunk-XE77TUOP.js";
import "./chunk-CE5S2J4D.js";
import "./chunk-2ON55NUK.js";
import "./chunk-HGHZAKZY.js";
import "./chunk-TP5SG6V2.js";
import "./chunk-IMFWK6WZ.js";
import {
  consoleError,
  isObject,
  keys
} from "./chunk-7ZHHBHXU.js";
import {
  h,
  mergeProps,
  render,
  resolveComponent
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/directives/mutate/index.mjs
function mounted(el, binding) {
  const modifiers = binding.modifiers || {};
  const value = binding.value;
  const {
    once,
    immediate,
    ...modifierKeys
  } = modifiers;
  const defaultValue = !Object.keys(modifierKeys).length;
  const {
    handler,
    options
  } = typeof value === "object" ? value : {
    handler: value,
    options: {
      attributes: (modifierKeys == null ? void 0 : modifierKeys.attr) ?? defaultValue,
      characterData: (modifierKeys == null ? void 0 : modifierKeys.char) ?? defaultValue,
      childList: (modifierKeys == null ? void 0 : modifierKeys.child) ?? defaultValue,
      subtree: (modifierKeys == null ? void 0 : modifierKeys.sub) ?? defaultValue
    }
  };
  const observer = new MutationObserver(function() {
    let mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let observer2 = arguments.length > 1 ? arguments[1] : void 0;
    handler == null ? void 0 : handler(mutations, observer2);
    if (once) unmounted(el, binding);
  });
  if (immediate) handler == null ? void 0 : handler([], observer);
  el._mutate = Object(el._mutate);
  el._mutate[binding.instance.$.uid] = {
    observer
  };
  observer.observe(el, options);
}
function unmounted(el, binding) {
  var _a;
  if (!((_a = el._mutate) == null ? void 0 : _a[binding.instance.$.uid])) return;
  el._mutate[binding.instance.$.uid].observer.disconnect();
  delete el._mutate[binding.instance.$.uid];
}
var Mutate = {
  mounted,
  unmounted
};

// node_modules/vuetify/lib/directives/resize/index.mjs
function mounted2(el, binding) {
  var _a, _b;
  const handler = binding.value;
  const options = {
    passive: !((_a = binding.modifiers) == null ? void 0 : _a.active)
  };
  window.addEventListener("resize", handler, options);
  el._onResize = Object(el._onResize);
  el._onResize[binding.instance.$.uid] = {
    handler,
    options
  };
  if (!((_b = binding.modifiers) == null ? void 0 : _b.quiet)) {
    handler();
  }
}
function unmounted2(el, binding) {
  var _a;
  if (!((_a = el._onResize) == null ? void 0 : _a[binding.instance.$.uid])) return;
  const {
    handler,
    options
  } = el._onResize[binding.instance.$.uid];
  window.removeEventListener("resize", handler, options);
  delete el._onResize[binding.instance.$.uid];
}
var Resize = {
  mounted: mounted2,
  unmounted: unmounted2
};

// node_modules/vuetify/lib/directives/scroll/index.mjs
function mounted3(el, binding) {
  const {
    self = false
  } = binding.modifiers ?? {};
  const value = binding.value;
  const options = typeof value === "object" && value.options || {
    passive: true
  };
  const handler = typeof value === "function" || "handleEvent" in value ? value : value.handler;
  const target = self ? el : binding.arg ? document.querySelector(binding.arg) : window;
  if (!target) return;
  target.addEventListener("scroll", handler, options);
  el._onScroll = Object(el._onScroll);
  el._onScroll[binding.instance.$.uid] = {
    handler,
    options,
    // Don't reference self
    target: self ? void 0 : target
  };
}
function unmounted3(el, binding) {
  var _a;
  if (!((_a = el._onScroll) == null ? void 0 : _a[binding.instance.$.uid])) return;
  const {
    handler,
    options,
    target = el
  } = el._onScroll[binding.instance.$.uid];
  target.removeEventListener("scroll", handler, options);
  delete el._onScroll[binding.instance.$.uid];
}
function updated(el, binding) {
  if (binding.value === binding.oldValue) return;
  unmounted3(el, binding);
  mounted3(el, binding);
}
var Scroll = {
  mounted: mounted3,
  unmounted: unmounted3,
  updated
};

// node_modules/vuetify/lib/directives/touch/index.mjs
var handleGesture = (wrapper) => {
  const {
    touchstartX,
    touchendX,
    touchstartY,
    touchendY
  } = wrapper;
  const dirRatio = 0.5;
  const minDistance = 16;
  wrapper.offsetX = touchendX - touchstartX;
  wrapper.offsetY = touchendY - touchstartY;
  if (Math.abs(wrapper.offsetY) < dirRatio * Math.abs(wrapper.offsetX)) {
    wrapper.left && touchendX < touchstartX - minDistance && wrapper.left(wrapper);
    wrapper.right && touchendX > touchstartX + minDistance && wrapper.right(wrapper);
  }
  if (Math.abs(wrapper.offsetX) < dirRatio * Math.abs(wrapper.offsetY)) {
    wrapper.up && touchendY < touchstartY - minDistance && wrapper.up(wrapper);
    wrapper.down && touchendY > touchstartY + minDistance && wrapper.down(wrapper);
  }
};
function touchstart(event, wrapper) {
  var _a;
  const touch = event.changedTouches[0];
  wrapper.touchstartX = touch.clientX;
  wrapper.touchstartY = touch.clientY;
  (_a = wrapper.start) == null ? void 0 : _a.call(wrapper, {
    originalEvent: event,
    ...wrapper
  });
}
function touchend(event, wrapper) {
  var _a;
  const touch = event.changedTouches[0];
  wrapper.touchendX = touch.clientX;
  wrapper.touchendY = touch.clientY;
  (_a = wrapper.end) == null ? void 0 : _a.call(wrapper, {
    originalEvent: event,
    ...wrapper
  });
  handleGesture(wrapper);
}
function touchmove(event, wrapper) {
  var _a;
  const touch = event.changedTouches[0];
  wrapper.touchmoveX = touch.clientX;
  wrapper.touchmoveY = touch.clientY;
  (_a = wrapper.move) == null ? void 0 : _a.call(wrapper, {
    originalEvent: event,
    ...wrapper
  });
}
function createHandlers() {
  let value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const wrapper = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: value.left,
    right: value.right,
    up: value.up,
    down: value.down,
    start: value.start,
    move: value.move,
    end: value.end
  };
  return {
    touchstart: (e) => touchstart(e, wrapper),
    touchend: (e) => touchend(e, wrapper),
    touchmove: (e) => touchmove(e, wrapper)
  };
}
function mounted4(el, binding) {
  var _a;
  const value = binding.value;
  const target = (value == null ? void 0 : value.parent) ? el.parentElement : el;
  const options = (value == null ? void 0 : value.options) ?? {
    passive: true
  };
  const uid = (_a = binding.instance) == null ? void 0 : _a.$.uid;
  if (!target || !uid) return;
  const handlers = createHandlers(binding.value);
  target._touchHandlers = target._touchHandlers ?? /* @__PURE__ */ Object.create(null);
  target._touchHandlers[uid] = handlers;
  keys(handlers).forEach((eventName) => {
    target.addEventListener(eventName, handlers[eventName], options);
  });
}
function unmounted4(el, binding) {
  var _a, _b;
  const target = ((_a = binding.value) == null ? void 0 : _a.parent) ? el.parentElement : el;
  const uid = (_b = binding.instance) == null ? void 0 : _b.$.uid;
  if (!(target == null ? void 0 : target._touchHandlers) || !uid) return;
  const handlers = target._touchHandlers[uid];
  keys(handlers).forEach((eventName) => {
    target.removeEventListener(eventName, handlers[eventName]);
  });
  delete target._touchHandlers[uid];
}
var Touch = {
  mounted: mounted4,
  unmounted: unmounted4
};

// node_modules/vuetify/lib/composables/directiveComponent.mjs
function useDirectiveComponent(component, props) {
  const concreteComponent = typeof component === "string" ? resolveComponent(component) : component;
  const hook = mountComponent(concreteComponent, props);
  return {
    mounted: hook,
    updated: hook,
    unmounted(el) {
      render(null, el);
    }
  };
}
function mountComponent(component, props) {
  return function(el, binding, vnode) {
    var _a, _b, _c;
    const _props = typeof props === "function" ? props(binding) : props;
    const text = ((_a = binding.value) == null ? void 0 : _a.text) ?? binding.value ?? (_props == null ? void 0 : _props.text);
    const value = isObject(binding.value) ? binding.value : {};
    const children = () => text ?? el.textContent;
    const provides = (vnode.ctx === binding.instance.$ ? (_b = findComponentParent(vnode, binding.instance.$)) == null ? void 0 : _b.provides : (_c = vnode.ctx) == null ? void 0 : _c.provides) ?? binding.instance.$.provides;
    const node = h(component, mergeProps(_props, value), children);
    node.appContext = Object.assign(/* @__PURE__ */ Object.create(null), binding.instance.$.appContext, {
      provides
    });
    render(node, el);
  };
}
function findComponentParent(vnode, root) {
  const stack = /* @__PURE__ */ new Set();
  const walk = (children) => {
    var _a, _b;
    for (const child of children) {
      if (!child) continue;
      if (child === vnode || child.el && vnode.el && child.el === vnode.el) {
        return true;
      }
      stack.add(child);
      let result2;
      if (child.suspense) {
        result2 = walk([child.ssContent]);
      } else if (Array.isArray(child.children)) {
        result2 = walk(child.children);
      } else if ((_a = child.component) == null ? void 0 : _a.vnode) {
        result2 = walk([(_b = child.component) == null ? void 0 : _b.subTree]);
      }
      if (result2) {
        return result2;
      }
      stack.delete(child);
    }
    return false;
  };
  if (!walk([root.subTree])) {
    consoleError("Could not find original vnode, component will not inherit provides");
    return root;
  }
  const result = Array.from(stack).reverse();
  for (const child of result) {
    if (child.component) {
      return child.component;
    }
  }
  return root;
}

// node_modules/vuetify/lib/directives/tooltip/index.mjs
var Tooltip = useDirectiveComponent(VTooltip, (binding) => {
  var _a;
  return {
    activator: "parent",
    location: (_a = binding.arg) == null ? void 0 : _a.replace("-", " "),
    text: typeof binding.value === "boolean" ? void 0 : binding.value
  };
});
export {
  ClickOutside,
  Intersect,
  Mutate,
  Resize,
  Ripple,
  Scroll,
  Tooltip,
  Touch
};
//# sourceMappingURL=vuetify_lib_directives_index__mjs.js.map
