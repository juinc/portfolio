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
  observer?.disconnect();
});
</script>

<template>
  <section id="section-4" class="relative overflow-visible min-h-screen lg:overflow-hidden 2xl:h-screen">
    <div
        class="relative mx-auto max-w-screen-2xl grid gap-6 py-10 lg:py-0
          w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[90vw] xl:w-[90vw] 2xl:w-[70vw]
             lg:grid-cols-2 lg:gap-8 lg:h-[70vh] lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2
             2xl:h-[80vh] 2xl:grid-cols-2 2xl:gap-15"
    >
      <div class="flex flex-col gap-6 lg:min-h-0 lg:h-full 2xl:gap-15">
        <div
            ref="eduRef"
            class="bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                 dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                 border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                 shadow-2xl rounded-4xl px-6 py-6 sm:px-8 sm:py-8 2xl:px-10 2xl:py-10
                 transform transition-all duration-700 ease-out
                 will-change-[opacity,transform,backdrop-filter]"
            :class="inView.edu
              ? 'opacity-100 translate-x-0 backdrop-blur-sm'
              : 'opacity-0 -translate-x-6 backdrop-blur-none'"
            style="will-change: opacity, transform, backdrop-filter;"
        >
          <p class="font-bg-rubik font-bold text-2xl md:text-3xl sm:text-3xl lg:text-4xl 2xl:text-4xl text-(--text-muted) mb-4" style="font-weight: bold;">
            {{ t('section-4-education-title') }}
          </p>
          <p class="font-bg-rubik font-bold text-base md:text-xl sm:text-lg lg:text-xl 2xl:text-xl text-(--text) whitespace-pre-line">
            {{ t('section-4-education-text') }}
          </p>
          <ul class="font-bg-rubik font-bold text-base md:text-xl sm:text-lg lg:text-xl 2xl:text-xl text-(--text) list-disc ml-5 mt-2">
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
                 shadow-2xl rounded-4xl px-6 py-6 sm:px-8 sm:py-8 2xl:px-10 2xl:py-10 flex flex-col
                 lg:flex-1 lg:min-h-0
                 transform transition-all duration-700 ease-out
                 will-change-[opacity,transform,backdrop-filter]"
            :class="inView.dp
              ? 'opacity-100 translate-x-0 backdrop-blur-sm'
              : 'opacity-0 translate-x-6 backdrop-blur-none'"
            style="will-change: opacity, transform, backdrop-filter;"
        >
          <p class="font-bg-rubik font-bold text-2xl sm:text-3xl lg:text-4xl 2xl:text-4xl text-(--text-muted) mb-4 flex-shrink-0" style="font-weight: bold;">
            {{ t('section-4-dp-title') }}
          </p>
          <div
              class="flex-1 overflow-y-auto bg-none dark:border dark:border-(--border-muted) rounded-4xl p-3 sm:p-4
                   scrollbar-hide flex flex-col gap-2 min-h-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]"
          >
            <div
                v-for="i in 4"
                :key="i"
                class="px-3 sm:px-4 py-3 sm:py-4 bg-[linear-gradient(to_bottom,_color-mix(in_oklch,_var(--bg-light)_25%,_transparent),_color-mix(in_oklch,_var(--bg)_15%,_transparent))]
                     backdrop-blur-sm dark:border-r dark:border-b dark:border-l dark:border-(--border-muted)
                     border-t-[2px] dark:border-t-[1.5px] border-t-(--highlight) dark:border-t-(--highlight)
                     shadow-lg rounded-2xl flex flex-col gap-1 transition-all hover:bg-(--bg-extra-light) flex-shrink-0
                     min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] 2xl:h-[15vh]"
            >
              <p class="font-bg-roboto text-lg sm:text-xl lg:text-2xl 2xl:text-2xl text-(--text-muted) font-bold" style="font-weight: bold;">
                {{ t(`section-4-dp-${i}-title`) }}
              </p>
              <p class="font-bg-rubik text-sm sm:text-base lg:text-md 2xl:text-md">
                {{ t(`section-4-dp-${i}-desc`) }}
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
                 shadow-2xl rounded-4xl px-6 py-6 sm:px-8 sm:py-8 2xl:px-10 2xl:py-10 flex flex-col gap-4
                 lg:h-full lg:min-h-0
                 transform transition-all duration-700 ease-out
                 will-change-[opacity,transform,backdrop-filter]"
            :class="inView.soc
              ? 'opacity-100 translate-x-0 backdrop-blur-sm'
              : 'opacity-0 -translate-x-6 backdrop-blur-none'"
            style="will-change: opacity, transform, backdrop-filter;"
        >
          <p class="font-bg-rubik font-bold text-2xl sm:text-3xl lg:text-4xl 2xl:text-4xl text-(--text-muted) mb-2 lg:mb-4 flex-shrink-0" style="font-weight: bold;">
            {{ t('global-socials-title') }}
          </p>

          <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide">
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-6 2xl:gap-8 mt-2">
              <div
                  v-for="(value, key) in socials"
                  :key="key"
                  class="relative"
              >
                <span
                    class="absolute -top-2.5 left-5 bg-[color-mix(in_oklch,_var(--bg)_20%,_transparent)] px-2
                         font-bg-rubik font-bold text-xs sm:text-sm text-(--text-muted) z-100 uppercase" style="font-weight: bold;"
                >
                  {{ key }}
                </span>
                <div
                    class="border border-(--border-muted) rounded-2xl p-2.5 sm:p-3 flex justify-between items-center
                         bg-[color-mix(in_oklch,_var(--bg)_10%,_transparent)] backdrop-blur-sm transition-all duration-200
                         hover:bg-[color-mix(in_oklch,_var(--bg)_30%,_transparent)] hover:border-(--border)"
                >
                  <span class="font-bg-rubik text-(--text) text-sm sm:text-base select-all truncate mr-2">
                    {{ value }}
                  </span>
                  <button
                      @click="copyToClipboard(key)"
                      class="p-1.5 px-2 sm:px-2.5 bg-[color-mix(in_oklch,_var(--bg)_40%,_transparent)]
                           border border-(--border) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-200
                           flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-7 sm:h-8
                           hover:bg-[color-mix(in_oklch,_var(--bg)_60%,_transparent)] hover:text-(--text)
                           hover:scale-105 active:scale-95 flex-shrink-0"
                  >
                    <span v-if="!copiedStates[key]">
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
      </div>
    </div>
  </section>
</template>