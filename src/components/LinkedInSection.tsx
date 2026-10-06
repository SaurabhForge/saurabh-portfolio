import "./styles/LinkedInSection.css";
import { config } from "../config";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { MdArrowOutward, MdVerified, MdLocationOn, MdSchool, MdWorkOutline } from "react-icons/md";

const updates = [
  {
    tag: "Project Milestone",
    title: "BlockCredAI — Decentralized Verification & Fraud Detection",
    date: "Recent Update",
    desc: "Engineered smart-contract based credential verification on Ethereum paired with an AI-driven FastAPI resume inspection engine.",
  },
  {
    tag: "Generative AI",
    title: "Agentic AI Workflow for B2B RFP Responses",
    date: "Recent Update",
    desc: "Built autonomous LLM agents that parse enterprise RFPs, extract requirements, and map SKUs into technical commercial bids.",
  },
  {
    tag: "Certification",
    title: "Principles of Generative AI — Google & Coursera",
    date: "Verified",
    desc: "Completed advanced coursework in generative models, prompting architectures, and practical AI application pipelines.",
  },
  {
    tag: "Academic",
    title: "Information Science & Engineering — M.S. Engineering College",
    date: "2023 – 2027",
    desc: "Pursuing B.E. in Bangalore, focusing on algorithms, distributed networks, cybersecurity, and Web3 technologies.",
  },
];

const LinkedInSection = () => {
  const linkedinUrl = config.social.linkedin || "https://www.linkedin.com/in/saurabh-kumar-59aa14265";

  return (
    <section className="linkedin-section section-container" id="linkedin">
      <div className="linkedin-container">
        {/* Section Heading */}
        <div className="linkedin-header">
          <h2>
            LinkedIn <span>& Live Updates</span>
          </h2>
          <p className="linkedin-subtitle">
            Connect with me on LinkedIn for real-time engineering milestones, open-source work, and internship availability.
          </p>
        </div>

        {/* Master Showcase Card */}
        <div className="linkedin-card">
          {/* Top banner styling */}
          <div className="linkedin-banner">
            <span className="linkedin-status-pill">
              <span className="linkedin-status-dot" /> Open to Opportunities & Internships
            </span>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-badge-btn"
              data-cursor="disable"
            >
              <FaLinkedinIn /> View on LinkedIn <MdArrowOutward />
            </a>
          </div>

          <div className="linkedin-body">
            {/* Profile Overview Column */}
            <div className="linkedin-profile-col">
              <div className="linkedin-avatar-wrap">
                <img
                  src="/images/profile.png"
                  alt="Saurabh Kumar"
                  className="linkedin-avatar"
                  onError={(e) => {
                    // Fallback to placeholder if profile.png isn't available
                    (e.target as HTMLImageElement).src = "/images/placeholder.webp";
                  }}
                />
                <span className="linkedin-online-ring" />
              </div>

              <div className="linkedin-details">
                <div className="linkedin-name-row">
                  <h3>{config.developer.fullName}</h3>
                  <MdVerified className="linkedin-verified-icon" title="Verified Profile" />
                </div>
                <p className="linkedin-headline">{config.developer.title}</p>

                <div className="linkedin-meta-list">
                  <div className="linkedin-meta-item">
                    <MdSchool className="linkedin-meta-icon" />
                    <span>M.S. Engineering College (B.E. 2023–2027)</span>
                  </div>
                  <div className="linkedin-meta-item">
                    <MdLocationOn className="linkedin-meta-icon" />
                    <span>{config.social.location}</span>
                  </div>
                  <div className="linkedin-meta-item">
                    <MdWorkOutline className="linkedin-meta-icon" />
                    <span>Full-Stack, AI Agents & Solidity DApps</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="linkedin-actions">
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-connect-btn"
                    data-cursor="disable"
                  >
                    <FaLinkedinIn /> Connect on LinkedIn
                  </a>
                  <a
                    href={`https://github.com/${config.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-github-btn"
                    data-cursor="disable"
                  >
                    <FaGithub /> GitHub Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Live Updates & Milestones Feed Column */}
            <div className="linkedin-feed-col">
              <div className="linkedin-feed-header">
                <h4>Recent Milestones & Profile Updates</h4>
                <span className="linkedin-feed-sync">Synced Profile</span>
              </div>

              <div className="linkedin-feed-list">
                {updates.map((item, idx) => (
                  <div className="linkedin-feed-item" key={idx}>
                    <div className="linkedin-feed-top">
                      <span className="linkedin-feed-tag">{item.tag}</span>
                      <span className="linkedin-feed-date">{item.date}</span>
                    </div>
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="linkedin-stats-bar">
            <div className="linkedin-stat">
              <span className="linkedin-stat-val">19+</span>
              <span className="linkedin-stat-lbl">GitHub Repos</span>
            </div>
            <div className="linkedin-stat">
              <span className="linkedin-stat-val">6+</span>
              <span className="linkedin-stat-lbl">Featured Projects</span>
            </div>
            <div className="linkedin-stat">
              <span className="linkedin-stat-val">5</span>
              <span className="linkedin-stat-lbl">Certifications</span>
            </div>
            <div className="linkedin-stat">
              <span className="linkedin-stat-val">2027</span>
              <span className="linkedin-stat-lbl">Graduation Year</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkedInSection;
