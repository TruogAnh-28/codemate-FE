import "./chunk-2PSEIA2V.js";
import {
  VBtn
} from "./chunk-SHRKJSJS.js";
import "./chunk-DNTQL5EA.js";
import "./chunk-U4CDQZPL.js";
import "./chunk-IBNRTJ2F.js";
import "./chunk-DB2YRNXL.js";
import "./chunk-IDXYNXDM.js";
import "./chunk-4AM27EJJ.js";
import {
  makeDensityProps
} from "./chunk-DNVMGE2E.js";
import "./chunk-4E3GKBEK.js";
import "./chunk-Y2GC5DK2.js";
import "./chunk-QNNQBKZ4.js";
import "./chunk-TXI77NTR.js";
import "./chunk-W4YUM6IS.js";
import "./chunk-2SMYUG2D.js";
import "./chunk-D3VMBXOB.js";
import "./chunk-IOMX4THI.js";
import "./chunk-JOZZHMQ6.js";
import "./chunk-EWWA6K3J.js";
import {
  makeSizeProps
} from "./chunk-7URWXHLF.js";
import {
  makeTagProps
} from "./chunk-KQMOYNAH.js";
import "./chunk-XE77TUOP.js";
import {
  IconValue
} from "./chunk-LLPFESVU.js";
import {
  useLocale
} from "./chunk-2ON55NUK.js";
import {
  useProxiedModel
} from "./chunk-HGHZAKZY.js";
import "./chunk-TP5SG6V2.js";
import "./chunk-PVYEV7FC.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-IMFWK6WZ.js";
import {
  clamp,
  createRange,
  genericComponent,
  getUid,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-7ZHHBHXU.js";
import {
  Fragment,
  computed,
  createTextVNode,
  createVNode,
  mergeProps,
  shallowRef
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VRating/VRating.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VRating/VRating.css";
var makeVRatingProps = propsFactory({
  name: String,
  itemAriaLabel: {
    type: String,
    default: "$vuetify.rating.ariaLabel.item"
  },
  activeColor: String,
  color: String,
  clearable: Boolean,
  disabled: Boolean,
  emptyIcon: {
    type: IconValue,
    default: "$ratingEmpty"
  },
  fullIcon: {
    type: IconValue,
    default: "$ratingFull"
  },
  halfIncrements: Boolean,
  hover: Boolean,
  length: {
    type: [Number, String],
    default: 5
  },
  readonly: Boolean,
  modelValue: {
    type: [Number, String],
    default: 0
  },
  itemLabels: Array,
  itemLabelPosition: {
    type: String,
    default: "top",
    validator: (v) => ["top", "bottom"].includes(v)
  },
  ripple: Boolean,
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VRating");
var VRating = genericComponent()({
  name: "VRating",
  props: makeVRatingProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      themeClasses
    } = provideTheme(props);
    const rating = useProxiedModel(props, "modelValue");
    const normalizedValue = computed(() => clamp(parseFloat(rating.value), 0, +props.length));
    const range = computed(() => createRange(Number(props.length), 1));
    const increments = computed(() => range.value.flatMap((v) => props.halfIncrements ? [v - 0.5, v] : [v]));
    const hoverIndex = shallowRef(-1);
    const itemState = computed(() => increments.value.map((value) => {
      const isHovering = props.hover && hoverIndex.value > -1;
      const isFilled = normalizedValue.value >= value;
      const isHovered = hoverIndex.value >= value;
      const isFullIcon = isHovering ? isHovered : isFilled;
      const icon = isFullIcon ? props.fullIcon : props.emptyIcon;
      const activeColor = props.activeColor ?? props.color;
      const color = isFilled || isHovered ? activeColor : props.color;
      return {
        isFilled,
        isHovered,
        icon,
        color
      };
    }));
    const eventState = computed(() => [0, ...increments.value].map((value) => {
      function onMouseenter() {
        hoverIndex.value = value;
      }
      function onMouseleave() {
        hoverIndex.value = -1;
      }
      function onClick() {
        if (props.disabled || props.readonly) return;
        rating.value = normalizedValue.value === value && props.clearable ? 0 : value;
      }
      return {
        onMouseenter: props.hover ? onMouseenter : void 0,
        onMouseleave: props.hover ? onMouseleave : void 0,
        onClick
      };
    }));
    const name = computed(() => props.name ?? `v-rating-${getUid()}`);
    function VRatingItem(_ref2) {
      var _a, _b;
      let {
        value,
        index,
        showStar = true
      } = _ref2;
      const {
        onMouseenter,
        onMouseleave,
        onClick
      } = eventState.value[index + 1];
      const id = `${name.value}-${String(value).replace(".", "-")}`;
      const btnProps = {
        color: (_a = itemState.value[index]) == null ? void 0 : _a.color,
        density: props.density,
        disabled: props.disabled,
        icon: (_b = itemState.value[index]) == null ? void 0 : _b.icon,
        ripple: props.ripple,
        size: props.size,
        variant: "plain"
      };
      return createVNode(Fragment, null, [createVNode("label", {
        "for": id,
        "class": {
          "v-rating__item--half": props.halfIncrements && value % 1 > 0,
          "v-rating__item--full": props.halfIncrements && value % 1 === 0
        },
        "onMouseenter": onMouseenter,
        "onMouseleave": onMouseleave,
        "onClick": onClick
      }, [createVNode("span", {
        "class": "v-rating__hidden"
      }, [t(props.itemAriaLabel, value, props.length)]), !showStar ? void 0 : slots.item ? slots.item({
        ...itemState.value[index],
        props: btnProps,
        value,
        index,
        rating: normalizedValue.value
      }) : createVNode(VBtn, mergeProps({
        "aria-label": t(props.itemAriaLabel, value, props.length)
      }, btnProps), null)]), createVNode("input", {
        "class": "v-rating__hidden",
        "name": name.value,
        "id": id,
        "type": "radio",
        "value": value,
        "checked": normalizedValue.value === value,
        "tabindex": -1,
        "readonly": props.readonly,
        "disabled": props.disabled
      }, null)]);
    }
    function createLabel(labelProps) {
      if (slots["item-label"]) return slots["item-label"](labelProps);
      if (labelProps.label) return createVNode("span", null, [labelProps.label]);
      return createVNode("span", null, [createTextVNode(" ")]);
    }
    useRender(() => {
      var _a;
      const hasLabels = !!((_a = props.itemLabels) == null ? void 0 : _a.length) || slots["item-label"];
      return createVNode(props.tag, {
        "class": ["v-rating", {
          "v-rating--hover": props.hover,
          "v-rating--readonly": props.readonly
        }, themeClasses.value, props.class],
        "style": props.style
      }, {
        default: () => [createVNode(VRatingItem, {
          "value": 0,
          "index": -1,
          "showStar": false
        }, null), range.value.map((value, i) => {
          var _a2, _b;
          return createVNode("div", {
            "class": "v-rating__wrapper"
          }, [hasLabels && props.itemLabelPosition === "top" ? createLabel({
            value,
            index: i,
            label: (_a2 = props.itemLabels) == null ? void 0 : _a2[i]
          }) : void 0, createVNode("div", {
            "class": "v-rating__item"
          }, [props.halfIncrements ? createVNode(Fragment, null, [createVNode(VRatingItem, {
            "value": value - 0.5,
            "index": i * 2
          }, null), createVNode(VRatingItem, {
            "value": value,
            "index": i * 2 + 1
          }, null)]) : createVNode(VRatingItem, {
            "value": value,
            "index": i
          }, null)]), hasLabels && props.itemLabelPosition === "bottom" ? createLabel({
            value,
            index: i,
            label: (_b = props.itemLabels) == null ? void 0 : _b[i]
          }) : void 0]);
        })]
      });
    });
    return {};
  }
});
export {
  VRating
};
//# sourceMappingURL=vuetify_lib_components_VRating_index__mjs.js.map
