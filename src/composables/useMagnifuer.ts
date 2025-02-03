import { computed, type MaybeRef, type MaybeRefOrGetter, reactive, type Reactive, type Ref, toRef } from 'vue'
import { useElementHover, useMouseInElement } from '@vueuse/core'
import type { MagnifuerPosition, MagnifuerSize } from '@/types'

export interface UseMagnifuerOptions {
  /**
   * Allow the magnifying area to overflow the container
   *
   * @default false
   */
  allowOverflow?: MaybeRefOrGetter<boolean>
}

export interface MagnifuerPointer extends MagnifuerPosition {
  /**
   * Absolute position of the pointer in px
   */
  absolute: MagnifuerPosition
  /**
   * Whether the pointer is inside the container
   */
  isInside: boolean
}

export interface UseMagnifuerState {
  /**
   * Current scale value
   */
  scale: number
  /**
   * Current position of the magnifier on X axis relative to container width as a fractional value (0-1)
   */
  x: number
  /**
   * Current position of the magnifier on Y axis relative to container height as a fractional value (0-1)
   */
  y: number
  /**
   * Absolute position of the magnifier relative to the container in px
   */
  absolute: MagnifuerPosition
  /**
   * Pointer state relative to the container
   */
  pointer: MagnifuerPointer
  /**
   * Size of the magnifier in px
   */
  size: MagnifuerSize
  /**
   * Size of the container in px
   */
  containerSize: MagnifuerSize
  /**
   * Size of the magnifying area in px
   */
  areaSize: MagnifuerSize
}

/**
 * Utility composable for making custom magnifying-glass-style component.
 * Provides all the essential calculations updated in real-time for positioning the elements.
 *
 * @param container Reference to the container element whose content is to be magnified
 * @param scale Scale value
 * @param size Size of the magnifier in px
 * @param options Additional options
 */
function useMagnifuer (
  container: MaybeRef<HTMLElement | null | undefined>,
  scale: MaybeRefOrGetter<number>,
  size: MagnifuerSize<MaybeRefOrGetter<number>>,
  options: UseMagnifuerOptions = {}
): Reactive<UseMagnifuerState> {
  const currentScale: Ref<number> = toRef(scale)
  const computedSize = reactive({
    width: toRef(size.width),
    height: toRef(size.height)
  })
  const allowOverflow: Ref<boolean> = toRef(options?.allowOverflow ?? false)

  const {
    elementX: pointerX,
    elementY: pointerY,
    x: pointerAbsoluteX,
    y: pointerAbsoluteY,
    elementWidth: containerWidth,
    elementHeight: containerHeight
  } = useMouseInElement(container)
  const pointer = reactive({
    x: pointerX,
    y: pointerY,
    absolute: {
      x: pointerAbsoluteX,
      y: pointerAbsoluteY
    },
    isInside: useElementHover(container)
  })
  const containerSize = reactive({
    width: containerWidth,
    height: containerHeight
  })

  const magnifierAreaSize = reactive({
    width: computed(() => computedSize.width / currentScale.value),
    height: computed(() => computedSize.height / currentScale.value)
  })

  const magnifierContainerPosition = reactive({
    x: computed(
      () => {
        if (allowOverflow.value) return pointer.x

        return Math.max(
          magnifierAreaSize.width / 2,
          Math.min(
            containerSize.width - magnifierAreaSize.width / 2,
            pointer.x
          )
        )
      }
    ),
    y: computed(
      () => {
        if (allowOverflow.value) return pointer.y

        return Math.max(
          magnifierAreaSize.height / 2,
          Math.min(
            containerSize.height - magnifierAreaSize.height / 2,
            pointer.y
          )
        )
      }
    )
  })

  return reactive({
    scale: currentScale,
    x: computed(() => magnifierContainerPosition.x / containerSize.width),
    y: computed(() => magnifierContainerPosition.y / containerSize.height),
    absolute: magnifierContainerPosition,
    pointer,
    size: computedSize,
    containerSize,
    areaSize: magnifierAreaSize
  })
}

export default useMagnifuer
