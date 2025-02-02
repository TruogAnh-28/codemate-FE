import {
  useTextColor
} from "./chunk-5SNBRTN6.js";
import {
  genericComponent,
  getPropertyFromItem,
  getUid,
  propsFactory,
  useRender
} from "./chunk-6PPR34VZ.js";
import {
  Fragment,
  computed,
  createVNode,
  mergeProps,
  nextTick,
  ref,
  toRef,
  watch
} from "./chunk-IJV5NOMV.js";
import "./chunk-UVKRO5ER.js";

// node_modules/vuetify/lib/components/VSparkline/util/line.mjs
var makeLineProps = propsFactory({
  autoDraw: Boolean,
  autoDrawDuration: [Number, String],
  autoDrawEasing: {
    type: String,
    default: "ease"
  },
  color: String,
  gradient: {
    type: Array,
    default: () => []
  },
  gradientDirection: {
    type: String,
    validator: (val) => ["top", "bottom", "left", "right"].includes(val),
    default: "top"
  },
  height: {
    type: [String, Number],
    default: 75
  },
  labels: {
    type: Array,
    default: () => []
  },
  labelSize: {
    type: [Number, String],
    default: 7
  },
  lineWidth: {
    type: [String, Number],
    default: 4
  },
  id: String,
  itemValue: {
    type: String,
    default: "value"
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  min: [String, Number],
  max: [String, Number],
  padding: {
    type: [String, Number],
    default: 8
  },
  showLabels: Boolean,
  smooth: [Boolean, String, Number],
  width: {
    type: [Number, String],
    default: 300
  }
}, "Line");

// node_modules/vuetify/lib/components/VSparkline/VBarline.mjs
var makeVBarlineProps = propsFactory({
  autoLineWidth: Boolean,
  ...makeLineProps()
}, "VBarline");
var VBarline = genericComponent()({
  name: "VBarline",
  props: makeVBarlineProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const uid = getUid();
    const id = computed(() => props.id || `barline-${uid}`);
    const autoDrawDuration = computed(() => Number(props.autoDrawDuration) || 500);
    const hasLabels = computed(() => {
      return Boolean(props.showLabels || props.labels.length > 0 || !!(slots == null ? void 0 : slots.label));
    });
    const lineWidth = computed(() => parseFloat(props.lineWidth) || 4);
    const totalWidth = computed(() => Math.max(props.modelValue.length * lineWidth.value, Number(props.width)));
    const boundary = computed(() => {
      return {
        minX: 0,
        maxX: totalWidth.value,
        minY: 0,
        maxY: parseInt(props.height, 10)
      };
    });
    const items = computed(() => props.modelValue.map((item) => getPropertyFromItem(item, props.itemValue, item)));
    function genBars(values, boundary2) {
      const {
        minX,
        maxX,
        minY,
        maxY
      } = boundary2;
      const totalValues = values.length;
      let maxValue = props.max != null ? Number(props.max) : Math.max(...values);
      let minValue = props.min != null ? Number(props.min) : Math.min(...values);
      if (minValue > 0 && props.min == null) minValue = 0;
      if (maxValue < 0 && props.max == null) maxValue = 0;
      const gridX = maxX / totalValues;
      const gridY = (maxY - minY) / (maxValue - minValue || 1);
      const horizonY = maxY - Math.abs(minValue * gridY);
      return values.map((value, index) => {
        const height = Math.abs(gridY * value);
        return {
          x: minX + index * gridX,
          y: horizonY - height + +(value < 0) * height,
          height,
          value
        };
      });
    }
    const parsedLabels = computed(() => {
      const labels = [];
      const points = genBars(items.value, boundary.value);
      const len = points.length;
      for (let i = 0; labels.length < len; i++) {
        const item = points[i];
        let value = props.labels[i];
        if (!value) {
          value = typeof item === "object" ? item.value : item;
        }
        labels.push({
          x: item.x,
          value: String(value)
        });
      }
      return labels;
    });
    const bars = computed(() => genBars(items.value, boundary.value));
    const offsetX = computed(() => (Math.abs(bars.value[0].x - bars.value[1].x) - lineWidth.value) / 2);
    const smooth = computed(() => typeof props.smooth === "boolean" ? props.smooth ? 2 : 0 : Number(props.smooth));
    useRender(() => {
      const gradientData = !props.gradient.slice().length ? [""] : props.gradient.slice().reverse();
      return createVNode("svg", {
        "display": "block"
      }, [createVNode("defs", null, [createVNode("linearGradient", {
        "id": id.value,
        "gradientUnits": "userSpaceOnUse",
        "x1": props.gradientDirection === "left" ? "100%" : "0",
        "y1": props.gradientDirection === "top" ? "100%" : "0",
        "x2": props.gradientDirection === "right" ? "100%" : "0",
        "y2": props.gradientDirection === "bottom" ? "100%" : "0"
      }, [gradientData.map((color, index) => createVNode("stop", {
        "offset": index / Math.max(gradientData.length - 1, 1),
        "stop-color": color || "currentColor"
      }, null))])]), createVNode("clipPath", {
        "id": `${id.value}-clip`
      }, [bars.value.map((item) => createVNode("rect", {
        "x": item.x + offsetX.value,
        "y": item.y,
        "width": lineWidth.value,
        "height": item.height,
        "rx": smooth.value,
        "ry": smooth.value
      }, [props.autoDraw && createVNode(Fragment, null, [createVNode("animate", {
        "attributeName": "y",
        "from": item.y + item.height,
        "to": item.y,
        "dur": `${autoDrawDuration.value}ms`,
        "fill": "freeze"
      }, null), createVNode("animate", {
        "attributeName": "height",
        "from": "0",
        "to": item.height,
        "dur": `${autoDrawDuration.value}ms`,
        "fill": "freeze"
      }, null)])]))]), hasLabels.value && createVNode("g", {
        "key": "labels",
        "style": {
          textAnchor: "middle",
          dominantBaseline: "mathematical",
          fill: "currentColor"
        }
      }, [parsedLabels.value.map((item, i) => {
        var _a;
        return createVNode("text", {
          "x": item.x + offsetX.value + lineWidth.value / 2,
          "y": parseInt(props.height, 10) - 2 + (parseInt(props.labelSize, 10) || 7 * 0.75),
          "font-size": Number(props.labelSize) || 7
        }, [((_a = slots.label) == null ? void 0 : _a.call(slots, {
          index: i,
          value: item.value
        })) ?? item.value]);
      })]), createVNode("g", {
        "clip-path": `url(#${id.value}-clip)`,
        "fill": `url(#${id.value})`
      }, [createVNode("rect", {
        "x": 0,
        "y": 0,
        "width": Math.max(props.modelValue.length * lineWidth.value, Number(props.width)),
        "height": props.height
      }, null)])]);
    });
  }
});

