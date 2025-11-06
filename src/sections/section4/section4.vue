<script setup>
  import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const socials = ref({
    email: 'tintarea.iulian.work@gmail.com',
    github: 'github.com/juinc',
    linkedin: 'linkedin.com/in/julian-tintarea-6b2327387',
    leetcode: 'leetcode.com/u/juinc/',
    discord: '@juinc',
    roblox: '@juinc'
  });

  const copiedStates = ref({
    email: false,
    discord: false,
    github: false,
    linkedin: false,
    leetcode: false,
    roblox: false
  });

  const copyToClipboard = async (platform) => {
    try {
      await navigator.clipboard.writeText(socials.value[platform]);
      copiedStates.value[platform] = true;
      setTimeout(() => {
        copiedStates.value[platform] = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const eduRef = ref(null);
  const dpRef = ref(null);
  const socRef = ref(null);

  const inView = reactive({
    edu: false,
    dp: false,
    soc: false
  });

  let observer;

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

  onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (entry.target === eduRef.value) inView.edu = true;
            if (entry.target === dpRef.value) inView.dp = true;
            if (entry.target === socRef.value) inView.soc = true;
            observer.unobserve(entry.target);
          });
        },
        {
          root: null,
          threshold: 0.2,
          rootMargin: '0px 0px -10% 0px'
        }
    );

    [eduRef.value, dpRef.value, socRef.value].forEach((el) => {
      if (el) observer.observe(el);
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', setVh)
    window.removeEventListener('orientationchange', setVh)
    if (window.visualViewport) window.visualViewport.removeEventListener('resize', setVh)
    observer?.disconnect();
  });
</script>

