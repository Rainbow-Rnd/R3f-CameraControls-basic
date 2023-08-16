import "./styles.css";
import { OrbitControls, Center, Grid ,useGLTF} from "@react-three/drei";

import { Suspense, useState } from "react";

import { Building } from "./Buidling";
import { Area } from "./Area";
import cracks from "./cracks.json";
import { useRef } from "react";
useGLTF.preload("/all-transformed.glb");
cracks.forEach((val) => {
    useGLTF.preload(val.path);
});

export default function Model(props) {

    const [isModelOpen, setisModelOpen] = useState(false);
    const [imageFile, setImageFile] = useState("");

    const showModel = (imageFile) => {
        console.log(`showModel imageFile: ${imageFile}`);
        setisModelOpen(true);
        setImageFile(imageFile);
    };
    const onHide = () => {
        setisModelOpen(false);
    };
    const ref = useRef();
    return (
             <>
                <ambientLight />
                <Suspense fallback={null}>
                    <Center top>
                        <group position-y={-0.75} dispose={null} scale={0.07}>
                            <Building controls={ref} areas={cracks} />
                            {cracks.map((crack) => {
                                return (
                                    <Area
                                        key={crack.path}
                                        title={crack.title}
                                        showModel={props.showModel}
                                        path={crack.path}
                                        crackParam={crack.crackParam}
                                    ></Area>
                                );
                            })}
                        </group>
                    </Center>
                    <OrbitControls ref={ref} target={[0, 1, 0]} />
                    <OrbitControls ref={ref} target={[0, 1, 0]} />
                </Suspense>
            </>
    );
}