// node_modules/vuetify/lib/components/VSparkline/util/path.mjs
function genPath(points, radius) {
  let fill = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  let height = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 75;
  if (points.length === 0) return "";
  const start = points.shift();
  const end = points[points.length - 1];
  return (fill ? `M${start.x} ${height - start.x + 2} L${start.x} ${start.y}` : `M${start.x} ${start.y}`) + points.map((point, index) => {
    const next = points[index + 1];
    const prev = points[index - 1] || start;
    const isCollinear = next && checkCollinear(next, point, prev);
    if (!next || isCollinear) {
      return `L${point.x} ${point.y}`;
    }
    const threshold = Math.min(getDistance(prev, point), getDistance(next, point));
    const isTooCloseForRadius = threshold / 2 < radius;
    const radiusForPoint = isTooCloseForRadius ? threshold / 2 : radius;
    const before = moveTo(prev, point, radiusForPoint);
    const after = moveTo(next, point, radiusForPoint);
    return `L${before.x} ${before.y}S${point.x} ${point.y} ${after.x} ${after.y}`;
  }).join("") + (fill ? `L${end.x} ${height - start.x + 2} Z` : "");
}
function int(value) {
  return parseInt(value, 10);
}
function checkCollinear(p0, p1, p2) {
  return int(p0.x + p2.x) === int(2 * p1.x) && int(p0.y + p2.y) === int(2 * p1.y);
}
function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
function moveTo(to, from, radius) {
  const vector = {
    x: to.x - from.x,
    y: to.y - from.y
  };
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  const unitVector = {
    x: vector.x / length,
    y: vector.y / length
  };
  return {
    x: from.x + unitVector.x * radius,
    y: from.y + unitVector.y * radius
  };
}

