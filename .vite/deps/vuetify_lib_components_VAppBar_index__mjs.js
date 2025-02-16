import {
  VToolbar,
  VToolbarTitle,
  makeVToolbarProps,
  makeVToolbarTitleProps
} from "./chunk-N2TUU5ZK.js";
import {
  useSsrBoot
} from "./chunk-GXYLEPDC.js";
import "./chunk-2XQY4ZPA.js";
import "./chunk-SCOPPOCF.js";
import "./chunk-2OF4BO7E.js";
import {
  VBtn,
  makeVBtnProps
} from "./chunk-SHRKJSJS.js";
import "./chunk-DNTQL5EA.js";
import "./chunk-U4CDQZPL.js";
import "./chunk-IBNRTJ2F.js";
import "./chunk-DB2YRNXL.js";
import "./chunk-IDXYNXDM.js";
import "./chunk-4AM27EJJ.js";
import "./chunk-DNVMGE2E.js";
import "./chunk-4E3GKBEK.js";
import "./chunk-Y2GC5DK2.js";
import "./chunk-QNNQBKZ4.js";
import "./chunk-TXI77NTR.js";
import "./chunk-W4YUM6IS.js";
import "./chunk-2SMYUG2D.js";
import "./chunk-D3VMBXOB.js";
import "./chunk-IOMX4THI.js";
import "./chunk-OCQPVZMC.js";
import "./chunk-JOZZHMQ6.js";
import "./chunk-EWWA6K3J.js";
import "./chunk-7URWXHLF.js";
import "./chunk-KQMOYNAH.js";
import "./chunk-XE77TUOP.js";
import "./chunk-LLPFESVU.js";
import {
  makeLayoutItemProps,
  useLayoutItem
} from "./chunk-R57R4RMC.js";
import "./chunk-2ON55NUK.js";
import {
  useProxiedModel
} from "./chunk-HGHZAKZY.js";
import {
  useToggleScope
} from "./chunk-TP5SG6V2.js";
import "./chunk-PVYEV7FC.js";
import "./chunk-IMFWK6WZ.js";
import {
  clamp,
  consoleWarn,
  genericComponent,
  propsFactory,
  useRender
} from "./chunk-7ZHHBHXU.js";
import {
  computed,
  createVNode,
  mergeProps,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRef,
  watch,
  watchEffect
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VAppBar/VAppBar.mjs
import "/home/thi/projects/codemate/frontend/node_modules/vuetify/lib/components/VAppBar/VAppBar.css";

// node_modules/vuetify/lib/composables/scroll.mjs
var makeScrollProps = propsFactory({
  scrollTarget: {
    type: String
  },
  scrollThreshold: {
    type: [String, Number],
    default: 300
  }
}, "scroll");
function useScroll(props) {
  let args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    canScroll
  } = args;
  let previousScroll = 0;
  let previousScrollHeight = 0;
  const target = ref(null);
  const currentScroll = shallowRef(0);
  const savedScroll = shallowRef(0);
  const currentThreshold = shallowRef(0);
  const isScrollActive = shallowRef(false);
  const isScrollingUp = shallowRef(false);
  const scrollThreshold = computed(() => {
    return Number(props.scrollThreshold);
  });
  const scrollRatio = computed(() => {
    return clamp((scrollThreshold.value - currentScroll.value) / scrollThreshold.value || 0);
  });
  const onScroll = () => {
    const targetEl = target.value;
    if (!targetEl || canScroll && !canScroll.value) return;
    previousScroll = currentScroll.value;
    currentScroll.value = "window" in targetEl ? targetEl.pageYOffset : targetEl.scrollTop;
    const currentScrollHeight = targetEl instanceof Window ? document.documentElement.scrollHeight : targetEl.scrollHeight;
    if (previousScrollHeight !== currentScrollHeight) {
      previousScrollHeight = currentScrollHeight;
      return;
    }
    isScrollingUp.value = currentScroll.value < previousScroll;
    currentThreshold.value = Math.abs(currentScroll.value - scrollThreshold.value);
  };
  watch(isScrollingUp, () => {
    savedScroll.value = savedScroll.value || currentScroll.value;
  });
  watch(isScrollActive, () => {
    savedScroll.value = 0;
  });
  onMounted(() => {
    watch(() => props.scrollTarget, (scrollTarget) => {
      var _a;
      const newTarget = scrollTarget ? document.querySelector(scrollTarget) : window;
      if (!newTarget) {
        consoleWarn(`Unable to locate element with identifier ${scrollTarget}`);
        return;
      }
      if (newTarget === target.value) return;
      (_a = target.value) == null ? void 0 : _a.removeEventListener("scroll", onScroll);
      target.value = newTarget;
      target.value.addEventListener("scroll", onScroll, {
        passive: true
      });
    }, {
      immediate: true
    });
  });
  onBeforeUnmount(() => {
    var _a;
    (_a = target.value) == null ? void 0 : _a.removeEventListener("scroll", onScroll);
  });
  canScroll && watch(canScroll, onScroll, {
    immediate: true
  });
  return {
    scrollThreshold,
    currentScroll,
    currentThreshold,
    isScrollActive,
    scrollRatio,
    // required only for testing
    // probably can be removed
    // later (2 chars chlng)
    isScrollingUp,
    savedScroll
  };
}

