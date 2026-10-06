import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import LinkedInSection from "./LinkedInSection";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const TechStackFallback = () => (
  <div className="techstack" id="techstack">
    <h2>My Techstack</h2>
    <p className="techstack-subtitle">
      Core Technical Ecosystem & Architecture
    </p>
    <div className="tech-badge-container">
      <div className="tech-badge-group">
        {[
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Python",
          "FastAPI",
          "Solidity",
          "Ethereum",
          "Docker",
          "MongoDB",
          "MySQL",
          "Express",
          "Tailwind CSS",
          "Three.js",
          "Git & GitHub",
        ].map((skill) => (
          <span key={skill} className="tech-badge">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div className="container-content">
        <Landing>{!isDesktopView && children}</Landing>
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <Suspense fallback={<TechStackFallback />}>
          <TechStack />
        </Suspense>
        <LinkedInSection />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
