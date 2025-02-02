import type { MaybeRefOrGetter } from 'vue'
import type { MaybeReadonlyRefOrGetter } from '@floating-ui/vue'

export type ToValue<T> = T extends MaybeReadonlyRefOrGetter<infer U>
  ? U
  : T extends MaybeRefOrGetter<infer U>
    ? U
    : T

export type OptionsToProp<T> = {
  [key in keyof T]: ToValue<T[key]>
}

export interface MagnifuerPosition<T = number> {
  x: T
  y: T
}

export interface MagnifuerSize<T = number> {
  width: T
  height: T
}

export interface MagnifuerPointer extends MagnifuerPosition {
  absolute: MagnifuerPosition
  isOutside: boolean
}
