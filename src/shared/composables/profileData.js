import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

import classyImg from '@/assets/img/classy.png'
import goofyImg from '@/assets/img/goofy.png'

const profiles = [
    {
        image: classyImg,
        gradientFrom: "#3b82f6", // blue-500
        gradientTo: "#8b5cf6", // violet-500
        borderColor: "#7373e6",
        gradientFromOklch: "oklch(54.06% 0.216 264.05)", // blue-500 in OKLCH
        gradientToOklch: "oklch(56.14% 0.197 295.81)", // violet-500 in OKLCH
        name: "Julian",
        handle: "juinc",
        font: "font-bg-sirivennela",
        textSize: "text-5xl"
    },
    {
        image: goofyImg,
        gradientFrom: "#ec4899", // pink-500
        gradientTo: "#eab308", // yellow-500
        borderColor: "#f78d83",
        gradientFromOklch: "oklch(64.23% 0.284 349.39)", // pink-500 in OKLCH
        gradientToOklch: "oklch(79.48% 0.196 91.38)", // yellow-500 in OKLCH
        name: "Julian",
        handle: "juinc",
        font: "font-bg-roboto",
        textSize: "text-4xl"
    },
]

const currentProfileIndex = ref(0)
const isSpinning = ref(false)
const isImageHovered = ref(false)

const displayedName = ref('')
const displayedHandle = ref('')
const nameCharIndex = ref(0)
const handleCharIndex = ref(0)
const typingSpeed = 100
const showNameCursor = ref(true)
const showHandleCursor = ref(false)
const isTypingName = ref(false)
const isTypingHandle = ref(false)
const typingComplete = ref(false)

let nameTimeout = null
let handleTimeout = null
let cursorInterval = null

const currentProfile = computed(() => profiles[currentProfileIndex.value])

const currentFont = computed(() => currentProfile.value.font)
const currentTextSize = computed(() => currentProfile.value.textSize)

const gradientStyle = computed(() => {
    const profile = currentProfile.value
    return `linear-gradient(135deg, ${profile.gradientFrom}, ${profile.gradientTo})`
})

const imageGlowStyle = computed(() => {
    const profile = currentProfile.value
    const baseGlow = `0 0 20px ${profile.gradientFrom}40, 0 0 40px ${profile.gradientTo}20`
    const hoverGlow = `0 0 30px ${profile.gradientFrom}80, 0 0 60px ${profile.gradientTo}40, 0 0 80px ${profile.gradientFrom}20`

    return {
        boxShadow: isImageHovered.value ? hoverGlow : baseGlow,
    }
})

const buttonScaleStyle = computed(() => ({
    transform: 'scale(0.9)'
}))

const clearTimeouts = () => {
    if (nameTimeout) clearTimeout(nameTimeout)
    if (handleTimeout) clearTimeout(handleTimeout)
    if (cursorInterval) clearInterval(cursorInterval)
}

const startCursorBlink = (type) => {
    if (cursorInterval) clearInterval(cursorInterval)

    if (type === 'name') {
        showNameCursor.value = true
        showHandleCursor.value = false
        cursorInterval = setInterval(() => {
            showNameCursor.value = !showNameCursor.value
        }, 500)
    } else {
        showNameCursor.value = false
        showHandleCursor.value = true
        cursorInterval = setInterval(() => {
            showHandleCursor.value = !showHandleCursor.value
        }, 500)
    }
}

const typewriteName = () => {
    const targetName = currentProfile.value.name
    isTypingName.value = true
    showNameCursor.value = true
    startCursorBlink('name')

    if (nameCharIndex.value < targetName.length) {
        displayedName.value += targetName[nameCharIndex.value]
        nameCharIndex.value++
        nameTimeout = setTimeout(typewriteName, typingSpeed)
    } else {
        isTypingName.value = false
        showNameCursor.value = false
        if (cursorInterval) clearInterval(cursorInterval)

        setTimeout(() => {
            typewriteHandle()
        }, 200)
    }
}

const typewriteHandle = () => {
    const targetHandle = currentProfile.value.handle
    isTypingHandle.value = true
    showHandleCursor.value = true
    startCursorBlink('handle')

    if (handleCharIndex.value < targetHandle.length) {
        displayedHandle.value += targetHandle[handleCharIndex.value]
        handleCharIndex.value++
        handleTimeout = setTimeout(typewriteHandle, typingSpeed)
    } else {
        isTypingHandle.value = false
        showHandleCursor.value = false
        typingComplete.value = true
        if (cursorInterval) clearInterval(cursorInterval)
    }
}

const resetTypewriter = () => {
    clearTimeouts()
    displayedName.value = ''
    displayedHandle.value = ''
    nameCharIndex.value = 0
    handleCharIndex.value = 0
    showNameCursor.value = false
    showHandleCursor.value = false
    isTypingName.value = false
    isTypingHandle.value = false
    typingComplete.value = false

    setTimeout(() => {
        typewriteName()
    }, 300)
}

const switchProfile = () => {
    if (isSpinning.value) return

    isSpinning.value = true

    setTimeout(() => {
        currentProfileIndex.value = (currentProfileIndex.value + 1) % profiles.length
    }, 300)

    setTimeout(() => {
        isSpinning.value = false
    }, 600)
}

const setImageHovered = (hovered) => {
    isImageHovered.value = hovered
}

const initializeTypewriter = () => {
    setTimeout(() => {
        typewriteName()
    }, 500)
}

watch(currentProfileIndex, () => {
    resetTypewriter()
})

const cleanup = () => {
    clearTimeouts()
}

export function useProfileData() {
    return {
        currentProfileIndex,
        isSpinning,
        isImageHovered,
        displayedName,
        displayedHandle,
        showNameCursor,
        showHandleCursor,
        isTypingName,
        isTypingHandle,
        typingComplete,

        currentProfile,
        currentFont,
        currentTextSize,
        gradientStyle,
        imageGlowStyle,
        buttonScaleStyle,

        switchProfile,
        setImageHovered,
        initializeTypewriter,
        cleanup,

        profiles
    }
}