<script setup>
  import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ProjectCard from '@/sections/section3/components/projectCard.vue'

  const { t } = useI18n()

  import ikm1 from '@/assets/img/ikm/1.png';
  import ikm2 from '@/assets/img/ikm/2.png';
  import ikm3 from '@/assets/img/ikm/3.png';
  import ikm4 from '@/assets/img/ikm/4.png';
  import ikm5 from '@/assets/img/ikm/5.png';

  import bot1 from '@/assets/img/bot/1.png';
  import bot2 from '@/assets/img/bot/2.png';
  import bot3 from '@/assets/img/bot/3.png';
  import bot4 from '@/assets/img/bot/4.png';

  import odb1 from '@/assets/img/odb/1.png';
  import odb2 from '@/assets/img/odb/2.png';
  import odb3 from '@/assets/img/odb/3.png';
  import odb4 from '@/assets/img/odb/4.png';
  import odb5 from '@/assets/img/odb/5.png';
  import odb6 from '@/assets/img/odb/6.png';
  import odb7 from '@/assets/img/odb/7.png';
  import odb8 from '@/assets/img/odb/8.png';
  import odb9 from '@/assets/img/odb/9.png';

  import prt1 from '@/assets/img/prt/1.png';
  import prt2 from '@/assets/img/prt/2.png';
  import prt3 from '@/assets/img/prt/3.png';

  const projects = computed(() => [
    {
      title: t('project-1-title'),
      description: t('project-1-card-desc'),
      modalDescription: t('project-1-modal-desc'),
      images: [
        ikm1,
        ikm2
      ],
      modalImages: [
        ikm1,
        ikm2,
        ikm3,
        ikm4,
        ikm5
      ],
      technologies: ['Roblox', 'Luau', 'Fusion', 'Adb Illustrator', 'Blender', 'Lunacy', 'Rojo'],
      socials: [
        { name: 'Roblox', url: 'https://www.roblox.com/share/g/260210301' },
        { name: 'Discord', url: 'https://discord.gg/TsMbEnrRVg' }
      ]
    },
    {
      title: t('project-2-title'),
      description: t('project-2-card-desc'),
      modalDescription: t('project-2-modal-desc'),
      images: [
        bot1,
        bot2,
      ],
      modalImages: [
        bot1,
        bot2,
        bot3,
        bot4
      ],
      technologies: ['Python', 'Discord.py', 'Docker', 'Proxmox', 'Linux', 'Linux servers'],
      socials: [{ name: 'GitHub', url: 'https://github.com/juinc/Hooty-Bot' }]
    },
    {
      title: t('project-3-title'),
      description: t('project-3-card-desc'),
      modalDescription: t('project-3-modal-desc'),
      images: [
        odb1,
        odb2
      ],
      modalImages: [
        odb1,
        odb2,
        odb3,
        odb4,
        odb5,
        odb6,
        odb7,
        odb8,
        odb9
      ],
      technologies: ['C++', 'imgui', 'Vulkan', 'Walnut', 'Desktop'],
      socials: [{ name: 'GitHub', url: 'https://github.com/juinc/Bank-DB-Project' }]
    },
    {
      title: t('project-4-title'),
      description: t('project-4-card-desc'),
      modalDescription: t('project-4-modal-desc'),
      images: [
        prt1,
        prt2
      ],
      modalImages: [
        prt1,
        prt2,
        prt3
      ],
      technologies: ['Vue.js', 'TailwindCSS', 'i18n', 'Github Pages', 'Swiper.js'],
      socials: [{ name: 'GitHub', url: 'https://github.com/juinc/portfolio' }]
    }
  ])

  const observerCache = new WeakMap()

  function useReveal({ threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
    const el = ref(null)
    const visible = ref(false)
    let observer = null
    let rafId = null

    const start = () => {
      if (!el.value || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        visible.value = true
        return
      }

      const options = { threshold, rootMargin }
      const key = JSON.stringify(options)

      if (!observerCache.has(window)) {
        observerCache.set(window, {})
      }

      const cache = observerCache.get(window)

      if (!cache[key]) {
        cache[key] = new IntersectionObserver((entries) => {
          if (rafId) cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(() => {
            entries.forEach((entry) => {
              const callback = entry.target._revealCallback
              if (callback) callback(entry)
            })
          })
        }, options)
      }

      observer = cache[key]

      el.value._revealCallback = (entry) => {
        if (entry.isIntersecting) {
          visible.value = true
          if (once) {
            observer.unobserve(entry.target)
            delete entry.target._revealCallback
          }
        } else if (!once) {
          visible.value = false
        }
      }

      observer.observe(el.value)
    }

    onMounted(async () => {
      await nextTick()
      start()
    })

    onBeforeUnmount(() => {
      if (rafId) cancelAnimationFrame(rafId)
      if (observer && el.value) {
        observer.unobserve(el.value)
        delete el.value._revealCallback
      }
    })

    return { el, visible }
  }

  function revealClasses(isVisible, direction = 'left') {
    const base = 'transform-gpu transition-opacity transition-transform duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none'
    const hiddenTranslate = {
      left: 'translate3d(-2rem, 0, 0)',
      right: 'translate3d(2rem, 0, 0)',
      up: 'translate3d(0, -2rem, 0)',
      down: 'translate3d(0, 2rem, 0)'
    }[direction] || 'translate3d(0, 2rem, 0)'
    return [
      base,
      isVisible ? 'opacity-100 translate3d-0' : `opacity-0 ${hiddenTranslate} motion-reduce:opacity-100`
    ].join(' ')
  }

  const { el: titleRef, visible: titleVisible } = useReveal({ threshold: 0.2 })
  const { el: gridRef, visible: gridVisible } = useReveal({ threshold: 0.15 })

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

  onBeforeUnmount(() => {
    window.removeEventListener('resize', setVh)
    window.removeEventListener('orientationchange', setVh)
    if (window.visualViewport) window.visualViewport.removeEventListener('resize', setVh)
  })
</script>

<template>
  <section
      id="section-3"
      class="relative py-8 lg:py-0 lg:h-screen lg:flex lg:items-center lg:justify-center min-h-[calc(var(--vh,1vh)*100)] lg:min-h-0 max-h-none lg:max-h-[1000px] overflow-visible lg:overflow-hidden"
  >
    <div
        class="w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[90vw] xl:w-[90vw] 2xl:w-[70vw]
             mx-auto lg:mx-0 lg:absolute lg:top-[50%] lg:left-[50%]
             lg:translate-x-[-50%] lg:translate-y-[-50%] z-10 flex flex-col
             lg:h-[98vh] h-auto overflow-visible lg:overflow-hidden max-h-none lg:max-h-[1000px]"
    >
      <p
          ref="titleRef"
          :class="['font-bg-rubik font-bold text-2xl sm:text-3xl lg:text-4xl text-(--text-muted) mb-4 lg:mb-6 lg:px-0', revealClasses(titleVisible, 'left')]"
          style="font-weight: bold"
      >
        {{ t('projects-section-title') }}
      </p>

      <div
          ref="gridRef"
          :class="['grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 w-full lg:flex-1 lg:px-0', revealClasses(gridVisible, 'right')]"
      >
        <ProjectCard
            v-for="(project, index) in projects"
            :key="index"
            :title="project.title"
            :description="project.description"
            :images="project.images"
            :technologies="project.technologies"
            :socials="project.socials"
            :modal-description="project.modalDescription"
            :modal-images="project.modalImages"
            :reveal-direction="index % 2 === 0 ? 'left' : 'right'"
            :reveal-delay="index * 90"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.translate3d-0 {
  transform: translate3d(0, 0, 0);
}
</style>