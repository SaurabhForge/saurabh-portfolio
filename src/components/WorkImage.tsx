import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaCode, FaGithub } from "react-icons/fa6";

interface Props {
  image?: string;
  alt?: string;
  video?: string;
  link?: string;
  category?: string;
  language?: string;
}

const WorkImage = ({ image, alt, video, link, category, language }: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  const handleMouseEnter = async () => {
    if (video) {
      setIsVideo(true);
      try {
        const response = await fetch(`src/assets/${video}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideoUrl(blobUrl);
      } catch (e) {
        console.error("Video load error", e);
      }
    }
  };

  const showFallback = !image || imgError;

  return (
    <div className="work-image">
      <a
        className={`work-image-in ${showFallback ? "work-image-fallback-wrap" : ""}`}
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="disable"
      >
        {link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}

        {!showFallback ? (
          <img
            src={image}
            alt={alt || "Project preview"}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="work-fallback-card">
            <div className="work-fallback-glow" />
            <div className="work-fallback-content">
              <div className="work-fallback-icon">
                <FaCode />
              </div>
              <h4>{alt || "GitHub Repository"}</h4>
              <div className="work-fallback-badges">
                {language && <span className="work-fallback-pill">{language}</span>}
                {category && <span className="work-fallback-pill-sub">{category}</span>}
              </div>
              <div className="work-fallback-meta">
                <FaGithub /> View Source on GitHub
              </div>
            </div>
          </div>
        )}

        {isVideo && videoUrl && (
          <video src={videoUrl} autoPlay muted playsInline loop></video>
        )}
      </a>
    </div>
  );
};

export default WorkImage;
