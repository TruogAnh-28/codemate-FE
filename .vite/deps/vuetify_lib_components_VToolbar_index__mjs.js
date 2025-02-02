import {
  VToolbar,
  VToolbarTitle
} from "./chunk-IH33BDQO.js";
import "./chunk-2RGHPH2B.js";
import "./chunk-PZ66FD5O.js";
import {
  makeVariantProps
} from "./chunk-LJ4IMYQU.js";
import "./chunk-SUEUCYKG.js";
import "./chunk-572KT7UG.js";
import "./chunk-W33P7CXP.js";
import "./chunk-ZC6VOQCQ.js";
import "./chunk-3ITINNO3.js";
import "./chunk-UAWZA7KV.js";
import "./chunk-NQNZCBGM.js";
import "./chunk-HCIWNCCT.js";
import "./chunk-TP5SG6V2.js";
import "./chunk-OPGBKIHZ.js";
import "./chunk-3MLMI5NR.js";
import "./chunk-DNZVU6LE.js";
import "./chunk-5SNBRTN6.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  provideDefaults,
  useRender
} from "./chunk-6PPR34VZ.js";
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
