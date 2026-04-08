import * as THREE from 'three';
import { CameraControls, Environment, Gltf, useScroll, useGLTF, Html, useAnimations, Billboard, Text, Image} from "@react-three/drei";
import { button, useControls } from "leva";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { sections } from "./UI";
import { extend, useFrame } from "@react-three/fiber";
import { easing, geometry } from 'maath';

extend(geometry)


// 相机4个运镜
const cameraPositions = {
  "intro": [
    -0.6021257346111379,
    0.5836331353032708,
    -0.11983388173022544,
    0.5918697633491294,
    0.49874849330202725,
    -0.2045058865661455
  ],
  "titanium": [1.0756703590819021, 0.19271292203866852, 0.9834410697540532, 1.0990683016581821, 0.48774142843159424, -0.07599779903392692],
  "camera": [-1.0989799479699283, 0.09958553183273146, 1.1084340692644683, -0.21751616852684177, -0.022135471369111592, 0.07862974177970324],
  "action-button": [0.6389585613164641, 6.294997481143991, 6.494822184423753, 1.1018293001426291, 0.04654834212044953, -0.2371775866500586],
};

// 第二页：七宝位置和动画
const FloatingCubes = ({ hoveredIndex, textHoveredIndex }) => {
  const group = useRef();

  const cubesConfig = [
    { pos: [0.3, 0.8, -1], scale: 0.025, model: '/models/coral2.glb' },
    { pos: [0.5, 0.8, -1], scale: 0.5, model: '/models/Tridacnes.glb' },
    { pos: [0.7, 0.75, -1], scale: 0.003, model: '/models/agate.glb' },
    { pos: [1.1, 1.1, -1], scale: 0.009, model: '/models/Lapis1.glb' },
    { pos: [1.5, 0.78, -1], scale: 0.02, model: '/models/pearl.glb' },
    { pos: [1.7, 0.8, -1], scale: 0.05, model: '/models/gold_nugget.glb' },
    { pos: [1.9, 0.8, -1], scale: 0.008, model: '/models/silver_ore1.glb' }
  ];

  // 矿石旋转
  useFrame(() => {
    if (group.current) {
      cubesConfig.forEach((cube, index) => {
      const agateMesh = group.current.children[index];
        if (hoveredIndex !== index) {
          agateMesh.rotation.y += 0.01; // 旋转
        }
        if (textHoveredIndex === index) {
          agateMesh.scale.set(cube.scale * 1.2, cube.scale * 1.2, cube.scale * 1.2);
        } else {
          agateMesh.scale.set(cube.scale, cube.scale, cube.scale);
        }
      });
    }
  });

  return (
    <group ref={group}>
      {cubesConfig.map((cube, index) => (
        <Gltf 
          key={index} 
          src={cube.model} 
          position={cube.pos}
          scale={cube.scale}
        />
      ))}
    </group>
  );
};

// 首页：莲花交互
const AnimatedLotus = () => {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/lotus.glb');
  const { actions } = useAnimations(animations, group);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];
    action.setEffectiveTimeScale(1);
    if (hovered) {
      if (!action.isRunning()) {
        action.reset().play();
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
    } else {
      action.stop();
    }

    // 设置材质为白色
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.isMeshStandardMaterial || child.material.isMeshBasicMaterial) {
          child.material.color.set(0xffffff); // 设置材质颜色为白色
          child.material.map = null; // 移除纹理
        }
      }
    });
  }, [hovered, actions, scene]);

  const handlePointerOver = () => {
    setHovered(true);
  };
  const handlePointerOut = () => {
    setHovered(false);
  };
  return (
    <group 
      ref={group} 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      style={{ cursor: hovered ? 'pointer' : 'auto' }}
    >
      <primitive 
        object={scene} 
        position={[0.9, 0.38, -0.56]} 
        scale={0.05}
      />
    </group>
  );
};

// 第二页：七宝标签html
function Annotation({ children, index, setHoveredIndex, ...props }) {
  return (
    // 如果把onPointer事件放在html上，则无法触发
    // Html组件可能会有一些默认的行为或样式，影响其交互性。
    // Html组件可能会处理事件的传播方式，导致事件未能正确传递到其子元素。
    // Html 组件可能会在 3D 场景中以不同的方式渲染，可能会影响事件的捕获和冒泡。
    <Html
      {...props}
      transform
      occlude="blending"
    >
      <div 
        className="annotation" 
        onPointerEnter={() => {
          setHoveredIndex(index);
        }}
        onPointerLeave={() => {
          setHoveredIndex(null);
        }}
      >
        <span style={{ fontSize: '1.5px' }}>{children}</span>
      </div>
    </Html>
  );
}

