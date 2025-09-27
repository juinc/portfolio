<script setup>
  import { ref, computed } from 'vue'

  const icons = {
    check: "M5 12l5 5L20 7",
    person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    document: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z",
    hammer: "M20 8h-3V6c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2H8c-.55 0-1 .45-1 1s.45 1 1 1h3v2H2v2h9v7l2 3 2-3v-7h5c.55 0 1-.45 1-1s-.45-1-1-1z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
  }

  const multiPathIcons = {
    personCircle: [
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z",
      "M12 11c1.33 0 2.4-1.07 2.4-2.4S13.33 6.2 12 6.2 9.6 7.27 9.6 8.6 10.67 11 12 11z",
      "M12 12.5c-2 0-6 1.01-6 3v1.4h12v-1.4c0-1.99-4-3-6-3z"
    ],
    documentFilled: [
      "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6Z",
      "M13 3.5V9h5.5L13 3.5z",
      "M8 11h8v2H8v-2zm0 4h8v2H8v-2z"
    ],
    hammerWrench: [
      "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z",
      "M12 6l1.5-1.5c.3-.3.8-.3 1.1 0l4.9 4.9c.3.3.3.8 0 1.1L18 12"
    ]
  }

  const addAlphaToOklch = (oklchColor, alpha) => {
    const colorMatch = oklchColor.match(/oklchKATEX_INLINE_OPEN(.*?)KATEX_INLINE_CLOSE/)
    if (colorMatch) {
      const values = colorMatch[1].trim()
      return `oklch(${values} / ${alpha})`
    }
    return oklchColor
  }

  const props = defineProps({
    variant: {
      type: String,
      default: 'filled',
      validator: (value) => ['filled', 'hybrid', 'empty'].includes(value)
    },

    persistentGlow: {
      type: Boolean,
      default: false
    },
    glowIntensity: {
      type: String,
      default: 'normal',
      validator: (value) => ['subtle', 'normal', 'intense'].includes(value)
    },

    text: {
      type: String,
      default: 'Click Me'
    },
    successText: {
      type: String,
      default: 'Success!'
    },
    textColor: {
      type: String,
      default: 'oklch(100% 0 0)', // white
      validator: (value) => value.includes('oklch(')
    },
    successTextColor: {
      type: String,
      default: 'oklch(100% 0 0)', // white
      validator: (value) => value.includes('oklch(')
    },

    gradientFrom: {
      type: String,
      default: 'oklch(67% 0.27 295)', // purple-500
      validator: (value) => value.includes('oklch(')
    },
    gradientTo: {
      type: String,
      default: 'oklch(56% 0.29 285)', // purple-600
      validator: (value) => value.includes('oklch(')
    },
    successGradientFrom: {
      type: String,
      default: 'oklch(69% 0.17 162)', // emerald-500
      validator: (value) => value.includes('oklch(')
    },
    successGradientTo: {
      type: String,
      default: 'oklch(58% 0.16 163)', // emerald-600
      validator: (value) => value.includes('oklch(')
    },

    borderColor: {
      type: String,
      default: 'oklch(67% 0.27 295)',
      validator: (value) => value.includes('oklch(')
    },
    successBorderColor: {
      type: String,
      default: 'oklch(69% 0.17 162)', // emerald-500
      validator: (value) => value.includes('oklch(')
    },
    hoverBorderColor: {
      type: String,
      default: 'oklch(67% 0.27 295)', // purple-500
      validator: (value) => value.includes('oklch(')
    },
    successHoverBorderColor: {
      type: String,
      default: 'oklch(69% 0.17 162)', // emerald-500
      validator: (value) => value.includes('oklch(')
    },

    // Icon props - OKLCH format required
    icon: {
      type: String,
      default: 'arrow'
    },
    successIcon: {
      type: String,
      default: 'check'
    },
    iconColor: {
      type: String,
      default: 'oklch(100% 0 0)', // white
      validator: (value) => value.includes('oklch(')
    },
    successIconColor: {
      type: String,
      default: 'oklch(100% 0 0)', // white
      validator: (value) => value.includes('oklch(')
    },
    customIcon: {
      type: String,
      default: null
    },
    customSuccessIcon: {
      type: String,
      default: null
    },

    successDuration: {
      type: Number,
      default: 2000
    },
    allowClickOnSuccess: {
      type: Boolean,
      default: false
    },
    persistSuccess: {
      type: Boolean,
      default: false
    },

    click: {
      type: Function,
      default: null
    }
  })

  const emit = defineEmits(['click', 'success-end'])

  const isHovered = ref(false)
  const isClicked = ref(false)
  const showSuccess = ref(false)
  let successTimeout = null

  const gradientClass = computed(() => 'custom-gradient')
  const successGradientClass = computed(() => 'custom-success-gradient')
  const shadowClass = computed(() => 'custom-shadow')
  const successShadowClass = computed(() => 'custom-success-shadow')
  const hoverShadowClass = computed(() => 'custom-hover-shadow')
  const successHoverShadowClass = computed(() => 'custom-success-hover-shadow')

  const glowAlphas = {
    subtle: { base: '0.12', hover: '0.18' },
    normal: { base: '0.19', hover: '0.25' },
    intense: { base: '0.3', hover: '0.4' }
  }

  const customStyles = computed(() => {
    const styles = {}

    if (props.variant === 'filled' || (props.variant === 'hybrid' && (isHovered.value || showSuccess.value))) {
      if (showSuccess.value) {
        styles.background = `linear-gradient(135deg, ${props.successGradientFrom} 0%, ${props.successGradientTo} 100%)`
      } else {
        styles.background = `linear-gradient(135deg, ${props.gradientFrom} 0%, ${props.gradientTo} 100%)`
      }
    }

    if (props.variant === 'hybrid' || props.variant === 'empty') {
      if (showSuccess.value) {
        styles.borderColor = props.successBorderColor
      } else {
        styles.borderColor = props.borderColor
      }
    }

    const glowLevel = glowAlphas[props.glowIntensity] || glowAlphas.normal

    const shouldShowGlow = props.persistentGlow || isHovered.value
    const shouldShowBaseGlow = props.variant === 'filled' ||
        (props.variant === 'hybrid' && (isHovered.value || showSuccess.value)) ||
        (props.variant === 'empty' && props.persistentGlow)

    if (shouldShowBaseGlow) {
      if (showSuccess.value) {
        if (shouldShowGlow) {
          const alpha = isHovered.value ? glowLevel.hover : glowLevel.base
          const blur = isHovered.value ? '20px' : '15px'
          const spread = isHovered.value ? '6px' : '4px'
          styles.boxShadow = `0 ${spread} ${blur} ${addAlphaToOklch(props.successGradientFrom, alpha)}`
        }
      } else {
        if (shouldShowGlow) {
          const alpha = isHovered.value ? glowLevel.hover : glowLevel.base
          const blur = isHovered.value ? '20px' : '15px'
          const spread = isHovered.value ? '6px' : '4px'
          styles.boxShadow = `0 ${spread} ${blur} ${addAlphaToOklch(props.gradientFrom, alpha)}`
        }
      }
    }

    styles['--after-border-color'] = showSuccess.value ? props.successHoverBorderColor : props.hoverBorderColor

    return styles
  })

  const currentTextColor = computed(() => {
    if (props.variant === 'empty' || (props.variant === 'hybrid' && !isHovered.value && !showSuccess.value)) {
      return showSuccess.value ? props.successBorderColor : props.borderColor
    }
    return showSuccess.value ? props.successTextColor : props.textColor
  })

  const currentIconColor = computed(() => {
    if (props.variant === 'empty' || (props.variant === 'hybrid' && !isHovered.value && !showSuccess.value)) {
      return showSuccess.value ? props.successBorderColor : props.borderColor
    }
    return showSuccess.value ? props.successIconColor : props.iconColor
  })

  const isMultiPath = computed(() => {
    return multiPathIcons[props.icon] !== undefined
  })

  const getIconPath = (iconName, customPath) => {
    if (customPath) return customPath
    if (multiPathIcons[iconName]) return multiPathIcons[iconName]
    return icons[iconName] || icons.arrow
  }

  const currentPath = computed(() => {
    if (showSuccess.value) {
      return getIconPath(props.successIcon, props.customSuccessIcon)
    }
    return getIconPath(props.icon, props.customIcon)
  })

  const currentMultiPath = computed(() => {
    if (isMultiPath.value && !showSuccess.value) {
      return multiPathIcons[props.icon]
    }
    return []
  })

  const buttonText = computed(() => {
    return showSuccess.value ? props.successText : props.text
  })

  const handleMouseEnter = () => {
    isHovered.value = true
  }

  const handleMouseLeave = () => {
    isHovered.value = false
  }

  const resetSuccess = () => {
    showSuccess.value = false
    emit('success-end')
  }

  const handleClick = () => {
    if (showSuccess.value && !props.allowClickOnSuccess) return

    if (props.click && typeof props.click === 'function') {
      props.click()
    }

    emit('click')

    if (successTimeout) {
      clearTimeout(successTimeout)
    }

    if (showSuccess.value && props.allowClickOnSuccess) {
      showSuccess.value = false
      setTimeout(() => {
        triggerClickAnimation()
      }, 50)
    } else {
      triggerClickAnimation()
    }
  }

  const triggerClickAnimation = () => {
    isClicked.value = true

    setTimeout(() => {
      showSuccess.value = true
      isClicked.value = false

      if (!props.persistSuccess) {
        successTimeout = setTimeout(() => {
          resetSuccess()
        }, props.successDuration)
      }
    }, 200)
  }

  defineExpose({
    resetSuccess
  })
