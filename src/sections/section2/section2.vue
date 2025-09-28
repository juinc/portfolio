<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import CppIcon from '@/assets/icons/tech/cpp.svg'
import LuaIcon from '@/assets/icons/tech/lua.svg'
import HTMLIcon from '@/assets/icons/tech/html.svg'
import CssIcon from '@/assets/icons/tech/css.svg'
import JSIcon from '@/assets/icons/tech/js.svg'
import PythonIcon from '@/assets/icons/tech/python.svg'
import VueIcon from '@/assets/icons/tech/vue.svg'
import TailwindIcon from '@/assets/icons/tech/tailwind.svg'
import FlutterIcon from '@/assets/icons/tech/flutter.svg'

const { t } = useI18n()

const techItems = [
  { title: 'C++', descKey: 'tech-cpp-desc', icons: [{ component: CppIcon, label: 'C++ logo' }] },
  { title: 'LUA / LUAU', descKey: 'tech-lua-desc', icons: [{ component: LuaIcon, label: 'Lua logo' }] },
  {
    title: 'HTML, CSS, JAVASCRIPT',
    descKey: 'tech-web-desc',
    icons: [
      { component: HTMLIcon, label: 'HTML logo' },
      { component: CssIcon, label: 'CSS logo' },
      { component: JSIcon, label: 'JS logo' }
    ]
  },
  { title: 'PYTHON', descKey: 'tech-py-desc', icons: [{ component: PythonIcon, label: 'Python logo' }] },
  {
    title: 'VUE, TAILWINDCSS',
    descKey: 'tech-vue-desc',
    icons: [
      { component: VueIcon, label: 'Vue logo' },
      { component: TailwindIcon, label: 'Tailwind logo' }
    ]
  },
  { title: 'FLUTTER', descKey: 'tech-flutter-desc', icons: [{ component: FlutterIcon, label: 'Flutter logo' }] }
]

const aboutRef = ref(null)
const langRef = ref(null)
const techRef = ref(null)

const aboutInView = ref(false)
const langInView = ref(false)
const techInView = ref(false)

function setupReveal(targetRef, stateRef, { threshold = 0.2, rootMargin = '0px 0px -5% 0px', once = true } = {}) {
  let observer = null

  const observe = () => {
    if (!targetRef.value || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      stateRef.value = true
      return
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stateRef.value = true
          if (once && observer) observer.unobserve(entry.target)
        } else if (!once) {
          stateRef.value = false
        }
      })
    }, { threshold, rootMargin })

    observer.observe(targetRef.value)
  }

  onMounted(async () => {
    await nextTick()
    observe()
  })

  onBeforeUnmount(() => {
    if (observer && targetRef.value) observer.unobserve(targetRef.value)
    if (observer) observer.disconnect()
  })
}

setupReveal(aboutRef, aboutInView, { threshold: 0.25, rootMargin: '0px 0px -10% 0px', once: true })
setupReveal(langRef, langInView, { threshold: 0.25, rootMargin: '0px 0px -10% 0px', once: true })
setupReveal(techRef, techInView, { threshold: 0.25, rootMargin: '0px 0px -10% 0px', once: true })

function revealClasses(isVisible, direction = 'up', delay = 0) {
  const hiddenBase = 'opacity-0 motion-reduce:opacity-100'
  const shownBase = 'opacity-100'

  const dirHidden = {
    left: '-translate-x-8',
    right: 'translate-x-8',
    up: '-translate-y-8',
    down: 'translate-y-8'
  }[direction] || 'translate-y-8'

  const dirShown = 'translate-x-0 translate-y-0'

  const delayClass = delay ? `delay-[${delay}ms]` : ''

  return [
    'transform-gpu transition-all duration-700 ease-out',
    'motion-reduce:transition-none motion-reduce:transform-none',
    isVisible ? `${shownBase} ${dirShown}` : `${hiddenBase} ${dirHidden}`,
    delayClass
  ].join(' ')
}

function blurClasses(isVisible) {
  return [
    'transition-all duration-700 ease-out',
    'motion-reduce:transition-none',
    isVisible ? 'backdrop-blur-sm' : 'backdrop-blur-none'
  ].join(' ')
}

const gradientBeforeBase = [
  'relative isolate',
  "before:content-[''] before:absolute before:inset-0 before:rounded-4xl",
  'before:pointer-events-none',
  'before:transition-opacity before:duration-700 before:ease-out',
  "before:bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]"
].join(' ')

function gradientBeforeVisibility(isVisible) {
  return isVisible
      ? 'before:opacity-100'
      : 'before:opacity-0 motion-reduce:before:opacity-100'
}

const setVh = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

onMounted(() => {
  setVh()
  window.addEventListener('resize', setVh)
  window.addEventListener('orientationchange', setVh)
  if (window.visualViewport) window.visualViewport.addEventListener('resize', setVh)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVh)
  window.removeEventListener('orientationchange', setVh)
  if (window.visualViewport) window.visualViewport.removeEventListener('resize', setVh)
})
</script>

