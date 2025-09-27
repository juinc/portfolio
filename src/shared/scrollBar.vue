<script setup>
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const isTabletOrAbove = ref(false)

  const sections = computed(() => [
    { label: t('scroll-bar-home'), id: 'section-1' },
    { label: t('scroll-bar-ab-me'), id: 'section-2' },
    { label: t('scroll-bar-projects'), id: 'section-3' },
    { label: t('scroll-bar-socials'), id: 'section-4' }
  ])

  const currentSection = ref(0)
  const hoveredSection = ref(null)
  const scrollPosition = ref(0)
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 0)
  const documentHeight = ref(0)
  const reachedSections = ref([false, false, false, false])
  const scrollIndicatorPosition = ref(16)
  const sectionElements = ref([])

  const snappedToSection = ref(null)
  const isSnapping = ref(false)
  const lastScrollTime = ref(0)
  const scrollVelocity = ref(0)
  const lastScrollPosition = ref(0)

  const CONTAINER_HEIGHT = 400
  const CIRCLE_SIZE = 32
  const SNAP_THRESHOLD = 0.35
  const SCROLL_SNAP_THRESHOLD = 0.2
  const SCROLL_VELOCITY_THRESHOLD = 2
  const SNAP_DELAY = 150
  const TABLET_BREAKPOINT = 1535

  let scrollSnapTimeout = null
  let velocityCheckInterval = null

  const checkScreenSize = () => {
    const wasTabletOrAbove = isTabletOrAbove.value
    isTabletOrAbove.value = window.innerWidth >= TABLET_BREAKPOINT

    if (wasTabletOrAbove && !isTabletOrAbove.value) {
      cleanupScrollbarFunctionality()
    }

    else if (!wasTabletOrAbove && isTabletOrAbove.value) {
      initializeScrollbarFunctionality()
    }
  }

  const cleanupScrollbarFunctionality = () => {
    if (scrollSnapTimeout) {
      clearTimeout(scrollSnapTimeout)
      scrollSnapTimeout = null
    }
    if (velocityCheckInterval) {
      clearInterval(velocityCheckInterval)
      velocityCheckInterval = null
    }
  }

  const initializeScrollbarFunctionality = () => {
    setTimeout(() => {
      initializeSections()
      handleScroll()
      startVelocityMonitoring()
    }, 500)
  }

  const getCirclePosition = (index) => {
    if (sections.value.length === 0) return 16
    const totalRange = CONTAINER_HEIGHT - CIRCLE_SIZE
    const step = totalRange / (sections.value.length - 1)
    return (CIRCLE_SIZE / 2) + (index * step)
  }

  const progressHeight = computed(() => {
    const scrollable = documentHeight.value - windowHeight.value
    if (scrollable <= 0) return 0
    return Math.min(100, (scrollPosition.value / scrollable) * 100)
  })

  const initializeSections = async () => {
    if (!isTabletOrAbove.value) return

    await nextTick()

    const elements = []
    for (let i = 1; i <= 4; i++) {
      let element = document.querySelector(`[class*="Section${i}"]`) ||
          document.querySelector(`#section-${i}`) ||
          document.querySelector(`.section-${i}`)

      if (!element) {
        const allSections = document.querySelectorAll('section, [class*="Section"], div[class*="section"]')
        if (allSections[i - 1]) {
          element = allSections[i - 1]
        }
      }

      if (element) {
        elements.push(element)
      }
    }

    if (elements.length < 4) {
      const totalHeight = document.documentElement.scrollHeight
      const sectionHeight = totalHeight / 4
      for (let i = 0; i < 4; i++) {
        elements[i] = {
          offsetTop: i * sectionHeight,
          offsetHeight: sectionHeight,
          getBoundingClientRect: () => ({
            top: (i * sectionHeight) - scrollPosition.value,
            height: sectionHeight
          })
        }
      }
    }

    sectionElements.value = elements
    documentHeight.value = document.documentElement.scrollHeight
  }

  const updateScrollIndicator = () => {
    if (!isTabletOrAbove.value || sections.value.length === 0) return

    const scrollable = documentHeight.value - windowHeight.value
    if (scrollable <= 0) {
      scrollIndicatorPosition.value = getCirclePosition(0)
      return
    }

    const scrollPercentage = Math.min(1, Math.max(0, scrollPosition.value / scrollable))
    const firstCirclePos = getCirclePosition(0)
    const lastCirclePos = getCirclePosition(sections.value.length - 1)
    const range = lastCirclePos - firstCirclePos

    let position = firstCirclePos + (scrollPercentage * range)

    let closestSection = null
    let minDistance = Infinity
    let snapData = null

    for (let i = 0; i < sections.value.length; i++) {
      const circlePos = getCirclePosition(i)
      const distance = Math.abs(position - circlePos)
      const segmentSize = range / (sections.value.length - 1)
      const snapThreshold = segmentSize * SNAP_THRESHOLD

      if (distance < minDistance) {
        minDistance = distance
        closestSection = i
      }

      if (distance < snapThreshold) {
        snapData = {
          index: i,
          circlePos,
          distance,
          threshold: snapThreshold
        }
      }
    }

    if (snapData) {
      const { index, circlePos, distance, threshold } = snapData

      const pullStrength = 1 - (distance / threshold)
      const direction = circlePos > position ? 1 : -1
      const magneticOffset = distance * pullStrength * 0.9 * direction

      position += magneticOffset

      if (snappedToSection.value !== index) {
        snappedToSection.value = index
        isSnapping.value = true
        setTimeout(() => {
          isSnapping.value = false
        }, 400)
      }
    } else {
      snappedToSection.value = null
    }

    position = Math.max(firstCirclePos, Math.min(lastCirclePos, position))
    scrollIndicatorPosition.value = position
  }

  const calculateScrollVelocity = () => {
    if (!isTabletOrAbove.value) return

    const now = performance.now()
    const timeDelta = now - lastScrollTime.value
    const positionDelta = scrollPosition.value - lastScrollPosition.value

    if (timeDelta > 0) {
      scrollVelocity.value = Math.abs(positionDelta / timeDelta) * 16.67
    }

    lastScrollTime.value = now
    lastScrollPosition.value = scrollPosition.value
  }

  const checkScrollSnapping = () => {
    if (!isTabletOrAbove.value) return

    if (scrollVelocity.value < SCROLL_VELOCITY_THRESHOLD && sectionElements.value.length > 0) {
      const viewportMiddle = scrollPosition.value + windowHeight.value / 2

      const sectionDistances = sectionElements.value.map((element, index) => {
        if (!element) return { index, distance: Infinity, element: null }

        const sectionMiddle = element.offsetTop + (element.offsetHeight || windowHeight.value / 4) / 2
        const distance = Math.abs(viewportMiddle - sectionMiddle)

        return { index, distance, element, sectionMiddle }
      }).filter(item => item.element !== null)

      sectionDistances.sort((a, b) => a.distance - b.distance)

      if (sectionDistances.length > 0) {
        const closest = sectionDistances[0]
        const element = closest.element
        const sectionHeight = element.offsetHeight || windowHeight.value / 4
        const snapDistance = sectionHeight * SCROLL_SNAP_THRESHOLD

        if (closest.distance < snapDistance) {
          const currentMiddle = viewportMiddle
          const targetMiddle = closest.sectionMiddle
          const scrollDelta = targetMiddle - currentMiddle

          if (Math.abs(scrollDelta) > 10) {
            const targetScrollTop = scrollPosition.value + scrollDelta

            window.scrollTo({
              top: Math.max(0, targetScrollTop),
              behavior: 'smooth'
            })
          }
        }
      }
    }
  }

  const updateCurrentSection = () => {
    if (!isTabletOrAbove.value || sections.value.length === 0) return

    const viewportMiddle = scrollPosition.value + windowHeight.value / 2

    for (let i = sectionElements.value.length - 1; i >= 0; i--) {
      const element = sectionElements.value[i]
      if (element && element.offsetTop <= viewportMiddle) {
        if (currentSection.value !== i) {
          if (!reachedSections.value[i]) {
            reachedSections.value[i] = true
          }
          currentSection.value = i
        }
        break
      }
    }

    updateScrollIndicator()
  }

  const scrollToSection = (index) => {
    if (!isTabletOrAbove.value) return

    const element = sectionElements.value[index]
    if (element) {
      const targetPosition = element.offsetTop || (index * (documentHeight.value / 4))

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  let rafId = null
  const handleScroll = () => {
    if (!isTabletOrAbove.value || rafId) return

    rafId = requestAnimationFrame(() => {
      const newScrollPosition = window.scrollY
      scrollPosition.value = newScrollPosition

      calculateScrollVelocity()
      updateCurrentSection()

      if (scrollSnapTimeout) {
        clearTimeout(scrollSnapTimeout)
      }

      scrollSnapTimeout = setTimeout(checkScrollSnapping, SNAP_DELAY)

      rafId = null
    })
  }

  const handleResize = () => {
    windowHeight.value = window.innerHeight
    checkScreenSize()

    if (isTabletOrAbove.value) {
      initializeSections()
    }
  }

  const startVelocityMonitoring = () => {
    if (!isTabletOrAbove.value) return

    velocityCheckInterval = setInterval(() => {
      if (performance.now() - lastScrollTime.value > 100) {
        scrollVelocity.value *= 0.9
      }
    }, 16)
  }

  onMounted(() => {
    checkScreenSize()

    if (isTabletOrAbove.value) {
      initializeScrollbarFunctionality()
    }
    window.addEventListener('resize', handleResize)
    if (isTabletOrAbove.value) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)

    cleanupScrollbarFunctionality()

    if (rafId) cancelAnimationFrame(rafId)
  })
</script>

<template>
  <div v-if="isTabletOrAbove" class="fixed right-8 top-1/2 -translate-y-1/2 z-50">
    <div class="relative h-[400px] flex items-center justify-center">
      <div class="absolute h-full w-0.5 rounded-full bg-[var(--border-muted)]"></div>

      <div
          class="absolute top-0 w-0.5 rounded-full bg-[var(--border)] transition-all duration-700 ease-out"
          :style="{ height: `${progressHeight}%` }"
      ></div>

      <div class="absolute top-0 h-full w-full flex flex-col justify-between items-center cursor-default">
        <div
            v-for="(section, index) in sections"
            :key="index"
            class="relative group flex items-center justify-center"
        >
          <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-x-2"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 translate-x-2"
          >
            <div
                v-if="hoveredSection === index"
                class="absolute right-full mr-6 top-1/2 -translate-y-1/2"
            >
              <div class="relative bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] border border-[var(--border)] text-[var(--text-muted)] px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
                {{ section.label }}
              </div>
            </div>
          </Transition>

          <button
              @click="scrollToSection(index)"
              @mouseenter="hoveredSection = index"
              @mouseleave="hoveredSection = null"
              class="circle-button relative w-8 h-8 rounded-full focus:outline-none z-10 cursor-pointer"
              :class="[
              currentSection === index ? 'is-active' : '',
              reachedSections[index] ? 'is-reached' : '',
              hoveredSection === index ? 'is-hovered' : '',
              snappedToSection === index ? 'is-snapped' : ''
            ]"
          >
            <span
                v-if="currentSection === index"
                class="absolute inset-0 rounded-full animate-pulse-ring"
            ></span>

            <span
                v-if="snappedToSection === index && currentSection !== index"
                class="absolute inset-0 rounded-full animate-snap-ring"
            ></span>

            <span class="circle-bg bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] backdrop-blur-sm border border-[var(--border)] absolute inset-0 rounded-full"></span>

            <span
                v-if="currentSection === index"
                class="circle-dot absolute inset-2 rounded-full"
            ></span>

            <span class="circle-hover absolute inset-0 rounded-full"></span>
          </button>
        </div>
      </div>

      <div
          v-if="sections.length > 0"
          class="absolute w-3 h-3 pointer-events-none z-20"
          :class="{
          'transition-all duration-300 ease-out': !isSnapping,
          'transition-all duration-500 ease-out': isSnapping
        }"
          :style="{
          top: `${scrollIndicatorPosition}px`,
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }"
      >
        <div class="indicator-wrapper relative">
          <div class="absolute inset-0 rounded-full bg-[var(--border)] opacity-30 blur-sm animate-pulse"
               :class="{ 'animate-snap-glow': isSnapping }"></div>
          <div class="w-3 h-3 rounded-full bg-[var(--bg-extra-light)] shadow-md relative z-10 border border-[var(--border)]"></div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
  .circle-button {
    transform: scale(1);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .circle-bg {
    background: var(--bg-light);
    border: 2px solid var(--border-muted);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(1);
  }


  .circle-hover {
    background: transparent;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0;
  }

  .circle-dot {
    background: var(--border);
    transform: scale(0);
    animation: dot-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .circle-button.is-hovered:not(.is-active) {
    transform: scale(1.2) rotate(5deg);
  }

  .circle-button.is-hovered:not(.is-active) .circle-bg {
    background: var(--bg-small-extra-light);
    border-color: var(--border);
    transform: scale(1.05);
  }

  .circle-button.is-hovered:not(.is-active) .circle-hover {
    background: var(--border);
    opacity: 0.1;
    transform: scale(1.5);
  }

  .circle-button.is-reached:not(.is-active) .circle-bg {
    background: var(--bg-small-extra-light);
    border-color: var(--border);
  }

  .circle-button.is-active {
    transform: scale(1.15);
    animation: active-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .circle-button.is-active .circle-bg {
    background: var(--bg-extra-light);
    border: 2px solid var(--border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1);
  }

  .circle-button.is-active.is-hovered {
    transform: scale(1.25) rotate(-5deg);
  }

  .circle-button.is-active.is-hovered .circle-dot {
    transform: scale(1);
    animation: none;
    animation: dot-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .circle-button.is-snapped:not(.is-active) {
    transform: scale(1.1);
  }

  .circle-button.is-snapped:not(.is-active) .circle-bg {
    background: var(--bg-small-extra-light);
    border-color: var(--border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @keyframes dot-appear {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
  }

  @keyframes active-bounce {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(1.3);
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1.15);
    }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }

  @keyframes snap-ring {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.8);
      opacity: 0.6;
    }
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
  }

  @keyframes snap-glow {
    0% {
      opacity: 0.3;
      filter: blur(2px);
    }
    50% {
      opacity: 0.8;
      filter: blur(4px);
    }
    100% {
      opacity: 0.3;
      filter: blur(2px);
    }
  }

  .animate-pulse-ring {
    background: var(--border);
    opacity: 0;
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-snap-ring {
    background: var(--border);
    opacity: 0;
    animation: snap-ring 1s ease-out infinite;
  }

  .animate-snap-glow {
    animation: snap-glow 0.5s ease-out;
  }

  .indicator-wrapper {
    animation: float 3s ease-in-out infinite;
    transition: transform 0.3s ease-out;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
  }

  .circle-button:focus-visible .circle-bg {
    box-shadow: 0 0 0 3px var(--border), 0 0 0 6px rgba(0, 0, 0, 0.1);
  }
</style>