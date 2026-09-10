import * as THREE from "three";
import { DDSLoader } from "three-stdlib";

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let mesh: THREE.Mesh | null = null;
let material: THREE.MeshBasicMaterial | null = null;

const textureCache = new Map<string, Promise<THREE.Texture>>();
const loader = new DDSLoader();

export async function getDDSDataUrl(
  fileUrl: string,
  x: number,
  y: number,
  w: number,
  h: number
): Promise<string> {
  // Initialize Three.js offscreen renderer once
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
    scene = new THREE.Scene();
    
    // Orthographic camera for pixel-perfect 2D rendering
    camera = new THREE.OrthographicCamera(0, w, 0, -h, 0, 1);
    camera.position.z = 0.5;

    material = new THREE.MeshBasicMaterial({ transparent: true });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(mesh);
  }

  // Load and cache texture
  if (!textureCache.has(fileUrl)) {
    textureCache.set(
      fileUrl,
      new Promise((resolve, reject) => {
        loader.load(
          fileUrl,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            resolve(tex);
          },
          undefined,
          reject
        );
      })
    );
  }

  const texture = await textureCache.get(fileUrl);
  if (!texture || !material || !mesh || !camera || !renderer || !scene) {
    throw new Error("Renderer not initialized properly");
  }

  // Set texture
  material.map = texture;
  material.needsUpdate = true;

  // Resize geometry to match full texture size
  const texWidth = texture.image.width;
  const texHeight = texture.image.height;
  mesh.geometry = new THREE.PlaneGeometry(texWidth, texHeight);

  // Plane geometry is centered by default. We want top-left to be at (0,0).
  // So we move the plane's center to (texWidth/2, -texHeight/2)
  mesh.position.set(texWidth / 2, -texHeight / 2, 0);

  // Position the camera so that its top-left corner matches the requested (x, y) rect in the texture.
  // The camera's top-left is (camera.left, camera.top).
  camera.left = x;
  camera.right = x + w;
  camera.top = -y;
  camera.bottom = -(y + h);
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  renderer.clear();
  renderer.render(scene, camera);

  return renderer.domElement.toDataURL("image/png");
}
