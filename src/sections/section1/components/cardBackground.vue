<script setup>
  import { onMounted, onUnmounted, ref, computed } from 'vue'

  const props = defineProps({
    items: { type: Array, default: () => [] },
    className: { type: String, default: '' },
    radius: { type: Number, default: 300 },
    damping: { type: Number, default: 0.45 },
    fadeOut: { type: Number, default: 0.6 },
    ease: { type: String, default: 'power3.out' }
  })

  const rootRef = ref(null)
  const mouseX = ref(0)
  const mouseY = ref(0)
  const data = computed(() => props.items)

  let removeListeners = null
  const enableEffects = ref(false)
  const hasMouseDevice = ref(false)

  onMounted(() => {
    const el = rootRef.value
    if (!el) return

    const checkMouseCapability = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches
      const hasHover = window.matchMedia('(hover: hover)').matches
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      hasMouseDevice.value = hasFinePointer && hasHover
      enableEffects.value = hasMouseDevice.value && !hasReducedMotion
    }

    checkMouseCapability()

    const init = () => {
      if (!enableEffects.value) return

      const rect = el.getBoundingClientRect()
      mouseX.value = rect.width / 2
      mouseY.value = rect.height / 2
      el.style.setProperty('--mouse-x', `${mouseX.value}px`)
      el.style.setProperty('--mouse-y', `${mouseY.value}px`)
    }

    const handleGlobalMouseMove = (event) => {
      if (!enableEffects.value) return
      const rect = el.getBoundingClientRect()
      mouseX.value = event.clientX - rect.left
      mouseY.value = event.clientY - rect.top
      el.style.setProperty('--mouse-x', `${mouseX.value}px`)
      el.style.setProperty('--mouse-y', `${mouseY.value}px`)
    }

    if (enableEffects.value) {
      init()
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('resize', init)

      removeListeners = () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('resize', init)
      }
    }

    const mediaQueryList = window.matchMedia('(pointer: fine)')
    const handleMediaQueryChange = () => {
      checkMouseCapability()
      if (enableEffects.value && !removeListeners) {
        init()
        window.addEventListener('mousemove', handleGlobalMouseMove)
        window.addEventListener('resize', init)
        removeListeners = () => {
          window.removeEventListener('mousemove', handleGlobalMouseMove)
          window.removeEventListener('resize', init)
        }
      } else if (!enableEffects.value && removeListeners) {
        removeListeners()
        removeListeners = null
      }
    }

    mediaQueryList.addEventListener('change', handleMediaQueryChange)

    const originalRemoveListeners = removeListeners
    removeListeners = () => {
      if (originalRemoveListeners) originalRemoveListeners()
      mediaQueryList.removeEventListener('change', handleMediaQueryChange)
    }
  })

  onUnmounted(() => {
    if (removeListeners) removeListeners()
  })

  const handleCardMove = (e) => {
    if (!enableEffects.value) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--card-mouse-x', `${x}px`)
    card.style.setProperty('--card-mouse-y', `${y}px`)
  }
</script>

<template>
  <div
      ref="rootRef"
      class="relative w-full h-full flex flex-wrap justify-center items-start gap-1"
      :style="{ '--mouse-x': '50%', '--mouse-y': '50%', '--radius': `${radius}px` }"
  >
    <article
        v-for="(c, i) in data"
        :key="i"
        class="group relative flex flex-col w-full rounded-[20px] overflow-hidden bg-[linear-gradient(to bottom, color-mix(in oklch, var(--bg-light) 25%, transparent), color-mix(in oklch, var(--bg) 15%, transparent))] backdrop-blur-sm dark:border-r dark:border-b dark:border-l dark:border-(--border-muted) border-t-[1px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight) transition-all duration-300 p-4 sm:p-6 md:p-8 shadow-2xl"
        :style="{
        '--card-mouse-x': '50%',
        '--card-mouse-y': '50%',
        '--card-border': c.borderColor || 'transparent',
        cursor: c.url ? 'pointer' : 'default'
      }"
        @mousemove="handleCardMove"
    >
      <slot></slot>
    </article>

    <div
        v-if="hasMouseDevice"
        class="absolute inset-0 pointer-events-none z-20 hidden sm:block"
        :style="{
        background: enableEffects
          ? `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, transparent 90%)`
          : 'none',
        opacity: enableEffects ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }"
    />
  </div>
</template>