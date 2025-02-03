import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, TransitionProps } from 'vue'
import type { UseFloatingOptions } from '@floating-ui/vue'
import type { UseMagnifuerState } from '@/composables/useMagnifuer'
import type { MagnifuerPosition, MagnifuerSize, OptionsToProp } from '@/types'
import type { UseMagnifuerScaleOptions } from '@/composables/useMagnifuerScale'

export interface MagnifuerState extends UseMagnifuerState {
  /**
   * Whether the magnifier is currently active
   */
  active: boolean
  /**
   * Absolute position and size of the anchor
   */
  anchor: MagnifuerPosition & MagnifuerSize
  /**
   * Magnifier offset value as CSS values
   */
  offset?: MagnifuerPosition<string>
}

export interface MagnifuerImgSrc {
  /**
   * Image source for the default slot
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#src
   */
  default: string
  /**
   * Image source for the magnifier slot
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#src
   */
  magnifier: string
}
export interface MagnifuerImg extends Omit<ImgHTMLAttributes, 'src'> {
  src: string | MagnifuerImgSrc
}

export interface MagnifuerOffset {
  x: number | string
  y: number | string
}

export interface MagnifuerProps {
  /**
   * Allow user to control the magnifier scale using the mouse wheel
   *
   * @default false
   * @see {@link UseMagnifuerScaleOptions}
   */
  controllable?: boolean | OptionsToProp<UseMagnifuerScaleOptions>
  /**
   * Provide the image to be magnified
   *
   * @see Use {@link MagnifuerSlots|`default` and `magnifier` slots} to provide custom contents
   */
  img?: MagnifuerImg
  /**
   * Anchor for the magnifier
   *
   * - `'self'` - Container element
   * - `'pointer'` - Pointer (cursor, touch, etc.)
   * - `HTMLElement` - Reference to a custom element
   *
   * @default 'self'
   */
  anchor?: 'self' | 'pointer' | HTMLElement
  /**
   * Position of the magnifier
   *
   * - `'anchor'` - Set position equal to the anchor position
   * - `{ x: number, y: number }` - Set position to absolute coordinates
   *
   * @default 'anchor'
   * @see Use {@link MagnifuerProps.floating|`floating`} to use [Floating UI](https://floating-ui.com/docs/vue) for the positioning
   */
  position?: 'anchor' | MagnifuerPosition
  /**
   * Use transform for positioning the magnifier element.
   * Disable to use `top` and `left` properties instead.
   *
   * Applies only when used with {@link MagnifuerProps.position|`position`}.
   *
   * @default true
   */
  transform?: boolean
  /**
   * Offset the magnifier element by specified values.
   * Accepts any CSS value or a number in px.
   *
   * Provide a single value to apply to both axes.
   */
  offset?: number | string | MagnifuerOffset
  /**
   * Use [Floating UI](https://floating-ui.com/docs/vue) for positioning the magnifier element.
   *
   * {@link MagnifuerProps.position|`position`} is ignored when this one is provided.
   *
   * @see https://floating-ui.com/docs/vue#options
   */
  floating?: OptionsToProp<UseFloatingOptions<HTMLElement>>
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
   * Enable Vue transition for the magnifier element
   *
   * @see https://vuejs.org/guide/built-ins/transition.html
   */
  transition?: string | TransitionProps
  /**
   * Z-index for the magnifier element
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
  /**
   * Allow the magnifying area to overflow the container
   *
   * @default false
   * @see {@link UseMagnifuerOptions}
   */
  allowOverflow?: boolean
  /**
   * Display the magnifying area in the container
   *
   * @default true
   * @see Use {@link MagnifuerSlots.area|`area` slot} to customize it
   */
  area?: boolean
  /**
   * Cursor to apply to the container
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
   */
  cursor?: CSSProperties['cursor']
  /**
   * Border radius to apply to the magnifier and default magnifying area elements
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius
   */
  borderRadius?: string | number
  /**
   * Class to apply to the default magnifying area element
   */
  areaClass?: HTMLAttributes['class']
  /**
   * Class to apply to the magnifier element
   */
  magnifierClass?: HTMLAttributes['class']
  /**
   * Class to apply to the magnifier content element
   */
  contentClass?: HTMLAttributes['class']
}

export type MagnifuerBaseSlot = (props: { state: MagnifuerState }) => unknown
export interface MagnifuerSlots {
  /**
   * Slot to be used for both the container and the magnifier.
   *
   * Overridable by the {@link MagnifuerSlots.magnifier|`magnifier` slot} for the magnifier.
   *
   * @param props.state Current state
   * @param props.isMagnifier Specifies whether this slot is currently being rendered in the {@link MagnifuerSlots.magnifier|`magnifier` slot}
   * @see Use {@link MagnifuerProps.img|`img`} to render an image by default
   */
  default?: (props: { state: MagnifuerState, isMagnifier: boolean }) => unknown
  /**
   * Contents of the magnifier
   */
  magnifier?: MagnifuerBaseSlot
  /**
   * Use to make a custom magnifying area
   *
   * @see Use {@link MagnifuerProps.areaClass|`areaClass`} to alter the styles of the default magnifying area element
   */
  area?: MagnifuerBaseSlot
}
