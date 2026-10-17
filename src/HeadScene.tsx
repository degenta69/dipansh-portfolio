import { useEffect, useRef } from 'react'
import {
  AmbientLight, Box3, Bone, DirectionalLight, DoubleSide, FrontSide, HemisphereLight, MathUtils, Mesh, MeshStandardMaterial,
  Object3D, PerspectiveCamera, Plane, Scene, SkinnedMesh, SRGBColorSpace, Vector3, WebGLRenderer, type Material, type Texture,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { addTicker, stage } from './stage'

declare const __HEAD_GLB__: boolean
const HEAD_GLB = '/avatar/avatar-head.glb'      // preferred: head-only rigged model (build-time presence check, see vite.config.ts)
const FULL_GLB = '/avatar/avatar.glb'           // fallback: bust/torso model, cropped at the neck at runtime
const clamp = MathUtils.clamp

type Props = { onReady: () => void; onError: () => void }
type MorphRef = { mesh: Mesh; idx: number }

/** morph aliases (lower-case) → the model's own names; finds ARKit-style or custom names defensively */
const ALIASES: Record<string, string[]> = {
  blink: ['blink', 'eyesclosed', 'eyeblink'], blinkL: ['blink_l', 'eyeblinkleft', 'blinkleft'], blinkR: ['blink_r', 'eyeblinkright', 'blinkright'],
  smile: ['smile', 'mouthsmile'], smileL: ['mouthsmileleft'], smileR: ['mouthsmileright'], jaw: ['jawopen'], teeth: ['smileteeth'],
  brow: ['browraise', 'browinnerup', 'brow_up'],
  lookL: ['lookleft', 'eyelookoutleft'], lookR: ['lookright', 'eyelookoutright'], lookU: ['lookup', 'eyelookupleft'], lookD: ['lookdown', 'eyelookdownleft'],
}

export default function HeadScene({ onReady, onError }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const cb = useRef({ onReady, onError }); cb.current = { onReady, onError }

  useEffect(() => {
    const el = host.current!
    let disposed = false, visible = true

    const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default', stencil: false, depth: true })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.shadowMap.enabled = false
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.appendChild(renderer.domElement)
    // DPR is capped at 1.5 and adapts down when frames are slow
    const dprMax = Math.min(window.devicePixelRatio || 1, 1.5)
    let dpr = dprMax
    renderer.setPixelRatio(dpr)
    const clip = new Plane(new Vector3(0, 1, 0), 1e6); renderer.clippingPlanes = [clip]

    const scene = new Scene()
    const camera = new PerspectiveCamera(20, 1, 0.02, 20)
    scene.add(new HemisphereLight(0xdfe9ff, 0x1a1236, 1.25), new AmbientLight(0xffffff, 0.5))
    const key = new DirectionalLight(0xfff1e2, 1.2); key.position.set(0.7, 1.3, 1.8)
    const rimC = new DirectionalLight(0x4de1ff, 2.2); rimC.position.set(-1.8, 1.0, -1.1)
    const rimM = new DirectionalLight(0xff5bd1, 0.9); rimM.position.set(1.9, 0.5, -1.3)
    scene.add(key, rimC, rimM)

    let root: Object3D | null = null, head: Bone | null = null, neck: Bone | null = null
    let eyeL: Bone | null = null, eyeR: Bone | null = null
    const rest = { h: new Vector3(), n: new Vector3(), el: new Vector3(), er: new Vector3() }
    const morphs: Record<string, MorphRef[]> = {}
    const setM = (k: string, v: number) => { const a = morphs[k]; if (a) for (let i = 0; i < a.length; i++) a[i].mesh.morphTargetInfluences![a[i].idx] = v }

    const resize = () => {
      const r = el.getBoundingClientRect(); const w = Math.max(2, Math.round(r.width)), h = Math.max(2, Math.round(r.height))
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true
    }
    let dirty = true
    const ro = new ResizeObserver(resize); ro.observe(el); resize()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)

    // ── animation state ──
    const cur = { x: 0, y: 0, look: 0 }
    let smile = 0, blink = 0, nextBlink = performance.now() + 2200, blinkStart = -1, surprise = 0
    let nod = 0, lastActive = stage.active, orbit = 0, lastRender = 0, lastPoke = 0
    let slowAcc = 0, slowN = 0, fastN = 0

    const tick = (now: number, dt: number) => {
      if (!root || disposed || !visible || document.hidden) return
      const k = 1 - Math.pow(0.0015, dt)
      const tx = clamp(stage.px * 1.0, -1, 1), ty = clamp(stage.py * 1.0, -1, 1)
      const dx = tx - cur.x, dy = ty - cur.y, dl = stage.look - cur.look
      cur.x += dx * k; cur.y += dy * k; cur.look += dl * (1 - Math.pow(0.01, dt))
      if (stage.active !== lastActive) { lastActive = stage.active; nod = 1 }
      nod *= Math.pow(0.02, dt)
      if (stage.poke !== lastPoke) { lastPoke = stage.poke; surprise = 1 }
      surprise *= Math.pow(0.08, dt)
      const smT = stage.hover ? 0.8 : 0.0
      const dsm = smT - smile; smile += dsm * (1 - Math.pow(0.004, dt))
      if (blinkStart < 0 && now > nextBlink) { blinkStart = now; nextBlink = now + 2600 + Math.random() * 3600 }
      let blinking = false
      if (blinkStart >= 0) { const p = (now - blinkStart) / 160; blink = p >= 1 ? 0 : Math.sin(p * Math.PI); blinking = true; if (p >= 1) blinkStart = -1 }
      const orbT = Math.sin(stage.progress * 0.55) * 0.16 + stage.look * 0.05
      orbit += (orbT - orbit) * k
      const moving = Math.abs(dx) + Math.abs(dy) + Math.abs(dl) > 0.002 || Math.abs(dsm) > 0.01 || nod > 0.01 || surprise > 0.01 || blinking || Math.abs(orbT - orbit) > 0.0005
      // idle: breathe at ~15 fps instead of 60
      if (!moving && !dirty && now - lastRender < 66) return
      if (document.hidden) return

      const yaw = cur.look * 0.32 + cur.x * 0.34, pitch = cur.y * 0.2 - nod * 0.06 + surprise * -0.06
      if (head) { head.rotation.set(rest.h.x + pitch * 0.55, rest.h.y + yaw * 0.6, rest.h.z) }
      if (neck) { neck.rotation.set(rest.n.x + pitch * 0.3, rest.n.y + yaw * 0.32, rest.n.z) }
      const ex = clamp((cur.x + cur.look * 0.6) * 1.2, -1, 1), ey = clamp(-cur.y * 1.2, -1, 1)
      setM('lookL', Math.max(0, ex)); setM('lookR', Math.max(0, -ex)); setM('lookU', Math.max(0, ey) * 0.8); setM('lookD', Math.max(0, -ey) * 0.8)
      if (eyeL && eyeR) { eyeL.rotation.set(rest.el.x - ey * 0.25, rest.el.y + ex * 0.3, rest.el.z); eyeR.rotation.set(rest.er.x - ey * 0.25, rest.er.y + ex * 0.3, rest.er.z) }
      setM('smile', smile); setM('smileL', smile); setM('smileR', smile); setM('blink', blink)
      setM('brow', clamp(surprise * 0.8 + (stage.hover ? 0.25 : 0) + nod * 0.2, 0, 0.9))
      setM('jaw', surprise * 0.22)
      root.rotation.y = orbit
      root.position.y = baseY + Math.sin(now / 1900) * 0.0022
      lastRender = now; dirty = false
      const t0 = performance.now()
      renderer.render(scene, camera)
      // adaptive resolution from *active* frames only (idle frames are naturally spaced)
      if (moving) {
        slowAcc = slowAcc * 0.9 + dt * 1000 * 0.1
        if (slowAcc > 26) { if (++slowN > 40 && dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); renderer.setPixelRatio(dpr); resize(); slowN = 0; slowAcc = 16 } }
        else { slowN = 0; if (slowAcc < 14 && dpr < dprMax && ++fastN > 300) { dpr = Math.min(dprMax, dpr + 0.25); renderer.setPixelRatio(dpr); resize(); fastN = 0 } }
      }
      void t0
      ;(window as unknown as { __r3info?: unknown }).__r3info = { calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geoms: renderer.info.memory.geometries, tex: renderer.info.memory.textures, dpr }
    }
    let baseY = 0
    const off = addTicker(tick)

    // ── load: head-only model if it shipped with the build, else the bust (cropped) ──
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    const onLoad = (gltf: { scene: Object3D }, cropTorso: boolean) => {
      if (disposed) return
      root = gltf.scene
      const meshes: Mesh[] = []
      const bones: Bone[] = []
      root.traverse((o) => {
        if ((o as Bone).isBone) bones.push(o as Bone)
        const m = o as SkinnedMesh
        if (m.isMesh) { meshes.push(m); m.frustumCulled = false }
      })
      const find = (re: RegExp, not?: RegExp) => bones.find((b) => re.test(b.name) && !(not && not.test(b.name))) || null
      head = find(/^(.*[:_.])?head$/i) || find(/head/i, /top|end|hair|neck/i)
      neck = find(/^(.*[:_.])?neck(\d)?$/i) || find(/neck/i, /end|top/i)
      eyeL = find(/eye[._ -]?l|left[._ -]?eye|eye_?left/i); eyeR = find(/eye[._ -]?r|right[._ -]?eye|eye_?right/i)
      if (head) rest.h.copy(head.rotation as unknown as Vector3)
      if (neck) rest.n.copy(neck.rotation as unknown as Vector3)
      if (eyeL) rest.el.copy(eyeL.rotation as unknown as Vector3)
      if (eyeR) rest.er.copy(eyeR.rotation as unknown as Vector3)
      // morph lookup by alias
      for (const m of meshes) {
        const dict = m.morphTargetDictionary; if (!dict) continue
        const lower: Record<string, number> = {}; for (const [n, i] of Object.entries(dict)) lower[n.toLowerCase()] = i
        for (const [key2, names] of Object.entries(ALIASES)) for (const n of names) if (n in lower) { (morphs[key2] ||= []).push({ mesh: m, idx: lower[n] }); break }
      }
      // if only per-side blink exists, drive both from the generic channel
      if (!morphs.blink) morphs.blink = [...(morphs.blinkL || []), ...(morphs.blinkR || [])]
      // light materials: standard only, no clearcoat/transmission/transparent sorting
      const seen = new Map<Material, MeshStandardMaterial>()
      for (const m of meshes) {
        const mats = (Array.isArray(m.material) ? m.material : [m.material]) as Material[]
        const out = mats.map((src: any) => {
          let n = seen.get(src); if (n) return n
          const isHair = /hair|strand/i.test(src.name || '')
          n = new MeshStandardMaterial({
            name: src.name, color: src.color, map: src.map, normalMap: src.normalMap, roughnessMap: src.roughnessMap, metalnessMap: src.metalnessMap,
            roughness: src.roughness ?? 0.7, metalness: src.metalness ?? 0, vertexColors: !!src.vertexColors, emissive: src.emissive, emissiveMap: src.emissiveMap,
            side: isHair ? DoubleSide : FrontSide, transparent: false, alphaTest: src.alphaMode === 'MASK' ? src.alphaTest : 0,
          })
          if (src.normalScale) n.normalScale.copy(src.normalScale)
          ;[n.map, n.normalMap, n.roughnessMap].forEach((t) => { if (t) (t as Texture).anisotropy = 2 })
          seen.set(src, n); src.dispose?.(); return n
        })
        m.material = Array.isArray(m.material) ? out : out[0]
      }
      scene.add(root)
      root.updateWorldMatrix(true, true)
      // ── framing ──
      const box = new Box3().setFromObject(root); const size = box.getSize(new Vector3()); const c = box.getCenter(new Vector3())
      // NB: bone world positions can live in a different space than the (skinned, quantised) mesh bbox, so frame from meshes only
      const eyeMesh = meshes.find((m) => /eye/i.test(((Array.isArray(m.material) ? m.material[0] : m.material) as Material).name) && !/lash|brow/i.test(m.name))
      const eyeY = eyeMesh ? new Box3().setFromObject(eyeMesh).getCenter(new Vector3()).y : box.max.y - size.y * 0.15
      const topToEye = Math.max(0.02, box.max.y - eyeY)
      const cutY = eyeY - topToEye * 1.5               // ≈ neck base / collar
      const hasTorso = cropTorso && box.min.y < cutY - topToEye * 0.6
      let frameTop: number, frameBottom: number
      if (hasTorso) {
        clip.set(new Vector3(0, 1, 0), -cutY)           // keep y ≥ cutY; the canvas CSS mask fades the cut
        frameTop = box.max.y; frameBottom = cutY
      } else { clip.set(new Vector3(0, 1, 0), 1e6); frameTop = box.max.y; frameBottom = box.min.y }
      const hgt = frameTop - frameBottom
      const mid = (frameTop + frameBottom) / 2 + hgt * 0.02
      const dist = (hgt * 1.06 / 2) / Math.tan(MathUtils.degToRad(camera.fov / 2))
      camera.position.set(c.x, mid, c.z + dist + size.z / 2); camera.lookAt(c.x, mid, c.z)
      baseY = root.position.y
      renderer.render(scene, camera)
      cb.current.onReady()
      ;(window as unknown as { __r3frame?: unknown }).__r3frame = { hasTorso, eyeY, topToEye, cutY, size: size.toArray(), min: box.min.toArray(), max: box.max.toArray(), bones: bones.length, head: head?.name, neck: neck?.name, morphs: Object.keys(morphs) }
    }
    const fail = () => { if (!disposed) cb.current.onError() }
    const loadFull = () => loader.load(FULL_GLB, (g) => onLoad(g, true), undefined, fail)
    const dbg = new URLSearchParams(location.search).get('glb')   // QA override, same-origin /avatar/*.glb only
    if (dbg && /^\/avatar\/[\w.-]+\.glb$/.test(dbg)) loader.load(dbg, (g) => onLoad(g, true), undefined, fail)
    else if (__HEAD_GLB__) loader.load(HEAD_GLB, (g) => onLoad(g, true), undefined, loadFull)
    else loadFull()

    return () => {
      disposed = true; off(); ro.disconnect(); io.disconnect()
      root?.traverse((o) => {
        const m = o as Mesh
        if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt: any) => { Object.values(mt).forEach((v: any) => v?.isTexture && v.dispose()); mt.dispose() }) }
      })
      renderer.dispose(); renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className="head-canvas" />
}
