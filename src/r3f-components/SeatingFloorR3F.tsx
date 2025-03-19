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
import { BackWallsR3F, BalconyEdgeR3F } from './CinemaParts'
import { SeatModelR3F } from './SeatModelR3F'

export function SeatingFloorR3F({ place }: { place: SeatGroup }
) {
  const { place: seatingGroup } = useCinemaStore((state) => state.selectedSeat)
  const seatingLayout = useCinemaStore((state) => state.seatingLayout)

  const { columns, rows } = seatingLayout[place]

  //const positionX = 'ground' === place ? 0 : (seatingGroup === 'balcony' ? 11 : 22)

  return (
    // <group position-x={positionX} position-y={'ground' === place ? 0 : 10}>
    <>
      <group position-x={rows + 1} position-y={rows / ('ground' === place ? 3 : 2)}>
        <RowR3F
          width={columns}
        />
      </group>
      {arrayRange(1, rows).map((valueRow) =>
        <group position-x={valueRow} position-y={valueRow / ('ground' === place ? 3 : 2)} key={valueRow}>
          <RowR3F
            width={columns}
          />
          <SeatRowR3F
            stalls={columns}
            start={-columns * 0.5 - 0.5}
            currentRow={valueRow}
            seatingGroup={place}
          />
        </group>
      )}
      {place === 'balcony' &&
        <>

          <group position-x={0} position-y={0.0}>
            <BalconyEdgeR3F width={columns} />
          </group>
          <BackWallsR3F />
        </>
      }
    </>
    // </group>

  )

}

export function SeatRowR3F({ stalls, start, currentRow, seatingGroup }: { stalls: number, start: number, currentRow: number, seatingGroup: SeatGroup }) {
  const selectedSeat = useCinemaStore((state) => state.selectedSeat)
  const reservedSeats = useCinemaStore((state) => state.reservedSeats)
  const takenSeats = useCinemaStore((state) => state.takenSeats)
  const selectedSeatID = selectedSeat ? toSeatId(selectedSeat.place, selectedSeat.column || 1, selectedSeat.row || 1) : null
  const takenSeatID = selectedSeat ? toSeatId(selectedSeat.place, selectedSeat.column || 1, selectedSeat.row || 1) : null

  return (
    <>
      {arrayRange(1, stalls).map((valueStall) =>

        <SeatR3F
          isReserved={toSeatId(seatingGroup, valueStall, currentRow) in reservedSeats}
          isSelected={!!selectedSeatID && toSeatId(seatingGroup, valueStall, currentRow) === selectedSeatID}
          isTaken={toSeatId(seatingGroup, valueStall, currentRow) in takenSeats}

          row={currentRow}
          column={valueStall}
          seatingGroup={seatingGroup}
          key={toSeatId(seatingGroup, valueStall, currentRow)}
          offset={1 * valueStall + start}
        />
      )}
    </>
  )

}

export function SeatR3F({ isReserved = false, isSelected = false, isTaken = false, row, column, seatingGroup = 'ground', offset }: { isReserved: boolean, isSelected: boolean, isTaken:boolean, row: number, column: number, seatingGroup: 'ground' | 'balcony', offset: number }) {
  const reserveSeat = useCinemaStore((state) => state.reserveSeat)
  const setSelectedSeat = useCinemaStore((state) => state.setSelectedSeat)
  const seatID = toSeatId(seatingGroup, column, row)
  const presentation = useCinemaStore((state) => state.presentation)

  const clickHandler = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedSeat({ place: seatingGroup, column, row })
  }

  return (
    <>
      {(isSelected && presentation === 'seat') && <group
        position={[0, 1.9, offset]}
        rotation={[0, Math.PI * 0.5, 0]}
      >
        <PerspectiveCamera
          makeDefault
          fov={50}
          rotation={[
            seatingGroup === 'ground' ? 0.1 : -0.2, 0, 0,
          ]}
        />
      </group>}
      <SeatModelR3F
        position-x={0}
        position-y={1}
        position-z={offset}
        scale={0.45}
        isReserved={isReserved}
        isTaken={isTaken}
        isSelected={isSelected}
        onClick={clickHandler}
      />
    </>
  )
}

export function RowR3F({ width }: { width: number }) {
  const seatingLayout = useCinemaStore((state) => state.seatingLayout)
  const { columns, rows } = seatingLayout['balcony']

  const clickHandler = (e: ThreeEvent<MouseEvent>) => {
    // we need to stop propagation here or it might be possible to select Ground seat trough balcony floor!
    e.stopPropagation()
  }

  return (
    <mesh castShadow receiveShadow onClick={clickHandler}>
      <boxBufferGeometry args={[1, 1, 1 * width + 2]} />
      <meshStandardMaterial
        color={'red'}
        roughness={0.8}
      />
    </mesh>
  )
}
