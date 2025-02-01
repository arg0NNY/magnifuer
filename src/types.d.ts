
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

export interface MagnifuerState extends MagnifuerPosition {
  active: boolean
  scale: number
  x: number
  y: number
  absolute: MagnifuerPosition
  pointer: MagnifuerPointer
  anchor: MagnifuerPosition & MagnifuerSize
  offset?: MagnifuerPosition<string>
  size: MagnifuerSize
  containerSize: MagnifuerSize
  areaSize: MagnifuerSize
}
