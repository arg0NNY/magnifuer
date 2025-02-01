<template>
  <div
    ref="containerRef"
    class="magnifuer"
    @wheel="onWheel"
  >
    <slot :size="containerSize">
      <img
        v-if="img"
        v-bind="img"
        :src="computedSrc.default"
      >
    </slot>

    <div
      v-if="magnifier.active"
      class="magnifuer__area-container"
      :style="{
        width: px(magnifierAreaSize.width),
        height: px(magnifierAreaSize.height),
        transform: [
          `translate(-50%, -50%)`,
          `translate(${magnifierContainerPosition.x}px, ${magnifierContainerPosition.y}px)`
        ].join(' ')
      }"
    >
      <slot
        name="area"
        :size="magnifierAreaSize"
      >
        <div class="magnifuer__area" />
      </slot>
    </div>
  </div>

  <Teleport
    :to="teleport === false ? 'body' : teleport"
    :disabled="teleport === false"
  >
    <div
      v-if="magnifier.active"
      ref="magnifierRef"
      class="magnifuer__magnifier"
      :style="{
        ...magnifierStyles,
        width: px(computedSize.width),
        height: px(computedSize.height),
        zIndex
      }"
    >
      <div
        ref="contentRef"
        class="magnifuer__content"
        :style="{
          width: px(containerSize.width),
          height: px(containerSize.height),
          transform: [
            `scale(${scale})`,
            `translate(${-magnifier.x * 100}%, ${-magnifier.y * 100}%)`
          ].join(' ')
        }"
      >
        <slot
          name="magnifier"
          :size="containerSize"
        >
          <slot :size="containerSize">
            <img
              v-if="img"
              v-bind="img"
              :src="computedSrc.magnifier"
            >
          </slot>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, type ImgHTMLAttributes, reactive, ref } from 'vue'
import { useFloating, type UseFloatingOptions } from '@floating-ui/vue'
import { useMouseInElement } from '@vueuse/core'
import px from '@/utils/px'

export interface MagnifuerPosition {
  x: number
  y: number
}
export interface MagnifuerSize {
  width: number
  height: number
}

export interface MagnifuerImgSrc {
  /**
   * Image source for the default slot
   */
  default: string
  /**
   * Image source for the magnifier slot
   */
  magnifier: string
}
export interface MagnifuerImg extends Omit<ImgHTMLAttributes, 'src'> {
  src: string | MagnifuerImgSrc
}

export interface MagnifuerControllableOptions {
  /**
   * Minimal scale value
   *
   * @default 1
   */
  min?: number
  /**
   * Maximal scale value
   *
   * @default 10
   */
  max?: number
  /**
   * Step for scale value
   *
   * @default 0.5
   */
  step?: number
}

export interface MagnifuerOffset {
  x: number | string
  y: number | string
}

export interface MagnifuerProps {
  /**
   * Allow user to control magnifier scale using the mouse wheel
   *
   * @default false
   */
  controllable?: boolean | MagnifuerControllableOptions
  /**
   * Use images for default and magnifier slots
   */
  img?: MagnifuerImg
  /**
   * Anchor for the magnifier
   *
   * @default 'self'
   */
  anchor?: 'self' | 'pointer' | HTMLElement
  /**
   * Position of the magnifier
   *
   * - `'anchor'` - set position equal to the anchor position
   * - `{ x: number, y: number }` - set position to absolute coordinates
   * - `UseFloatingOptions<HTMLElement>` - use [Floating UI](https://floating-ui.com/docs/vue#options) for positioning
   *
   * @default 'anchor'
   */
  position?: 'anchor' | MagnifuerPosition | UseFloatingOptions<HTMLElement>
  transform?: boolean
  offset?: number | string | MagnifuerOffset
  /**
   * Size of the magnifier
   *
   * - `'anchor'` - set size equal to the anchor size
   * - `number` - set width and height to the same value
   * - `{ width: number, height: number }` - set width and height to absolute values
   *
   * @default 'anchor'
   */
  size?: 'anchor' | number | MagnifuerSize
  /**
   * Element for the magnifier to be teleported to, `false` to disable the teleport
   *
   * @default 'body'
   * @see https://vuejs.org/guide/built-ins/teleport.html
   */
  teleport?: string | HTMLElement | false
  /**
   * Z-index for the magnifier
   *
   * @default 1000
   */
  zIndex?: number
  /**
   * Disable the magnifier
   *
   * @default false
   */
  disabled?: boolean
}

export interface MagnifuerSlots {
  default?: (props: { size: MagnifuerSize }) => any
  magnifier?: (props: { size: MagnifuerSize }) => any
  area?: (props: { size: MagnifuerSize }) => any
}

const props = withDefaults(
  defineProps<MagnifuerProps>(),
  {
    controllable: false,
    img: undefined,
    anchor: 'self',
    position: 'anchor',
    transform: true,
    offset: undefined,
    size: 'anchor',
    teleport: 'body',
    zIndex: 1000,
    disabled: false
  }
)
defineSlots<MagnifuerSlots>()

