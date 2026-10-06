import { useEffect, useState, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import { FaGithub, FaStar } from "react-icons/fa6";
import { MdRefresh, MdCheckCircle, MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  technologies: string;
  image?: string;
  link: string;
  homepage?: string;
  stars?: number;
  forks?: number;
  updatedAt?: string;
  isFeatured?: boolean;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  topics?: string[];
}

const CACHE_KEY = "saurabh_github_repos_v3";
const CACHE_TTL = 15 * 60 * 1000; // 15 mins

function formatRepoTitle(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function inferCategory(repo: GitHubRepo): string {
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (text.includes("ethereum") || text.includes("solidity") || text.includes("web3") || text.includes("blockchain") || text.includes("dapp")) {
    return "Web3 / Blockchain";
  }
  if (text.includes("ai") || text.includes("llm") || text.includes("agent") || text.includes("vision") || text.includes("ml") || text.includes("genai")) {
    return "AI / ML";
  }
  if (text.includes("react") || text.includes("next") || text.includes("fullstack") || text.includes("full-stack") || text.includes("node") || text.includes("fastapi")) {
    return "Full Stack";
  }
  return repo.language ? `${repo.language}` : "Software";
}

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    return config.projects.map((p) => ({ ...p, isFeatured: true }));
  });
  const [totalRepoCount, setTotalRepoCount] = useState<number>(19);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch live repos from GitHub API
  const fetchGitHubRepos = async (force: boolean = false) => {
    setIsLoading(true);
    try {
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp, total } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            mergeRepos(data);
            if (total) setTotalRepoCount(total);
            setIsLoading(false);
            return;
          }
        }
      }

      const res = await fetch("https://api.github.com/users/SaurabhForge/repos?sort=updated&per_page=100", {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

      const repos: GitHubRepo[] = await res.json();
      const filtered = repos.filter((r) => !r.fork && r.name.toLowerCase() !== "saurabhforge");
      setTotalRepoCount(filtered.length);

      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: repos, timestamp: Date.now(), total: filtered.length })
      );
      mergeRepos(repos);
    } catch (err) {
      console.warn("Using curated static projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeRepos = (repos: GitHubRepo[]) => {
    const filtered = repos.filter(
      (r) => !r.fork && r.name.toLowerCase() !== "saurabhforge"
    );

    const merged: ProjectItem[] = [];
    const usedNames = new Set<string>();

    // 1. Add curated featured projects with live star counts
    config.projects.forEach((cp) => {
      const match = filtered.find(
        (r) =>
          r.html_url.toLowerCase() === cp.link.toLowerCase() ||
          r.name.toLowerCase() === cp.title.toLowerCase().replace(/\s+/g, "-") ||
          r.name.toLowerCase() === cp.title.toLowerCase()
      );

      if (match) {
        usedNames.add(match.name.toLowerCase());
        merged.push({
          ...cp,
          homepage: match.homepage || undefined,
          stars: match.stargazers_count,
          forks: match.forks_count,
          isFeatured: true,
        });
      } else {
        merged.push({ ...cp, isFeatured: true });
      }
    });

    // 2. Automatically add any newly created public repos from GitHub (up to 4 newest)
    const newRepos = filtered.filter((r) => !usedNames.has(r.name.toLowerCase()));
    newRepos.slice(0, 3).forEach((repo) => {
      const techList = [repo.language, ...(repo.topics || []).slice(0, 2)]
        .filter(Boolean)
        .join(" · ");

      merged.push({
        id: `gh-${repo.id}`,
        title: formatRepoTitle(repo.name),
        category: inferCategory(repo),
        description: repo.description || `Open-source project on GitHub.`,
        technologies: techList || repo.language || "Open Source",
        link: repo.html_url,
        homepage: repo.homepage || undefined,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isFeatured: false,
      });
    });

    setProjects(merged);
  };

  useEffect(() => {
    fetchGitHubRepos(false);
  }, []);

  // Butter-smooth GSAP horizontal scroll with zero layout jump
  useEffect(() => {
    if (window.innerWidth <= 1024) return;

    let ctx: gsap.Context | null = null;

    const timer = setTimeout(() => {
      const flexEl = flexRef.current;
      const sectionEl = sectionRef.current;
      if (!flexEl || !sectionEl) return;

      const boxes = flexEl.querySelectorAll(".work-box");
      if (boxes.length === 0) return;

      const boxWidth = (boxes[0] as HTMLElement).offsetWidth || 560;
      const totalBoxesWidth = boxWidth * boxes.length;
      const viewportWidth = window.innerWidth;
      const translateX = Math.max(0, totalBoxesWidth - viewportWidth + 120);

      if (translateX <= 0) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => `+=${translateX}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            id: "work",
            invalidateOnRefresh: true,
          },
        });

        tl.to(flexEl, {
          x: -translateX,
          ease: "none",
        });
      }, sectionEl);

      ScrollTrigger.refresh();
    }, 120);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
      ScrollTrigger.getById("work")?.kill();
    };
  }, [projects]);

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        {/* Top Header Row */}
        <div className="work-top-bar">
          <h2>
            My <span>Work</span>
          </h2>

          <div className="work-live-sync-pill">
            <span className={`work-live-dot ${isLoading ? "syncing" : ""}`} />
            <span className="work-live-text">
              <MdCheckCircle className="work-live-icon" /> Live Sync with GitHub (@SaurabhForge)
            </span>
            <button
              className="work-live-refresh"
              onClick={() => fetchGitHubRepos(true)}
              disabled={isLoading}
              title="Refresh latest GitHub repositories"
              aria-label="Refresh GitHub projects"
            >
              <MdRefresh className={isLoading ? "spin" : ""} />
            </button>
          </div>
        </div>

        {/* Dynamic Horizontal Scroll Stream */}
        <div className="work-flex" ref={flexRef}>
          {projects.map((project, index) => {
            const indexStr = (index + 1).toString().padStart(2, "0");
            return (
              <div className="work-box" key={project.id}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>{indexStr}</h3>

                    <div>
                      <h4>{project.title}</h4>
                      <p>{project.category}</p>
                    </div>
                  </div>

                  <h4>Tools and features</h4>
                  <p>{project.technologies}</p>

                  {project.description && (
                    <p className="work-desc">{project.description}</p>
                  )}

                  <div className="work-meta-row">
                    {typeof project.stars === "number" && project.stars > 0 && (
                      <span className="work-meta-star">
                        <FaStar /> {project.stars}
                      </span>
                    )}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-meta-link"
                      data-cursor="disable"
                    >
                      <FaGithub /> Source
                    </a>
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-meta-link live"
                        data-cursor="disable"
                      >
                        Live <MdArrowOutward />
                      </a>
                    )}
                  </div>
                </div>

                <WorkImage
                  image={project.image}
                  alt={project.title}
                  link={project.homepage || project.link}
                  category={project.category}
                  language={project.technologies.split("·")[0]?.trim()}
                />
              </div>
            );
          })}

          {/* End Card: View All GitHub Repositories */}
          <div className="work-box work-box-more">
            <div className="work-more-card">
              <div className="work-more-icon">
                <FaGithub />
              </div>
              <h3>Explore All Repositories</h3>
              <p>
                {totalRepoCount}+ open-source projects, smart contracts, AI pipelines & experiments on GitHub.
              </p>
              <a
                href="https://github.com/SaurabhForge?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="work-more-btn"
                data-cursor="disable"
              >
                View @SaurabhForge <MdArrowOutward />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
