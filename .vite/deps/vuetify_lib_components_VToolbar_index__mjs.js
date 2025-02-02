import {
  VToolbar,
  VToolbarTitle
} from "./chunk-Q23TKPUP.js";
import "./chunk-EPJP2ZU7.js";
import "./chunk-4JX4XPLT.js";
import "./chunk-4E2VGDKU.js";
import {
  makeVariantProps
} from "./chunk-BFPZT6CI.js";
import "./chunk-BVG4NO4Z.js";
import "./chunk-UFKXNOED.js";
import "./chunk-UGW3QIBN.js";
import "./chunk-6SFSL73L.js";
import "./chunk-6KXFZ5QA.js";
import "./chunk-BVKIQNMX.js";
import "./chunk-QRMDTNZD.js";
import "./chunk-VUYQSG2J.js";
import "./chunk-7H2DGG6R.js";
import "./chunk-U5II5HHJ.js";
import "./chunk-U7JXVVLV.js";
import "./chunk-TP5SG6V2.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  provideDefaults,
  useRender
} from "./chunk-3PQ7XZCE.js";
import {
  createVNode,
  toRef
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VToolbar/VToolbarItems.mjs
var makeVToolbarItemsProps = propsFactory({
  ...makeComponentProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VToolbarItems");
var VToolbarItems = genericComponent()({
  name: "VToolbarItems",
  props: makeVToolbarItemsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    provideDefaults({
      VBtn: {
        color: toRef(props, "color"),
        height: "inherit",
        variant: toRef(props, "variant")
      }
    });
    useRender(() => {
      var _a;
      return createVNode("div", {
        "class": ["v-toolbar-items", props.class],
        "style": props.style
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    });
    return {};
  }
});
export {
  VToolbar,
  VToolbarItems,
  VToolbarTitle
};
//# sourceMappingURL=vuetify_lib_components_VToolbar_index__mjs.js.map
