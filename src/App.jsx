import { ScrollControls} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { useState, useEffect } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { BackgroundUI } from "./components/UI";
import { sections } from "./components/UI";
import './index.css';


//yarn install --registry=https://registry.npmmirror.com

function App() {
  const [section, setSection] = useState(0);
  const [isInit, setIsInit] = useState(false);
  const [textHoveredIndex, setTextHoveredIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsInit(true);
    }, 2000);
  }, []);

  return (
    <>
      <Leva hidden={true} />
      {sections[section] === "camera" && <div className="camera-background" />}
      <BackgroundUI section={section} isInit={isInit}/>
      <Canvas 
        camera={{ position: [0, 0, 3], fov: 30}} //是剪裁的问题
        className="canvas"
      >
        {sections[section] === "intro" || sections[section] === "titanium" ? (
          <Experience section={section} textHoveredIndex={textHoveredIndex} />
        ) : (
          <ScrollControls pages={1} infinite>
            <Experience section={section} textHoveredIndex={textHoveredIndex} />
          </ScrollControls>
        )}
      </Canvas>
      <UI section={section} onSectionChange={setSection}  setTextHoveredIndex={setTextHoveredIndex} />
    </>
  );
}

export default App;
