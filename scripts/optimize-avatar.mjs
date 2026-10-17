// Local-only GLB diet used for public/avatar/avatar.glb (v6 -> ~3.4MB). Not part of the build.
// Setup (outside the repo):  npm i @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp
// Usage: node scripts/optimize-avatar.mjs in.glb out.glb [hairRatio=0.45] [albedoPx=1536] [normalPx=1024]
// Steps: split morph-target-free body/hair mesh from the face mesh, drop hands, strip clearcoat/specular,
// simplify hair, resize textures, meshopt-compress. Deps are MIT/Apache-2.0.
import {NodeIO} from '@gltf-transform/core'
import {ALL_EXTENSIONS, EXTMeshoptCompression} from '@gltf-transform/extensions'
import {MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier} from 'meshoptimizer'
import {simplify, weld, reorder, quantize, textureCompress, prune, dedup} from '@gltf-transform/functions'
import sharp from 'sharp'
const [,, inp, out, hr='0.45', alb='1536', nrm='1024'] = process.argv
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready])
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder,'meshopt.encoder':MeshoptEncoder})
const doc=await io.read(inp); const root=doc.getRoot()
const mesh=root.listMeshes()[0]
const node=root.listNodes().find(n=>n.getMesh()===mesh)
const FACE=new Set(['Skin','Eye','Socket','Teeth','MouthInterior','Tongue'])
// 1. split: face prims keep morph targets; hair/sweater go to a target-free mesh; drop hands
const body=doc.createMesh('AvatarBody')
for(const p of [...mesh.listPrimitives()]){
  const n=p.getMaterial().getName()
  if(n==='Hand'){mesh.removePrimitive(p); p.dispose(); continue}
  if(!FACE.has(n)){ mesh.removePrimitive(p); for(const t of p.listTargets()){p.removeTarget(t); t.dispose()} body.addPrimitive(p) }
}
const node2=doc.createNode('AvatarBody').setMesh(body).setSkin(node.getSkin())
node.listParents().filter(x=>x.propertyType==='Node'||x.propertyType==='Scene').forEach(par=>par.addChild?.(node2))
// 2. material diet: drop physical extensions (runtime uses MeshStandardMaterial)
for(const m of root.listMaterials()){ for(const e of m.listExtensions?.()||[]) e.dispose() }
for (const m of root.listMaterials()) for (const ex of ['KHR_materials_clearcoat','KHR_materials_specular']) { const e=m.getExtension(ex); if(e) e.dispose() }
// 3. simplify hair only
const saved=mesh.listPrimitives().slice(); const ex=mesh.getExtras(), wts=mesh.getWeights(); saved.forEach(p=>mesh.removePrimitive(p))
await doc.transform(weld({tolerance:1e-5}), simplify({simplifier:MeshoptSimplifier, ratio:+hr, error:0.01, lockBorder:false}))
const face=doc.createMesh('AvatarMesh').setExtras(ex).setWeights(wts); saved.forEach(p=>face.addPrimitive(p)); node.setMesh(face)
// 4. textures
const sizes={albedo:+alb, normal:+nrm, rough:512, knit_n:256, eye:512, hair_cards:256}
for(const t of root.listTextures()){
  const s=sizes[t.getName()]; if(!s) continue
  const img=Buffer.from(t.getImage()); const meta=await sharp(img).metadata()
  if(Math.max(meta.width,meta.height)>s){ const r=await sharp(img).resize(s,s,{fit:'inside'}).webp({quality:t.getName()==='normal'?88:90}).toBuffer(); t.setImage(new Uint8Array(r)).setMimeType('image/webp') }
}
await doc.transform(reorder({encoder:MeshoptEncoder}), quantize({quantizePosition:14,quantizeNormal:10,quantizeTexcoord:12,quantizeColor:8,quantizeWeight:8,quantizeGeneric:12}), prune(), dedup())
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE})
await io.write(out,doc)
