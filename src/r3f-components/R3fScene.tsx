import React, { useEffect, useRef, useState } from 'react'
import { Canvas, 
  // Object3DNode, 
  useFrame } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useCinemaStore } from '../store/store'
import { arrayRange } from "../utilities/arrayRange";
import { Stats } from '@react-three/drei'
import { toSeatId } from '../store/store'
//import { extend } from '@react-three/fiber'
//import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
//import myFont from './trebuc.ttf'
//import { useFont } from '@react-three/drei'
//import { Text3D } from '@react-three/drei'
import { SeatingFloorR3F } from './SeatingFloorR3F'
import { MovieCanvasR3F, SideWallsR3F } from './CinemaParts'
//import { useSpring, animated } from '@react-spring/three'

import { Group } from 'three'
//const AnimatedGroup = animated()
import { Euler } from 'three'
//import { animated, useSpring } from 'react-spring/web'
import { animated, useSpring } from '@react-spring/three'
import { EffectComposer} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Bloom } from '@react-three/postprocessing'
import { BloomEffect } from 'postprocessing'
//import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
/*
extend({ TextGeometry })

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}*/
import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'

export function R3fScene() {
  const { place: seatingGroup } = useCinemaStore((state) => state.selectedSeat)
  const seatingLayout = useCinemaStore((state) => state.seatingLayout)
  const presentation = useCinemaStore((state) => state.presentation)
  const bloom = useCinemaStore((state)=> state.bloom);
  const darkMode = useCinemaStore((state)=> state.darkMode);

  const balconyPositionX = ((seatingGroup === 'balcony') || presentation === 'seat' ? 12 : 21.7)

  const { x } = useSpring({
    x: balconyPositionX,
    config: {
      precision: 0.0001,
    },

  })

  const Bloom1:any = Bloom

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas shadows 
      gl={{preserveDrawingBuffer:true}}
      >
       {bloom &&<EffectComposer>
              <Bloom1
                  mipmapBlur={darkMode ? 0 : 0}
                  luminanceThreshold={0.3}
                  luminanceSmoothing={darkMode ? 0.2 : 0.025}
                  intensity={darkMode ? 5 : 2}
              />
          </EffectComposer>}
        <Stats />
        {/* <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />
        <PerspectiveCamera makeDefault fov={50} position={[150, 60, 5]} />*/} 
        <color args={[0, 0, 0]} attach='background' />
        <mesh
          castShadow
          receiveShadow
          rotation-x={-Math.PI * 0.5}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={'#777777'} />
        </mesh>

        <ambientLight
          intensity={!darkMode ? 0.25 : 0.2}
          color={!darkMode ? 'white' : '#5555ff'}
        />

        <pointLight
          position-y={60}
          position-x={5}
          castShadow
          intensity={!darkMode ? 1 : 0.2}
          color={!darkMode ? 'white' : '#8888ff'}
        />

        <animated.group position-x={x} position-y={10}>
          <SeatingFloorR3F place='balcony' />
        </animated.group>
        <group position-x={0} position-y={-0.5}>
          <SeatingFloorR3F place='ground' />
        </group>
        <MovieCanvasR3F />
        <UpperCameraR3F />
        <SideWallsR3F /> 
      </Canvas>
    </Suspense>
  )
}

export function UpperCameraR3F() {
  const { place: seatingGroup } = useCinemaStore((state) => state.selectedSeat)
  const presentation = useCinemaStore((state) => state.presentation)

  const { x, y } = useSpring({
    x: seatingGroup === 'ground' ? -4 : 2,
    y: seatingGroup === 'ground' ? 26 : 30,

    config: {
      precision: 0.0001,
    },

  })

  return (
    <animated.group
      position-x={x}
      position-y={y}
      rotation={[
        0,
        0,
        -1,
      ]}
    >
      {presentation === '3d' && <PerspectiveCamera makeDefault fov={50}
        rotation={[
          0,
          -Math.PI * 0.5,
          0,
        ]}
      />}
    </animated.group>

  )

  // return (
  //   <animated.mesh
  //     position-x={x}
  //     position-y={y}
  //   // position-z={8}

  //   >
  //     <boxGeometry args={[0.5, 0.5, 0.5]} />
  //     <meshStandardMaterial
  //       color={'white'}
  //       roughness={0.8}
  //     />
  //   </animated.mesh>
  // )
}

