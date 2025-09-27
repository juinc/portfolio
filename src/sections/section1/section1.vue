<script setup>
  import { useI18n } from 'vue-i18n'
  import InfoBox from '@/sections/section1/components/infoBox.vue'
  import ArrowIcon from '@/assets/icons/other/arrow.svg'

  const { t } = useI18n()
</script>

<template>
  <section
      id="section-1"
      class="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-12 sm:pb-24 md:pt-16 md:pb-28 lg:pt-8 lg:pb-32"
  >
    <div class="w-full flex items-center justify-center">
      <InfoBox />
    </div>

    <div
        class="pointer-events-none select-none absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-10"
    >
      <ArrowIcon
          alt="down-arrow"
          class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-2 animate-bounce text-(--text-muted)"
      />
      <p class="font-bold font-bg-rubik text-xs sm:text-sm md:text-base lg:text-lg text-(--text-muted) whitespace-nowrap">
        {{ t('section-1-scroll-down') }}
      </p>
    </div>
  </section>
</template>