import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Hero particle cloud: morphs sphere → cube lattice → double helix → "RA" → sphere,
// and scatters away from the cursor. Every shape is baked into its own attribute and
// the vertex shader blends between two of them, so the CPU only updates a few uniforms.

const RADIUS = 1.6
const HOLD = 3.5 // seconds each shape stays
const MORPH = 2.2 // seconds each transition takes
const SHAPE_COUNT = 4
const TEXT = 'RA'
const TEXT_FONT = '700 220px "Space Grotesk", sans-serif'

const THEMES = {
  dark: { a: '#10b981', b: '#6ee7b7', hot: '#ecfdf5', opacity: 0.85, blending: THREE.AdditiveBlending },
  light: { a: '#059669', b: '#047857', hot: '#0d9488', opacity: 0.8, blending: THREE.NormalBlending },
}

// ─── Shapes ─────────────────────────────────────────────────────────────────

function spherePoints(count: number) {
  const out = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const a = i * golden
    out.set([Math.cos(a) * r * RADIUS, y * RADIUS, Math.sin(a) * r * RADIUS], i * 3)
  }
  return out
}

// Points along the grid lines of a cube's faces, tilted so it reads as 3D
function cubeLatticePoints(count: number) {
  const out = new Float32Array(count * 3)
  const half = 1.15
  const lines = 4
  const tilt = new THREE.Euler(0.55, 0, 0.35)
  const v = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    const side = Math.random() < 0.5 ? -half : half
    const along = (Math.random() * 2 - 1) * half
    const snapped = ((Math.floor(Math.random() * lines) / (lines - 1)) * 2 - 1) * half
    const [a, b] = Math.random() < 0.5 ? [along, snapped] : [snapped, along]
    const axis = Math.floor(Math.random() * 3)
    if (axis === 0) v.set(side, a, b)
    else if (axis === 1) v.set(a, side, b)
    else v.set(a, b, side)
    v.applyEuler(tilt)
    out.set([v.x, v.y, v.z], i * 3)
  }
  return out
}

function doubleHelixPoints(count: number) {
  const out = new Float32Array(count * 3)
  const height = 3.4
  const r = 0.75
  const turns = 1.75
  const rungs = 16
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.75) {
      // Strands
      const t = Math.random()
      const a = t * turns * Math.PI * 2 + (Math.random() < 0.5 ? 0 : Math.PI)
      const jitter = () => (Math.random() - 0.5) * 0.08
      out.set([Math.cos(a) * r + jitter(), (t - 0.5) * height + jitter(), Math.sin(a) * r + jitter()], i * 3)
    } else {
      // Rungs between the strands
      const t = (Math.floor(Math.random() * rungs) + 0.5) / rungs
      const a = t * turns * Math.PI * 2
      const u = Math.random() * 2 - 1
      out.set([Math.cos(a) * r * u, (t - 0.5) * height, Math.sin(a) * r * u], i * 3)
    }
  }
  return out
}

// Samples filled pixels of the text drawn on an offscreen canvas
function textPoints(count: number): Float32Array | null {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = TEXT_FONT
  ctx.fillText(TEXT, w / 2, h / 2)
  const data = ctx.getImageData(0, 0, w, h).data
  const pixels: number[] = []
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) pixels.push(x, y)
    }
  }
  if (pixels.length === 0) return null

  const out = new Float32Array(count * 3)
  const scale = 4.4 / w
  for (let i = 0; i < count; i++) {
    const p = Math.floor(Math.random() * (pixels.length / 2)) * 2
    out.set([
      (pixels[p] - w / 2 + Math.random() * 2) * scale,
      -(pixels[p + 1] - h / 2 + Math.random() * 2) * scale,
      (Math.random() - 0.5) * 0.25,
    ], i * 3)
  }
  return out
}

