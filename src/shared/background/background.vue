<script setup>
import Aurora from '@/shared/background/backgroundEffects/Aurora.vue'
import Particles from '@/shared/background/backgroundEffects/Particles.vue'
import { ref, onMounted, onUnmounted, nextTick, reactive, computed } from 'vue'

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
  maxWords: 300,
  // Transform values for the word container
  containerRotation: -20,
  containerScale: 1.6
})

const isTouch = ref(false)
const hasMouse = ref(true)
const containerRef = ref(null)
const wordsContainerRef = ref(null)
const wordRefs = ref([])
const mousePosition = ref({ x: 0, y: 0 })
const smoothMousePosition = ref({ x: 0, y: 0 })
const actualMousePosition = ref({ x: 0, y: 0 }) // Track actual mouse position globally
const words = ref([])
const ripples = ref([])
const animationFrame = ref(null)
const randomLightTimer = ref(null)
const isInitialized = ref(false)
const containerRect = ref(null)
const hasInteraction = ref(false)
const mouseInContainer = ref(false)

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

// Transform point from screen coordinates to transformed container coordinates
const transformPointToContainer = (x, y, containerRect) => {
  if (!containerRect) return { x, y }

  // Get the center of the container
  const centerX = containerRect.width / 2
  const centerY = containerRect.height / 2

  // Translate point relative to center
  const relativeX = x - centerX
  const relativeY = y - centerY

  // Apply inverse rotation
  const angleRad = (-config.containerRotation * Math.PI) / 180
  const cos = Math.cos(angleRad)
  const sin = Math.sin(angleRad)

  const rotatedX = relativeX * cos - relativeY * sin
  const rotatedY = relativeX * sin + relativeY * cos

  // Apply inverse scale
  const scaledX = rotatedX / config.containerScale
  const scaledY = rotatedY / config.containerScale

  // Translate back to container coordinates
  return {
    x: scaledX + centerX,
    y: scaledY + centerY
  }
}

// Improved responsive gap calculation
const getGapClass = computed(() => {
  const width = window.innerWidth
  const height = window.innerHeight
  const aspectRatio = height / width

  if (width < 640) {
    return aspectRatio > 1.5 ? 'gap-2' : 'gap-3'
  } else if (width < 1024) {
    return aspectRatio > 1.3 ? 'gap-3' : 'gap-4'
  } else if (width < 1920) {
    return 'gap-6'
  } else {
    return height > 1080 ? 'gap-6' : 'gap-8'
  }
})

const getFontSizeClass = (screenWidth, screenHeight) => {
  const aspectRatio = screenHeight / screenWidth

  const sizeMap = {
    mobile: aspectRatio > 1.5
        ? ['text-xs', 'text-sm']
        : ['text-xs', 'text-sm', 'text-base'],
    tablet: ['text-sm', 'text-base', 'text-lg', 'text-xl'],
    desktop: screenHeight > 1080
        ? ['text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl']
        : ['text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl']
  }

  const category = screenWidth < 640 ? 'mobile' : screenWidth < 1024 ? 'tablet' : 'desktop'
  const sizes = sizeMap[category]
  return sizes[Math.floor(Math.random() * sizes.length)]
}

const calculateWordCount = () => {
  const { innerWidth: width, innerHeight: height } = window
  const aspectRatio = height / width

  let density, heightDensity

  if (width < 640) {
    density = aspectRatio > 1.5 ? 60 : 70
    heightDensity = aspectRatio > 1.5 ? 80 : 100
  } else if (width < 1024) {
    density = 80
    heightDensity = 90
  } else if (width < 1920) {
    density = 85
    heightDensity = 65
  } else {
    density = width > 2560 ? 70 : 90
    heightDensity = height > 1440 ? 55 : 70
  }

  const calculated = Math.floor((width / density) * (height / heightDensity))
  return Math.min(calculated, config.maxWords)
}

const getRandomColor = () => vibrantColors[Math.floor(Math.random() * vibrantColors.length)]

const initializeWords = async () => {
  const wordCount = calculateWordCount()
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  words.value = Array.from({ length: wordCount }, (_, i) => ({
    id: i,
    fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
    fontWeight: fontWeights[Math.floor(Math.random() * fontWeights.length)],
    fontSize: getFontSizeClass(screenWidth, screenHeight),
    opacity: 0.4 + Math.random() * 0.3,
    color: getRandomColor(),
    colorValues: null,
    currentIntensity: 0,
    position: { x: 0, y: 0 },
    transformedPosition: { x: 0, y: 0 }, // Store transformed position
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
  containerRect.value = containerRef.value?.getBoundingClientRect()
  if (!containerRect.value) return

  await nextTick()

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      wordRefs.value.forEach((el, index) => {
        if (el && words.value[index]) {
          const rect = el.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            // Calculate position relative to container
            const x = rect.left + rect.width / 2 - containerRect.value.left
            const y = rect.top + rect.height / 2 - containerRect.value.top

            // Store both original and transformed positions
            words.value[index].position = { x, y }
            words.value[index].transformedPosition = transformPointToContainer(x, y, containerRect.value)
          }
        }
      })
      resolve()
    })
  })
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
  const rect = containerRect.value || containerRef.value?.getBoundingClientRect()
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

