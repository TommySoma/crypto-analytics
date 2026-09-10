import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSwarm({ trend }) {
  const ref = useRef();
  const materialRef = useRef();
  
  // Target colors based on trend
  const targetColor = useMemo(() => new THREE.Color(), []);
  
  // Generate random particles
  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorOptions = [
      new THREE.Color('#00e5ff'), // Accent blue
      new THREE.Color('#c084fc'), // Accent purple
      new THREE.Color('#475569'), // Slate
    ];
    
    for (let i = 0; i < count; i++) {
      // Sphere distribution
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 8; // Radius 2 to 10
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const mixedColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
    
    if (materialRef.current) {
      // Set target color based on market trend
      if (trend === 'up') {
        targetColor.set('#00e5ff'); // Igloo Cyan for UP
      } else if (trend === 'down') {
        targetColor.set('#6b21a8'); // Deep purple for DOWN
      } else {
        targetColor.set('#ffffff'); // Neutral multiplier
      }
      // Smoothly interpolate current material color towards the target
      materialRef.current.color.lerp(targetColor, delta * 2);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          ref={materialRef}
          transparent
          vertexColors
          color="#ffffff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function Background3D({ isVisible = true, marketTrend }) {
  return (
    <div className="absolute inset-0 -z-10 bg-[#020617]">
      {isVisible && (
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <ParticleSwarm trend={marketTrend} />
        </Canvas>
      )}
    </div>
  );
}
