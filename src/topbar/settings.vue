<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import LanguageIcon from '@/assets/icons/other/language.svg'

  import usaIcon from '@/assets/icons/other/usa.svg?url';
  import romaniaIcon from '@/assets/icons/other/romania.svg?url';
  import spainIcon from '@/assets/icons/other/spain.svg?url';

  const { t, locale } = useI18n()

  const isMenuOpen = ref(false)
  const selectedLanguage = ref('English')
  const isLanguageDropdownOpen = ref(false)
  const isDarkMode = ref(true)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    updateTheme()
  }

  const updateTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme ? savedTheme === 'dark' : true
    updateTheme()
  }

  onMounted(() => {
    initTheme()
  })

  const languages = [
    { code: 'en', name: 'English', icon: usaIcon },
    { code: 'ro', name: 'Română', icon: romaniaIcon },
    { code: 'es', name: 'Español', icon: spainIcon },
  ]

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    if (!isMenuOpen.value) {
      isLanguageDropdownOpen.value = false
    }
  }

  const toggleLanguageDropdown = () => {
    isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
  }

  const selectLanguage = (language) => {
    selectedLanguage.value = language.name
    isLanguageDropdownOpen.value = false
    locale.value = language.code
  }

  const gradientBg = 'dark:bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))] bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-dark)_25%,_transparent),_color-mix(in_oklch,_var(--bg-extra-dark)_65%,_transparent))]'
  const borderStyles = 'dark:border-r dark:border-b dark:border-(--border-muted) border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight) border-l-[2px] dark:border-l-[1.5px] border-l-(--highlight) dark:border-l-(--highlight)'
</script>

<template>
  <div class="fixed left-3 sm:left-4 md:left-5 lg:left-6 top-3 sm:top-4 md:top-5 lg:top-6 z-10">
    <div class="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-[3vw] xl:h-[6vh] xl:max-w-[60px] xl:max-h-[65px] rounded-full relative shadow-2xl">
      <div
          :class="[gradientBg, borderStyles]"
          class="absolute inset-0 rounded-full backdrop-blur-sm"
      ></div>

      <div class="relative z-10 w-full h-full flex flex-row justify-center items-center p-1.5 sm:p-2">
        <button
            @click="toggleMenu"
            class="h-full w-full flex flex-col justify-center items-center hover:scale-110 transition-transform duration-200 ease-in-out cursor-pointer"
        >
          <div class="w-3 h-2.5 sm:w-3.5 sm:h-3 md:w-4 md:h-3 flex flex-col justify-center items-center relative">
            <span
                class="absolute w-full h-0.5 bg-current transition-all duration-300 ease-in-out"
                :class="isMenuOpen ? 'rotate-45' : '-translate-y-1'"
            ></span>
            <span
                class="absolute w-full h-0.5 bg-current transition-all duration-300 ease-in-out"
                :class="isMenuOpen ? 'opacity-0' : ''"
            ></span>
            <span
                class="absolute w-full h-0.5 bg-current transition-all duration-300 ease-in-out"
                :class="isMenuOpen ? '-rotate-45' : 'translate-y-1'"
            ></span>
          </div>
        </button>
      </div>
    </div>

    <div
        class="mt-2 space-y-1.5 sm:space-y-2 transition-all duration-300 ease-in-out"
        :class="isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'"
    >
      <div class="w-28 sm:w-30 md:w-32 h-9 sm:h-10">
        <div class="w-full h-full rounded-full overflow-hidden relative">
          <div
              :class="[gradientBg, borderStyles]"
              class="absolute inset-0 rounded-full shadow-2xl"
          ></div>

          <button
              @click="toggleTheme"
              class="relative z-10 w-full h-full flex flex-row justify-start items-center px-2.5 sm:px-3 gap-1.5 sm:gap-2 hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer overflow-hidden"
          >
            <div class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 relative">
              <svg
                  class="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
                  :class="isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>

              <svg
                  class="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
                  :class="!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
              </svg>
            </div>

            <span class="text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ease-in-out">
              {{ isDarkMode ? t('settings-light-mode') : t('settings-dark-mode') }}
            </span>
          </button>
        </div>
      </div>

      <div class="relative">
        <div class="w-32 sm:w-36 md:w-40 h-9 sm:h-10">
          <div class="w-full h-full rounded-full overflow-hidden relative">
            <div
                :class="[gradientBg, borderStyles]"
                class="absolute inset-0 rounded-full"
            ></div>

            <button
                @click="toggleLanguageDropdown"
                class="relative z-10 w-full h-full flex flex-row justify-between items-center px-2.5 sm:px-3 gap-1.5 sm:gap-2 hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer overflow-hidden"
            >
              <div class="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                <LanguageIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-none rounded flex-shrink-0 text-(--text)" alt="language icon"/>
                <span class="text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ selectedLanguage }}</span>
              </div>
              <svg
                  class="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 flex-shrink-0"
                  :class="isLanguageDropdownOpen ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>

        <div
            class="absolute top-full left-0 mt-1 w-full space-y-1 transition-all duration-300 ease-in-out"
            :class="isLanguageDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'"
        >
          <div
              v-for="language in languages"
              :key="language.code"
              class="w-full h-7 sm:h-8"
          >
            <div class="w-full h-full rounded-full overflow-hidden relative">
              <div
                  :class="[gradientBg, borderStyles]"
                  class="absolute inset-0 rounded-full shadow-2xl"
              ></div>

              <button
                  @click="selectLanguage(language)"
                  class="relative z-10 w-full h-full flex flex-row justify-start items-center px-2.5 sm:px-3 gap-1.5 sm:gap-2 hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer overflow-hidden"
                  :class="selectedLanguage === language.name ? 'opacity-75' : ''"
              >
                <img class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex-shrink-0" :src="language.icon" alt="language icon">
                <span class="text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ language.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>