<template>
  <section id="section-4" class="relative overflow-visible lg:overflow-hidden min-h-[calc(var(--vh,1vh)*100)] lg:h-screen max-h-none lg:max-h-[1000px]">
    <div
        class="relative mx-auto max-w-screen-2xl grid gap-3 xs:gap-4 sm:gap-6
             py-4 xs:py-6 sm:py-8 lg:py-0
             px-[5vw] xs:px-[8vw] sm:px-[5vw] w-full
             lg:w-[90vw] xl:w-[90vw] 2xl:w-[90vw]
             grid-cols-1 lg:grid-cols-2 lg:gap-8
             h-auto lg:h-[70vh] lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2
             2xl:h-[80vh] 2xl:grid-cols-2 2xl:gap-15 max-h-none"
    >
      <div class="flex flex-col gap-3 xs:gap-4 sm:gap-6 lg:min-h-0 lg:h-full 2xl:gap-15">
        <div
            ref="eduRef"
            class="bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                 dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                 border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                 shadow-2xl rounded-2xl xs:rounded-3xl sm:rounded-4xl
                 px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 2xl:px-10 2xl:py-10
                 transform transition-all duration-700 ease-out
                 will-change-[opacity,transform,backdrop-filter]"
            :class="inView.edu
            ? 'opacity-100 translate-x-0 backdrop-blur-sm'
            : 'opacity-0 -translate-x-6 backdrop-blur-none'"
            style="will-change: opacity, transform, backdrop-filter;"
        >
          <p class="font-bg-rubik font-bold
                    text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl
                    text-(--text-muted) mb-2 xs:mb-3 sm:mb-4"
             style="font-weight: bold;">
            {{ t('section-4-education-title') }}
          </p>
          <p class="font-bg-rubik font-bold
                    text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-xl
                    text-(--text) whitespace-pre-line leading-relaxed">
            {{ t('section-4-education-text') }}
          </p>
          <ul class="font-bg-rubik font-bold
                     text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-xl
                     text-(--text) list-disc ml-3 xs:ml-4 sm:ml-5 mt-1 xs:mt-2 space-y-0.5 xs:space-y-1">
            <li>{{ t('section-4-education-l1') }}</li>
            <li>{{ t('section-4-education-l2') }}</li>
            <li>{{ t('section-4-education-l3') }}</li>
          </ul>
        </div>

        <div
            ref="dpRef"
            class="bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                 dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                 border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                 shadow-2xl rounded-2xl xs:rounded-3xl sm:rounded-4xl
                 px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 2xl:px-10 2xl:py-10
                 flex flex-col lg:flex-1 lg:min-h-0
                 transform transition-all duration-700 ease-out
                 will-change-[opacity,transform,backdrop-filter]"
            :class="inView.dp
            ? 'opacity-100 translate-x-0 backdrop-blur-sm'
            : 'opacity-0 translate-x-6 backdrop-blur-none'"
            style="will-change: opacity, transform, backdrop-filter;"
        >
          <p class="font-bg-rubik font-bold
                    text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl
                    text-(--text-muted) mb-2 xs:mb-3 sm:mb-4 flex-shrink-0"
             style="font-weight: bold;">
            {{ t('section-4-dp-title') }}
          </p>
          <div
              class="lg:flex-1 overflow-visible lg:overflow-y-auto bg-none dark:border dark:border-(--border-muted)
                   rounded-xl xs:rounded-2xl sm:rounded-3xl lg:rounded-4xl
                   p-2 xs:p-2.5 sm:p-3 md:p-4
                   scrollbar-hide flex flex-col gap-1.5 xs:gap-2 lg:min-h-0
                   shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]
                   max-h-none lg:max-h-none"
          >
            <div
                v-for="i in 6"
                :key="i"
                class="px-2 py-2 xs:px-3 xs:py-2.5 sm:px-4 sm:py-3 md:py-4
                     bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                     backdrop-blur-sm dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                     border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                     shadow-lg rounded-xl xs:rounded-2xl flex flex-col gap-0.5 xs:gap-1
                     transition-all hover:bg-(--bg-extra-light) flex-shrink-0
                     min-h-[70px] xs:min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] 2xl:h-[15vh]"
            >
              <p class="font-bg-roboto
                        text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-2xl
                        text-(--text-muted) font-bold leading-tight"
                 style="font-weight: bold;">
                {{ t(`section-4-dp-${i-1}-title`) }}
              </p>
              <p class="font-bg-rubik
                        text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-md 2xl:text-md
                        leading-tight xs:leading-normal">
                {{ t(`section-4-dp-${i-1}-desc`) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:min-h-0 lg:h-full flex flex-col">
        <div
            ref="socRef"
            class="bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                 dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                 border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                 shadow-2xl rounded-2xl xs:rounded-3xl sm:rounded-4xl
                 px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 2xl:px-10 2xl:py-10
                 flex flex-col gap-2 xs:gap-3 sm:gap-4
                 lg:h-full lg:min-h-0
                 transform transition-all duration-700 ease-out
                 will-change-[opacity,transform,backdrop-filter]"
            :class="inView.soc
            ? 'opacity-100 translate-x-0 backdrop-blur-sm'
            : 'opacity-0 -translate-x-6 backdrop-blur-none'"
            style="will-change: opacity, transform, backdrop-filter;"
        >
          <p class="font-bg-rubik font-bold
                    text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl
                    text-(--text-muted) mb-1 xs:mb-2 sm:mb-2 lg:mb-4 flex-shrink-0"
             style="font-weight: bold;">
            {{ t('global-socials-title') }}
          </p>

          <div class="lg:flex-1 overflow-visible lg:overflow-y-auto lg:overscroll-contain scrollbar-hide max-h-none lg:max-h-none">
            <div class="flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:gap-6 2xl:gap-8 mt-1 xs:mt-2">
              <div
                  v-for="(value, key) in socials"
                  :key="key"
                  class="relative"
              >
                <span
                    class="absolute -top-2 xs:-top-2.5 left-3 xs:left-4 sm:left-5
                         bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)]
                         px-1 xs:px-1.5 sm:px-2
                         font-bg-rubik font-bold text-[10px] xs:text-xs sm:text-sm
                         text-(--text-muted) z-100 uppercase"
                    style="font-weight: bold;"
                >
                  {{ key }}
                </span>
                <div
                    class="border border-(--border-muted) rounded-lg xs:rounded-xl sm:rounded-2xl
                         p-1.5 xs:p-2 sm:p-2.5 md:p-3
                         flex justify-between items-center gap-1 xs:gap-2
                         bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm
                         transition-all duration-200
                         hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)]
                         hover:border-(--border)"
                >
                  <span class="font-bg-rubik text-(--text)
                               text-[11px] xs:text-xs sm:text-sm md:text-base
                               select-all truncate flex-1 min-w-0">
                    {{ value }}
                  </span>
                  <button
                      @click="copyToClipboard(key)"
                      class="p-1 xs:p-1.5
                           bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)]
                           border border-(--border) rounded-md xs:rounded-lg
                           text-(--text-muted) cursor-pointer transition-all duration-200
                           flex items-center justify-center
                           min-w-[24px] xs:min-w-[28px] sm:min-w-[32px]
                           h-6 xs:h-7 sm:h-8
                           hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)]
                           hover:text-(--text)
                           hover:scale-105 active:scale-95 flex-shrink-0"
                  >
                    <span v-if="!copiedStates[key]" class="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg"
                           class="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </span>
                    <span v-else class="text-[11px] xs:text-xs sm:text-sm">✓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@media (max-width: 300px) {
  .truncate {
    font-size: 10px !important;
  }
}
</style>