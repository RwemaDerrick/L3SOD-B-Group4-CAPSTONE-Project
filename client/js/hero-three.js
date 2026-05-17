export function initHeroThree() {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(2, 20);
  const material = new THREE.MeshStandardMaterial({
    color: 0x8a2be2,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
    emissive: 0xff2a85,
    emissiveIntensity: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  scene.add(new THREE.PointLight(0xffffff, 1, 100));
  scene.children[1].position.set(10, 10, 10);
  scene.add(new THREE.AmbientLight(0x404040));
  camera.position.z = 5;

  const initialPositions = geometry.attributes.position.array.slice();
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = initialPositions[i];
      const y = initialPositions[i + 1];
      const z = initialPositions[i + 2];
      const noise = Math.sin(x * 1.5 + time) * Math.cos(y * 1.5 + time) * 0.3;
      const length = Math.sqrt(x * x + y * y + z * z) || 1;
      positions[i] = x * (1 + noise / length);
      positions[i + 1] = y * (1 + noise / length);
      positions[i + 2] = z * (1 + noise / length);
    }
    geometry.attributes.position.needsUpdate = true;
    sphere.rotation.y += 0.005;
    sphere.rotation.x += 0.002;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });

  document.addEventListener('mousemove', (e) => {
    sphere.rotation.y += (e.clientX / window.innerWidth - 0.5) * 0.02;
    sphere.rotation.x += (e.clientY / window.innerHeight - 0.5) * 0.02;
  });

  animate();
}
