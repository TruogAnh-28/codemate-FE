import {
  VToolbar,
  VToolbarTitle
} from "./chunk-N2TUU5ZK.js";
import "./chunk-2XQY4ZPA.js";
import "./chunk-SCOPPOCF.js";
import "./chunk-2OF4BO7E.js";
import "./chunk-4E3GKBEK.js";
import "./chunk-Y2GC5DK2.js";
import {
  makeVariantProps
} from "./chunk-TXI77NTR.js";
import "./chunk-W4YUM6IS.js";
import "./chunk-2SMYUG2D.js";
import "./chunk-IOMX4THI.js";
import "./chunk-OCQPVZMC.js";
import "./chunk-KQMOYNAH.js";
import "./chunk-XE77TUOP.js";
import "./chunk-2ON55NUK.js";
import "./chunk-HGHZAKZY.js";
import "./chunk-TP5SG6V2.js";
import "./chunk-IMFWK6WZ.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  provideDefaults,
  useRender
} from "./chunk-7ZHHBHXU.js";
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
