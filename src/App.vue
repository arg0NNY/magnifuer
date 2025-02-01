<script setup lang="ts">
import Magnifuer from './components/Magnifuer.vue'
</script>

<template>
  <main>
    <Magnifuer
      :scale="3"
      :img="{
        src: 'http://dummy-images.com/abstract/dummy-2160x2880-Glass.jpg',
        width: 500
      }"
      anchor="pointer"
      offset="-50%"
      :size="200"
      allow-overflow
    />
  </main>
</template>

<style scoped lang="scss">
main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
