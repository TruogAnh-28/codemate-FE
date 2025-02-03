import {
  VToolbar,
  VToolbarTitle
} from "./chunk-TLUDLXTI.js";
import "./chunk-4E6ISGGK.js";
import "./chunk-STKVJM52.js";
import "./chunk-26IEHTVX.js";
import {
  makeVariantProps
} from "./chunk-TF3OHB7L.js";
import "./chunk-LMWX4SRW.js";
import "./chunk-3CU5VKDC.js";
import "./chunk-XCXQWXQX.js";
import "./chunk-4D6CWHFV.js";
import "./chunk-ESYLCOPT.js";
import "./chunk-UUOJC7GH.js";
import "./chunk-4VXDIFS4.js";
import "./chunk-JATTYYQW.js";
import "./chunk-EFWZQNSD.js";
import "./chunk-FB3AKH2O.js";
import "./chunk-TP5SG6V2.js";
import "./chunk-V25JPCJF.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  provideDefaults,
  useRender
} from "./chunk-3BSLPPLE.js";
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
