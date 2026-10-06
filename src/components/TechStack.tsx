import * as THREE from "three";
import { useRef, useMemo, useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(22)].map(() => ({
  scale: [0.65, 0.8, 0.7, 0.85, 0.75][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.05, delta);
    const pos = api.current.translation();
    const impulse = vec
      .copy(pos)
      .normalize()
      .multiply(
        new THREE.Vector3(
          -25 * delta * scale,
          -35 * delta * scale,
          -25 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(12), r(9), r(6) - 2]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

interface CanvasErrorBoundaryProps {
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("TechStack 3D Canvas notice:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "FastAPI",
  "Solidity",
  "Ethereum",
  "Docker",
  "MongoDB",
  "MySQL",
  "Express",
  "Tailwind CSS",
  "Three.js",
  "LangChain",
  "Git & GitHub",
];

const TechStack = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.35,
          metalness: 0.6,
          roughness: 0.3,
          clearcoat: 0.2,
        })
    );
  }, []);

  return (
    <div className="techstack" id="techstack">
      <h2>My Techstack</h2>
      <p className="techstack-subtitle">
        Interactive 3D Simulation & Core Technical Ecosystem
      </p>

      <CanvasErrorBoundary>
        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: true, antialias: true }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.3)}
          className="tech-canvas"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
        >
          <ambientLight intensity={1.2} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.25}
            color="#e2d4ff"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 6, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => (
              <SphereGeo
                key={i}
                {...props}
                material={materials[Math.floor(Math.random() * materials.length)]}
                isActive={isActive}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.6}
            environmentRotation={[0, 4, 2]}
          />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Persistent skill badges ensuring content is always visible & interactive */}
      <div className="tech-badge-container">
        <div className="tech-badge-group">
          {skills.map((skill) => (
            <span key={skill} className="tech-badge" data-cursor="disable">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
