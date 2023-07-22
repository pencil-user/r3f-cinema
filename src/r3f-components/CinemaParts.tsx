import React, { useRef, useState } from 'react'
import { Canvas, Object3DNode, ThreeEvent, useFrame } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { SeatGroup, useCinemaStore } from '../store/store'
import { arrayRange } from "../utilities/arrayRange";
import { Stats } from '@react-three/drei'
import { toSeatId } from '../store/store'
//import { extend } from '@react-three/fiber'
//import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import myFont from './trebuc.ttf'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { useFont } from '@react-three/drei'
import { Text3D } from '@react-three/drei'
import { RowR3F } from './SeatingFloorR3F'

export function BalconyEdgeR3F({ width }: { width: number }) {
  const selectedSeat = useCinemaStore((state) => state.selectedSeat)
  const setSelectedSeat = useCinemaStore((state) => state.setSelectedSeat)
  const presentation = useCinemaStore((state) => state.presentation)

  const [hover, setHover] = useState(false)

  const clickHandler = (e: ThreeEvent<MouseEvent>) => {
    setSelectedSeat({ ...selectedSeat, place: selectedSeat?.place === 'balcony' ? 'ground' : 'balcony' })
    e.stopPropagation()
  }
  const hoverHandler = (e: ThreeEvent<MouseEvent>) => {
    setHover(true)
    e.stopPropagation()
  }
  const hoverLeaveHandler = (e: ThreeEvent<MouseEvent>) => {
    setHover(false)
    e.stopPropagation()
  }

  const font = useFont('./Trebuchet MS_Regular.json').data

  // do not show in 'Seat' view
  //if(presentation!='3d') return <></>

  return (
    <>
      <mesh position-y={0.9} position-x={-0.4}>
        <boxGeometry args={[0.1, 0.8, 1 * width + 2]} />
        <meshStandardMaterial
          color={'red'}
          roughness={0.8}
        />
      </mesh>
      {presentation === '3d' &&
        <>
          <Text3D
            font={font}
            position-z={-2.6}
            position-x={-1.4}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            height={0.05}
            size={0.6}
          >
            {selectedSeat.place === 'balcony' ? 'TO GROUND' : ' TO BALCONY'}
            <meshStandardMaterial
              color={'black'}
              roughness={0.8}
            />
          </Text3D>
          <mesh
            // castShadow
            // receiveShadow
            position-x={-1}
            rotation-x={-Math.PI * 0.5}
            onClick={clickHandler}
            onPointerOver={hoverHandler}
            onPointerLeave={hoverLeaveHandler}
          >
            <planeGeometry args={[1.3, 6]} />
            <meshStandardMaterial color={'white'} transparent opacity={0.8} emissive={'white'} />
          </mesh>
        </>
      }
      <mesh position-y={0.3} position-x={0} castShadow>
        <boxGeometry args={[1, 0.6, 1 * width + 2]} />
        <meshStandardMaterial
          color={'red'}
          roughness={0.8}
        />
      </mesh>
    </>
  )
}

export function BackWallsR3F() {
  return (
    <>
      <mesh
        //castShadow
        receiveShadow
        //rotation-z={-Math.PI * 0.5}
        position-y={4}
        position-z={-11.1}
        position-x={5}

      >
        <boxGeometry args={[11, 8, 0.3]} />
        <meshStandardMaterial color={'#555555'} />
      </mesh>
      <mesh
        //castShadow
        receiveShadow
        //rotation-z={-Math.PI * 0.5}
        position-y={4}
        position-z={11.1}
        position-x={5}

      >
        <boxGeometry args={[11, 8, 0.3]} />
        <meshStandardMaterial color={'#555555'} />
      </mesh>
      <mesh
        //castShadow
        receiveShadow
        //rotation-z={-Math.PI * 0.5}
        position-y={4}
        position-z={0}
        position-x={10.5}

      >
        <boxGeometry args={[0.3, 8, 22.5]} />
        <meshStandardMaterial color={'#555555'} />
      </mesh>
    </>
  )
}

export function SideWallsR3F() {

  return (<>
    <mesh
      //castShadow
      receiveShadow
      //rotation-z={-Math.PI * 0.5}
      position-y={8}
      position-z={0}
      position-x={23}

    >
      <boxGeometry args={[0.3, 9, 22.5]} />
      <meshStandardMaterial color={'#555555'} />
    </mesh>
    <mesh
      castShadow
      receiveShadow
      //rotation-z={-Math.PI * 0.5}
      position-y={4.5}
      position-z={11.1}
      position-x={8}

    >
      <boxGeometry args={[29, 11, 0.3]} />
      <meshStandardMaterial color={'#e79558'} />
    </mesh>
    <mesh
      castShadow
      receiveShadow
      //rotation-z={-Math.PI * 0.5}
      position-y={4.5}
      position-z={-11.1}
      position-x={8}

    >
      <boxGeometry args={[29, 11, 0.3]} />
      <meshStandardMaterial color={'#e79558'} />
    </mesh>
    <mesh
      //castShadow
      receiveShadow
      //rotation-z={-Math.PI * 0.5}
      position-y={14}
      position-z={-11.1}
      position-x={1.5}

    >
      <boxGeometry args={[20, 8, 0.3]} />
      <meshStandardMaterial color={'#555555'} />
    </mesh>
    <mesh
      //castShadow
      receiveShadow
      //rotation-z={-Math.PI * 0.5}
      position-y={14}
      position-z={11.1}
      position-x={1.5}

    >
      <boxGeometry args={[20, 8, 0.3]} />
      <meshStandardMaterial color={'#555555'} />
    </mesh>
  </>
  )
}

export function MovieCanvasR3F() {
  return (
    <>
      <mesh
        castShadow
        receiveShadow
        rotation-y={Math.PI * 0.5}
        position-x={-6.1}
        position-y={4}
      >
        <planeGeometry args={[25, 28]} />
        <meshStandardMaterial color={'#b0b0b0'} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        rotation-y={Math.PI * 0.5}
        position-x={-6}
        position-y={8}
      >
        <planeGeometry args={[17, 10]} />
        <meshStandardMaterial
          color={'white'}
          emissive={'white'}
        />
      </mesh>
    </>
  )
}