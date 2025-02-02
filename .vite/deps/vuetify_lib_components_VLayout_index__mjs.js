import {
  createLayout,
  makeLayoutItemProps,
  makeLayoutProps,
  useLayoutItem
} from "./chunk-D3S74BNS.js";
import "./chunk-3NWFQN4N.js";
import {
  makeDimensionProps,
  useDimension
} from "./chunk-QRMDTNZD.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-3PQ7XZCE.js";
import {
  computed,
  createVNode,
  toRef
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VLayout/VLayout.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VLayout/VLayout.css";
var makeVLayoutProps = propsFactory({
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeLayoutProps()
}, "VLayout");
var VLayout = genericComponent()({
  name: "VLayout",
  props: makeVLayoutProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      layoutClasses,
      layoutStyles,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout(props);
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => {
      var _a;
      return createVNode("div", {
        "ref": layoutRef,
        "class": [layoutClasses.value, props.class],
        "style": [dimensionStyles.value, layoutStyles.value, props.style]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    });
    return {
      getLayoutItem,
      items
    };
  }
});

// node_modules/vuetify/lib/components/VLayout/VLayoutItem.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VLayout/VLayoutItem.css";
var makeVLayoutItemProps = propsFactory({
  position: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 300
  },
  modelValue: Boolean,
  ...makeComponentProps(),
  ...makeLayoutItemProps()
}, "VLayoutItem");
var VLayoutItem = genericComponent()({
  name: "VLayoutItem",
  props: makeVLayoutItemProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: toRef(props, "position"),
      elementSize: toRef(props, "size"),
      layoutSize: toRef(props, "size"),
      active: toRef(props, "modelValue"),
      absolute: toRef(props, "absolute")
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": ["v-layout-item", props.class],
        "style": [layoutItemStyles.value, props.style]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
export {
  VLayout,
  VLayoutItem
};
//# sourceMappingURL=vuetify_lib_components_VLayout_index__mjs.js.map
