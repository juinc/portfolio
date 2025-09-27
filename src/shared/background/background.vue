<script setup>
  import Aurora from '@/shared/background/backgroundEffects/Aurora.vue'
  import Particles from '@/shared/background/backgroundEffects/Particles.vue'
  import { ref, onMounted, onUnmounted, nextTick, reactive } from 'vue'

  const config = reactive({
    baseColor: 'var(--bg-extra-light)',
    smoothSpeed: 0.65,
    smoothIntensity: 0.75,
    rippleSpeed: 0.02,
    rippleMaxRadius: 300,
    randomLightInterval: 150,
    randomLightDuration: 800,
    fadeOutDuration: 600,
    fadeOutSmoothing: 0.92,
    maxWords: 200
  })

  const isTouch = ref(false)
  const hasMouse = ref(true)
  const containerRef = ref(null)
  const wordRefs = ref([])
  const mousePosition = ref({ x: -1000, y: -1000 })
  const smoothMousePosition = ref({ x: -1000, y: -1000 })
  const words = ref([])
  const ripples = ref([])
  const animationFrame = ref(null)
  const randomLightTimer = ref(null)
  const isInitialized = ref(false)

  const ripplePool = ref([])
  const maxPoolSize = 15

  const fontFamilies = [
    'font-bg-roboto',
    'font-bg-sirivennela',
    'font-bg-dancing',
    'font-bg-pacifico',
    'font-bg-rubik-Doodle',
    'font-bg-sometype',
  ]

  const fontWeights = ['font-normal', 'font-medium', 'font-semibold', 'font-bold']

  const vibrantColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
  ]

  const colorCache = new Map()
  const getColorValues = (color) => {
    if (colorCache.has(color)) return colorCache.get(color)

    const values = {
      hex: color,
      rgba: (alpha) => `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
    }

    colorCache.set(color, values)
    return values
  }

  const detectDevice = () => {
    isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    hasMouse.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }

  const getInitialMousePosition = () => {
    return new Promise((resolve) => {
      if (!hasMouse.value) {
        resolve({ x: -1000, y: -1000 })
        return
      }

      const handleInitialMouseMove = (event) => {
        const rect = containerRef.value?.getBoundingClientRect()
        if (rect) {
          const initialPos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          }

          mousePosition.value = initialPos
          smoothMousePosition.value = { ...initialPos }

          window.removeEventListener('mousemove', handleInitialMouseMove)
          resolve(initialPos)
        }
      }

      window.addEventListener('mousemove', handleInitialMouseMove, { once: true, passive: true })

      setTimeout(() => {
        window.removeEventListener('mousemove', handleInitialMouseMove)
        resolve({ x: -1000, y: -1000 })
      }, 100)
    })
  }

  const getFontSizeClass = (screenWidth) => {
    const sizeMap = {
      mobile: ['text-xs', 'text-sm', 'text-base'],
      tablet: ['text-sm', 'text-base', 'text-lg', 'text-xl'],
      desktop: ['text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl']
    }

    const category = screenWidth < 640 ? 'mobile' : screenWidth < 1024 ? 'tablet' : 'desktop'
    const sizes = sizeMap[category]
    return sizes[Math.floor(Math.random() * sizes.length)]
  }

  const calculateWordCount = () => {
    const { innerWidth: width, innerHeight: height } = window
    const density = width < 640 ? 80 : width < 1024 ? 100 : 90
    const heightDensity = width < 640 ? 120 : width < 1024 ? 100 : 70

    const calculated = Math.floor((width / density) * (height / heightDensity))
    return Math.min(calculated, config.maxWords)
  }

  const getRandomColor = () => vibrantColors[Math.floor(Math.random() * vibrantColors.length)]

  const initializeWords = async () => {
    const wordCount = calculateWordCount()
    const screenWidth = window.innerWidth

    words.value = Array.from({ length: wordCount }, (_, i) => ({
      id: i,
      fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
      fontWeight: fontWeights[Math.floor(Math.random() * fontWeights.length)],
      fontSize: getFontSizeClass(screenWidth),
      opacity: 0.4 + Math.random() * 0.3,
      color: getRandomColor(),
      colorValues: null,
      currentIntensity: 0,
      position: { x: 0, y: 0 },
      randomLightTimer: 0,
      isRandomLit: false,
      effectSource: 'none',
      rippleCenter: { x: 0, y: 0 },
      isFadingOut: false,
      fadeOutStartTime: 0,
      fadeOutStartIntensity: 0,
      lastActiveEffectSource: 'none',
      lastRippleCenter: { x: 0, y: 0 }
    }))

    words.value.forEach(word => {
      word.colorValues = getColorValues(word.color)
    })

    await nextTick()
    await updateWordPositions()
  }

  const setWordRef = (el, index) => {
    if (el) wordRefs.value[index] = el
  }

  const updateWordPositions = async () => {
    const containerRect = containerRef.value?.getBoundingClientRect()
    if (!containerRect) return

    await nextTick()

    let attempts = 0
    const maxAttempts = 3

    const tryUpdatePositions = () => {
      attempts++
      let updatedCount = 0

      wordRefs.value.forEach((el, index) => {
        if (el && words.value[index]) {
          const rect = el.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            words.value[index].position = {
              x: rect.left + rect.width / 2 - containerRect.left,
              y: rect.top + rect.height / 2 - containerRect.top
            }
            updatedCount++
          }
        }
      })

      if (updatedCount < words.value.length && attempts < maxAttempts) {
        setTimeout(tryUpdatePositions, 50)
      }
    }

    tryUpdatePositions()
  }

  const createRipple = (x, y, intensity = 1) => {
    const ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      radius: 0,
      maxRadius: config.rippleMaxRadius * intensity,
      intensity,
      startTime: performance.now()
    }

    ripples.value.push(ripple)

    if (ripples.value.length > maxPoolSize) {
      ripples.value.splice(0, ripples.value.length - maxPoolSize)
    }
  }

  const triggerRipple = (x, y, intensity = 1) => {
    const rect = containerRef.value?.getBoundingClientRect()
    if (!rect) return

    createRipple(x, y, intensity)
  }

  const startRandomLighting = () => {
    if (!isTouch.value || hasMouse.value) return

    randomLightTimer.value = setInterval(() => {
      const word = words.value[Math.floor(Math.random() * words.value.length)]
      if (word && !word.isRandomLit) {
        word.isRandomLit = true
        word.randomLightTimer = performance.now()
      }
    }, config.randomLightInterval)
  }

  const getDistance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)

  const getAngle = (word, sourceX = null, sourceY = null) => {
    const sourcePositionX = sourceX !== null ? sourceX : smoothMousePosition.value.x
    const sourcePositionY = sourceY !== null ? sourceY : smoothMousePosition.value.y

    const dx = sourcePositionX - word.position.x
    const dy = sourcePositionY - word.position.y
    return Math.atan2(dy, dx) * 57.2958 + 270
  }

  const startFadeOut = (word, currentTime) => {
    if (word.currentIntensity > 0.01) {
      word.isFadingOut = true
      word.fadeOutStartTime = currentTime
      word.fadeOutStartIntensity = word.currentIntensity
      word.lastActiveEffectSource = word.effectSource
      word.lastRippleCenter = { ...word.rippleCenter }
    }
  }

  const getFadeOutIntensity = (word, currentTime) => {
    if (!word.isFadingOut) return 0

    const elapsed = currentTime - word.fadeOutStartTime
    const progress = Math.min(elapsed / config.fadeOutDuration, 1)

    const fadeProgress = 1 - Math.pow(progress, 2)

    if (progress >= 1) {
      word.isFadingOut = false
      return 0
    }

    return word.fadeOutStartIntensity * fadeProgress
  }

  const animateWords = (currentTime) => {
    if (isInitialized.value) {
      const { x: mx, y: my } = mousePosition.value
      const { x: smx, y: smy } = smoothMousePosition.value

      smoothMousePosition.value.x += (mx - smx) * config.smoothSpeed
      smoothMousePosition.value.y += (my - smy) * config.smoothSpeed
    }

    ripples.value = ripples.value.filter(ripple => {
      const elapsed = currentTime - ripple.startTime
      const progress = elapsed / 1000

      if (progress >= 1) return false

      ripple.radius = ripple.maxRadius * progress
      return true
    })

    const { x: smx, y: smy } = smoothMousePosition.value

    words.value.forEach(word => {
      let targetIntensity = 0
      let effectSource = 'none'
      let rippleCenter = { x: 0, y: 0 }
      let hasActiveEffect = false

      if (smx > -999 && smy > -999) {
        const distance = getDistance(word.position.x, word.position.y, smx, smy)
        const mouseIntensity = Math.max(0, 1 - distance / 250)
        if (mouseIntensity > targetIntensity) {
          targetIntensity = mouseIntensity
          effectSource = 'mouse'
          hasActiveEffect = mouseIntensity > 0.01
        }
      }

      ripples.value.forEach(ripple => {
        const distance = getDistance(word.position.x, word.position.y, ripple.x, ripple.y)
        const rippleWidth = 50
        const rippleEdge = Math.abs(distance - ripple.radius)

        if (rippleEdge < rippleWidth) {
          const rippleIntensity = (1 - rippleEdge / rippleWidth) * ripple.intensity
          if (rippleIntensity > targetIntensity) {
            targetIntensity = rippleIntensity
            effectSource = 'ripple'
            rippleCenter = { x: ripple.x, y: ripple.y }
            hasActiveEffect = rippleIntensity > 0.01
          }
        }
      })

      if (word.isRandomLit && isTouch.value && !hasMouse.value) {
        const elapsed = currentTime - word.randomLightTimer
        const lightProgress = elapsed / config.randomLightDuration

        let lightIntensity = 0
        if (lightProgress <= 1.2) {
          const sineProgress = Math.min(lightProgress, 1)
          lightIntensity = Math.sin(sineProgress * Math.PI) * 0.8
        }

        if (lightProgress > 1 && lightIntensity < 0.01) {
          word.isRandomLit = false
          lightIntensity = 0
        }

        if (lightIntensity > targetIntensity) {
          targetIntensity = lightIntensity
          effectSource = 'auto-glow'
          hasActiveEffect = lightIntensity > 0.01
        }
      }

      if (effectSource === 'mouse') {
        if (word.isFadingOut) {
          word.isFadingOut = false
        }
        word.currentIntensity += (targetIntensity - word.currentIntensity) * config.smoothIntensity
        word.effectSource = effectSource
        word.rippleCenter = rippleCenter

      } else if (hasActiveEffect) {
        if (word.isFadingOut) {
          word.isFadingOut = false
        }
        word.currentIntensity += (targetIntensity - word.currentIntensity) * config.smoothIntensity
        word.effectSource = effectSource
        word.rippleCenter = rippleCenter

      } else {
        if (word.currentIntensity > 0.01 && !word.isFadingOut && word.effectSource !== 'mouse') {
          if (word.effectSource === 'ripple') {
            startFadeOut(word, currentTime)
          }
        }

        if (word.isFadingOut) {
          const fadeIntensity = getFadeOutIntensity(word, currentTime)
          word.currentIntensity = fadeIntensity
          word.effectSource = word.lastActiveEffectSource
          word.rippleCenter = word.lastRippleCenter
        } else if (word.effectSource === 'mouse') {
          word.currentIntensity = 0
          word.effectSource = 'none'
        } else {
          word.currentIntensity += (targetIntensity - word.currentIntensity) * config.smoothIntensity
          if (word.currentIntensity < 0.01) {
            word.currentIntensity = 0
            word.effectSource = 'none'
          }
        }
      }
    })

    animationFrame.value = requestAnimationFrame(animateWords)
  }

  const handleMouseMove = (event) => {
    if (!hasMouse.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const newPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }

    mousePosition.value = newPosition

    if (!isInitialized.value) {
      smoothMousePosition.value = { ...newPosition }
      isInitialized.value = true
    }
  }

  const handleTouch = (event) => {
    event.preventDefault()
    const rect = containerRef.value.getBoundingClientRect()
    const touch = event.touches[0] || event.changedTouches[0]

    if (touch) {
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      const newPosition = { x, y }
      mousePosition.value = newPosition

      if (!isInitialized.value) {
        smoothMousePosition.value = { ...newPosition }
        isInitialized.value = true
      }

      if (event.type === 'touchstart') {
        createRipple(x, y, 0.8)
      }
    }
  }

  const getWordStyle = (word) => {
    const intensity = word.currentIntensity

    return {
      transform: `scale(${1 + intensity * 0.3})`,
      opacity: word.opacity + intensity * 0.5,
      zIndex: Math.floor(intensity * 10),
      transition: intensity > 0.01
          ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
          : 'none'
    }
  }

  const getGradientStyle = (word) => {
    const intensity = word.currentIntensity

    if (intensity < 0.01) {
      return {
        color: config.baseColor,
        background: 'transparent',
        WebkitTextFillColor: 'inherit',
        filter: 'none'
      }
    }

    const gradientColor = word.color

    if (word.effectSource === 'auto-glow') {
      return {
        color: gradientColor,
        background: 'transparent',
        WebkitTextFillColor: 'inherit',
        filter: `brightness(${1 + intensity * 1.2}) saturate(${1 + intensity * 0.8})`,
        transition: 'all 0.1s ease-out'
      }
    }

    let angle
    if (word.effectSource === 'ripple') {
      angle = getAngle(word, word.rippleCenter.x, word.rippleCenter.y)
    } else {
      angle = getAngle(word)
    }

    const alpha = Math.min(intensity * 1.3, 1)
    const colorEndPercent = alpha * 60
    const fadeStartPercent = alpha * 80

    return {
      background: `linear-gradient(${angle}deg, ${gradientColor} 0%, ${gradientColor} ${colorEndPercent}%, ${config.baseColor} ${fadeStartPercent}%, ${config.baseColor} 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: config.baseColor, // Fallback
      filter: `brightness(${1 + intensity * 0.6}) saturate(${1 + intensity * 0.5})`,
      transition: (word.isFadingOut && word.effectSource === 'ripple') ? `all ${config.fadeOutDuration}ms ease-out` : 'none'
    }
  }

  onMounted(async () => {
    detectDevice()
    await initializeWords()

    setTimeout(async () => {
      await getInitialMousePosition()
      isInitialized.value = true
    }, 100)

    animateWords()

    if (isTouch.value && !hasMouse.value) {
      startRandomLighting()
    }

    const handleGlobalMouseMove = (event) => {
      if (!hasMouse.value) return
      const rect = containerRef.value?.getBoundingClientRect()
      if (rect) {
        const newPosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
        mousePosition.value = newPosition

        if (!isInitialized.value) {
          smoothMousePosition.value = { ...newPosition }
          isInitialized.value = true
        }
      }
    }

    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(async () => {
        detectDevice()
        await initializeWords()

        isInitialized.value = false

        setTimeout(async () => {
          await getInitialMousePosition()
          isInitialized.value = true
        }, 150)

        if (randomLightTimer.value) {
          clearInterval(randomLightTimer.value)
        }

        if (isTouch.value && !hasMouse.value) {
          startRandomLighting()
        }
      }, 300)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    onUnmounted(() => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('resize', handleResize)
      if (animationFrame.value) cancelAnimationFrame(animationFrame.value)
      if (randomLightTimer.value) clearInterval(randomLightTimer.value)
      clearTimeout(resizeTimeout)

      colorCache.clear()
    })
  })

  defineExpose({
    triggerRipple,

    createRipple: (x, y, intensity = 1) => {
      const rect = containerRef.value?.getBoundingClientRect()
      if (rect) {
        createRipple(x - rect.left, y - rect.top, intensity)
      }
    }
  })
