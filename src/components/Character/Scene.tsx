import { useEffect, useRef } from "react";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";

const Scene = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();
  // Store progress handle so onLoad can call loaded()
  const progressRef = useRef<ReturnType<typeof setProgress> | null>(null);

  useEffect(() => {
    progressRef.current = setProgress((value) => setLoading(value));

    // 3D perspective tilt following mouse (replaces head-bone rotation)
    let animFrame: number;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      target.y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    const animate = () => {
      animFrame = requestAnimationFrame(animate);
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      if (cardRef.current) {
        const rx = -current.y * 12;
        const ry = current.x * 14;
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
      }
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      target.x = (t.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      target.y = (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouch, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const handleImageLoad = () => {
    document.querySelector(".character-container")?.classList.add("character-loaded");
    progressRef.current?.loaded().then(() => {
      setTimeout(() => {
        setCharTimeline(null, null);
        setAllTimeline();
      }, 2500);
    });
  };

  return (
    <>
      <div className="character-container">
        <div className="character-model">
          <div className="character-rim" />
          <div className="photo-card-wrap">
            <div className="photo-card" ref={cardRef}>
              <img
                src="/images/profile.png"
                alt="Saurabh Kumar"
                className="photo-card-img"
                onLoad={handleImageLoad}
              />
              <div className="photo-card-gloss" />
            </div>
          </div>
          <div className="character-hover" />
        </div>
      </div>
    </>
  );
};

export default Scene;
