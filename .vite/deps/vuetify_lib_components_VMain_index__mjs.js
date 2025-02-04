import {
  useSsrBoot
} from "./chunk-GXYLEPDC.js";
import {
  makeDimensionProps,
  useDimension
} from "./chunk-IOMX4THI.js";
import {
  makeTagProps
} from "./chunk-KQMOYNAH.js";
import {
  useLayout
} from "./chunk-R57R4RMC.js";
import "./chunk-PVYEV7FC.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-7ZHHBHXU.js";
import {
  createVNode
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VMain/VMain.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VMain/VMain.css";
var makeVMainProps = propsFactory({
  scrollable: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps({
    tag: "main"
  })
}, "VMain");
var VMain = genericComponent()({
  name: "VMain",
  props: makeVMainProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      mainStyles
    } = useLayout();
    const {
      ssrBootStyles
    } = useSsrBoot();
    useRender(() => createVNode(props.tag, {
      "class": ["v-main", {
        "v-main--scrollable": props.scrollable
      }, props.class],
      "style": [mainStyles.value, ssrBootStyles.value, dimensionStyles.value, props.style]
    }, {
      default: () => {
        var _a, _b;
        return [props.scrollable ? createVNode("div", {
          "class": "v-main__scroller"
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]) : (_b = slots.default) == null ? void 0 : _b.call(slots)];
      }
    }));
    return {};
  }
});
export {
  VMain
};
//# sourceMappingURL=vuetify_lib_components_VMain_index__mjs.js.map
