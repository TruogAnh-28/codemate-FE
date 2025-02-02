import {
  intersect_default
} from "./chunk-BVG4NO4Z.js";
import {
  makeTagProps
} from "./chunk-6KXFZ5QA.js";
import {
  MaybeTransition,
  makeTransitionProps
} from "./chunk-BVKIQNMX.js";
import {
  makeDimensionProps,
  useDimension
} from "./chunk-QRMDTNZD.js";
import {
  useProxiedModel
} from "./chunk-U7JXVVLV.js";
import "./chunk-TP5SG6V2.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-3PQ7XZCE.js";
import {
  createVNode,
  resolveDirective,
  withDirectives
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VLazy/VLazy.mjs
var makeVLazyProps = propsFactory({
  modelValue: Boolean,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps(),
  ...makeTransitionProps({
    transition: "fade-transition"
  })
}, "VLazy");
var VLazy = genericComponent()({
  name: "VLazy",
  directives: {
    intersect: intersect_default
  },
  props: makeVLazyProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const isActive = useProxiedModel(props, "modelValue");
    function onIntersect(isIntersecting) {
      if (isActive.value) return;
      isActive.value = isIntersecting;
    }
    useRender(() => withDirectives(createVNode(props.tag, {
      "class": ["v-lazy", props.class],
      "style": [dimensionStyles.value, props.style]
    }, {
      default: () => [isActive.value && createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      })]
    }), [[resolveDirective("intersect"), {
      handler: onIntersect,
      options: props.options
    }, null]]));
    return {};
  }
});
export {
  VLazy
};
//# sourceMappingURL=vuetify_lib_components_VLazy_index__mjs.js.map
