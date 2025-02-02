import {
  VProgressLinear
} from "./chunk-6WTCD4KW.js";
import {
  getCurrentInstanceName,
  propsFactory
} from "./chunk-3PQ7XZCE.js";
import {
  computed,
  createVNode
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/composables/loader.mjs
var makeLoaderProps = propsFactory({
  loading: [Boolean, String]
}, "loader");
function useLoader(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const loaderClasses = computed(() => ({
    [`${name}--loading`]: props.loading
  }));
  return {
    loaderClasses
  };
}
function LoaderSlot(props, _ref) {
  var _a;
  let {
    slots
  } = _ref;
  return createVNode("div", {
    "class": `${props.name}__loader`
  }, [((_a = slots.default) == null ? void 0 : _a.call(slots, {
    color: props.color,
    isActive: props.active
  })) || createVNode(VProgressLinear, {
    "absolute": props.absolute,
    "active": props.active,
    "color": props.color,
    "height": "2",
    "indeterminate": true
  }, null)]);
}

export {
  makeLoaderProps,
  useLoader,
  LoaderSlot
};
//# sourceMappingURL=chunk-SQA4JUXE.js.map