// node_modules/vuetify/lib/components/VAppBar/VAppBar.mjs
var makeVAppBarProps = propsFactory({
  scrollBehavior: String,
  modelValue: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom"].includes(value)
  },
  ...makeVToolbarProps(),
  ...makeLayoutItemProps(),
  ...makeScrollProps(),
  height: {
    type: [Number, String],
    default: 64
  }
}, "VAppBar");
var VAppBar = genericComponent()({
  name: "VAppBar",
  props: makeVAppBarProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const vToolbarRef = ref();
    const isActive = useProxiedModel(props, "modelValue");
    const scrollBehavior = computed(() => {
      var _a;
      const behavior = new Set(((_a = props.scrollBehavior) == null ? void 0 : _a.split(" ")) ?? []);
      return {
        hide: behavior.has("hide"),
        fullyHide: behavior.has("fully-hide"),
        inverted: behavior.has("inverted"),
        collapse: behavior.has("collapse"),
        elevate: behavior.has("elevate"),
        fadeImage: behavior.has("fade-image")
        // shrink: behavior.has('shrink'),
      };
    });
    const canScroll = computed(() => {
      const behavior = scrollBehavior.value;
      return behavior.hide || behavior.fullyHide || behavior.inverted || behavior.collapse || behavior.elevate || behavior.fadeImage || // behavior.shrink ||
      !isActive.value;
    });
    const {
      currentScroll,
      scrollThreshold,
      isScrollingUp,
      scrollRatio
    } = useScroll(props, {
      canScroll
    });
    const canHide = computed(() => scrollBehavior.value.hide || scrollBehavior.value.fullyHide);
    const isCollapsed = computed(() => props.collapse || scrollBehavior.value.collapse && (scrollBehavior.value.inverted ? scrollRatio.value > 0 : scrollRatio.value === 0));
    const isFlat = computed(() => props.flat || scrollBehavior.value.fullyHide && !isActive.value || scrollBehavior.value.elevate && (scrollBehavior.value.inverted ? currentScroll.value > 0 : currentScroll.value === 0));
    const opacity = computed(() => scrollBehavior.value.fadeImage ? scrollBehavior.value.inverted ? 1 - scrollRatio.value : scrollRatio.value : void 0);
    const height = computed(() => {
      var _a, _b;
      if (scrollBehavior.value.hide && scrollBehavior.value.inverted) return 0;
      const height2 = ((_a = vToolbarRef.value) == null ? void 0 : _a.contentHeight) ?? 0;
      const extensionHeight = ((_b = vToolbarRef.value) == null ? void 0 : _b.extensionHeight) ?? 0;
      if (!canHide.value) return height2 + extensionHeight;
      return currentScroll.value < scrollThreshold.value || scrollBehavior.value.fullyHide ? height2 + extensionHeight : height2;
    });
    useToggleScope(computed(() => !!props.scrollBehavior), () => {
      watchEffect(() => {
        if (canHide.value) {
          if (scrollBehavior.value.inverted) {
            isActive.value = currentScroll.value > scrollThreshold.value;
          } else {
            isActive.value = isScrollingUp.value || currentScroll.value < scrollThreshold.value;
          }
        } else {
          isActive.value = true;
        }
      });
    });
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: toRef(props, "location"),
      layoutSize: height,
      elementSize: shallowRef(void 0),
      active: isActive,
      absolute: toRef(props, "absolute")
    });
    useRender(() => {
      const toolbarProps = VToolbar.filterProps(props);
      return createVNode(VToolbar, mergeProps({
        "ref": vToolbarRef,
        "class": ["v-app-bar", {
          "v-app-bar--bottom": props.location === "bottom"
        }, props.class],
        "style": [{
          ...layoutItemStyles.value,
          "--v-toolbar-image-opacity": opacity.value,
          height: void 0,
          ...ssrBootStyles.value
        }, props.style]
      }, toolbarProps, {
        "collapse": isCollapsed.value,
        "flat": isFlat.value
      }), slots);
    });
    return {};
  }
});

// node_modules/vuetify/lib/components/VAppBar/VAppBarNavIcon.mjs
var makeVAppBarNavIconProps = propsFactory({
  ...makeVBtnProps({
    icon: "$menu",
    variant: "text"
  })
}, "VAppBarNavIcon");
var VAppBarNavIcon = genericComponent()({
  name: "VAppBarNavIcon",
  props: makeVAppBarNavIconProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VBtn, mergeProps(props, {
      "class": ["v-app-bar-nav-icon"]
    }), slots));
    return {};
  }
});

// node_modules/vuetify/lib/components/VAppBar/VAppBarTitle.mjs
var VAppBarTitle = genericComponent()({
  name: "VAppBarTitle",
  props: makeVToolbarTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VToolbarTitle, mergeProps(props, {
      "class": "v-app-bar-title"
    }), slots));
    return {};
  }
});
export {
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle
};
//# sourceMappingURL=vuetify_lib_components_VAppBar_index__mjs.js.map
