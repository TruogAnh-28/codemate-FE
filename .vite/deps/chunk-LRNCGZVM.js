import {
  VImg
} from "./chunk-EPJP2ZU7.js";
import {
  makeBorderProps,
  useBorder
} from "./chunk-4JX4XPLT.js";
import {
  genOverlays,
  makeVariantProps,
  useVariant
} from "./chunk-BFPZT6CI.js";
import {
  makeDensityProps,
  useDensity
} from "./chunk-3TBKGRGC.js";
import {
  VIcon
} from "./chunk-JAVNC4G7.js";
import {
  makeSizeProps,
  useSize
} from "./chunk-HW2HDGJC.js";
import {
  IconValue
} from "./chunk-KH7S2UVC.js";
import {
  VDefaultsProvider
} from "./chunk-UGW3QIBN.js";
import {
  makeRoundedProps,
  useRounded
} from "./chunk-6SFSL73L.js";
import {
  makeTagProps
} from "./chunk-6KXFZ5QA.js";
import {
  makeThemeProps,
  provideTheme
} from "./chunk-7H2DGG6R.js";
import {
  genericComponent,
  makeComponentProps,
  propsFactory,
  useRender
} from "./chunk-3PQ7XZCE.js";
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
//# sourceMappingURL=chunk-LRNCGZVM.js.map