const distanceCache = new Map()
const getDistance = (x1, y1, x2, y2) => {
  const key = `${x1},${y1},${x2},${y2}`
  if (distanceCache.has(key)) return distanceCache.get(key)

  const distance = Math.hypot(x2 - x1, y2 - y1)

  if (distanceCache.size > 1000) {
    distanceCache.clear()
  }

  distanceCache.set(key, distance)
  return distance
}

const getAngle = (word, sourceX = null, sourceY = null) => {
  const sourcePositionX = sourceX !== null ? sourceX : smoothMousePosition.value.x
  const sourcePositionY = sourceY !== null ? sourceY : smoothMousePosition.value.y

  // Use transformed position for angle calculation
  const dx = sourcePositionX - word.transformedPosition.x
  const dy = sourcePositionY - word.transformedPosition.y
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
  if (!hasInteraction.value && isInitialized.value) {
    const hasActiveWords = words.value.some(w => w.currentIntensity > 0.01 || w.isRandomLit)
    if (!hasActiveWords && ripples.value.length === 0) {
      animationFrame.value = requestAnimationFrame(animateWords)
      return
    }
  }

  // Always update smooth mouse position based on actual mouse position
  const { x: mx, y: my } = mousePosition.value
  const { x: smx, y: smy } = smoothMousePosition.value

  // Smooth transition to target position
  const dx = mx - smx
  const dy = my - smy

  if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
    smoothMousePosition.value.x += dx * config.smoothSpeed
    smoothMousePosition.value.y += dy * config.smoothSpeed
  } else {
    smoothMousePosition.value.x = mx
    smoothMousePosition.value.y = my
  }

  // Update ripples
  ripples.value = ripples.value.filter(ripple => {
    const elapsed = currentTime - ripple.startTime
    const progress = elapsed / 1000

    if (progress >= 1) return false

    ripple.radius = ripple.maxRadius * progress
    return true
  })

  const { x: smoothX, y: smoothY } = smoothMousePosition.value

  // Batch word updates
  words.value.forEach(word => {
    let targetIntensity = 0
    let effectSource = 'none'
    let rippleCenter = { x: 0, y: 0 }
    let hasActiveEffect = false

    // Always calculate mouse effect, regardless of position
    const distance = getDistance(word.transformedPosition.x, word.transformedPosition.y, smoothX, smoothY)
    const mouseIntensity = Math.max(0, 1 - distance / 250)
    if (mouseIntensity > targetIntensity) {
      targetIntensity = mouseIntensity
      effectSource = 'mouse'
      hasActiveEffect = mouseIntensity > 0.01
    }

    // Ripple effects - use transformed position
    ripples.value.forEach(ripple => {
      const distance = getDistance(word.transformedPosition.x, word.transformedPosition.y, ripple.x, ripple.y)
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

    // Random lighting for touch devices
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

    // Update word state
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

const updateMousePositionFromGlobal = (clientX, clientY) => {
  const rect = containerRect.value || containerRef.value?.getBoundingClientRect()
  if (!rect) return

  // Get mouse position relative to container (can be negative or beyond bounds)
  const containerX = clientX - rect.left
  const containerY = clientY - rect.top

  // Transform the mouse position to match the transformed container
  const transformedPosition = transformPointToContainer(containerX, containerY, rect)

  mousePosition.value = transformedPosition

  // Initialize smooth position on first interaction
  if (!isInitialized.value) {
    smoothMousePosition.value = { ...transformedPosition }
    isInitialized.value = true
  }
}

const handleMouseMove = (event) => {
  if (!hasMouse.value) return

  hasInteraction.value = true
  mouseInContainer.value = true
  updateMousePositionFromGlobal(event.clientX, event.clientY)
}

const handleTouch = (event) => {
  event.preventDefault()
  hasInteraction.value = true

  const touch = event.touches[0] || event.changedTouches[0]
  if (touch) {
    updateMousePositionFromGlobal(touch.clientX, touch.clientY)

    if (event.type === 'touchstart') {
      createRipple(mousePosition.value.x, mousePosition.value.y, 0.8)
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
    color: config.baseColor,
    filter: `brightness(${1 + intensity * 0.6}) saturate(${1 + intensity * 0.5})`,
    transition: (word.isFadingOut && word.effectSource === 'ripple') ? `all ${config.fadeOutDuration}ms ease-out` : 'none'
  }
}

onMounted(async () => {
  detectDevice()

  // Cache container rect early
  containerRect.value = containerRef.value?.getBoundingClientRect()

  await initializeWords()

  // Start animation immediately
  animationFrame.value = requestAnimationFrame(animateWords)

  // Initialize with current mouse position
  if (hasMouse.value) {
    // Set initial mouse position to center of viewport
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    updateMousePositionFromGlobal(centerX, centerY)
    isInitialized.value = true
  }

  if (isTouch.value && !hasMouse.value) {
    startRandomLighting()
  }

  // Global mouse move handler - always tracks mouse position
  const handleGlobalMouseMove = (event) => {
    if (!hasMouse.value) return
    hasInteraction.value = true

    // Store actual mouse position
    actualMousePosition.value = { x: event.clientX, y: event.clientY }

    // Always update mouse position, even when outside container
    updateMousePositionFromGlobal(event.clientX, event.clientY)
  }

  // Track mouse enter/leave for container
  const handleMouseEnter = () => {
    mouseInContainer.value = true
  }

  const handleMouseLeave = () => {
    mouseInContainer.value = false
    // Continue tracking mouse position even when leaving
  }

  let resizeTimeout
  const handleResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(async () => {
      detectDevice()
      containerRect.value = containerRef.value?.getBoundingClientRect()
      await initializeWords()

      if (randomLightTimer.value) {
        clearInterval(randomLightTimer.value)
      }

      if (isTouch.value && !hasMouse.value) {
        startRandomLighting()
      }

      // Update mouse position after resize
      if (actualMousePosition.value.x && actualMousePosition.value.y) {
        updateMousePositionFromGlobal(actualMousePosition.value.x, actualMousePosition.value.y)
      }
    }, 300)
  }

  // Update container rect and word positions on scroll
  const handleScroll = () => {
    containerRect.value = containerRef.value?.getBoundingClientRect()
    // Update word positions after scroll
    requestAnimationFrame(() => {
      updateWordPositions()
      // Update mouse position after scroll
      if (actualMousePosition.value.x && actualMousePosition.value.y) {
        updateMousePositionFromGlobal(actualMousePosition.value.x, actualMousePosition.value.y)
      }
    })
  }

  // Add event listeners
  containerRef.value?.addEventListener('mouseenter', handleMouseEnter)
  containerRef.value?.addEventListener('mouseleave', handleMouseLeave)
  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })

  onUnmounted(() => {
    containerRef.value?.removeEventListener('mouseenter', handleMouseEnter)
    containerRef.value?.removeEventListener('mouseleave', handleMouseLeave)
    window.removeEventListener('mousemove', handleGlobalMouseMove)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
    if (animationFrame.value) cancelAnimationFrame(animationFrame.value)
    if (randomLightTimer.value) clearInterval(randomLightTimer.value)
    clearTimeout(resizeTimeout)

    colorCache.clear()
    distanceCache.clear()
  })
})

defineExpose({
  triggerRipple,
  createRipple: (x, y, intensity = 1) => {
    const rect = containerRect.value || containerRef.value?.getBoundingClientRect()
    if (rect) {
      const transformedPosition = transformPointToContainer(x - rect.left, y - rect.top, rect)
      createRipple(transformedPosition.x, transformedPosition.y, intensity)
    }
  }
})
</script>

<template>
  <Particles />
  <div
      ref="containerRef"
      class="w-full h-[400vh] overflow-hidden p-4 sm:p-6 md:p-8 bg-none absolute top-0 left-0"
      @mousemove="handleMouseMove"
      @touchstart="handleTouch"
      @touchmove="handleTouch"
  >
    <div
        ref="wordsContainerRef"
        :class="['w-full h-full flex flex-wrap items-center justify-center', getGapClass]"
        :style="`transform: rotate(${config.containerRotation}deg) scale(${config.containerScale});`"
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

/* Responsive margins based on screen size */
@media (max-width: 640px) {
  .word-element {
    margin: 0.125rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .word-element {
    margin: 0.25rem;
  }
}

@media (min-width: 1025px) and (max-width: 1920px) {
  .word-element {
    margin: 0.5rem;
  }
}

@media (min-width: 1921px) {
  .word-element {
    margin: 0.625rem;
  }
}

/* Optimize for tall screens */
@media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 3/4) {
  .word-element {
    margin: 0.125rem;
  }
}

.aurora-container {
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
  pointer-events: none;
}
</style>