// node_modules/vuetify/lib/components/VSparkline/VTrendline.mjs
var makeVTrendlineProps = propsFactory({
  fill: Boolean,
  ...makeLineProps()
}, "VTrendline");
var VTrendline = genericComponent()({
  name: "VTrendline",
  props: makeVTrendlineProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const uid = getUid();
    const id = computed(() => props.id || `trendline-${uid}`);
    const autoDrawDuration = computed(() => Number(props.autoDrawDuration) || (props.fill ? 500 : 2e3));
    const lastLength = ref(0);
    const path = ref(null);
    function genPoints(values, boundary2) {
      const {
        minX,
        maxX,
        minY,
        maxY
      } = boundary2;
      const totalValues = values.length;
      const maxValue = props.max != null ? Number(props.max) : Math.max(...values);
      const minValue = props.min != null ? Number(props.min) : Math.min(...values);
      const gridX = (maxX - minX) / (totalValues - 1);
      const gridY = (maxY - minY) / (maxValue - minValue || 1);
      return values.map((value, index) => {
        return {
          x: minX + index * gridX,
          y: maxY - (value - minValue) * gridY,
          value
        };
      });
    }
    const hasLabels = computed(() => {
      return Boolean(props.showLabels || props.labels.length > 0 || !!(slots == null ? void 0 : slots.label));
    });
    const lineWidth = computed(() => {
      return parseFloat(props.lineWidth) || 4;
    });
    const totalWidth = computed(() => Number(props.width));
    const boundary = computed(() => {
      const padding = Number(props.padding);
      return {
        minX: padding,
        maxX: totalWidth.value - padding,
        minY: padding,
        maxY: parseInt(props.height, 10) - padding
      };
    });
    const items = computed(() => props.modelValue.map((item) => getPropertyFromItem(item, props.itemValue, item)));
    const parsedLabels = computed(() => {
      const labels = [];
      const points = genPoints(items.value, boundary.value);
      const len = points.length;
      for (let i = 0; labels.length < len; i++) {
        const item = points[i];
        let value = props.labels[i];
        if (!value) {
          value = typeof item === "object" ? item.value : item;
        }
        labels.push({
          x: item.x,
          value: String(value)
        });
      }
      return labels;
    });
    watch(() => props.modelValue, async () => {
      await nextTick();
      if (!props.autoDraw || !path.value) return;
      const pathRef = path.value;
      const length = pathRef.getTotalLength();
      if (!props.fill) {
        pathRef.style.strokeDasharray = `${length}`;
        pathRef.style.strokeDashoffset = `${length}`;
        pathRef.getBoundingClientRect();
        pathRef.style.transition = `stroke-dashoffset ${autoDrawDuration.value}ms ${props.autoDrawEasing}`;
        pathRef.style.strokeDashoffset = "0";
      } else {
        pathRef.style.transformOrigin = "bottom center";
        pathRef.style.transition = "none";
        pathRef.style.transform = `scaleY(0)`;
        pathRef.getBoundingClientRect();
        pathRef.style.transition = `transform ${autoDrawDuration.value}ms ${props.autoDrawEasing}`;
        pathRef.style.transform = `scaleY(1)`;
      }
      lastLength.value = length;
    }, {
      immediate: true
    });
    function genPath2(fill) {
      const smoothValue = typeof props.smooth === "boolean" ? props.smooth ? 8 : 0 : Number(props.smooth);
      return genPath(genPoints(items.value, boundary.value), smoothValue, fill, parseInt(props.height, 10));
    }
    useRender(() => {
      var _a;
      const gradientData = !props.gradient.slice().length ? [""] : props.gradient.slice().reverse();
      return createVNode("svg", {
        "display": "block",
        "stroke-width": parseFloat(props.lineWidth) ?? 4
      }, [createVNode("defs", null, [createVNode("linearGradient", {
        "id": id.value,
        "gradientUnits": "userSpaceOnUse",
        "x1": props.gradientDirection === "left" ? "100%" : "0",
        "y1": props.gradientDirection === "top" ? "100%" : "0",
        "x2": props.gradientDirection === "right" ? "100%" : "0",
        "y2": props.gradientDirection === "bottom" ? "100%" : "0"
      }, [gradientData.map((color, index) => createVNode("stop", {
        "offset": index / Math.max(gradientData.length - 1, 1),
        "stop-color": color || "currentColor"
      }, null))])]), hasLabels.value && createVNode("g", {
        "key": "labels",
        "style": {
          textAnchor: "middle",
          dominantBaseline: "mathematical",
          fill: "currentColor"
        }
      }, [parsedLabels.value.map((item, i) => {
        var _a2;
        return createVNode("text", {
          "x": item.x + lineWidth.value / 2 + lineWidth.value / 2,
          "y": parseInt(props.height, 10) - 4 + (parseInt(props.labelSize, 10) || 7 * 0.75),
          "font-size": Number(props.labelSize) || 7
        }, [((_a2 = slots.label) == null ? void 0 : _a2.call(slots, {
          index: i,
          value: item.value
        })) ?? item.value]);
      })]), createVNode("path", {
        "ref": path,
        "d": genPath2(props.fill),
        "fill": props.fill ? `url(#${id.value})` : "none",
        "stroke": props.fill ? "none" : `url(#${id.value})`
      }, null), props.fill && createVNode("path", {
        "d": genPath2(false),
        "fill": "none",
        "stroke": props.color ?? ((_a = props.gradient) == null ? void 0 : _a[0])
      }, null)]);
    });
  }
});

