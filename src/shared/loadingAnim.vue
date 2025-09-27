<script setup>
  import { ref, onMounted, nextTick, computed } from 'vue'

  const props = defineProps({
    shapeFadeInDuration: { type: Number, default: 500 },
    pathAnimationDuration: { type: Number, default: 900 },
    rectangleAnimationDuration: { type: Number, default: 900 },
    pathAnimationDelay: { type: Number, default: 300 },
    rectangleAnimationDelay: { type: Number, default: 400 },
    zoomDuration: { type: Number, default: 600 },
    totalLoadingTime: { type: Number, default: 1400 },

    backgroundColor: { type: String, default: 'black' },
    baseShapeColor: { type: String, default: '#666666' },
    fillColor: { type: String, default: 'white' },
    rectangleColor: { type: String, default: 'white' },

    shapeSize: { type: Number, default: 300 },
    strokeWidth: { type: Number, default: 16 },
    rectangleWidth: { type: Number, default: 20 },
    rectangleHeight: { type: Number, default: 80 },

    shapeInitialScale: { type: Number, default: 0.8 },
    rectangleInitialScale: { type: Number, default: 0.6 },
    rectangleOvershoot: { type: Number, default: 1.05 },
    zoomScale: { type: Number, default: 10 },

    fadeEasing: { type: String, default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    pathEasing: { type: String, default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
    rectangleEasing: { type: String, default: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    zoomEasing: { type: String, default: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },

    enableShapeFadeIn: { type: Boolean, default: true },
    enableRectangleAnimation: { type: Boolean, default: true },
    enableZoomEffect: { type: Boolean, default: true },
    enableBounceEffect: { type: Boolean, default: true }
  })

  const isLoading = ref(true)
  const isZooming = ref(false)
  const svgElement = ref(null)
  const animatedPath = ref(null)
  const pathLength = ref(0)

  const emit = defineEmits(['loading-complete'])

  const dynamicStyles = computed(() => ({
    '--shape-fade-duration': `${props.shapeFadeInDuration}ms`,
    '--path-duration': `${props.pathAnimationDuration}ms`,
    '--path-delay': `${props.pathAnimationDelay}ms`,
    '--rectangle-duration': `${props.rectangleAnimationDuration}ms`,
    '--rectangle-delay': `${props.rectangleAnimationDelay}ms`,
    '--zoom-duration': `${props.zoomDuration}ms`,
    '--shape-initial-scale': props.shapeInitialScale,
    '--rectangle-initial-scale': props.rectangleInitialScale,
    '--rectangle-overshoot': props.rectangleOvershoot,
    '--zoom-scale': props.zoomScale,
    '--fade-easing': props.fadeEasing,
    '--path-easing': props.pathEasing,
    '--rectangle-easing': props.rectangleEasing,
    '--zoom-easing': props.zoomEasing,
    '--path-length': pathLength.value
  }))

  onMounted(async () => {
    await nextTick()

    if (animatedPath.value) {
      pathLength.value = animatedPath.value.getTotalLength()

      animatedPath.value.style.transition = 'none'

      animatedPath.value.style.strokeDasharray = `${pathLength.value}`
      animatedPath.value.style.strokeDashoffset = `-${pathLength.value}` // Negative for left-to-right

      setTimeout(() => {
        animatedPath.value.style.transition = `stroke-dashoffset var(--path-duration) var(--path-easing)`

        setTimeout(() => {
          animatedPath.value.style.strokeDashoffset = '0'
        }, 50)
      }, props.pathAnimationDelay)
    }

    setTimeout(() => {
      isLoading.value = false
      if (props.enableZoomEffect) {
        isZooming.value = true

        setTimeout(() => {
          isZooming.value = false
          emit('loading-complete')
        }, props.zoomDuration)
      } else {
        emit('loading-complete')
      }
    }, props.totalLoadingTime)
  })
</script>

<template>
  <div
      class="loading-screen"
      v-if="isLoading || isZooming"
      :class="{ 'fade-out-screen': isZooming }"
      :style="{ backgroundColor: backgroundColor }"
  >
    <div class="svg-container" :class="{ 'zoom-in': isZooming }">
      <svg
          id="loading-circle"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 231.19 214.59"
          :width="shapeSize"
          :height="shapeSize * 0.93"
          class="shape"
          ref="svgElement"
      >
        <path
            class="base-path"
            d="M175.01,203.53c27.76-18.98,45.98-50.9,45.98-87.07,0-58.21-47.19-105.4-105.4-105.4C57.39,11.07,10.2,58.25,10.2,116.46c0,36.17,18.22,68.09,45.98,87.07"
            :style="{ stroke: baseShapeColor, strokeWidth: `${strokeWidth}px` }"
        />

        <path
            class="animated-path"
            ref="animatedPath"
            d="M175.01,203.53c27.76-18.98,45.98-50.9,45.98-87.07,0-58.21-47.19-105.4-105.4-105.4C57.39,11.07,10.2,58.25,10.2,116.46c0,36.17,18.22,68.09,45.98,87.07"
            :style="{ stroke: fillColor, strokeWidth: `${strokeWidth}px` }"
        />
      </svg>

      <div
          v-if="enableRectangleAnimation"
          class="animated-rectangle"
          :style="{
          backgroundColor: rectangleColor,
          width: `${rectangleWidth}px`,
          height: `${rectangleHeight}px`
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity var(--zoom-duration) var(--fade-easing);
  }

  .loading-screen.fade-out-screen {
    opacity: 0;
  }

  .svg-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(1);
    transition: transform var(--zoom-duration) var(--zoom-easing);
  }

  .svg-container.zoom-in {
    transform: scale(var(--zoom-scale));
  }

  .shape {
    opacity: 0;
    animation: fadeInShape var(--shape-fade-duration) var(--fade-easing) forwards;
  }

  .base-path {
    fill: none;
    stroke-linecap: round;
    stroke-miterlimit: 5;
  }

  .animated-path {
    fill: none;
    stroke-linecap: round;
    stroke-miterlimit: 5;

    stroke-dasharray: 1000;
    stroke-dashoffset: -1000; /* Negative for left-to-right animation */
  }

  .animated-rectangle {
    position: absolute;
    left: 50%;
    top: calc(100vh - 20px);
    transform: translateX(-50%) scale(var(--rectangle-initial-scale));
    opacity: 0;
    border-radius: 1px;
    animation: moveFromBottom var(--rectangle-duration) var(--rectangle-delay) var(--rectangle-easing) forwards;
  }

  @keyframes fadeInShape {
    0% {
      opacity: 0;
      transform: scale(var(--shape-initial-scale));
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes moveFromBottom {
    0% {
      top: calc(100vh - 20px);
      opacity: 0;
      transform: translateX(-50%) scale(var(--rectangle-initial-scale));
    }
    15% {
      opacity: 0.1;
      transform: translateX(-50%) scale(calc(var(--rectangle-initial-scale) + 0.1));
    }
    35% {
      opacity: 0.4;
      transform: translateX(-50%) scale(calc(var(--rectangle-initial-scale) + 0.25));
    }
    60% {
      opacity: 0.7;
      transform: translateX(-50%) scale(calc(var(--rectangle-initial-scale) + 0.35));
    }
    80% {
      opacity: 0.9;
      transform: translateX(-50%) scale(var(--rectangle-overshoot));
    }
    95% {
      top: 50%;
      opacity: 1;
      transform: translate(-50%, -50%) scale(calc(var(--rectangle-overshoot) - 0.03));
    }
    100% {
      top: 50%;
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
</style>

<style>
  .loading-screen {
    --shape-fade-duration: v-bind('dynamicStyles["--shape-fade-duration"]');
    --path-duration: v-bind('dynamicStyles["--path-duration"]');
    --path-delay: v-bind('dynamicStyles["--path-delay"]');
    --rectangle-duration: v-bind('dynamicStyles["--rectangle-duration"]');
    --rectangle-delay: v-bind('dynamicStyles["--rectangle-delay"]');
    --zoom-duration: v-bind('dynamicStyles["--zoom-duration"]');
    --shape-initial-scale: v-bind('dynamicStyles["--shape-initial-scale"]');
    --rectangle-initial-scale: v-bind('dynamicStyles["--rectangle-initial-scale"]');
    --rectangle-overshoot: v-bind('dynamicStyles["--rectangle-overshoot"]');
    --zoom-scale: v-bind('dynamicStyles["--zoom-scale"]');
    --fade-easing: v-bind('dynamicStyles["--fade-easing"]');
    --path-easing: v-bind('dynamicStyles["--path-easing"]');
    --rectangle-easing: v-bind('dynamicStyles["--rectangle-easing"]');
    --zoom-easing: v-bind('dynamicStyles["--zoom-easing"]');
    --path-length: v-bind('dynamicStyles["--path-length"]');
  }
</style>