</script>

<template>
  <Particles />
  <div
      ref="containerRef"
      class="w-full h-[400vh] overflow-hidden p-8 bg-none absolute top-0 left-0"
      @mousemove="handleMouseMove"
      @touchstart="handleTouch"
      @touchmove="handleTouch"
  >
    <div
        class="w-full h-full flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8"
        style="transform: rotate(-20deg) scale(1.6);"
    >
      <div
          v-for="(word, index) in words"
          :key="word.id"
          :ref="el => setWordRef(el, index)"
          :style="getWordStyle(word)"
          :class="[word.fontFamily, word.fontWeight, word.fontSize]"
          class="word-element flex-shrink-0"
      >
        <span
            class="block"
            :style="getGradientStyle(word)"
        >
          JULIAN
        </span>
      </div>
    </div>
  </div>

  <div class="aurora-container absolute top-0 left-0 w-full h-full">
    <Aurora
        :amplitude="0.8"
        :blend="0.5"
        :speed="0.5"
        :intensity="0.25"
        class="w-full h-full"
    />
  </div>
</template>

<style scoped>
.word-element {
  will-change: transform, opacity;
  cursor: default;
  user-select: none;
  contain: layout style paint;
}

span {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  will-change: background, filter;
  contain: paint;
  background-clip: text;
  -webkit-background-clip: text;
}

@media (max-width: 640px) {
  .word-element {
    margin: 0.25rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .word-element {
    margin: 0.5rem;
  }
}

@media (min-width: 1025px) {
  .word-element {
    margin: 0.75rem;
  }
}

.aurora-container {
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
}
</style>