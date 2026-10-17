import { useEffect, useRef } from 'react'
import {
  AmbientLight, Box3, Bone, DirectionalLight, HemisphereLight, MathUtils, Mesh, Object3D, PerspectiveCamera,
  Scene, SkinnedMesh, SRGBColorSpace, Vector3, WebGLRenderer, type Texture,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

type Props = { visible: boolean; size: 'hero' | 'small'; onReady: () => void; onError: () => void }

const GLB = '/avatar/avatar.glb'
const clamp = MathUtils.clamp

export default function Avatar3DScene({ visible, size, onReady, onError }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const cb = useRef({ onReady, onError }); cb.current = { onReady, onError }

  useEffect(() => {
    const el = host.current
    if (!el) return
    let disposed = false, raf = 0, running = false, inView = true
    const small = size === 'small'

    const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(small ? 20 : 22, 1, 0.05, 20)
    // soft, mostly flat key (the albedo has gentle shading already) + violet rim from behind-left + faint lime kick
    scene.add(new HemisphereLight(0xffffff, 0x3b3560, 1.35))
    scene.add(new AmbientLight(0xffffff, 0.55))
    const key = new DirectionalLight(0xfff3e6, 1.15); key.position.set(0.6, 1.4, 1.8); scene.add(key)
    const rim = new DirectionalLight(0x8b7bff, 3.2); rim.position.set(-1.6, 1.2, -1.2); scene.add(rim)
    const rim2 = new DirectionalLight(0xc6ff3d, 0.3); rim2.position.set(1.8, 0.4, -1.4); scene.add(rim2)

    let root: Object3D | null = null
    let head: Bone | null = null, neck: Bone | null = null
    let skinned: SkinnedMesh[] = []
    const morphs: Record<string, { mesh: Mesh; idx: number }[]> = {}
    const setMorph = (name: string, v: number) => { morphs[name]?.forEach(({ mesh, idx }) => { mesh.morphTargetInfluences![idx] = v }) }
    const headRest = { x: 0, y: 0, z: 0 }, neckRest = { x: 0, y: 0, z: 0 }

    // input state (all smoothed in the render loop; no React state)
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
    let smileT = 0, smile = 0, blink = 0, nextBlink = performance.now() + 2500, blinkStart = -1
    let scrollY = window.scrollY, scrollVel = 0, scrollTilt = 0
    let hover = false

    const resize = () => {
      const r = el.getBoundingClientRect(); const w = Math.max(2, Math.round(r.width)), h = Math.max(2, Math.round(r.height))
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize); ro.observe(el); resize()

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.38
      // gaze target relative to the face, normalised by viewport so far-away cursors saturate smoothly
      target.x = clamp((e.clientX - cx) / (window.innerWidth * 0.45), -1, 1)
      target.y = clamp((e.clientY - cy) / (window.innerHeight * 0.45), -1, 1)
      hover = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      smileT = hover ? 0.85 : 0
    }
    const onLeave = () => { hover = false; smileT = 0 }
    const onScroll = () => { const y = window.scrollY; scrollVel += (y - scrollY); scrollY = y }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; kick() }); io.observe(el)
    const onVis = () => kick(); document.addEventListener('visibilitychange', onVis)

    let last = performance.now()
    const frame = (now: number) => {
      raf = 0
      if (disposed) return
      if (!inView || document.hidden || !root) { running = false; return }
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const k = 1 - Math.pow(0.0015, dt)           // frame-rate independent smoothing
      cur.x += (target.x - cur.x) * k; cur.y += (target.y - cur.y) * k
      smile += (smileT - smile) * (1 - Math.pow(0.004, dt))
      // blink (random) – quick close/open
      if (blinkStart < 0 && now > nextBlink) { blinkStart = now; nextBlink = now + 2600 + Math.random() * 3800 }
      if (blinkStart >= 0) { const p = (now - blinkStart) / 170; blink = p >= 1 ? 0 : Math.sin(p * Math.PI); if (p >= 1) blinkStart = -1 }
      // scroll reaction: decaying velocity -> small nod + counter-lift
      scrollTilt += (clamp(scrollVel * 0.0016, -0.16, 0.16) - scrollTilt) * k
      scrollVel *= Math.pow(0.02, dt)
      const amp = small ? 0.7 : 1
      const yaw = cur.x * 0.42 * amp, pitch = cur.y * 0.22 * amp + scrollTilt
      if (head) { head.rotation.y = headRest.y + yaw * 0.55; head.rotation.x = headRest.x + pitch * 0.55 }
      if (neck) { neck.rotation.y = neckRest.y + yaw * 0.3; neck.rotation.x = neckRest.x + pitch * 0.3 }
      // eyes lead the head: morph targets (bone names are stripped by three; morphs are robust)
      const ex = clamp(cur.x * 1.25, -1, 1), ey = clamp(-cur.y * 1.25, -1, 1)
      setMorph('lookLeft', Math.max(0, ex)); setMorph('lookRight', Math.max(0, -ex))
      setMorph('lookUp', Math.max(0, ey) * 0.8); setMorph('lookDown', Math.max(0, -ey) * 0.8)
      setMorph('smile', smile); setMorph('blink', blink)
      setMorph('browRaise', clamp(Math.abs(scrollTilt) * 3 + (hover ? 0.25 : 0), 0, 0.6))
      root.position.y = Math.sin(now / 1900) * 0.0025 - scrollTilt * 0.02
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame); running = true
    }
    function kick() { if (!running && !raf && !disposed) { last = performance.now(); raf = requestAnimationFrame(frame); running = true } }

    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(GLB, (gltf) => {
      if (disposed) return
      root = gltf.scene
      root.traverse((o) => {
        if ((o as Bone).isBone) {
          const n = o.name.toLowerCase()
          if (n === 'head') { head = o as Bone; headRest.x = o.rotation.x; headRest.y = o.rotation.y; headRest.z = o.rotation.z }
          if (n === 'neck') { neck = o as Bone; neckRest.x = o.rotation.x; neckRest.y = o.rotation.y; neckRest.z = o.rotation.z }
        }
        const m = o as SkinnedMesh
        if (m.isMesh) {
          m.frustumCulled = false
          if (m.isSkinnedMesh) skinned.push(m)
          const dict = m.morphTargetDictionary
          if (dict) for (const [name, idx] of Object.entries(dict)) (morphs[name] ||= []).push({ mesh: m, idx })
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((mat: any) => { if (mat.map) (mat.map as Texture).anisotropy = 4 })
        }
      })
      scene.add(root)
      // frame the head & shoulders
      const box = new Box3().setFromObject(root); const c = box.getCenter(new Vector3()); const s = box.getSize(new Vector3())
      const headY = box.max.y - s.y * (small ? 0.40 : 0.40)
      const vh = s.y * (small ? 0.95 : 1.02)
      const dist = (vh / 2) / Math.tan(MathUtils.degToRad(camera.fov / 2))
      camera.position.set(c.x, headY, c.z + dist + s.z / 2); camera.lookAt(c.x, headY - s.y * 0.04, c.z)
      renderer.render(scene, camera)
      cb.current.onReady(); kick()
    }, undefined, () => { if (!disposed) cb.current.onError() })

    return () => {
      disposed = true; cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('pointerleave', onLeave); document.removeEventListener('visibilitychange', onVis)
      ro.disconnect(); io.disconnect()
      root?.traverse((o) => {
        const m = o as Mesh
        if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt: any) => { Object.values(mt).forEach((v: any) => v?.isTexture && v.dispose()); mt.dispose() }) }
      })
      renderer.dispose(); renderer.domElement.remove()
    }
  }, [size])

  return <div ref={host} className="a3d-canvas" data-state={visible ? 'in' : 'out'} />
}
