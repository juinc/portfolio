<script setup>
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    isOpen: Boolean
  })

  const emit = defineEmits(['close'])

  const socials = reactive({
    email: 'tintarea.iulian.work@gmail.com',
    github: 'github.com/juinc',
    linkedin: 'linkedin.com/in/julian-tintarea-6b2327387',
    leetcode: 'leetcode.com/u/juinc/',
    discord: '@juinc',
    roblox: '@juinc'
  })

  const copiedStates = reactive({
    email: false,
    github: false,
    linkedin: false,
    leetcode: false,
    discord: false,
    roblox: false
  })

  const copyToClipboard = async (type) => {
    try {
      await navigator.clipboard.writeText(socials[type])
      copiedStates[type] = true
      setTimeout(() => {
        copiedStates[type] = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const closeModal = () => {
    emit('close')
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal()
    }
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
          class="fixed inset-0 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] backdrop-blur-sm z-100 flex items-center justify-center p-6 md:p-8"
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
              class="relative max-w-lg w-full max-h-[85vh] overflow-y-auto"
              @click.stop
          >
            <button
                @click="closeModal"
                class="absolute right-2 top-2 z-20 w-10 h-10 bg-[color-mix(in_oklch,_var(--bg)_80%,_transparent)] border-2 border-(--border) rounded-full flex items-center justify-center text-(--text-muted) hover:text-(--text) hover:bg-[color-mix(in_oklch,_var(--bg)_100%,_transparent)] transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] backdrop-blur-xs rounded-4xl border-(--border) border-1 px-8 py-8 md:px-10 md:py-10 flex flex-col gap-6 mt-4 mr-4">
              <p class="font-bg-rubik font-bold text-3xl md:text-4xl text-(--text-muted) mb-4 flex-shrink-0" style="font-weight: bold">{{t('global-socials-title')}}</p>

              <div class="flex flex-col gap-6">
                <div class="relative">
                  <span class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2 font-bg-rubik font-bold text-sm text-(--text-muted) z-10" style="font-weight:bold;">EMAIL</span>
                  <div class="border border-(--border-muted) rounded-2xl p-3 flex justify-between items-center bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200 hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)">
                    <span class="font-bg-rubik text-(--text) text-base select-all truncate mr-2">{{ socials.email }}</span>
                    <button
                        @click="copyToClipboard('email')"
                        class="p-1.5 px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)] border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[36px] h-8 hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text) hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      <span v-if="!copiedStates.email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>

                <div class="relative">
                  <span class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2 font-bg-rubik font-bold text-sm text-(--text-muted) z-10" style="font-weight:bold;">GITHUB</span>
                  <div class="border border-(--border-muted) rounded-2xl p-3 flex justify-between items-center bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200 hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)">
                    <span class="font-bg-rubik text-(--text) text-base select-all truncate mr-2">{{ socials.github }}</span>
                    <button
                        @click="copyToClipboard('github')"
                        class="p-1.5 px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)] border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[36px] h-8 hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text) hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      <span v-if="!copiedStates.github">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>

                <div class="relative">
                  <span class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2 font-bg-rubik font-bold text-sm text-(--text-muted) z-10" style="font-weight:bold;">LINKEDIN</span>
                  <div class="border border-(--border-muted) rounded-2xl p-3 flex justify-between items-center bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200 hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)">
                    <span class="font-bg-rubik text-(--text) text-base select-all truncate mr-2">{{ socials.linkedin }}</span>
                    <button
                        @click="copyToClipboard('linkedin')"
                        class="p-1.5 px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)] border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[36px] h-8 hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text) hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      <span v-if="!copiedStates.linkedin">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>

                <div class="relative">
                  <span class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2 font-bg-rubik font-bold text-sm text-(--text-muted) z-10" style="font-weight:bold;">LEETCODE</span>
                  <div class="border border-(--border-muted) rounded-2xl p-3 flex justify-between items-center bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200 hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)">
                    <span class="font-bg-rubik text-(--text) text-base select-all truncate mr-2">{{ socials.leetcode }}</span>
                    <button
                        @click="copyToClipboard('leetcode')"
                        class="p-1.5 px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)] border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[36px] h-8 hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text) hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      <span v-if="!copiedStates.leetcode">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>

                <div class="relative">
                  <span class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2 font-bg-rubik font-bold text-sm text-(--text-muted) z-10" style="font-weight:bold;">DISCORD</span>
                  <div class="border border-(--border-muted) rounded-2xl p-3 flex justify-between items-center bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200 hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)">
                    <span class="font-bg-rubik text-(--text) text-base select-all truncate mr-2">{{ socials.discord }}</span>
                    <button
                        @click="copyToClipboard('discord')"
                        class="p-1.5 px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)] border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[36px] h-8 hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text) hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      <span v-if="!copiedStates.discord">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>

                <div class="relative">
                  <span class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2 font-bg-rubik font-bold text-sm text-(--text-muted) z-10" style="font-weight:bold;">ROBLOX</span>
                  <div class="border border-(--border-muted) rounded-2xl p-3 flex justify-between items-center bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200 hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)">
                    <span class="font-bg-rubik text-(--text) text-base select-all truncate mr-2">{{ socials.roblox }}</span>
                    <button
                        @click="copyToClipboard('roblox')"
                        class="p-1.5 px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)] border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200 flex items-center justify-center min-w-[36px] h-8 hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text) hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      <span v-if="!copiedStates.roblox">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </span>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>