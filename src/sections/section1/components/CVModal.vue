<script setup>
  import { ref, watch, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AnimatedButton from '@/sections/section1/components/animatedButton.vue'

  const { t } = useI18n()

  const props = defineProps({
    isOpen: Boolean,
    gradientFrom: {
      type: String,
      default: 'oklch(67% 0.27 295)'
    },
    gradientTo: {
      type: String,
      default: 'oklch(56% 0.29 285)'
    },
    borderColor: {
      type: String,
      default: 'oklch(67% 0.27 295)'
    }
  })

  const emit = defineEmits(['close'])

  const selectedLanguage = ref(null)
  const isDownloading = ref(false)

  const languages = [
    {
      code: 'en',
      name: 'English',
      flag: 'GB',
      cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      code: 'ro',
      name: 'Română',
      flag: 'RO',
      cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      code: 'es',
      name: 'Español',
      flag: 'ES',
      cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
  ]

  const closeModal = () => {
    selectedLanguage.value = null
    isDownloading.value = false
    emit('close')
  }

  const downloadCV = (language) => {
    selectedLanguage.value = language.code
    isDownloading.value = true

    const link = document.createElement('a')
    link.href = language.cvUrl
    link.download = `CV_${language.code}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      isDownloading.value = false
      closeModal()
    }, 2000)
  }

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
      <div
          v-if="isOpen"
          class="fixed inset-0 z-50 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] backdrop-blur-sm flex items-center justify-center p-4"
          @click="handleBackdropClick"
      >
        <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
              v-if="isOpen"
              class="relative bg-[color-mix(in_oklch,_var(--bg)_90%,_transparent)] backdrop-blur-md border-(--border) border rounded-2xl max-w-lg w-full transform-gpu shadow-2xl"
              @click.stop
          >
            <button
                @click="closeModal"
                class="absolute right-3 top-3 z-20 w-10 h-10 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] border-2 border-(--border) rounded-full flex items-center justify-center text-(--text-muted) hover:text-(--text) hover:bg-[color-mix(in_oklch,_var(--bg)_100%,_transparent)] transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="p-8 bg-transparent">
              <Transition
                  enter-active-class="transition-all duration-500 delay-100 ease-out"
                  enter-from-class="opacity-0 translate-y-4"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-4"
              >
                <div v-if="isOpen" class="text-center mb-8">
                  <h2 class="font-bg-rubik font-bold text-2xl sm:text-3xl text-(--text) mb-3" style="font-weight:bold;">
                    {{ t('cv-modal-title') || 'Download CV' }}
                  </h2>
                  <p class="text-(--text-muted) text-sm sm:text-base">
                    {{ t('cv-modal-subtitle') || 'Select your preferred language' }}
                  </p>
                </div>
              </Transition>

              <div class="flex flex-col gap-4">
                <Transition
                    v-for="(language, index) in languages"
                    :key="language.code"
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-4 scale-95"
                    enter-to-class="opacity-100 translate-x-0 scale-100"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0 scale-100"
                    leave-to-class="opacity-0 translate-x-4 scale-95"
                    :style="{ transitionDelay: `${(index * 50) + 200}ms` }"
                >
                  <div
                      v-if="isOpen"
                      class="relative group"
                  >
                    <div
                        class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        :style="{
                        background: `radial-gradient(circle at center, ${props.gradientFrom}20, transparent 70%)`
                      }"
                    />
                    <div class="relative flex items-center gap-3">
                      <span class="text-3xl">{{ language.flag }}</span>
                      <AnimatedButton
                          :variant="index === 0 ? 'filled' : index === 1 ? 'hybrid' : 'empty'"
                          :text="language.name"
                          icon="download"
                          :success-text="selectedLanguage === language.code && isDownloading ? 'Downloading...' : 'Downloaded!'"
                          :gradient-from="props.gradientFrom"
                          :gradient-to="props.gradientTo"
                          :border-color="props.borderColor"
                          :hover-border-color="props.borderColor"
                          :click="() => downloadCV(language)"
                          :glow-intensity="index === 0 ? 'normal' : 'subtle'"
                          :persistent-glow="index === 0"
                          class="flex-1"
                      />
                    </div>
                  </div>
                </Transition>
              </div>

              <Transition
                  enter-active-class="transition-all duration-500 delay-400 ease-out"
                  enter-from-class="opacity-0 translate-y-4"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-4"
              >
                <div v-if="isOpen" class="mt-6 pt-6 border-t border-(--border)/30 text-center">
                  <p class="text-(--text-muted) text-xs sm:text-sm">
                    {{ t('cv-modal-footer') || 'CV will be downloaded in PDF format' }}
                  </p>
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
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }

  .group:hover > div:first-child {
    animation: float 2s ease-in-out infinite;
  }
</style>