import "./chunk-2PSEIA2V.js";
import {
  VBtn
} from "./chunk-KSSTGZFT.js";
import "./chunk-BRAWURO7.js";
import {
  makePositionProps,
  usePosition
} from "./chunk-YC7NQGXL.js";
import "./chunk-F2TZ453U.js";
import "./chunk-STKVJM52.js";
import "./chunk-PG32VENP.js";
import {
  makeElevationProps,
  useElevation
} from "./chunk-26IEHTVX.js";
import "./chunk-L762JSBZ.js";
import {
  genOverlays,
  makeVariantProps,
  useVariant
} from "./chunk-TF3OHB7L.js";
import "./chunk-BZOW6ZJL.js";
import {
  makeDensityProps,
  useDensity
} from "./chunk-Y6EZBCRA.js";
import {
  VIcon
} from "./chunk-XWOOUGWN.js";
import "./chunk-VQ25MJHK.js";
import {
  VDefaultsProvider
} from "./chunk-4D6CWHFV.js";
import {
  makeDimensionProps,
  useDimension
} from "./chunk-ESYLCOPT.js";
import {
  makeLocationProps,
  useLocation
} from "./chunk-3TVS2E4S.js";
import "./chunk-OYVA53NA.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-UUOJC7GH.js";
import {
  useTextColor
} from "./chunk-4VXDIFS4.js";
import {
  makeTagProps
} from "./chunk-JATTYYQW.js";
import "./chunk-GHYVPCL4.js";
import {
  IconValue
} from "./chunk-TPSUBNYI.js";
import {
  useLocale
} from "./chunk-EFWZQNSD.js";
import {
  useProxiedModel
} from "./chunk-FB3AKH2O.js";
import "./chunk-TP5SG6V2.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-V25JPCJF.js";
import {
  createSimpleFunctional,
  genericComponent,
  makeComponentProps,
  propsFactory
} from "./chunk-3BSLPPLE.js";
import {
  computed,
  createVNode,
  mergeProps,
  toRef
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VAlert/VAlert.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VAlert/VAlert.css";

// node_modules/vuetify/lib/components/VAlert/VAlertTitle.mjs
var VAlertTitle = createSimpleFunctional("v-alert-title");

// node_modules/vuetify/lib/components/VAlert/VAlert.mjs
var allowedTypes = ["success", "info", "warning", "error"];
var makeVAlertProps = propsFactory({
  border: {
    type: [Boolean, String],
    validator: (val) => {
      return typeof val === "boolean" || ["top", "end", "bottom", "start"].includes(val);
    }
  },
  borderColor: String,
  closable: Boolean,
  closeIcon: {
    type: IconValue,
    default: "$close"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  icon: {
    type: [Boolean, String, Function, Object],
    default: null
  },
  modelValue: {
    type: Boolean,
    default: true
  },
  prominent: Boolean,
  title: String,
  text: String,
  type: {
    type: String,
    validator: (val) => allowedTypes.includes(val)
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "flat"
  })
}, "VAlert");
var VAlert = genericComponent()({
  name: "VAlert",
  props: makeVAlertProps(),
  emits: {
    "click:close": (e) => true,
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const icon = computed(() => {
      if (props.icon === false) return void 0;
      if (!props.type) return props.icon;
      return props.icon ?? `$${props.type}`;
    });
    const variantProps = computed(() => ({
      color: props.color ?? props.type,
      variant: props.variant
    }));
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "borderColor"));
    const {
      t
    } = useLocale();
    const closeProps = computed(() => ({
      "aria-label": t(props.closeLabel),
      onClick(e) {
        isActive.value = false;
        emit("click:close", e);
      }
    }));
    return () => {
      const hasPrepend = !!(slots.prepend || icon.value);
      const hasTitle = !!(slots.title || props.title);
      const hasClose = !!(slots.close || props.closable);
      return isActive.value && createVNode(props.tag, {
        "class": ["v-alert", props.border && {
          "v-alert--border": !!props.border,
          [`v-alert--border-${props.border === true ? "start" : props.border}`]: true
        }, {
          "v-alert--prominent": props.prominent
        }, themeClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value, props.style],
        "role": "alert"
      }, {
        default: () => {
          var _a, _b;
          return [genOverlays(false, "v-alert"), props.border && createVNode("div", {
            "key": "border",
            "class": ["v-alert__border", textColorClasses.value],
            "style": textColorStyles.value
          }, null), hasPrepend && createVNode("div", {
            "key": "prepend",
            "class": "v-alert__prepend"
          }, [!slots.prepend ? createVNode(VIcon, {
            "key": "prepend-icon",
            "density": props.density,
            "icon": icon.value,
            "size": props.prominent ? 44 : 28
          }, null) : createVNode(VDefaultsProvider, {
            "key": "prepend-defaults",
            "disabled": !icon.value,
            "defaults": {
              VIcon: {
                density: props.density,
                icon: icon.value,
                size: props.prominent ? 44 : 28
              }
            }
          }, slots.prepend)]), createVNode("div", {
            "class": "v-alert__content"
          }, [hasTitle && createVNode(VAlertTitle, {
            "key": "title"
          }, {
            default: () => {
              var _a2;
              return [((_a2 = slots.title) == null ? void 0 : _a2.call(slots)) ?? props.title];
            }
          }), ((_a = slots.text) == null ? void 0 : _a.call(slots)) ?? props.text, (_b = slots.default) == null ? void 0 : _b.call(slots)]), slots.append && createVNode("div", {
            "key": "append",
            "class": "v-alert__append"
          }, [slots.append()]), hasClose && createVNode("div", {
            "key": "close",
            "class": "v-alert__close"
          }, [!slots.close ? createVNode(VBtn, mergeProps({
            "key": "close-btn",
            "icon": props.closeIcon,
            "size": "x-small",
            "variant": "text"
          }, closeProps.value), null) : createVNode(VDefaultsProvider, {
            "key": "close-defaults",
            "defaults": {
              VBtn: {
                icon: props.closeIcon,
                size: "x-small",
                variant: "text"
              }
            }
          }, {
            default: () => {
              var _a2;
              return [(_a2 = slots.close) == null ? void 0 : _a2.call(slots, {
                props: closeProps.value
              })];
            }
          })])];
        }
      });
    };
  }
});
export {
  VAlert,
  VAlertTitle
};
//# sourceMappingURL=vuetify_lib_components_VAlert_index__mjs.js.map