</script>

<template>
  <button
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :style="customStyles"
      :class="[
        'relative inline-flex items-center justify-center',
        'px-7 py-1.5 min-w-[150px] w-full flex-1',
        'text-base font-semibold',
        'rounded-xl cursor-pointer',
        'transition-all duration-[400ms] ease-out',
        'overflow-visible',

        props.variant === 'filled' && [
          showSuccess ? successGradientClass : gradientClass,
          showSuccess ? successShadowClass : shadowClass,
        ],

        props.variant === 'hybrid' && [
          'border-2',
          isHovered || showSuccess
            ? (showSuccess ? successGradientClass : gradientClass)
            : 'bg-transparent',
          (isHovered || showSuccess) && (showSuccess ? successShadowClass : shadowClass),
        ],

        props.variant === 'empty' && [
          'border-2',
          'bg-transparent',
          !props.persistentGlow && '!shadow-none',
        ],

        isHovered && !isClicked && '-translate-y-0.5',
        isHovered && props.variant === 'filled' && (showSuccess ? successHoverShadowClass : hoverShadowClass),
        isHovered && props.variant === 'hybrid' && (showSuccess ? successHoverShadowClass : hoverShadowClass),

        isClicked && 'animate-pulse-scale',
        'active:scale-[0.98]',
        isHovered && 'active:-translate-y-0.5 active:scale-[0.98]',

        'after:content-[\'\'] after:absolute after:inset-[-6px]',
        'after:border-2 after:rounded-2xl after:opacity-0',
        'after:transition-all after:duration-300 after:ease-out after:pointer-events-none',
        isHovered && 'after:opacity-100 after:inset-[-8px]'
      ]"
  >
    <div
        :class="[
          'overflow-hidden transition-[width] duration-300 ease-out',
          isHovered || showSuccess ? 'w-7' : 'w-0'
        ]"
    >
      <div
          :class="[
            'w-5 h-5 mr-2 transition-all duration-300 ease-out',
            isHovered || showSuccess
              ? 'translate-x-0 opacity-100'
              : '-translate-x-5 opacity-0'
          ]"
      >
        <svg
            :class="[
              'w-5 h-5 transition-transform duration-300 ease-in-out',
              isClicked && 'animate-icon-bounce',
              showSuccess && !isClicked && 'animate-success-pop'
            ]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :style="{ color: currentIconColor }"
        >
          <path
              v-if="!isMultiPath"
              :d="currentPath"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-all duration-[400ms] ease-out"
          />

          <g v-else>
            <path
                v-for="(path, index) in currentMultiPath"
                :key="index"
                :d="path"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :fill="path.includes('Z') ? 'currentColor' : 'none'"
                :opacity="showSuccess ? 0 : 1"
                class="transition-all duration-[400ms] ease-out"
            />

            <path
                v-if="showSuccess"
                :d="icons.check"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-[400ms] ease-out"
            />
          </g>
        </svg>
      </div>
    </div>
    <span
        class="whitespace-nowrap transition-all duration-300 ease-out"
        style="font-weight: bold"
        :style="{ color: currentTextColor }"
    >
      {{ buttonText }}
    </span>
  </button>
</template>

<style>
  @keyframes iconBounce {
    0% { transform: scale(1) rotate(0deg); }
    40% { transform: scale(1.3) rotate(180deg); }
    60% { transform: scale(0.9) rotate(270deg); }
    80% { transform: scale(1.1) rotate(360deg); }
    100% { transform: scale(1) rotate(360deg); }
  }

  @keyframes successPop {
    0% { transform: scale(0) rotate(-180deg); }
    50% { transform: scale(1.2) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  @keyframes pulseScale {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.97); }
  }

  .animate-icon-bounce {
    animation: iconBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .animate-success-pop {
    animation: successPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .animate-pulse-scale {
    animation: pulseScale 0.3s ease;
  }

  button::after {
    border-color: var(--after-border-color);
  }
</style>