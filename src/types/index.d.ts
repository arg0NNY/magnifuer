
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
