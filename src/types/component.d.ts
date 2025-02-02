import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, TransitionProps } from 'vue'
import type { UseFloatingOptions } from '@floating-ui/vue'
import type { UseMagnifuerState } from '@/composables/useMagnifuer'
import type { MagnifuerPosition, MagnifuerSize, OptionsToProp } from '@/types'
import type { UseMagnifuerScaleOptions } from '@/composables/useMagnifuerScale'

export interface MagnifuerState extends UseMagnifuerState {
  active: boolean
  anchor: MagnifuerPosition & MagnifuerSize
  offset?: MagnifuerPosition<string>
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
  controllable?: boolean | OptionsToProp<UseMagnifuerScaleOptions>
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
  position?: 'anchor' | MagnifuerPosition
  transform?: boolean
  offset?: number | string | MagnifuerOffset
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
  transition?: string | TransitionProps
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
  allowOverflow?: boolean
  area?: boolean
  cursor?: CSSProperties['cursor']
  borderRadius?: string | number
  areaClass?: HTMLAttributes['class']
  magnifierClass?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
}

export type MagnifuerBaseSlot = (props: { state: MagnifuerState }) => unknown
export interface MagnifuerSlots {
  default?: (props: { state: MagnifuerState, isMagnifier: boolean }) => unknown
  magnifier?: MagnifuerBaseSlot
  area?: MagnifuerBaseSlot
}
