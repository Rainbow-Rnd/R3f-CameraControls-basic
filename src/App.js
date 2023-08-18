import * as THREE from 'three'
import { memo, useRef, forwardRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls } from '@react-three/drei'
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
      label: 'rotate theta',
      opts: {
        '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        '-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
        '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
      }
    }),
    phiGrp: buttonGroup({
      label: 'rotate phi',
      opts: {
        '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
        '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
      }
    }),
    truckGrp: buttonGroup({
      label: 'truck',
      opts: {
        '(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
        '(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
        '(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true)
      }
    }),
    dollyGrp: buttonGroup({
      label: 'dolly',
      opts: {
        1: () => cameraControlsRef.current?.dolly(1, true),
        '-1': () => cameraControlsRef.current?.dolly(-1, true)
      }
    }),
    zoomGrp: buttonGroup({
      label: 'zoom',
      opts: {
        '/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
        '/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
      }
    }),
    // minDistance: { value: 0 },
    // moveTo: folder(
    //   {
    //     vec1: { value: [3, 5, 2], label: 'vec' },
    //     'moveTo(…vec)': button((get) => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true))
    //   },
    //   { collapsed: true }
    // ),
    // 'fitToBox(mesh)': button(() => cameraControlsRef.current?.fitToBox(meshRef.current, true)),
    setPosition: folder(
      {
        vec2: { value: [-5, 2, 1], label: 'vec' },
        'setPosition(…vec)': button((get) => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
      },
      { collapsed: true }
    ),
    // setTarget: folder(
    //   {
    //     vec3: { value: [3, 0, -3], label: 'vec' },
    //     'setTarget(…vec)': button((get) => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
    //   },
    //   { collapsed: true }
    // ),
    // setLookAt: folder(
    //   {
    //     vec4: { value: [1, 2, 3], label: 'position' },
    //     vec5: { value: [1, 1, 0], label: 'target' },
    //     'setLookAt(…position, …target)': button((get) => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
    //   },
    //   { collapsed: true }
    // ),

    reset: button(() => cameraControlsRef.current?.reset(true)),

    균열_1: button((get) => {
      cameraControlsRef.current?.setLookAt(1.07459, 1.326096, -2.0549,  1.4869516928011447, 1.50839858982, -0.752778, true);
     // cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true)

    }),
    균열_2: button((get) => {
      cameraControlsRef.current?.setLookAt(0.7626, 1.878338, -1.2952, 0.762942, 1.8791, -0.13654, true);
      cameraControlsRef.current?.rotate(-135 * DEG2RAD, 0, true)

    }),
    균열_3: button((get) => {
      cameraControlsRef.current?.setLookAt(-1.95213, 3.1757, 0.00394, -1.260834, 2.724180, -1.19891, true);
      cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true)
    }),
    균열_4: button((get) => {
      cameraControlsRef.current?.setLookAt(-1.48586, 1.336, -2.05007, -1.48512, 1.3368, -1.0335, true);
      cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true)
    })
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
