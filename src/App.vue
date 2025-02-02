<script setup lang="ts">
import { ref } from 'vue'
import Magnifuer from './components/Magnifuer.vue'
import type { Placement } from '@floating-ui/vue'

const magnifuerRef = ref<InstanceType<typeof Magnifuer>>()

const showState = ref(false)

const minScale = ref(1)
const placement = ref<Placement>('right')
</script>

<template>
  <button @click="showState = !showState">
    Toggle state
  </button>
  <pre v-if="showState">{{ magnifuerRef?.state }}</pre>
  <select v-model="placement">
    <option value="top">
      top
    </option>
    <option value="right">
      right
    </option>
    <option value="bottom">
      bottom
    </option>
    <option value="left">
      left
    </option>
  </select>
  <input
    v-model="minScale"
    type="number"
  >
  <main>
    <Magnifuer
      ref="magnifuerRef"
      magnifier-class="magnifier"
      :scale="3"
      :controllable="{ min: minScale }"
      :img="{
        src: 'http://dummy-images.com/abstract/dummy-2160x2880-Glass.jpg',
        width: 500
      }"
      :floating="{ placement }"
      transition="fade"
    />
  </main>
</template>

<style lang="scss">
main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.magnifier {
  box-shadow: 0 0 0 2px #000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
