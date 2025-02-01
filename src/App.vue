<script setup lang="ts">
import Magnifuer from './components/Magnifuer.vue'
</script>

<template>
  <main>
    <Magnifuer
      magnifier-class="magnifier"
      :scale="3"
      controllable
      :img="{
        src: 'http://dummy-images.com/abstract/dummy-2160x2880-Glass.jpg',
        width: 500
      }"
      :position="{ placement: 'right' }"
      transition="fade"
      border-radius="50%"
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
  border: 2px solid #000;
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
