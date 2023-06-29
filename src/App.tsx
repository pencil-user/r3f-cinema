import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { SeatingFloor } from './components/SeatingFloor'
import { ReservationForm } from './components/ReservationForm'
import { R3fScene } from './r3f-components/R3fScene'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCinemaStore } from './store/store'

function App() {
  const { presentation } = useCinemaStore()
  return (
    <div className='App'>
      <div className="overlay">
        <ReservationForm />
      </div>
      {presentation === '2d' ? <SeatingFloor /> : <R3fScene />}
    </div>
  )

}

export default App
