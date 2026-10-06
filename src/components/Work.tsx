import { useEffect, useState } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import { FaGithub, FaStar } from "react-icons/fa6";
import { MdRefresh, MdCheckCircle } from "react-icons/md";

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

const CACHE_KEY = "saurabh_github_repos_dynamic_v1";
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
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    return config.projects.map((p) => ({ ...p, isFeatured: true }));
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch live repos from GitHub API
  const fetchGitHubRepos = async (force: boolean = false) => {
    setIsLoading(true);
    try {
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            mergeRepos(data);
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
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, timestamp: Date.now() }));
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

    // 1. Add curated featured projects
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

    // 2. Automatically add any other newly created public repos from GitHub
    filtered.forEach((repo) => {
      if (usedNames.has(repo.name.toLowerCase())) return;

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

  // Dynamic GSAP horizontal scroll timeline
  useEffect(() => {
    let timeline: gsap.core.Timeline | null = null;

    // Small delay to ensure all DOM boxes have rendered and measured
    const timeout = setTimeout(() => {
      const boxes = document.getElementsByClassName("work-box");
      if (boxes.length === 0) return;

      const container = document.querySelector(".work-container");
      if (!container) return;

      const rectLeft = container.getBoundingClientRect().left;
      const rect = boxes[0].getBoundingClientRect();
      const parentWidth = boxes[0].parentElement!.getBoundingClientRect().width;
      const padding = parseInt(window.getComputedStyle(boxes[0]).padding) / 2 || 40;

      const translateX = rect.width * boxes.length - (rectLeft + parentWidth) + padding;

      if (translateX <= 0) return;

      ScrollTrigger.getById("work")?.kill();

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: `+=${translateX}`,
          scrub: true,
          pin: true,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      timeline.to(".work-flex", {
        x: -translateX,
        ease: "none",
      });

      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timeout);
      timeline?.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, [projects]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-top-bar">
          <h2>
            My <span>Work</span>
          </h2>

          <div className="work-live-sync-pill">
            <span className={`work-live-dot ${isLoading ? "syncing" : ""}`} />
            <span className="work-live-text">
              <MdCheckCircle className="work-live-icon" /> Live GitHub Sync (@SaurabhForge)
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

        <div className="work-flex">
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
                      <FaGithub /> GitHub
                    </a>
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
        </div>
      </div>
    </div>
  );
};

export default Work;
