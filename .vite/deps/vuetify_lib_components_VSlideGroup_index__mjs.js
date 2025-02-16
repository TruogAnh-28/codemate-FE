import {
  VSlideGroup,
  VSlideGroupSymbol
} from "./chunk-73OHAUS3.js";
import "./chunk-OCQPVZMC.js";
import {
  makeGroupItemProps,
  useGroupItem
} from "./chunk-JOZZHMQ6.js";
import "./chunk-EWWA6K3J.js";
import "./chunk-7URWXHLF.js";
import "./chunk-KQMOYNAH.js";
import "./chunk-XE77TUOP.js";
import "./chunk-LLPFESVU.js";
import "./chunk-6Y46KBOX.js";
import "./chunk-CE5S2J4D.js";
import "./chunk-2ON55NUK.js";
import "./chunk-HGHZAKZY.js";
import "./chunk-TP5SG6V2.js";
import "./chunk-PVYEV7FC.js";
import "./chunk-IMFWK6WZ.js";
import {
  genericComponent
} from "./chunk-7ZHHBHXU.js";
import "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VSlideGroup/VSlideGroupItem.mjs
var VSlideGroupItem = genericComponent()({
  name: "VSlideGroupItem",
  props: makeGroupItemProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const slideGroupItem = useGroupItem(props, VSlideGroupSymbol);
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots, {
        isSelected: slideGroupItem.isSelected.value,
        select: slideGroupItem.select,
        toggle: slideGroupItem.toggle,
        selectedClass: slideGroupItem.selectedClass.value
      });
    };
  }
});
export {
  VSlideGroup,
  VSlideGroupItem
};
//# sourceMappingURL=vuetify_lib_components_VSlideGroup_index__mjs.js.map
