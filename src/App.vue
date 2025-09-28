<script setup>
import { ref } from 'vue'
import Background from '@/shared/background/background.vue';

import Section1 from '@/sections/section1/section1.vue';
import Section2 from '@/sections/section2/section2.vue';
import Section3 from "@/sections/section3/section3.vue";
import Section4 from "@/sections/section4/section4.vue";

import IconsBar from '@/topbar/socials/iconsBar.vue';
import Settings from '@/topbar/settings.vue';
import ScrollBar from '@/shared/scrollBar.vue';

import LoadingBar from '@/shared/loadingAnim.vue';

const backgroundRef = ref(null)

function loadingEnded(){
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  if (backgroundRef.value) {
    backgroundRef.value.createRipple(centerX, centerY, 4)
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <Background ref="backgroundRef" />
    </div>

    <div class="relative z-10 w-full max-w-full overflow-x-hidden">
      <ScrollBar />

      <IconsBar />
      <Settings />

      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>

    <div class="relative z-999">
      <LoadingBar @loading-complete="loadingEnded"
                  :background-color="'var(--bg-dark)'"
                  :fill-color="'var(--text)'"
                  :rectangle-color="'var(--text)'"
                  :base-shape-color="'var(--bg-light)'"
      />
    </div>
  </div>
</template>