const scale = defineModel<number>('scale', { required: true })
function alterScale (value: number): void {
  if (props.controllable === false) return

  const {
    min = 1,
    max = 10,
    step = 0.5
  } = typeof props.controllable === 'object' ? props.controllable : {}

  scale.value = Math.max(1, min, Math.min(max, scale.value + value * step))
}
function onWheel (event: WheelEvent): void {
  if (props.controllable === false || props.disabled) return

  alterScale(event.deltaY > 0 ? -1 : 1)
  event.preventDefault()
  event.stopPropagation()
}

const containerRef = ref<HTMLElement>()
const {
  elementX: pointerX,
  elementY: pointerY,
  x: pointerAbsoluteX,
  y: pointerAbsoluteY,
  elementWidth: containerWidth,
  elementHeight: containerHeight,
  isOutside: isPointerOutside
} = useMouseInElement(containerRef)
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

const magnifierRef = ref<HTMLElement>()

function getSrc (magnifier: boolean = false): string | undefined {
  if (props.img == null) return

  return typeof props.img.src === 'string'
    ? props.img.src
    : (magnifier ? props.img.src.magnifier : props.img.src.default)
}
const computedSrc = reactive({
  default: computed(() => getSrc()),
  magnifier: computed(() => getSrc(true))
})

const computedAnchor = computed(() => {
  if (props.anchor instanceof HTMLElement) return props.anchor
  return containerRef.value
})
const {
  elementPositionX: anchorX,
  elementPositionY: anchorY,
  elementWidth: anchorWidth,
  elementHeight: anchorHeight
} = useMouseInElement(computedAnchor)
const anchor = reactive({
  x: computed(() => {
    if (props.anchor === 'pointer') return pointer.absolute.x
    return anchorX.value
  }),
  y: computed(() => {
    if (props.anchor === 'pointer') return pointer.absolute.y
    return anchorY.value
  })
})

const computedOffset = computed(() => {
  if (!props.offset) return undefined
  if (typeof props.offset === 'object') return {
    x: px(props.offset.x),
    y: px(props.offset.y)
  }
  return {
    x: px(props.offset),
    y: px(props.offset)
  }
})

const computedPosition = computed(() => {
  if (props.position === 'anchor') return anchor
  return props.position
})
function isAbsolute (position: MagnifuerPosition | UseFloatingOptions<HTMLElement>): position is MagnifuerPosition {
  return 'x' in position
}
function isFloating (position: MagnifuerPosition | UseFloatingOptions<HTMLElement>): position is UseFloatingOptions {
  return !isAbsolute(position)
}
const isPositionFloating = computed(() => isFloating(computedPosition.value))
const { floatingStyles } = useFloating(
  computedAnchor,
  magnifierRef,
  isFloating(computedPosition.value) ? computedPosition.value : undefined
)
const magnifierStyles = computed(() => {
  if (isPositionFloating.value) return floatingStyles.value

  const position = {
    x: isAbsolute(computedPosition.value) ? px(computedPosition.value.x) : '',
    y: isAbsolute(computedPosition.value) ? px(computedPosition.value.y) : ''
  }

  const offsetTransform = computedOffset.value
    ? `translate(${computedOffset.value.x}, ${computedOffset.value.y})`
    : ''

  if (props.transform) return {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    transform: [
      offsetTransform,
      `translate(${position.x}, ${position.y})`
    ].filter(Boolean).join(' ')
  }

  return {
    position: 'absolute' as const,
    top: position.y,
    left: position.x,
    transform: offsetTransform
  }
})

const computedSize = reactive({
  width: computed(() => {
    if (props.size === 'anchor') return anchorWidth.value
    if (typeof props.size === 'number') return props.size
    return props.size.width
  }),
  height: computed(() => {
    if (props.size === 'anchor') return anchorHeight.value
    if (typeof props.size === 'number') return props.size
    return props.size.height
  })
})

const magnifierAreaSize = reactive({
  width: computed(() => computedSize.width / scale.value),
  height: computed(() => computedSize.height / scale.value)
})

const magnifierContainerPosition = reactive({
  x: computed(
    () => Math.max(
      magnifierAreaSize.width / 2,
      Math.min(
        containerWidth.value - magnifierAreaSize.width / 2,
        pointer.x
      )
    )
  ),
  y: computed(
    () => Math.max(
      magnifierAreaSize.height / 2,
      Math.min(
        containerHeight.value - magnifierAreaSize.height / 2,
        pointer.y
      )
    )
  )
})

const magnifier = reactive({
  active: computed(() => !props.disabled && !pointer.isOutside),
  x: computed(() => magnifierContainerPosition.x / containerWidth.value),
  y: computed(() => magnifierContainerPosition.y / containerHeight.value)
})
</script>

<style scoped lang="scss">
.magnifuer {
  position: relative;
  width: fit-content;
  height: fit-content;
  overflow: hidden;

  :deep(img) {
    display: block;
  }

  &__area-container {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  &__area {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .6);
    border: 1px solid #CCCBCC;
  }

  &__magnifier {
    position: absolute;
    pointer-events: none;
    overflow: hidden;
  }
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: top left;
  }
}
</style>