<template>
  <section id="section-2" class="relative overflow-visible lg:overflow-hidden min-h-[calc(var(--vh,1vh)*100)] lg:h-screen max-h-none lg:max-h-[1000px]">
    <div
        class="relative mx-auto max-w-screen-2xl grid gap-6
             w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[90vw] xl:w-[90vw] 2xl:w-[70vw]
             h-auto lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:h-[70vh] lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2
             2xl:h-[87vh] 2xl:grid-cols-2 2xl:gap-15 max-h-none lg:max-h-[900px]"
    >
      <div class="flex flex-col gap-6 lg:min-h-0 lg:h-full 2xl:gap-15">
        <div
            ref="aboutRef"
            :data-visible="aboutInView"
            :class="[
            gradientBeforeBase,
            gradientBeforeVisibility(aboutInView),
            blurClasses(aboutInView),
            'dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)',
            'border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)',
            'shadow-lg rounded-4xl px-6 py-6 2xl:px-10 2xl:py-10',
            'flex flex-col',
            revealClasses(aboutInView, 'left', 0)
          ]"
        >
          <p class="font-bg-rubik font-bold text-2xl sm:text-3xl lg:text-4xl 2xl:text-4xl text-(--text-muted) mb-4" style="font-weight: bold">
            {{ t('about-me-title') }}
          </p>
          <p class="font-bg-rubik font-bold xl:text-lg 2xl:max-4xl:text-lg 4xl:text-xl sm:text-base md:text-base text-(--text) whitespace-pre-line leading-relaxed break-words">
            {{ t('about-me-description-top') }} <br /><br /> {{ t('about-me-description-bottom') }}
          </p>
        </div>

        <div
            ref="langRef"
            :data-visible="langInView"
            :class="[
            gradientBeforeBase,
            gradientBeforeVisibility(langInView),
            blurClasses(langInView),
            'flex flex-col',
            'dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)',
            'border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)',
            'shadow-lg rounded-4xl px-6 py-6 2xl:px-10 2xl:py-10',
            'flex-1 min-h-0 lg:overflow-hidden',
            revealClasses(langInView, 'right', 100)
          ]"
        >
          <p class="font-bg-rubik font-bold text-2xl sm:text-3xl lg:text-4xl 2xl:text-4xl text-(--text-muted) mb-4 flex-shrink-0" style="font-weight: bold">
            {{ t('section-2-lang-title') }}
          </p>
          <div class="flex-1 overflow-visible lg:overflow-y-auto lg:overscroll-contain">
            <ul class="font-bg-rubik font-bold text-base sm:text-lg lg:text-lg xl:text-xl 2xl:max-4xl:text-lg 4xl:text-xl text-(--text) list-disc ml-6 space-y-1 pr-2">
              <li class="break-words hyphens-auto">{{ t('section-2-eng-lang') }}</li>
              <li class="break-words hyphens-auto">{{ t('section-2-ro-lang') }}</li>
              <li class="break-words hyphens-auto">{{ t('section-2-es-lang') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="min-h-0 flex flex-col lg:h-full">
        <div
            ref="techRef"
            :data-visible="techInView"
            :class="[
            gradientBeforeBase,
            gradientBeforeVisibility(techInView),
            blurClasses(techInView),
            'flex flex-col min-h-0 md:flex-1 lg:h-full',
            'dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)',
            'border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)',
            'shadow-lg rounded-4xl px-6 py-6 2xl:px-10 2xl:py-10',
            revealClasses(techInView, 'down', 200)
          ]"
        >
          <p class="font-bg-rubik font-bold text-2xl sm:text-3xl lg:text-4xl 2xl:text-4xl text-(--text-muted) mb-4 flex-shrink-0" style="font-weight: bold">
            {{ t('tech-title') }}
          </p>

          <div
              class="flex-1 min-h-0 dark:border dark:border-(--border-muted) lg:overflow-y-auto overflow-visible lg:overscroll-contain
                   rounded-4xl p-3 sm:p-4 bg-none max-h-none scrollbar-hide flex flex-col gap-2
                   shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]"
          >
            <div
                v-for="(item, index) in techItems"
                :key="index"
                class="px-3 sm:px-4 py-3 bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                     backdrop-blur-none dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                     border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                     shadow-lg rounded-2xl flex flex-row items-center gap-3 transition-colors hover:bg-(--bg-extra-light)
                     w-full max-w-full"
            >
              <div class="shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 2xl:w-[20%] 2xl:h-full">
                <div v-if="item.icons.length === 1" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 2xl:w-full 2xl:aspect-square">
                  <component
                      :is="item.icons[0].component"
                      class="w-full h-full fill-current text-(--text)"
                      role="img"
                      :aria-label="item.icons[0].label"
                  />
                </div>
                <div
                    v-else
                    class="flex flex-wrap items-center justify-center gap-2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                         2xl:grid 2xl:grid-cols-2 2xl:grid-rows-2 2xl:gap-2 2xl:w-full 2xl:h-full"
                >
                  <component
                      v-for="(icon, i) in item.icons"
                      :key="i"
                      :is="icon.component"
                      class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 2xl:w-full 2xl:h-full fill-current text-(--text)"
                      role="img"
                      :aria-label="icon.label"
                  />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-bg-roboto font-bold text-lg sm:text-xl md:text-2xl 2xl:text-2xl text-(--text-muted)" style="font-weight: bold">
                  {{ item.title }}
                </p>
                <p class="font-bg-rubik text-sm sm:text-base 2xl:text-md leading-relaxed break-words">
                  {{ t(item.descKey) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>