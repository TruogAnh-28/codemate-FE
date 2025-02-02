import {
  createLayout,
  makeLayoutProps
} from "./chunk-D3S74BNS.js";
import "./chunk-3NWFQN4N.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-7H2DGG6R.js";
import {
  useRtl
} from "./chunk-U5II5HHJ.js";
import "./chunk-U7JXVVLV.js";
import "./chunk-TP5SG6V2.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-3PQ7XZCE.js";
import {
  createVNode
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VApp/VApp.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VApp/VApp.css";
var makeVAppProps = propsFactory({
  ...makeComponentProps(),
  ...makeLayoutProps({
    fullHeight: true
  }),
  ...makeThemeProps()
}, "VApp");
var VApp = genericComponent()({
  name: "VApp",
  props: makeVAppProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const theme = provideTheme(props);
    const {
      layoutClasses,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout(props);
    const {
      rtlClasses
    } = useRtl();
    useRender(() => {
      var _a;
      return createVNode("div", {
        "ref": layoutRef,
        "class": ["v-application", theme.themeClasses.value, layoutClasses.value, rtlClasses.value, props.class],
        "style": [props.style]
      }, [createVNode("div", {
        "class": "v-application__wrap"
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    });
    return {
      getLayoutItem,
      items,
      theme
    };
  }
});
export {
  VApp
};
//# sourceMappingURL=vuetify_lib_components_VApp_index__mjs.js.map
