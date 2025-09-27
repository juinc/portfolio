<script setup>
  import { watch, onUnmounted } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation, Pagination } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import { useI18n } from 'vue-i18n'
  import { useSocialIcons } from '@/shared/composables/icons.js'

  const { t } = useI18n()
  const { getSocialIcon } = useSocialIcons()

  const props = defineProps({
    isOpen: Boolean,
    projectName: String,
    images: Array,
    description: String,
    socials: Array
  })

  const emit = defineEmits(['close'])

  const modules = [Navigation, Pagination]

  const closeModal = () => {
    emit('close')
  }

  const processedSocials = props.socials?.map(social => ({
    ...social,
    iconComponent: getSocialIcon(social.name)
  })) || []

  const preventScroll = () => {
    document.body.style.overflow = 'hidden'
  }

  const allowScroll = () => {
    document.body.style.overflow = ''
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal()
    }
  }

  watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
      preventScroll()
      document.addEventListener('keydown', handleKeyDown)
    } else {
      allowScroll()
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  onUnmounted(() => {
    allowScroll()
    document.removeEventListener('keydown', handleKeyDown)
  })
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="isOpen"
           class="fixed inset-0 z-50 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] backdrop-blur-sm flex items-center justify-center p-4"
           @click="handleBackdropClick">

        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="isOpen"
               class="relative bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] backdrop-blur-xs border-(--border) border rounded-2xl
                max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide transform-gpu"
               @click.stop>

            <button @click="closeModal"
                    class="absolute right-2 top-2 z-20 w-10 h-10 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] border-2 border-(--border) rounded-full flex items-center justify-center text-(--text-muted) hover:text-(--text) hover:bg-[color-mix(in_oklch,_var(--bg)_100%,_transparent)] transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm cursor-pointer">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="p-8 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)]">
              <Transition
                  enter-active-class="transition-all duration-500 delay-100 ease-out"
                  enter-from-class="opacity-0 translate-y-4"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-4"
              >
                <h2 v-if="isOpen" class="font-bg-rubik font-bold text-3xl text-(--text-muted) mb-6 pr-12" style="font-weight:bold;">
                  {{ projectName }}
                </h2>
              </Transition>

              <Transition
                  enter-active-class="transition-all duration-500 delay-200 ease-out"
                  enter-from-class="opacity-0 translate-y-8 scale-95"
                  enter-to-class="opacity-100 translate-y-0 scale-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0 scale-100"
                  leave-to-class="opacity-0 translate-y-8 scale-95"
              >
                <div v-if="isOpen" class="mb-8">
                  <Swiper
                      :modules="modules"
                      :slides-per-view="1"
                      :space-between="20"
                      :grabCursor="true"
                      :navigation="true"
                      :pagination="{ clickable: true }"
                      class="rounded-xl overflow-hidden aspect-video"
                  >
                    <SwiperSlide v-for="(image, index) in images" :key="index">
                      <img :src="image"
                           :alt="`${projectName} image ${index + 1}`"
                           class="w-full h-full object-cover">
                    </SwiperSlide>
                  </Swiper>
                </div>
              </Transition>

              <Transition
                  enter-active-class="transition-all duration-500 delay-300 ease-out"
                  enter-from-class="opacity-0 translate-y-4"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-4"
              >
                <div v-if="isOpen" class="mb-8">
                  <p class="font-bg-rubik text-lg text-(--text) leading-relaxed whitespace-pre-line">
                    {{ description }}
                  </p>
                </div>
              </Transition>

              <Transition
                  enter-active-class="transition-all duration-500 delay-400 ease-out"
                  enter-from-class="opacity-0 translate-y-4"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-4"
              >
                <div v-if="isOpen && processedSocials.length > 0" class="border-t border-(--border) pt-6">
                  <h3 class="font-bg-rubik font-bold text-xl text-(--text-muted) mb-4" style="font-weight: bold;">
                    {{ t('project-modal-socials') }}
                  </h3>
                  <div class="flex flex-wrap gap-3">
                    <Transition
                        v-for="(social, index) in processedSocials"
                        :key="social.name"
                        enter-active-class="transition-all duration-300 ease-out"
                        :enter-from-class="`opacity-0 translate-y-2 scale-95`"
                        enter-to-class="opacity-100 translate-y-0 scale-100"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 translate-y-0 scale-100"
                        leave-to-class="opacity-0 translate-y-2 scale-95"
                        :style="{ transitionDelay: `${(index * 50) + 500}ms` }"
                    >
                      <a v-if="isOpen"
                         :href="social.url"
                         target="_blank"
                         rel="noopener noreferrer"
                         class="group flex items-center gap-2 px-4 py-2 rounded-lg
                          bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg)_65%,_transparent),_color-mix(in_oklch,_var(--bg-dark)_45%,_transparent))]
                          border border-(--border) backdrop-blur-sm
                         text-(--text) hover:text-(--text-muted)
                         hover:border(--border)/50
                         hover:scale-105 active:scale-95
                         transition-[color,border-color,transform] duration-150 ease-out
                         will-change-[color,border-color,transform] transform-gpu
                         hover:shadow-lg">

                        <div class="w-4 h-4 flex items-center justify-center">
                          <component
                              v-if="social.iconComponent"
                              :is="social.iconComponent"
                              class="w-full h-full"
                          />
                          <div v-else-if="social.icon" v-html="social.icon" class="w-full h-full"></div>
                          <span v-else class="text-xs font-bold" style="font-weight: bold;">
                            {{ social.name.charAt(0).toUpperCase() }}
                          </span>
                        </div>

                        <span class="text-sm font-semibold" style="font-weight: 500;">{{ social.name }}</span>
                      </a>
                    </Transition>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: rgb(209 213 219);
  background: rgba(55, 65, 81, 0.3);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  color: white;
  background: rgba(75, 85, 99, 0.4);
  border-color: rgba(107, 114, 128, 0.5);
}

:deep(.swiper-pagination-bullet) {
  background: rgba(209, 213, 219, 0.5);
}

:deep(.swiper-navigation-icon) {
  padding: 12px;
}

/* Ensure SVG icons inherit colors properly */
:deep(svg) {
  fill: currentColor;
  transition: color 0.3s ease;
}
</style>