// ─── Shaders ────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFrom;
  uniform float uTo;
  uniform float uProgress;
  uniform float uSpin;
  uniform float uSize;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uAspect;
  uniform float uTanHalfFov;

  attribute vec3 aSphere;
  attribute vec3 aCube;
  attribute vec3 aHelix;
  attribute vec3 aText;
  attribute float aRandom;

  varying float vForce;
  varying float vRandom;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  // The text doesn't spin so it stays readable
  vec3 shape(float i) {
    if (i < 0.5) return rotY(aSphere, uSpin);
    if (i < 1.5) return rotY(aCube, uSpin);
    if (i < 2.5) return rotY(aHelix, uSpin);
    return aText;
  }

  void main() {
    // Stagger each particle's start so the morph ripples through the cloud
    float t = clamp((uProgress - aRandom * 0.35) / 0.65, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 pos = mix(shape(uFrom), shape(uTo), t);
    // Burst outward mid-flight
    pos += normalize(pos + 0.0001) * sin(t * 3.14159) * (0.35 + aRandom * 0.5);
    // Idle shimmer
    pos += 0.02 * vec3(
      sin(uTime * 1.3 + aRandom * 40.0),
      cos(uTime * 1.1 + aRandom * 30.0),
      sin(uTime * 0.9 + aRandom * 20.0)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Push away from the cursor, measured at this particle's depth so it matches the screen
    vec2 pointer = vec2(uPointer.x * uAspect, uPointer.y) * uTanHalfFov * -mv.z;
    vec2 d = mv.xy - pointer;
    float force = uPointerStrength * (1.0 - smoothstep(0.0, 0.75, length(d)));
    mv.xy += normalize(d + 0.0001) * force * 0.5;
    mv.z += force * 0.3;

    vForce = force;
    vRandom = aRandom;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRandom * 0.8) * (1.0 + force * 0.5) / -mv.z;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorHot;
  uniform float uOpacity;

  varying float vForce;
  varying float vRandom;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = pow(1.0 - d * 2.0, 1.6);
    vec3 color = mix(uColorA, uColorB, vRandom);
    color = mix(color, uColorHot, clamp(vForce * 1.5, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`

// ─── Component ──────────────────────────────────────────────────────────────

const ParticleMorph: React.FC<{ dark: boolean; count?: number }> = ({ dark, count = 6000 }) => {
  const groupRef = useRef<THREE.Group>(null)
  const gl = useThree((state) => state.gl)
  const hovering = useRef(false)
  const strength = useRef(0)
  const phase = useRef({ from: 0, to: 1, elapsed: 0 })
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const sphere = spherePoints(count)
    g.setAttribute('position', new THREE.BufferAttribute(sphere.slice(), 3))
    g.setAttribute('aSphere', new THREE.BufferAttribute(sphere, 3))
    g.setAttribute('aCube', new THREE.BufferAttribute(cubeLatticePoints(count), 3))
    g.setAttribute('aHelix', new THREE.BufferAttribute(doubleHelixPoints(count), 3))
    g.setAttribute('aText', new THREE.BufferAttribute(textPoints(count) ?? sphere.slice(), 3))
    g.setAttribute('aRandom', new THREE.BufferAttribute(new Float32Array(count).map(() => Math.random()), 1))
    return g
  }, [count])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 1 },
      uProgress: { value: 0 },
      uSpin: { value: 0 },
      uSize: { value: 22 },
      uPointer: { value: new THREE.Vector2() },
      uPointerStrength: { value: 0 },
      uAspect: { value: 1 },
      uTanHalfFov: { value: 1 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uColorHot: { value: new THREE.Color() },
      uOpacity: { value: 1 },
    },
  }), [])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  // The text is sampled at mount; redo it once the heading font has loaded
  useEffect(() => {
    let cancelled = false
    document.fonts?.load(TEXT_FONT).then(() => {
      const points = !cancelled && textPoints(count)
      if (!points) return
      const attr = geometry.getAttribute('aText') as THREE.BufferAttribute
      attr.set(points)
      attr.needsUpdate = true
    })
    return () => { cancelled = true }
  }, [geometry, count])

  useEffect(() => {
    const theme = dark ? THEMES.dark : THEMES.light
    material.uniforms.uColorA.value.set(theme.a)
    material.uniforms.uColorB.value.set(theme.b)
    material.uniforms.uColorHot.value.set(theme.hot)
    material.uniforms.uOpacity.value = theme.opacity
    material.blending = theme.blending
    material.needsUpdate = true
  }, [dark, material])

  useEffect(() => {
    const el = gl.domElement
    const enter = () => { hovering.current = true }
    const leave = () => { hovering.current = false }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [gl])

  useFrame((state, delta) => {
    const u = material.uniforms
    const dt = Math.min(delta, 0.1) // no jump after switching tabs

    if (!reduceMotion) {
      const p = phase.current
      p.elapsed += dt
      if (p.elapsed > HOLD + MORPH) {
        p.from = p.to
        p.to = (p.to + 1) % SHAPE_COUNT
        p.elapsed = 0
      }
      u.uFrom.value = p.from
      u.uTo.value = p.to
      u.uProgress.value = Math.min(1, Math.max(0, (p.elapsed - HOLD) / MORPH))
      u.uSpin.value += dt * 0.25
      u.uTime.value += dt
    }

    strength.current = THREE.MathUtils.damp(strength.current, hovering.current ? 1 : 0, 4, dt)
    u.uPointerStrength.value = strength.current
    u.uPointer.value.copy(state.pointer)
    u.uAspect.value = state.size.width / state.size.height
    u.uTanHalfFov.value = Math.tan(THREE.MathUtils.degToRad((state.camera as THREE.PerspectiveCamera).fov / 2))
    u.uSize.value = 22 * state.gl.getPixelRatio()

    // Lean toward the cursor
    const g = groupRef.current
    if (g) {
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.25 * strength.current, 3, dt)
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.35 * strength.current, 3, dt)
    }
  })

  return (
    <group ref={groupRef} scale={0.78}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}

export default ParticleMorph
