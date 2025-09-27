<!-- Credits to vue bits for the effect -->
<!-- Lightly modified by juinc -->

<script setup lang="ts">
  import { onMounted, onUnmounted, watch, type CSSProperties, useTemplateRef, ref } from 'vue';
  import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
  import { useProfileData } from '@/shared/composables/profileData.js';

  interface AuroraProps {
    amplitude?: number;
    blend?: number;
    time?: number;
    speed?: number;
    intensity?: number;
    className?: string;
    style?: CSSProperties;
    transitionDuration?: number;
  }

  const props = withDefaults(defineProps<AuroraProps>(), {
    amplitude: 1.0,
    blend: 0.5,
    speed: 1.0,
    intensity: 1.0,
    className: '',
    style: () => ({}),
    transitionDuration: 500
  });

  const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

  const { currentProfile, currentProfileIndex } = useProfileData();

  const isTransitioning = ref(false);
  const transitionProgress = ref(1);
  let transitionStartTime = 0;

  let renderer: Renderer | null = null;
  let program: Program | null = null;
  let animateId = 0;

  const currentColors = ref<number[][]>([]);
  const targetColors = ref<number[][]>([]);
  const isInitialized = ref(false);

  const VERT = `#version 300 es
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
  `;

  const FRAG = `#version 300 es
  precision highp float;

  uniform float uTime;
  uniform float uAmplitude;
  uniform vec3 uCurrentColors[3];
  uniform vec3 uTargetColors[3];
  uniform vec2 uResolution;
  uniform float uBlend;
  uniform float uIntensity;
  uniform float uTransitionProgress;

  out vec4 fragColor;

  vec3 permute(vec3 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  float snoise(vec2 v){
    const vec4 C = vec4(
        0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);

    vec3 p = permute(
        permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0)
    );

    vec3 m = max(
        0.5 - vec3(
            dot(x0, x0),
            dot(x12.xy, x12.xy),
            dot(x12.zw, x12.zw)
        ),
        0.0
    );
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  struct ColorStop {
    vec3 color;
    float position;
  };

  #define COLOR_RAMP(colors, factor, finalColor) {              \
    int index = 0;                                            \
    for (int i = 0; i < 2; i++) {                               \
       ColorStop currentColor = colors[i];                    \
       bool isInBetween = currentColor.position <= factor;    \
       index = int(mix(float(index), float(i), float(isInBetween))); \
    }                                                         \
    ColorStop currentColor = colors[index];                   \
    ColorStop nextColor = colors[index + 1];                  \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    vec3 interpolatedColors[3];
    for(int i = 0; i < 3; i++) {
      interpolatedColors[i] = mix(uCurrentColors[i], uTargetColors[i], uTransitionProgress);
    }

    ColorStop colors[3];
    colors[0] = ColorStop(interpolatedColors[0], 0.0);
    colors[1] = ColorStop(interpolatedColors[1], 0.5);
    colors[2] = ColorStop(interpolatedColors[2], 1.0);

    vec3 rampColor;
    COLOR_RAMP(colors, uv.x, rampColor);

    float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
    height = exp(height);
    height = (uv.y * 2.0 - height + 0.2);
    float intensity = 0.6 * height;

    float midPoint = 0.20;
    float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

    vec3 auroraColor = rampColor;
    float finalAlpha = auroraAlpha * smoothstep(0.0, 0.5, intensity) * uIntensity;

    fragColor = vec4(auroraColor * finalAlpha, finalAlpha);
  }
  `;

  const hexToRgb = (hex: string): [number, number, number] => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const getCurrentProfileColors = (): string[] => {
    return [
      currentProfile.value.gradientFrom,
      currentProfile.value.gradientTo,
      currentProfile.value.gradientFrom
    ];
  };

  const updateColorsFromProfile = () => {
    if (!program || !isInitialized.value) return;

    const newColorStops = getCurrentProfileColors();

    const newRgbColors = newColorStops.map(hexToRgb);

    currentColors.value = [...targetColors.value];
    targetColors.value = newRgbColors;

    isTransitioning.value = true;
    transitionProgress.value = 0;
    transitionStartTime = performance.now();

    program.uniforms.uCurrentColors.value = currentColors.value;
    program.uniforms.uTargetColors.value = targetColors.value;
  };

  const initAurora = () => {
    const container = containerRef.value;
    if (!container) return;

    renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    const resize = () => {
      if (!container) return;
      const width = Math.max(container.offsetWidth || window.innerWidth, 300);
      const height = Math.max(container.offsetHeight || window.innerHeight, 300);
      renderer!.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    };

    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const initialColorStops = getCurrentProfileColors();
    const initialColors = initialColorStops.map(hexToRgb);
    currentColors.value = initialColors;
    targetColors.value = initialColors;

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: props.amplitude },
        uCurrentColors: { value: initialColors },
        uTargetColors: { value: initialColors },
        uResolution: { value: [container.offsetWidth || window.innerWidth, container.offsetHeight || window.innerHeight] },
        uBlend: { value: props.blend },
        uIntensity: { value: props.intensity },
        uTransitionProgress: { value: 1.0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';

    const animate = (t: number) => {
      animateId = requestAnimationFrame(animate);

      if (program) {
        const time = props.time ?? t * 0.01;
        program.uniforms.uTime.value = time * (props.speed ?? 1.0) * 0.1;

        program.uniforms.uAmplitude.value = props.amplitude ?? 1.0;
        program.uniforms.uBlend.value = props.blend ?? 0.5;
        program.uniforms.uIntensity.value = props.intensity ?? 1.0;

        if (isTransitioning.value) {
          const elapsed = t - transitionStartTime;
          const duration = props.transitionDuration;
          const rawProgress = Math.min(elapsed / duration, 1);
          const easedProgress = easeInOutCubic(rawProgress);

          transitionProgress.value = easedProgress;
          program.uniforms.uTransitionProgress.value = easedProgress;

          if (rawProgress >= 1) {
            isTransitioning.value = false;
            currentColors.value = [...targetColors.value];
          }
        }

        renderer!.render({ scene: mesh });
      }
    };

    resize();
    isInitialized.value = true;
    animateId = requestAnimationFrame(animate);
  };

  const cleanup = () => {
    isInitialized.value = false;
    if (animateId) {
      cancelAnimationFrame(animateId);
      animateId = 0;
    }
    if (renderer) {
      const container = containerRef.value;
      const gl = renderer.gl;
      if (container && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    renderer = null;
    program = null;
  };

  onMounted(() => {
    initAurora();
  });

  onUnmounted(() => {
    cleanup();
  });

  watch(currentProfileIndex, (newIndex, oldIndex) => {
    updateColorsFromProfile();
  }, { immediate: false });

  watch(
      () => [props.amplitude, props.blend, props.intensity],
      () => {
        if (renderer) {
          cleanup();
          setTimeout(() => initAurora(), 50);
        }
      }
  );
</script>

<template>
  <div ref="containerRef" :class="className" :style="style" class="relative"></div>
</template>

<style scoped>
  :deep(canvas) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: -1 !important;
    pointer-events: none !important;
  }
</style>