// 第四页：消失的古国的档案
function Scene({ children, ...props }) {
  const ref = useRef()
  const scroll = useScroll()
  const [hovered, hover] = useState(null)
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
  })
  return (
    <group ref={ref} {...props}>
      <Cards category="公元前5世纪" description="河西走廊开辟带动中原对西方的交流" from={0} len={Math.PI / 4} position={[0, 0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
      <Cards category="公元前139年" description="汉武帝刘彻派遣张骞前往大月氏" from={Math.PI / 4} len={Math.PI / 2} position={[0, 0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
      <Cards category="公元618年" description="贞观年间发展鼎盛，安史之乱后走向衰落" from={Math.PI / 4 + Math.PI / 2} len={Math.PI / 2} position={[0, 0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
      <Cards category="公元13世纪" description="成吉思汗西征后草原丝绸之路重新畅通" from={Math.PI * 1.25} len={Math.PI * 2 - Math.PI * 1.25} position={[0, 0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
      <ActiveCard hovered={hovered} />
    </group>
  )
}

function Cards({ category, description, data, from = 0, len = Math.PI * 2, radius = 4, onPointerOver, onPointerOut, ...props }) {
  const [hovered, hover] = useState(null);
  const amount = Math.round(len * 22);
  const textPosition = from + (amount / 2 / amount) * len;
  return (
    <group {...props}>
      <Billboard position={[Math.sin(textPosition) * radius * 1.4, 0.9, Math.cos(textPosition) * radius * 1.4]}>
        <Text font={undefined} fontSize={0.2} anchorX="center" color="white">
          {category}
          {'\n'}
          {description}
        </Text>
      </Billboard>
      {Array.from({ length: amount - 2 /* minus 3 images at the end, creates a gap */ }, (_, i) => {
        const angle = from + (i / amount) * len
        return (
          <Card
            key={angle}
            onPointerOver={(e) => (e.stopPropagation(), hover(i), onPointerOver(i))}
            onPointerOut={() => (hover(null), onPointerOut(null))}
            onClick={(e) => { 
              e.stopPropagation(); // 阻止事件冒泡
              window.open('https://www.silkroutemuseum.com/aboutus.htm', '_blank');
            }}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            url={`/img${Math.floor(i % 10) + 1}.jpg`}
          />
        );
      })};
    </group>
  );
};

function Card({ url, active, hovered, ...props }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const f = hovered ? 1.4 : active ? 1.25 : 1
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta)
    easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta)
  });
  return (
    <group {...props}>
      <Image ref={ref} transparent radius={0} url={url} scale={[0.8, 0.04, 0.04]} side={THREE.DoubleSide} />
    </group>
  );
};

function ActiveCard({ hovered, ...props }) {
  const ref = useRef();
  const name = "佛国";
  useLayoutEffect(() => void (ref.current.material.zoom = 0.8), [hovered]);
  useFrame((state, delta) => {
    easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
    easing.damp(ref.current.material, 'opacity', hovered !== null, 0.3, delta)
  });
  return (
    <Billboard {...props}>
      <Text font={undefined} fontSize={0.5} position={[2.15, 2.8, 0]} anchorX="left" color="white">
        {hovered !== null && `${name}\n${hovered}`}
      </Text>
      <Image ref={ref} transparent radius={0.3} position={[0, 0.65, 0]} scale={[3.5, 1.618 * 3.5, 0.2, 1]} url={`/img${Math.floor(hovered % 10) + 1}.jpg`} />
    </Billboard>
  );
};

// 第三页：陆上丝绸之路
const SilkRoad = ({section, controls}) => {
  const { scene, animations} = useGLTF('/models/juicy.glb');
  const { scene: guanyinEyesScene } = useGLTF('/models/guanyin_eyes.glb');
  const { actions } = useAnimations(animations, scene); // 获取动画动作
  const scroll = useScroll(); // 添加滚动控制

  useEffect(() => {
    // 循环播放所有动画
    Object.values(actions).forEach(action => {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
    });
  }, [guanyinEyesScene, actions]);

  const cameraInnerPos = {
    "001": [-1.0989799479699283, 0.09958553183273146, 1.1084340692644683, -0.21751616852684177, -0.022135471369111592, 0.07862974177970324],
    "002": [0.1533130817597403, -0.03337566841388145, 0.359150460242416, 0.12593024320343424, -0.04205532334565633, 0.3053497637460329],
    "003": [-0.105594063847238, 0.332933991063237, -0.08075142379003725, -0.10559406384723799, 0.33293399106323696, -0.0807514237900375],
    "004": [-0.16390460618507247, 2.013646376580086, 0.15580534919416641, -0.16390459220337186, 0.252657269351631, 0.15580358826056523],
  };

  // 根据滚动位置切换相机机位
  useFrame(() => {
    if (sections[section] === "camera") { // 只在第三页时启用滚动控制相机
      const positionIndex = `00${Math.floor(scroll.offset * 4) + 1}`;
      const targetPosition = cameraInnerPos[positionIndex] || cameraInnerPos["001"];
      controls.current.setLookAt(...targetPosition, true);
    }
  });

  return (
    <>
      <primitive object={scene} position={[0, -0.1, 0]} scale={0.01} />;
      <primitive object={guanyinEyesScene} position={[1.2, -0.8, -1]} scale={0.08} rotation={[0, -Math.PI / 4, 0]} />;
      <Billboard position={[-0.3, 0.01, 0.08]}>
        <Text fontSize={0.02} color="white">楼兰</Text>
      </Billboard>
      <Billboard position={[-0.6, 0.01, 0.14]}>
        <Text fontSize={0.02} color="white">精绝</Text>
      </Billboard>
      <Billboard position={[-0.77, 0.01, 0.14]}>
        <Text fontSize={0.02} color="white">于阗</Text>
      </Billboard>
      <Billboard position={[-0.6, 0.01, -0.07]}>
        <Text fontSize={0.02} color="white">龟兹</Text>
      </Billboard>
      <Billboard position={[-0.85, 0.01, -0.08]}>
        <Text fontSize={0.02} color="white">姑墨</Text>
      </Billboard>
      <Billboard position={[-0.6, -0.04, 0.5]}>
        <Text fontSize={0.02} color="white">古格王国</Text>
      </Billboard>
      <Billboard position={[-0.2, 0.08, -0.04]}>
        <mesh>
          <roundedPlaneGeometry args={[0.28, 0.04, 0.02]} />
          <meshStandardMaterial color={0x000000}/>
        </mesh>
        <Text fontSize={0.025} color="white">河西走廊的异域商人们</Text>
      </Billboard>
      <Billboard position={[0.08, 0.04, 0.25]}>
        <mesh>
          <roundedPlaneGeometry args={[0.15, 0.04, 0.02]} />
          <meshStandardMaterial color={0x000000}/>
        </mesh>
        <Text fontSize={0.025} color="white">大唐节度使</Text>
      </Billboard>
    </>
  );
};

// export Experience to App
export const Experience = ({ section, textHoveredIndex }) => {
  const controls = useRef();
  const box = useRef();
  const sphere = useRef();
  
  useControls("settings", {
    smoothTime: {
      value: 0.35,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: (v) => (controls.current.smoothTime = v),
    },
  });

  useControls("dolly", {
    in: button(() => {
      controls.current.dolly(0.1, true);
    }),
    out: button(() => {
      controls.current.dolly(-0.1, true);
    }),
  });

  useControls("truck", {
    up: button(() => {
      controls.current.truck(0, -0.02, true);
    }),
    left: button(() => {
      controls.current.truck(-0.02, 0, true);
    }),
    down: button(() => {
      controls.current.truck(0, 0.02, true);
    }),

    right: button(() => {
      controls.current.truck(0.02, 0, true);
    }),
  });

  useControls("rotate", {
    up: button(() => {
      controls.current.rotate(0, -0.1, true);
    }),
    down: button(() => {
      controls.current.rotate(0, 0.1, true);
    }),
    left: button(() => {
      controls.current.rotate(-0.1, 0, true);
    }),
    right: button(() => {
      controls.current.rotate(0.1, 0, true);
    }),
  });

  useControls("fit", {
    fitToBox: button(() => {
      controls.current.fitToSphere(box.current, true);
    }),
    fitToSphere: button(() => {
      controls.current.fitToSphere(sphere.current, false);
    }),
  });

  // 加载的相机动画
  const [introFinished, setIntroFinished] = useState(false);
  const intro = async () => {
    controls.current.setLookAt(0, 0, 5, 1, 0.5, 0, false);
    await controls.current.dolly(3, true);
    await controls.current.rotate(degToRad(25), degToRad(-45), true);

    setIntroFinished(true);
    playTransition();
  };

  const playTransition = () => {
    if (sections[section] !== "camera") { // 在非第三页时使用全局相机控制
      controls.current.setLookAt(...cameraPositions[sections[section]], true);
    }
  };

  useControls("Helper", {
    getLookAt: button(() => {
      const position = controls.current.getPosition();
      const target = controls.current.getTarget();
      console.log([...position, ...target]);
    }),
    toJson: button(() => console.log(controls.current.toJSON())),
  });

  useEffect(() => {
    intro();
  }, []);

  useEffect(() => {
    if (!introFinished) {
      return;
    }
    playTransition();
  }, [section]);

  // 预加载所有模型
  useEffect(() => {
    Promise.all([
      useGLTF.preload('/models/agate.glb'),
      useGLTF.preload('/models/lotus.glb'),
      useGLTF.preload('/models/seated_guanyin.glb'),
      useGLTF.preload('/models/juicy.glb'),
      useGLTF.preload('/models/guanyin_eyes.glb'),
      useGLTF.preload('/models/coral2.glb'),
      useGLTF.preload('/models/Tridacnes.glb'),
      useGLTF.preload('/models/agate.glb'),
      useGLTF.preload('/models/Lapis1.glb'),
      useGLTF.preload('/models/pearl.glb'),
      useGLTF.preload('/models/gold_nugget.glb'),
      useGLTF.preload('/models/silver_ore1.glb')
    ]).catch(error => {
      console.error('模型预加载失败:', error);
    });
  }, []);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <CameraControls
        ref={controls}
        mouseButtons={{
          left: 0,
          middle: 0,
          right: 0,
          wheel: 0, // 禁用滚轮，cameraControl可能与ScrollControls冲突
        }}
        touches={{
          one: 0,
          two: 0,
          three: 0,
        }}
      />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.1} />
      {/* leva */}
      <mesh ref={box} visible={false}>
        <boxGeometry args={[0.5, 0.8, 0.2]} />
        <meshBasicMaterial color="mediumpurple" wireframe />
      </mesh>
      <mesh ref={sphere} visible={false}>
        <sphereGeometry args={[0.36, 64]} />
        <meshBasicMaterial color="hotpink" wireframe />
      </mesh>
      {/* 首页 */}
      { (sections[section] === "titanium" || sections[section] === "intro" || sections[section] === "action-button") && (
        <Gltf
          position={[0, 0, -1]}
          src="/models/seated_guanyin.glb"
          scale={0.6}
        />
      )}
      {sections[section] === "intro" && <AnimatedLotus/>}
      {/* 第2页 */}
      {sections[section] === "titanium" && (
        <>
          <Annotation children="珊瑚" index={0} position={[0.3, 0.7, -1]} setHoveredIndex={setHoveredIndex} />
          <Annotation children="砗磲" index={1} position={[0.5, 0.7, -1]} setHoveredIndex={setHoveredIndex} />
          <Annotation children="玛瑙" index={2} position={[0.7, 0.7, -1]} setHoveredIndex={setHoveredIndex} />
          <Annotation children="青金石" index={3} position={[1.1, 1, -1]} setHoveredIndex={setHoveredIndex} />
          <Annotation children="珍珠" index={4} position={[1.5, 0.7, -1]} setHoveredIndex={setHoveredIndex} />
          <Annotation children="金" index={5} position={[1.7, 0.7, -1]} setHoveredIndex={setHoveredIndex} />
          <Annotation children="银" index={6} position={[1.9, 0.7, -1]} setHoveredIndex={setHoveredIndex} />
          <FloatingCubes 
            hoveredIndex={hoveredIndex} 
            textHoveredIndex={textHoveredIndex}
          />
        </>
      )}
      {/* 第3页 */}
      {sections[section] === "camera" && (<SilkRoad section={section} controls={controls} />)}
      {/* 第4页 */}
      {sections[section] === "action-button" && (
        <Scene position={[1, 0.8, 0]} scale={0.5} />
      )}
      <group rotation-y={Math.PI}>
        <Environment preset="warehouse" blur />
      </group>
    </>
  );
};

