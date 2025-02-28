const initDebounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay = 0,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (immediate && !timeout) fn(...args);
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const useDebounce = <T>(
  initialValue: T,
  delay: number,
  immediate: boolean = false
): Ref<T> => {
  const state = ref(initialValue);

  const debouncedReference = customRef<T>((myTrack, myTrigger) => ({
    get() {
      myTrack();
      return state.value;
    },
    set: initDebounce(
      (value: T) => {
        state.value = value;
        myTrigger();
      },
      delay,
      immediate
    ),
  }));

  return debouncedReference;
};

const useDebounceFn = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export default { useDebounce, useDebounceFn };
