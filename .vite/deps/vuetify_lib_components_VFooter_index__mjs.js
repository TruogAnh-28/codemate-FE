import {
  makeElevationProps,
  useElevation
} from "./chunk-PZ66FD5O.js";
import {
  makeLayoutItemProps,
  useLayoutItem
} from "./chunk-LPTSBRX4.js";
import {
  useResizeObserver
} from "./chunk-LTUSW5DL.js";
import {
  makeBorderProps,
  useBorder
} from "./chunk-W33P7CXP.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-3ITINNO3.js";
import {
  makeTagProps
} from "./chunk-UAWZA7KV.js";
import {
  useToggleScope
} from "./chunk-TP5SG6V2.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-DNZVU6LE.js";
import {
  useBackgroundColor
} from "./chunk-5SNBRTN6.js";
import {
  convertToUnit,
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-6PPR34VZ.js";
import {
  computed,
  createVNode,
  ref,
  shallowRef,
  toRef,
  watchEffect
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VFooter/VFooter.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VFooter/VFooter.css";
var makeVFooterProps = propsFactory({
  app: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: "auto"
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "footer"
  }),
  ...makeThemeProps()
}, "VFooter");
var VFooter = genericComponent()({
  name: "VFooter",
  props: makeVFooterProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const layoutItemStyles = ref();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const autoHeight = shallowRef(32);
    const {
      resizeRef
    } = useResizeObserver((entries) => {
      if (!entries.length) return;
      autoHeight.value = entries[0].target.clientHeight;
    });
    const height = computed(() => props.height === "auto" ? autoHeight.value : parseInt(props.height, 10));
    useToggleScope(() => props.app, () => {
      const layout = useLayoutItem({
        id: props.name,
        order: computed(() => parseInt(props.order, 10)),
        position: computed(() => "bottom"),
        layoutSize: height,
        elementSize: computed(() => props.height === "auto" ? void 0 : height.value),
        active: computed(() => props.app),
        absolute: toRef(props, "absolute")
      });
      watchEffect(() => {
        layoutItemStyles.value = layout.layoutItemStyles.value;
      });
    });
    useRender(() => createVNode(props.tag, {
      "ref": resizeRef,
      "class": ["v-footer", themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, props.app ? layoutItemStyles.value : {
        height: convertToUnit(props.height)
      }, props.style]
    }, slots));
    return {};
  }
});
export {
  VFooter
};
//# sourceMappingURL=vuetify_lib_components_VFooter_index__mjs.js.map
