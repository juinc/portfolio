<script setup>
  import { ref } from 'vue'
  import SocialsModal from '@/topbar/socials/socialsModal.vue'
  import GithubLogo from '@/assets/icons/socials/github.svg'
  import DiscordLogo from '@/assets/icons/socials/discord.svg'
  import LeetCodeLogo from '@/assets/icons/socials/leetcode.svg'
  import LinkedInLogo from '@/assets/icons/socials/linkedin.svg'
  import MailLogo from '@/assets/icons/socials/mail.svg'

  const isModalOpen = ref(false)

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const openGithub = () => {
    window.open('https://github.com/juinc', '_blank')
  }

  const openLeetCode = () => {
    window.open('https://leetcode.com/u/juinc/', '_blank')
  }

  const openLinkedIn = () => {
    window.open('https://linkedin.com/in/julian-tintarea-6b2327387', '_blank')
  }
</script>

<template>
  <div class="fixed
    w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[250px] 2xl:w-[13vw]
    h-[45px] sm:h-[50px] md:h-[55px] lg:h-[60px] xl:h-[65px] 2xl:h-[6vh]
    right-3 sm:right-4 md:right-5 lg:right-6
    top-3 sm:top-4 md:top-5 lg:top-6
    z-10 rounded-full overflow-hidden">

    <div
        class="absolute inset-0 rounded-full
      dark:bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
      bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-dark)_25%,_transparent),_color-mix(in_oklch,_var(--bg-extra-dark)_65%,_transparent))]
      dark:border-r dark:border-b dark:border-(--border-muted)
      border-t-[1px] sm:border-t-[1.5px] lg:border-t-[2px] dark:border-t-[1px] dark:sm:border-t-[1.5px]
      border-t-(--highlight) dark:border-t-(--highlight)
      border-l-[1px] sm:border-l-[1.5px] lg:border-l-[2px] dark:border-l-[1px] dark:sm:border-l-[1.5px]
      border-l-(--highlight) dark:border-l-(--highlight)
      shadow-lg sm:shadow-xl lg:shadow-2xl backdrop-blur-sm"
    ></div>

    <div class="relative z-10 w-full h-full
      grid grid-cols-5
      gap-1 sm:gap-1.5 lg:gap-2
      p-1.5 sm:p-2
      place-items-center">

      <GithubLogo
          alt="GitHub"
          class="h-[70%] sm:h-[75%] md:h-[80%] lg:h-full
          w-[70%] sm:w-[75%] md:w-[80%] lg:w-full
          aspect-square cursor-pointer
          hover:scale-110 transition-transform duration-200 ease-in-out
          text-(--text)"
          @click="openGithub"
      />

      <DiscordLogo
          alt="Discord"
          class="h-[70%] sm:h-[75%] md:h-[80%] lg:h-full
          w-[70%] sm:w-[75%] md:w-[80%] lg:w-full
          aspect-square cursor-pointer
          hover:scale-110 transition-transform duration-200 ease-in-out
          text-(--text)"
          @click="openModal"
      />

      <LeetCodeLogo
          alt="LeetCode"
          class="h-[70%] sm:h-[75%] md:h-[80%] lg:h-full
          w-[70%] sm:w-[75%] md:w-[80%] lg:w-full
          aspect-square cursor-pointer
          hover:scale-110 transition-transform duration-200 ease-in-out
          text-(--text)"
          @click="openLeetCode"
      />

      <LinkedInLogo
          alt="LinkedIn"
          class="h-[70%] sm:h-[75%] md:h-[80%] lg:h-full
          w-[70%] sm:w-[75%] md:w-[80%] lg:w-full
          aspect-square cursor-pointer
          hover:scale-110 transition-transform duration-200 ease-in-out
          text-(--text)"
          @click="openLinkedIn"
      />

      <MailLogo
          alt="Email"
          class="h-[70%] sm:h-[75%] md:h-[80%] lg:h-full
          w-[70%] sm:w-[75%] md:w-[80%] lg:w-full
          -mt-1 sm:-mt-1.5 lg:-mt-2
          aspect-square cursor-pointer
          hover:scale-110 transition-transform duration-200 ease-in-out
          text-(--text)"
          @click="openModal"
      />
    </div>
  </div>

  <SocialsModal
      :is-open="isModalOpen"
      @close="closeModal"
  />
</template>