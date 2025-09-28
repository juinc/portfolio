<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import CardBackground from '@/sections/section1/components/cardBackground.vue'
import AnimatedButton from '@/sections/section1/components/animatedButton.vue'
import SocialsModal from '@/topbar/socials/socialsModal.vue'
import { faLocationDot, faUser, faBriefcase, faBullseye, faLaptop } from '@fortawesome/free-solid-svg-icons'
import { useProfileData } from '@/shared/composables/profileData.js'

const { t } = useI18n()

const {
  isSpinning,
  isImageHovered,
  displayedName,
  displayedHandle,
  showNameCursor,
  showHandleCursor,
  isTypingName,
  isTypingHandle,
  currentProfile,
  currentFont,
  currentTextSize,
  gradientStyle,
  imageGlowStyle,
  buttonScaleStyle,
  switchProfile,
  setImageHovered,
  initializeTypewriter,
  cleanup
} = useProfileData()

const isSocialsModalOpen = ref(false)
const openSocialsModal = () => { isSocialsModalOpen.value = true }
const closeSocialsModal = () => { isSocialsModalOpen.value = false }

const downloadCV = () => {
  const link = document.createElement('a')
  link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  link.download = 'CV.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const scrollToProjects = () => {
  let targetElement = document.getElementById('section-3')
  if (!targetElement) {
    targetElement =
        document.querySelector('[class*="Section3"]') ||
        document.querySelector('.section-3') ||
        document.querySelector('[data-section="3"]')
  }
  if (!targetElement) {
    const allSections = document.querySelectorAll('section, [class*="Section"], div[class*="section"]')
    targetElement = allSections[1]
  }
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    setTimeout(() => {
      const elementTop = targetElement.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: elementTop, behavior: 'smooth' })
    }, 100)
  } else {
    const fallbackPosition = document.documentElement.scrollHeight * 0.25
    window.scrollTo({ top: fallbackPosition, behavior: 'smooth' })
  }
  setTimeout(() => {
    const customScrollEvent = new CustomEvent('scrollToSection', { detail: { sectionIndex: 1, sectionId: 'section-2' } })
    window.dispatchEvent(customScrollEvent)
  }, 200)
}

const items = [
  {
    image: '',
    title: '',
    subtitle: '',
    handle: '',
    borderColor: '#dcdcdc',
    gradient:
        'linear-gradient(145deg, color-mix(in oklch, var(--bg-light) 80%, transparent), color-mix(in oklch, var(--bg) 80%, transparent))',
    url: ''
  }
]