// node_modules/vuetify/lib/components/VSparkline/VSparkline.mjs
var makeVSparklineProps = propsFactory({
  type: {
    type: String,
    default: "trend"
  },
  ...makeVBarlineProps(),
  ...makeVTrendlineProps()
}, "VSparkline");
var VSparkline = genericComponent()({
  name: "VSparkline",
  props: makeVSparklineProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "color"));
    const hasLabels = computed(() => {
      return Boolean(props.showLabels || props.labels.length > 0 || !!(slots == null ? void 0 : slots.label));
    });
    const totalHeight = computed(() => {
      let height = parseInt(props.height, 10);
      if (hasLabels.value) height += parseInt(props.labelSize, 10) * 1.5;
      return height;
    });
    useRender(() => {
      const Tag = props.type === "trend" ? VTrendline : VBarline;
      const lineProps = props.type === "trend" ? VTrendline.filterProps(props) : VBarline.filterProps(props);
      return createVNode(Tag, mergeProps({
        "key": props.type,
        "class": textColorClasses.value,
        "style": textColorStyles.value,
        "viewBox": `0 0 ${props.width} ${parseInt(totalHeight.value, 10)}`
      }, lineProps), slots);
    });
  }
});
export {
  VSparkline
};
//# sourceMappingURL=vuetify_lib_components_VSparkline_index__mjs.js.map
