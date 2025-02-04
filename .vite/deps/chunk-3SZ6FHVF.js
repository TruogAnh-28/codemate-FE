import {
  VImg
} from "./chunk-BRDY2Z2U.js";
import {
  makeDensityProps,
  useDensity
} from "./chunk-DNVMGE2E.js";
import {
  genOverlays,
  makeVariantProps,
  useVariant
} from "./chunk-TXI77NTR.js";
import {
  makeBorderProps,
  useBorder
} from "./chunk-4E3GKBEK.js";
import {
  VDefaultsProvider
} from "./chunk-W4YUM6IS.js";
import {
  VIcon
} from "./chunk-AG66M7BA.js";
import {
  makeSizeProps,
  useSize
} from "./chunk-7URWXHLF.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-2SMYUG2D.js";
import {
  makeTagProps
} from "./chunk-KQMOYNAH.js";
import {
  IconValue
} from "./chunk-LLPFESVU.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-IMFWK6WZ.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-7ZHHBHXU.js";
import {
  createVNode
} from "./chunk-IJV5NOMV.js";

// node_modules/vuetify/lib/components/VAvatar/VAvatar.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VAvatar/VAvatar.css";
var makeVAvatarProps = propsFactory({
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  image: String,
  text: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "flat"
  })
}, "VAvatar");
var VAvatar = genericComponent()({
  name: "VAvatar",
  props: makeVAvatarProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-avatar", {
        "v-avatar--start": props.start,
        "v-avatar--end": props.end
      }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class],
      "style": [colorStyles.value, sizeStyles.value, props.style]
    }, {
      default: () => [!slots.default ? props.image ? createVNode(VImg, {
        "key": "image",
        "src": props.image,
        "alt": "",
        "cover": true
      }, null) : props.icon ? createVNode(VIcon, {
        "key": "icon",
        "icon": props.icon
      }, null) : props.text : createVNode(VDefaultsProvider, {
        "key": "content-defaults",
        "defaults": {
          VImg: {
            cover: true,
            src: props.image
          },
          VIcon: {
            icon: props.icon
          }
        }
      }, {
        default: () => [slots.default()]
      }), genOverlays(false, "v-avatar")]
    }));
    return {};
  }
});

export {
  VAvatar
};
//# sourceMappingURL=chunk-3SZ6FHVF.js.map
