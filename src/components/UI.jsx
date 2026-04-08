export const sections = ["intro", "titanium", "camera", "action-button"];
import { useEffect, useState } from "react";

export const BackgroundUI = ({ section, isInit}) => {
  return (
    <main className="fixed inset-0 flex flex-col p-4 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="flex-1 relative h-full">
        <section
            className={`absolute inset-4 flex flex-col justify-start text-right transition-opacity duration-1000 ${
              sections[section] === "intro" && isInit ? "" : "opacity-0" 
            }`}
          >
            <h1 className="font-extrabold text-white mt-16 mr-16 custom-text-size" style={{ zIndex: 0 }}>
              色即是空，<br />空即是色。
            </h1>
            <p className="text-2xl font-thin text-center text-white mt-16 ml-128 mr-16">
            金塔庄严，梵音绕梁。<br />丝路佛国，盛极而衰，色相因缘而生灭，本质皆为空性。<br />色相湮没，法性无碍，真理恒存。<br />一切真谛，得般若智慧，究竟涅槃，永离苦厄。
            </p>
        </section>
        <section
          className={`absolute inset-4 flex flex-col justify-start text-center transition-opacity duration-1000 ${
            sections[section] === "titanium" ? "" : "opacity-0"
          }`}
        >
          <h1 className="font-medium text-stone-100 mt-28 qibao">
            七    宝
          </h1>
          <h1 className="font-medium text-stone-100 qibao">
            成    佛
          </h1>
        </section>
      </div>
    </main>
  );
};

export const UI = ({ section, onSectionChange, setTextHoveredIndex }) => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsInit(true);
    }, 2000);
  }, []);

  return (
    <main className="fixed inset-0 flex flex-col p-4 pointer-events-none" style={{ zIndex: 2 }}>
      <div className="flex flex-1 items-center justify-between text-white" style={{ zIndex: 2 }}>
        <button // 首页按钮
          className="absolute top-10 left-10 text-white cursor-pointer hover:scale-105 transition-transform duration-200 pointer-events-auto"
          onClick={() => onSectionChange(0)}
        >
          首页
        </button>
        <a // Wiki按钮
          href="https://zh.wikipedia.org/wiki/%E4%B8%9D%E7%BB%B8%E4%B9%8B%E8%B7%AF"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-10 left-32 text-white cursor-pointer hover:scale-105 transition-transform duration-200 pointer-events-auto"
        >
          Wiki
        </a>
        <button // 返回按钮
          className="hover:opacity-50 transition-opacity duration-200 cursor-pointer pointer-events-auto"
          onClick={() =>
            onSectionChange(section === 0 ? sections.length - 1 : section - 1)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div className="flex-1 relative h-full">
          <section
            className={`absolute inset-4 flex flex-col justify-start text-center mt-4 transition-opacity duration-1000 ${
              sections[section] === "titanium" ? "" : "opacity-0"
            }`}
          >
          </section>
          <section
          className={`absolute inset-4 flex flex-col justify-start text-center transition-opacity duration-1000 ${
            sections[section] === "titanium" ? "" : "opacity-0"
          }`}
        >
          <p className="text-2xl font-thin text-center text-white mt-10 ml-16 mr-16 pointer-events-auto">
            随着公元前5世纪左右河西走廊的开辟，带动了中原对西方的商贸交流，丝绸之路的雏形开始形成。产自今阿富汗巴达克山的
            <span 
              className="font-bold cursor-pointer hover:underline" 
              onPointerEnter={() => setTextHoveredIndex(3)}
              onPointerLeave={() => setTextHoveredIndex(null)}
            >
              青金石
            </span>
            ，传入印度河流域文明，成为佛教七宝之一。
          </p>
          </section>
          <section
            className={`absolute inset-4 flex flex-col justify-end text-center transition-opacity pointer-events-none duration-1000 ${
              sections[section] === "camera" ? "" : "opacity-0"
            }`}
          >
            <h1 className="text-2xl font-medium text-stone-100">
              消失的佛国
            </h1>
            <p className="text-white">
              在古代丝绸之路，政治经济文化宗教在这里融合，出现过许多绿洲佛国。然而在经历了无数次朝代更迭之后，这些神秘的国度都已一一消逝在历史的长河中。
            </p>
          </section>
          <section
            className={`absolute inset-4 flex flex-col justify-end text-center transition-opacity pointer-events-none duration-1000 ${
              sections[section] === "action-button" ? "" : "opacity-0"
            }`}
          >
            <h1 className="text-2xl font-medium text-stone-100">
              丝路档案馆
            </h1>
            <p className="text-white">
              陆上丝绸之路，是连接中国与中亚、西亚、南亚、欧洲及非洲的古代陆上通道。
            </p>
          </section>
        </div>
        <button // 下一页按钮
          className="hover:opacity-50 transition-opacity duration-200 cursor-pointer pointer-events-auto"
          onClick={() =>
            onSectionChange(section === sections.length - 1 ? 0 : section + 1)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-center items-center gap-2">
        {sections.map((sectionItem, idx) => (
          <div
            key={sectionItem}
            className={`rounded-full border border-stone-100 w-3 h-3 flex items-center justify-center hover:cursor-pointer hover:opacity-80 transition-opacity duration-200 pointer-events-auto ${
              section === idx ? "bg-stone-100" : ""
            }`}
            onClick={() => onSectionChange(idx)}
          ></div>
        ))}
      </div>
    </main>
  );
};
