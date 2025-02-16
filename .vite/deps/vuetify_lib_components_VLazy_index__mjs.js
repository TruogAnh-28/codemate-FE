import {
  intersect_default
} from "./chunk-SCOPPOCF.js";
import {
  MaybeTransition,
  makeTransitionProps
} from "./chunk-2OF4BO7E.js";
import {
  makeDimensionProps,
  useDimension
} from "./chunk-IOMX4THI.js";
import {
  makeTagProps
} from "./chunk-KQMOYNAH.js";
import {
  useProxiedModel
} from "./chunk-HGHZAKZY.js";
import "./chunk-TP5SG6V2.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-7ZHHBHXU.js";
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
