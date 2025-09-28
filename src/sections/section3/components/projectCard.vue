<script setup>
  import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay } from 'swiper/modules'
  import 'swiper/css'
  import ProjectModal from '@/sections/section3/components/projectModal.vue'
  import { useIcons } from '@/shared/composables/icons.js'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: Array, default: () => [] },
    technologies: { type: Array, default: () => [] },
    socials: { type: Array, default: () => [] },
    modalDescription: { type: String, default: '' },
    modalImages: { type: Array, default: () => [] },
    revealDirection: { type: String, default: 'left' },
    revealDelay: { type: Number, default: 0 }
  })

  const modules = [Autoplay]
  const { getIcon } = useIcons()
  const isModalOpen = ref(false)

  const openModal = () => { isModalOpen.value = true }
  const closeModal = () => { isModalOpen.value = false }

  const normalizedTechnologies = computed(() =>
      (props.technologies || []).map((tech) => {
        const techObj = typeof tech === 'string' ? { name: tech } : tech
        return { ...techObj, iconComponent: getIcon(techObj.name, 'tech') }
      })
  )

  const processedSocials = computed(() =>
      (props.socials || []).map((social) => ({ ...social, iconComponent: getIcon(social.name, 'social') }))
  )

  function useReveal({ threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
    const el = ref(null)
    const visible = ref(false)
    let observer

    const start = () => {
      if (!el.value || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        visible.value = true
        return
      }
      observer = new IntersectionObserver((entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visible.value = true
              if (once && observer) observer.unobserve(entry.target)
            } else if (!once) {
              visible.value = false
            }
          })
        })
      }, { threshold, rootMargin })
      observer.observe(el.value)
    }

    onMounted(async () => {
      await nextTick()
      start()
    })
    onBeforeUnmount(() => {
      if (observer) observer.disconnect()
    })
    return { el, visible }
  }

  const { el: cardRef, visible: inView } = useReveal({ threshold: 0.2 })

  function revealClasses(isVisible, direction = 'left') {
    const base = 'transform-gpu transition-all duration-700 ease-out will-change-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none'
    const hiddenTranslate = {
      left: '-translate-x-8',
      right: 'translate-x-8',
      up: '-translate-y-8',
      down: 'translate-y-8'
    }[direction] || 'translate-y-8'
    return [
      base,
      isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${hiddenTranslate} motion-reduce:opacity-100`
    ].join(' ')
  }

  function blurClasses(isVisible) {
    return [
      'transition-[backdrop-filter] duration-700 ease-out',
      isVisible ? 'backdrop-blur-[20px]' : 'backdrop-blur-none'
    ].join(' ')
  }

  const gradientBeforeBase = [
    'relative isolate',
    "before:content-[''] before:absolute before:inset-0 before:rounded-2xl",
    'before:pointer-events-none before:transition-opacity before:transition-[backdrop-filter] before:duration-700 before:ease-out',
    'before:bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]',
    'before:backdrop-blur-lg',
    'before:-z-10'
  ].join(' ')

  function gradientBeforeVisibility(isVisible) {
    return isVisible ? 'before:opacity-100' : 'before:opacity-0 motion-reduce:before:opacity-100'
  }
</script>

<template>
  <div
      ref="cardRef"
      :class="[
      gradientBeforeBase,
      gradientBeforeVisibility(inView),
      blurClasses(inView),
      'card-container rounded-2xl shadow-xl',
      'dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)',
      'border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)',
      'flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 items-center backdrop-blur-sm',
      revealClasses(inView, revealDirection)
    ]"
      :style="{ transitionDelay: `${revealDelay}ms` }"
  >
    <p class="font-bg-rubik font-bold text-xl sm:text-2xl text-(--text-muted) mb-3 sm:mb-4" style="font-weight: bold">
      {{ title }}
    </p>

    <div class="flex flex-row gap-3 sm:gap-4 w-full">
      <div v-for="(image, index) in images.slice(0, 2)" :key="index" class="flex-1 min-w-0">
        <img
            :src="image"
            :alt="`${title} image ${index + 1}`"
            class="w-full h-auto max-h-32 sm:max-h-32 lg:max-h-32 object-cover rounded-lg"
            loading="lazy"
        />
      </div>
    </div>

    <p class="font-bg-rubik font-bold text-sm sm:text-md text-(--text) mb-3 sm:mb-4 self-start mt-3 sm:mt-4">
      {{ description }}
    </p>

    <div class="w-full mb-4 sm:mb-5">
      <Swiper
          :modules="modules"
          :grab-cursor="true"
          :slides-per-view="2"
          :breakpoints="{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }"
          :space-between="8"
          :loop="true"
          :grabCursor="true"
          :autoplay="{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }"
          :speed="800"
          class="overflow-visible"
      >
        <SwiperSlide v-for="(tech, index) in normalizedTechnologies" :key="index">
          <div
              class="group relative px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full flex items-center justify-center
                   bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg)_65%,_transparent),_color-mix(in_oklch,_var(--bg-dark)_45%,_transparent))]
                   border border-(--border) backdrop-blur-sm
                   hover:from-gray-600/40 hover:to-gray-700/40
                   hover:border-gray-500/50
                   transition-all duration-300 ease-out max-w-full"
          >
            <div
                class="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400/0 via-gray-400/10 to-gray-400/0
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <component
                v-if="tech.iconComponent"
                :is="tech.iconComponent"
                class="relative z-10 w-3 h-3 flex-shrink-0 mr-1 sm:mr-1.5"
            />
            <div v-else-if="tech.icon" class="relative z-10 w-3 h-3 flex-shrink-0 mr-1 sm:mr-1.5" v-html="tech.icon"></div>

            <span
                class="relative z-10 text-[10px] sm:text-xs font-semibold text-(--text) group-hover:text-(--text-muted)
                     transition-colors duration-300 truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[150px]"
                :title="tech.name"
            >
              {{ tech.name }}
            </span>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="flex items-center justify-between w-full mt-auto gap-2">
      <button
          @click="openModal"
          class="group relative px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5
               bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg)_65%,_transparent),_color-mix(in_oklch,_var(--bg-dark)_45%,_transparent))]
               border border-(--border) backdrop-blur-sm rounded-xl
               text-(--text) font-semibold text-xs sm:text-sm
               hover:from-gray-600/40 hover:to-gray-700/40
               hover:border-gray-500/50 hover:shadow-xl hover:shadow-gray-900/30
               hover:-translate-y-0.5 hover:text-(--text-muted)
               transition-all duration-300 ease-out
               flex items-center gap-1.5 sm:gap-2 overflow-visible cursor-pointer"
      >
        <div
            class="absolute -inset-2 rounded-xl border-2 border-(--border)/0
                 group-hover:border-(--border)/30 group-hover:-inset-3
                 transition-all duration-500 ease-out pointer-events-none"
        ></div>

        <div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div
              class="absolute inset-0 -translate-x-full group-hover:translate-x-full
                   transition-transform duration-700 ease-out
                   bg-gradient-to-r from-transparent via-white/10 to-transparent"
          ></div>
        </div>

        <span class="relative z-10 cursor-pointer">{{ t('projects-card-view-more') }}</span>

        <svg
            class="relative z-10 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <div v-if="processedSocials.length > 0" class="flex items-center gap-1.5 sm:gap-2">
        <a
            v-for="social in processedSocials.slice(0, 3)"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group p-1.5 sm:p-2 rounded-lg
                 bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg)_65%,_transparent),_color-mix(in_oklch,_var(--bg-dark)_45%,_transparent))]
                 border border-(--border)
                 backdrop-blur-sm
                 text-(--text) hover:text-(--text-muted)
                 hover:from-gray-600/40 hover:to-gray-700/40
                 hover:border-gray-500/50 hover:shadow-lg hover:shadow-gray-900/20
                 hover:-translate-y-0.5 hover:scale-105
                 transition-all duration-300"
        >
          <component v-if="social.iconComponent" :is="social.iconComponent" class="w-3 h-3 sm:w-4 sm:h-4" />
          <div v-else class="w-3 h-3 sm:w-4 sm:h-4">{{ social.name }}</div>
        </a>

        <span v-if="(socials || []).length > 3" class="text-[10px] sm:text-xs text-gray-500 ml-1">
          +{{ (socials || []).length - 3 }}
        </span>
      </div>
    </div>

    <ProjectModal
        :is-open="isModalOpen"
        :project-name="title"
        :images="modalImages.length ? modalImages : images"
        :description="modalDescription || description"
        :socials="socials || []"
        @close="closeModal"
    />
  </div>
</template>

<style scoped>
  .card-container {
    contain: layout style;
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes pulse-outline {
    0%, 100% { opacity: 100; }
    50% { opacity: 60; }
  }

  .group:hover > div:first-child {
    animation: pulse-outline 2s infinite;
  }

  :deep(svg) {
    fill: currentColor;
    transition: color 0.3s ease;
  }
</style>