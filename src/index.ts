import type { App } from 'vue'
import Magnifuer from '@/components/Magnifuer.vue'
import useMagnifuer from '@/composables/useMagnifuer'

export type * from '@/types'
export type * from '@/types/component'
export type * from '@/composables/useMagnifuer'
export type * from '@/components/Magnifuer.vue'

export {
  useMagnifuer,
  Magnifuer
}

const magnifuer = {
  install: (app: App) => {
    app.component('Magnifuer', Magnifuer)
  }
}

export default magnifuer
