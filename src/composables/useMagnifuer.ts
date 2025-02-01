import { computed, type MaybeRefOrGetter, reactive, Reactive, Ref, toRef } from 'vue'
import { type MaybeElementRef, useMouseInElement } from '@vueuse/core'
import type { MagnifuerPosition, MagnifuerSize, MagnifuerPointer } from '@/types'

export interface UseMagnifuerOptions {
  allowOverflow?: MaybeRefOrGetter<boolean>
}

export interface UseMagnifuerState extends MagnifuerPosition {
  scale: number
  absolute: MagnifuerPosition
  pointer: MagnifuerPointer
  size: MagnifuerSize
  containerSize: MagnifuerSize
  areaSize: MagnifuerSize
}

function useMagnifuer (
  container: MaybeElementRef,
  scale: MaybeRefOrGetter<number>,
  size: MagnifuerSize<MaybeRefOrGetter<number>>,
  options?: UseMagnifuerOptions
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
    elementHeight: containerHeight,
    isOutside: isPointerOutside
  } = useMouseInElement(container)
  const pointer = reactive({
    x: pointerX,
    y: pointerY,
    absolute: {
      x: pointerAbsoluteX,
      y: pointerAbsoluteY
    },
    isOutside: isPointerOutside
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
