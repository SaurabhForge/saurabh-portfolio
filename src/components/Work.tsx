import { useEffect, useState, useMemo } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { config } from "../config";
import { FaGithub, FaStar, FaCodeFork } from "react-icons/fa6";
import { MdArrowOutward, MdRefresh, MdCheckCircle } from "react-icons/md";

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

const CACHE_KEY = "saurabh_github_repos_v2";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

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
  return repo.language ? `${repo.language} Project` : "Software Project";
}

const Work = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    // Start immediately with static config projects to avoid layout jump
    return config.projects.map((p) => ({
      ...p,
      isFeatured: true,
    }));
  });
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const fetchGitHubRepos = async (force: boolean = false) => {
    setIsLoading(true);
    try {
      // Check cache if not forcing refresh
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            mergeWithGitHubRepos(data);
            setLastSyncTime(new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
            setIsLoading(false);
            return;
          }
        }
      }

      const res = await fetch("https://api.github.com/users/SaurabhForge/repos?sort=updated&per_page=100", {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }

      const repos: GitHubRepo[] = await res.json();
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: repos, timestamp: Date.now() })
      );
      mergeWithGitHubRepos(repos);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.warn("Could not fetch live GitHub repos, relying on static curated projects:", err);
      // Graceful fallback to static config projects
    } finally {
      setIsLoading(false);
    }
  };

  const mergeWithGitHubRepos = (repos: GitHubRepo[]) => {
    // Filter out forks and profile README repo
    const filteredRepos = repos.filter(
      (r) => !r.fork && r.name.toLowerCase() !== "saurabhforge"
    );

    const merged: ProjectItem[] = [];
    const usedRepoNames = new Set<string>();

    // 1. First add curated projects, matching with GitHub stats if available
    config.projects.forEach((cp) => {
      const matched = filteredRepos.find(
        (r) =>
          r.html_url.toLowerCase() === cp.link.toLowerCase() ||
          r.name.toLowerCase() === cp.title.toLowerCase().replace(/\s+/g, "-") ||
          r.name.toLowerCase() === cp.title.toLowerCase()
      );

      if (matched) {
        usedRepoNames.add(matched.name.toLowerCase());
        merged.push({
          id: cp.id,
          title: cp.title,
          category: cp.category,
          description: cp.description,
          technologies: cp.technologies,
          image: cp.image,
          link: cp.link,
          homepage: matched.homepage || undefined,
          stars: matched.stargazers_count,
          forks: matched.forks_count,
          updatedAt: matched.updated_at,
          isFeatured: true,
        });
      } else {
        merged.push({
          ...cp,
          isFeatured: true,
        });
      }
    });

    // 2. Automatically add any newly discovered repositories from GitHub
    filteredRepos.forEach((repo) => {
      if (usedRepoNames.has(repo.name.toLowerCase())) return;

      const techList = [
        repo.language,
        ...(repo.topics || []).slice(0, 3),
      ]
        .filter(Boolean)
        .join(" · ");

      merged.push({
        id: `gh-${repo.id}`,
        title: formatRepoTitle(repo.name),
        category: inferCategory(repo),
        description:
          repo.description ||
          `Open-source ${repo.language || "software"} project created on GitHub.`,
        technologies: techList || repo.language || "Open Source",
        link: repo.html_url,
        homepage: repo.homepage || undefined,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        isFeatured: false,
      });
    });

    setProjects(merged);
  };

  useEffect(() => {
    fetchGitHubRepos(false);
  }, []);

  const filterCategories = ["All", "Featured", "AI / ML", "Web3 / Blockchain", "Full Stack"];

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    if (activeFilter === "Featured") return projects.filter((p) => p.isFeatured);
    return projects.filter((p) =>
      p.category.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [projects, activeFilter]);

  return (
    <section className="work-section" id="work">
      <div className="work-container section-container">
        {/* Header with Title and Live Sync Banner */}
        <div className="work-header">
          <div className="work-header-text">
            <h2>
              My <span>Work</span>
            </h2>
            <p className="work-subtitle">
              Selected client work, AI workflows, Web3 DApps, and open-source software.
            </p>
          </div>

          <div className="work-sync-box">
            <div className="work-sync-indicator">
              <span className={`work-sync-dot ${isLoading ? "syncing" : ""}`} />
              <span className="work-sync-label">
                <MdCheckCircle className="work-sync-icon" /> Live Sync with GitHub (
                <a
                  href="https://github.com/SaurabhForge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-sync-user"
                >
                  @SaurabhForge
                </a>
                )
              </span>
            </div>
            <div className="work-sync-actions">
              {lastSyncTime && (
                <span className="work-sync-time">Updated {lastSyncTime}</span>
              )}
              <button
                className="work-sync-btn"
                onClick={() => fetchGitHubRepos(true)}
                disabled={isLoading}
                title="Fetch latest projects from GitHub"
                aria-label="Refresh GitHub projects"
              >
                <MdRefresh className={isLoading ? "spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="work-filters">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              className={`work-filter-btn ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
              {cat === "All" && <span className="work-filter-count">{projects.length}</span>}
              {cat === "Featured" && (
                <span className="work-filter-count">
                  {projects.filter((p) => p.isFeatured).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Static Responsive Grid */}
        <div className="work-grid">
          {filteredProjects.map((project, index) => {
            const indexStr = (index + 1).toString().padStart(2, "0");
            return (
              <article className="work-card" key={project.id}>
                {/* Card Top: Index, Category, Stars */}
                <div className="work-card-header">
                  <span className="work-card-num">{indexStr}</span>
                  <div className="work-card-badges">
                    <span className="work-card-cat">{project.category}</span>
                    {project.isFeatured && (
                      <span className="work-card-featured">Featured</span>
                    )}
                    {typeof project.stars === "number" && project.stars > 0 && (
                      <span className="work-card-stars">
                        <FaStar /> {project.stars}
                      </span>
                    )}
                    {typeof project.forks === "number" && project.forks > 0 && (
                      <span className="work-card-stars">
                        <FaCodeFork /> {project.forks}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Image / Preview */}
                <div className="work-card-media">
                  <WorkImage
                    image={project.image}
                    alt={project.title}
                    link={project.homepage || project.link}
                    category={project.category}
                    language={project.technologies.split("·")[0]?.trim()}
                  />
                </div>

                {/* Card Details */}
                <div className="work-card-body">
                  <h3 className="work-card-title">{project.title}</h3>
                  <p className="work-card-tech">{project.technologies}</p>
                  <p className="work-card-desc">{project.description}</p>
                </div>

                {/* Card Footer: Action Links */}
                <div className="work-card-footer">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-btn work-btn-code"
                    data-cursor="disable"
                  >
                    <FaGithub /> Source Code
                  </a>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-btn work-btn-demo"
                      data-cursor="disable"
                    >
                      Live Demo <MdArrowOutward />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Work;