onMounted(() => {
  initializeTypewriter()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <div class="w-full max-w-4xl 2xl:max-w-5xl mx-auto my-4 sm:my-6 md:my-8 lg:my-0">
    <CardBackground :items="items" :radius="300" :damping="0.45" :fadeOut="0.6" ease="power3.out">
      <div
          class="pointer-events-none absolute inset-0 rounded-2xl hidden sm:block"
          :style="{
          background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1), transparent 40%)`,
          transition: 'opacity 0.2s ease'
        }"
      />

      <div class="flex flex-col gap-3 min-[300px]:gap-4 sm:gap-6 md:gap-7 lg:gap-8 2xl:gap-10 p-3 min-[300px]:p-4 sm:p-5 md:p-6 lg:p-8 2xl:p-10">
        <div class="flex flex-col lg:flex-row items-center lg:items-center gap-3 min-[300px]:gap-4 sm:gap-6 md:gap-7 lg:gap-8 2xl:gap-10">
          <div class="flex-1 flex items-center justify-center">
            <div class="w-20 h-20 min-[300px]:w-24 min-[300px]:h-24 min-[400px]:w-28 min-[400px]:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 relative">
              <img
                  :src="currentProfile.image"
                  :class="[
                  'w-full h-full rounded-full object-cover cursor-pointer',
                  'border-2 border-white/10 transition-all duration-300',
                  isSpinning ? 'animate-spin-3d' : '',
                  isImageHovered ? 'scale-105' : 'scale-100'
                ]"
                  :style="imageGlowStyle"
                  @click="switchProfile"
                  @mouseenter="setImageHovered(true)"
                  @mouseleave="setImageHovered(false)"
                  alt="Profile picture"
              />
            </div>
          </div>

          <div class="flex-1 flex flex-col items-center justify-center text-center">
            <p class="text-xs min-[300px]:text-sm min-[400px]:text-base sm:text-lg md:text-xl 2xl:text-2xl text-(--text-muted) font-bg-montserrat justify-center">
              {{ t('info-box-greeting') }}
            </p>

            <div class="w-full flex justify-center items-center h-7 min-[300px]:h-8 min-[400px]:h-10 sm:h-11 md:h-12 2xl:h-14 overflow-visible px-2">
              <button
                  @click="switchProfile"
                  :class="[
                  'relative m-0 cursor-pointer transition-all active:scale-95 z-10 hover:-translate-y-0.5',
                  'text-sm min-[300px]:text-base min-[400px]:text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl',
                  currentFont,
                  isSpinning ? 'animate-text-spin' : ''
                ]"
              >
                <span
                    class="absolute inset-0 blur-sm bg-clip-text text-transparent inline-flex items-baseline break-words"
                    :style="{ backgroundImage: gradientStyle }"
                >
                  <span style="font-weight: bold;" class="text-2xl min-[300px]:text-3xl min-[400px]:text-4xl 2xl:text-5xl">{{ displayedName }}</span>
                  <span
                      :class="[
                      'ml-0.5 font-bold transition-opacity duration-100 bg-clip-text text-transparent',
                      showNameCursor && isTypingName ? 'animate-cursor-blink' : 'opacity-0'
                    ]"
                      :style="{ backgroundImage: gradientStyle }"
                  >|</span>
                </span>
                <span
                    class="relative bg-clip-text text-transparent inline-flex items-baseline break-words"
                    :style="{ backgroundImage: gradientStyle }"
                >
                  <span style="font-weight: bold;" class="text-2xl min-[300px]:text-3xl min-[400px]:text-4xl 2xl:text-5xl">{{ displayedName }}</span>
                  <span
                      :class="[
                      'ml-0.5 font-bold transition-opacity duration-100 bg-clip-text text-transparent',
                      showNameCursor && isTypingName ? 'animate-cursor-blink' : 'opacity-0'
                    ]"
                      :style="{ backgroundImage: gradientStyle }"
                  >|</span>
                </span>
              </button>
            </div>

            <div class="flex flex-row items-center justify-center lg:justify-start text-center gap-1 min-[300px]:gap-2 h-5 min-[300px]:h-6 min-[400px]:h-8 sm:h-9 md:h-10 2xl:h-12">
              <p class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base 2xl:text-lg text-(--text-muted) font-bg-montserrat">aka</p>
              <button
                  @click="switchProfile"
                  :class="[
                  'relative m-0 cursor-pointer transition-all active:scale-95 hover:-translate-y-0.5',
                  'text-sm min-[300px]:text-base min-[400px]:text-lg sm:text-xl md:text-2xl 2xl:text-3xl',
                  currentFont,
                  isSpinning ? 'animate-text-spin' : ''
                ]"
              >
                <span
                    class="absolute inset-0  blur-sm bg-clip-text text-transparent inline-flex items-baseline break-words"
                    :style="{ backgroundImage: gradientStyle }"
                >
                  <span class="text-lg min-[300px]:text-xl min-[400px]:text-2xl 2xl:text-3xl px-1 sm:px-2" style="font-weight: bold;">{{ displayedHandle }}</span>
                  <span
                      :class="[
                      'ml-0.5 font-bold transition-opacity duration-100 bg-clip-text text-transparent',
                      showHandleCursor && isTypingHandle ? 'animate-cursor-blink' : 'opacity-0'
                    ]"
                      :style="{ backgroundImage: gradientStyle }"
                  >|</span>
                </span>
                <span
                    class="relative bg-clip-text text-transparent inline-flex items-baseline break-words"
                    :style="{ backgroundImage: gradientStyle }"
                >
                  <span class="text-lg min-[300px]:text-xl min-[400px]:text-2xl 2xl:text-3xl px-1 sm:px-2" style="font-weight: bold;">{{ displayedHandle }}</span>
                  <span
                      :class="[
                      'ml-0.5 font-bold transition-opacity duration-100 bg-clip-text text-transparent',
                      showHandleCursor && isTypingHandle ? 'animate-cursor-blink' : 'opacity-0'
                    ]"
                      :style="{ backgroundImage: gradientStyle }"
                  >|</span>
                </span>
              </button>
            </div>

            <p style="font-weight: bold;" class="text-sm min-[300px]:text-base min-[400px]:text-lg sm:text-xl md:text-2xl lg:text-[1.35rem] 2xl:text-[1.75rem] text-(--text) font-bg-montserrat font-bold">
              {{ t('info-box-role') }}
            </p>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row items-stretch gap-3 min-[300px]:gap-4 sm:gap-5 md:gap-6 2xl:gap-8">
          <div class="flex-1">
            <ul class="list-none space-y-1 sm:space-y-2 2xl:space-y-3">
              <li class="text-(--text)">
                <font-awesome-icon :icon="faUser" class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl mr-1" />
                <span class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl font-bg-montserrat">{{ t('info-box-age') }}</span>
              </li>
              <li class="text-(--text)">
                <font-awesome-icon :icon="faLocationDot" class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl mr-1" />
                <span class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl font-bg-montserrat">{{ t('info-box-location') }}</span>
              </li>
              <li class="text-(--text)">
                <font-awesome-icon :icon="faBriefcase" class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl mr-1" />
                <span class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl font-bg-montserrat">{{ t('info-box-exp') }}</span>
              </li>
              <li class="text-(--text)">
                <font-awesome-icon :icon="faBullseye" class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl mr-1 font-bold" />
                <span class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl font-bg-montserrat">{{ t('info-box-goal') }}</span>
              </li>
              <li class="text-(--text)">
                <font-awesome-icon :icon="faLaptop" class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl mr-1" />
                <span class="text-[10px] min-[300px]:text-xs min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl font-bg-montserrat">{{ t('info-box-specialization') }}</span>
              </li>
            </ul>
          </div>

          <div class="flex-1 flex items-center justify-center">
            <div
                class="w-full md:w-4/5 lg:w-3/4 2xl:w-4/5 dark:border dark:border-(--border-muted) rounded-2xl bg-[color-mix(in srgb, var(--bg-light) 50%, transparent)] px-2 py-2 min-[300px]:px-3 min-[300px]:py-3 sm:px-4 sm:py-4 2xl:px-5 2xl:py-5 flex justify-center items-center flex-col gap-2 min-[400px]:gap-3 sm:gap-4 2xl:gap-5 shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]"
            >
              <AnimatedButton
                  :text="t('info-box-socials-button')"
                  icon="person"
                  success-text="SEE THE SOCIALS"
                  :gradient-from="currentProfile.gradientFromOklch"
                  :gradient-to="currentProfile.gradientToOklch"
                  :border-color="currentProfile.borderColor"
                  :hover-border-color="currentProfile.borderColor"
                  :click="openSocialsModal"
              />
              <AnimatedButton
                  variant="hybrid"
                  :text="t('info-box-cv-button')"
                  icon="documentFilled"
                  success-text="DOWNLOADED"
                  :gradient-from="currentProfile.gradientFromOklch"
                  :gradient-to="currentProfile.gradientToOklch"
                  :border-color="currentProfile.borderColor"
                  :hover-border-color="currentProfile.borderColor"
                  :click="downloadCV"
              />
              <AnimatedButton
                  variant="empty"
                  :text="t('info-box-projects-button')"
                  icon="hammerWrench"
                  success-text="SEE THE PROJECTS"
                  :gradient-from="currentProfile.gradientFromOklch"
                  :gradient-to="currentProfile.gradientToOklch"
                  :border-color="currentProfile.borderColor"
                  :hover-border-color="currentProfile.borderColor"
                  :click="scrollToProjects"
              />
            </div>
          </div>
        </div>
      </div>

      <SocialsModal :is-open="isSocialsModalOpen" @close="closeSocialsModal" />
    </CardBackground>
  </div>
</template>

<style>
@keyframes spin-3d {
  0% { transform: rotateY(0deg) scale(1); }
  50% { transform: rotateY(90deg) scale(0.95); }
  100% { transform: rotateY(360deg) scale(1); }
}
@keyframes text-spin {
  0% { transform: rotateX(0deg); opacity: 1; }
  50% { transform: rotateX(90deg); opacity: 0.3; }
  100% { transform: rotateX(360deg); opacity: 1; }
}
@keyframes cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.2; }
}
.animate-spin-3d { animation: spin-3d 0.6s ease-in-out; }
.animate-text-spin { animation: text-spin 0.6s ease-in-out; }
.animate-cursor-blink { animation: cursor-blink 1s infinite; }
</style>