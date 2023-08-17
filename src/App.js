import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, Center, Environment, CameraControls } from '@react-three/drei'
import { useControls, button, buttonGroup, folder } from 'leva'
import { suspend } from 'suspend-react'
import Popup from './popUpModal'

import Model from './Model'

const city = import('@pmndrs/assets/hdri/city.exr')
const suzi = import(`@pmndrs/assets/models/suzi.glb`)
const { DEG2RAD } = THREE.MathUtils
export default function App() {
  const [imageFile, setImageFile] = useState('')
  const [isModelOpen, setIsModelOpen] = useState(false)
  const showModel = (imageFile) => {
    console.log(`showModel imageFile: ${imageFile}`)
    setIsModelOpen(true)
    setImageFile(imageFile)
  }
  const onHide = () => {
    setIsModelOpen(false)
  }
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene showModel={showModel} />
      </Canvas>
      <Popup visible={isModelOpen} onHide={onHide} imageFile={imageFile} />
    </>
  )
}

function Scene(props) {
  const meshRef = useRef()
  const cameraControlsRef = useRef()
  const { camera } = useThree()

  // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
  const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls({
    thetaGrp: buttonGroup({
      label: 'Rotate THETA',
      opts: {
        '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        '-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
        '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
      }
    }),
    phiGrp: buttonGroup({
      label: 'Rotate PHI',
      opts: {
        '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
        '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
      }
    }),
    dollyGrp: buttonGroup({
      label: 'Close UP',
      opts: {
        1: () => cameraControlsRef.current?.dolly(1, true),
        '-1': () => cameraControlsRef.current?.dolly(-1, true)
      }
    }),
    zoomGrp: buttonGroup({
      label: 'Zoom',
      opts: {
        '+2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
        '-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
      }
    }),
    setTarget: folder(
      {
        vec3: { value: [3, 0, -3], label: 'vec' },
        'setTarget(…vec)': button((get) => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
      },
      { collapsed: true }
    ),
    setLookAt: folder(
      {
        vec4: { value: [1, 2, 3], label: 'position' },
        vec5: { value: [1, 1, 0], label: 'target' },
        'setLookAt(…position, …target)': button((get) => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
      },
      { collapsed: true }
    ),
    reset: button(() => cameraControlsRef.current?.reset(true))
  })

  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <Model showModel={props.showModel} />
        </Center>
        <Ground />
        <CameraControls
          ref={cameraControlsRef}
          minDistance={minDistance}
          enabled={enabled}
          verticalDragToForward={verticalDragToForward}
          dollyToCursor={dollyToCursor}
          infinityDolly={infinityDolly}
        />
        <Environment files={suspend(city).default} />
      </group>
    </>
  )
}

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true
  }
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}
