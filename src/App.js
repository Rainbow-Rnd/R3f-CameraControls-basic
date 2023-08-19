import * as THREE from 'three'
import { memo, useRef, forwardRef, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls } from '@react-three/drei'
import { useControls, button, buttonGroup, folder } from 'leva'
import { suspend } from 'suspend-react'
import Popup from './popUpModal'
import Loading from './LoadingMUI'
import Model from './Model'
import CircularProgress from '@mui/material/CircularProgress'

const city = import('@pmndrs/assets/hdri/city.exr')
const suzi = import(`@pmndrs/assets/models/suzi.glb`)

const { DEG2RAD } = THREE.MathUtils

export default function App() {
  const [imageFile, setImageFile] = useState('')
  const [isModelOpen, setIsModelOpen] = useState(false)
  //const [showModell, setShowModell] = useState(false)
  const [isLoading, setIsLoading] = useState(0)


  useEffect(() => {
    const progressInterval = setInterval(() => {
      setIsLoading((prevProgress) => prevProgress + 10)
    }, 8000)

    setTimeout(() => {
      clearInterval(progressInterval)
      setIsLoading(100)
      //setShowModell(true)
    }, 100000)
  }, [])

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
      {isLoading < 100 ? (
        <Loading variant="determinate" value={isLoading} />
      ) : (
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 60 }}>
          <Scene showModel={showModel} />
        </Canvas>
      )}
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
    setPosition: folder(
      {
        vec2: { value: [-5, 2, 1], label: 'vec' },
        'setPosition(…vec)': button((get) => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
      },
      { collapsed: true }
    ),
    reset: button(() => cameraControlsRef.current?.reset(true)),

    균열_1: button((get) => {
      cameraControlsRef.current?.setLookAt(1.07459, 1.326096, -2.0549, 1.4869516928011447, 1.50839858982, -0.752778, true)
      cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true)
    }),
    균열_2: button((get) => {
      cameraControlsRef.current?.setLookAt(0.7626, 1.878338, -1.2952, 0.762942, 1.8791, -0.13654, true)
      cameraControlsRef.current?.rotate(-135 * DEG2RAD, 0, true)
    }),
    균열_3: button((get) => {
      cameraControlsRef.current?.setLookAt(-1.95213, 3.1757, 0.00394, -1.260834, 2.72418, -1.19891, true)
      cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true)
    }),
    균열_4: button((get) => {
      cameraControlsRef.current?.setLookAt(-1.48586, 1.336, -2.05007, -1.48512, 1.3368, -1.0335, true)
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
