import { computed, type MaybeRefOrGetter, type Ref, toValue, watch } from 'vue'

export interface UseMagnifuerScaleOptions {
  /**
   * Minimal scale value
   *
   * @default 1
   */
  min?: MaybeRefOrGetter<number | undefined>
  /**
   * Maximal scale value
   *
   * @default 10
   */
  max?: MaybeRefOrGetter<number | undefined>
  /**
   * Speed for the default scale step function
   *
   * @default 1.3
   */
  speed?: MaybeRefOrGetter<number | undefined>
  /**
   * Scale computation function on step
   *
   * @default (current, direction) => current * Math.pow(speed, direction)
   */
  step?: (current: number, direction: number) => number
}

export interface UseMagnifuerScaleReturn {
  scale: Ref<number>
  alter: (value: number) => void
  onWheel: (event: WheelEvent) => void
}

function useMagnifuerScale (
  scale: Ref<number>,
  options: UseMagnifuerScaleOptions
): UseMagnifuerScaleReturn {
  const min = computed(() => toValue(options.min) ?? 1)
  const max = computed(() => toValue(options.max) ?? 10)
  const secureScale = (value: number) => Math.max(
    1,
    min.value,
    Math.min(
      max.value,
      value
    )
  )

  const safeScale = computed({
    get: () => secureScale(scale.value),
    set: value => {
      scale.value = secureScale(value)
    }
  })
  watch([min, max], () => {
    scale.value = safeScale.value
  })

  function alter (value: number): void {
    const speed = toValue(options.speed) ?? 1.3
    const step = options.step ?? ((current: number, direction: number) => current * Math.pow(speed, direction))
    safeScale.value = step(safeScale.value, value)
  }

  function onWheel (event: WheelEvent): void {
    alter(event.deltaY > 0 ? -1 : 1)
    event.preventDefault()
    event.stopPropagation()
  }

  return {
    scale: safeScale,
    alter,
    onWheel
  }
}

export default useMagnifuerScale
