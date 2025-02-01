<template>
  <div
    ref="containerRef"
    class="magnifuer"
    :style="{ cursor }"
    @wheel="onWheel"
    v-bind="$attrs"
  >
    <slot
      :state="state"
      :is-magnifier="false"
    >
      <img
        v-if="img"
        v-bind="img"
        :src="computedSrc.default"
      >
    </slot>

    <div
      v-if="area && state.active"
      class="magnifuer__area-container"
      :style="{
        width: px(state.areaSize.width),
        height: px(state.areaSize.height),
        transform: [
          `translate(-50%, -50%)`,
          `translate(${state.absolute.x}px, ${state.absolute.y}px)`
        ].join(' ')
      }"
    >
      <slot
        name="area"
        :state="state"
      >
        <div
          class="magnifuer__area"
          :class="areaClass"
          :style="{ borderRadius }"
        />
      </slot>
    </div>
  </div>

  <Teleport
    :to="teleport === false ? 'body' : teleport"
    :disabled="teleport === false"
  >
    <Transition
      :name="typeof transition === 'string' ? transition : undefined"
      v-bind="typeof transition === 'object' ? transition : {}"
    >
      <div
        v-if="state.active"
        ref="magnifierRef"
        class="magnifuer__magnifier"
        :class="magnifierClass"
        :style="{
          ...magnifierStyles,
          width: px(state.size.width),
          height: px(state.size.height),
          zIndex,
          borderRadius
        }"
      >
        <div
          ref="contentRef"
          class="magnifuer__content"
          :class="contentClass"
          :style="{
          width: px(state.containerSize.width),
          height: px(state.containerSize.height),
          transform: [
            `scale(${scale})`,
            `translate(${-state.x * 100}%, ${-state.y * 100}%)`
          ].join(' ')
        }"
        >
          <slot
            name="magnifier"
            :state="state"
          >
            <slot
              :state="state"
              :is-magnifier="true"
            >
              <img
                v-if="img"
                v-bind="img"
                :src="computedSrc.magnifier"
              >
            </slot>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, } from 'vue'
import { useFloating, type UseFloatingOptions } from '@floating-ui/vue'
import { useMouseInElement } from '@vueuse/core'
import type { MagnifuerPosition } from '@/types'
import type { MagnifuerProps, MagnifuerSlots, MagnifuerState } from '@/types/component'
import useMagnifuer from '@/composables/useMagnifuer'
import px from '@/utils/px'

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
    disabled: false,
    allowOverflow: false,
    area: true
  }
)
defineSlots<MagnifuerSlots>()

const scale = defineModel<number>('scale', { required: true })
function alterScale (value: number): void {
  if (props.controllable === false) return

  const {
    min = 1,
    max = 10,
    speed = 1.3,
    step = (current: number, direction: number) => current * Math.pow(speed, direction)
  } = typeof props.controllable === 'object' ? props.controllable : {}

  scale.value = Math.max(
    1,
    min,
    Math.min(
      max,
      typeof step === 'function'
        ? step(scale.value, value)
        : (scale.value + value * step)
    )
  )
}
function onWheel (event: WheelEvent): void {
  if (props.controllable === false || props.disabled) return

  alterScale(event.deltaY > 0 ? -1 : 1)
  event.preventDefault()
  event.stopPropagation()
}

const containerRef = ref<HTMLElement>()
const magnifierRef = ref<HTMLElement>()

const computedAnchor = computed(() => {
  if (props.anchor instanceof HTMLElement) return props.anchor
  return containerRef.value
})
const {
  x: pointerX,
  y: pointerY,
  elementPositionX: anchorX,
  elementPositionY: anchorY,
  elementWidth: anchorWidth,
  elementHeight: anchorHeight
} = useMouseInElement(computedAnchor)
const anchor = reactive({
  x: computed(() => props.anchor === 'pointer' ? pointerX.value : anchorX.value),
  y: computed(() => props.anchor === 'pointer' ? pointerY.value : anchorY.value),
  width: computed(() => props.anchor === 'pointer' ? 0 : anchorWidth.value),
  height: computed(() => props.anchor === 'pointer' ? 0 : anchorHeight.value)
})

function getSrc (magnifier: boolean = false): string | undefined {
  if (!props.img) return

  return typeof props.img.src === 'string'
    ? props.img.src
    : (magnifier ? props.img.src.magnifier : props.img.src.default)
}
const computedSrc = reactive({
  default: computed(() => getSrc()),
  magnifier: computed(() => getSrc(true))
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

const computedPosition = computed<MagnifuerPosition | UseFloatingOptions<HTMLElement>>(() => {
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

const magnifuer = useMagnifuer(
  containerRef,
  scale,
  {
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
  },
  { allowOverflow: () => props.allowOverflow }
)

const state = computed<MagnifuerState>(() => ({
  ...magnifuer,
  active: !props.disabled && !magnifuer.pointer.isOutside,
  anchor,
  offset: computedOffset.value
}))

defineExpose({ state })
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
