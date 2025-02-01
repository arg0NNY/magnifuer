<script setup lang="ts">
import { ref } from 'vue'
import Magnifuer from './components/Magnifuer.vue'

const magnifuerRef = ref<InstanceType<typeof Magnifuer>>()
</script>

<template>
  <pre v-if="false">{{ magnifuerRef?.state }}</pre>
  <main>
    <Magnifuer
      ref="magnifuerRef"
      magnifier-class="magnifier"
      :scale="3"
      controllable
      :img="{
        src: 'http://dummy-images.com/abstract/dummy-2160x2880-Glass.jpg',
        width: 500
      }"
      :position="{ placement: 'right' }"
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
