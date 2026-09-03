import "./styles/About.css";
import { config } from "../config";
import { MdArrowOutward, MdPhone, MdLocationOn, MdCircle } from "react-icons/md";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const coreSkills = [
  "React", "Next.js", "TypeScript", "FastAPI",
  "Solidity", "Python", "Node.js", "Tailwind CSS",
];

const stats = [
  { value: "6+", label: "Projects Built" },
  { value: "5", label: "Certifications" },
  { value: "2+", label: "Yrs Learning" },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(".about-badge", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })
        .fromTo(".about-label", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.1")
        .fromTo(".about-hook", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.1")
        .fromTo(".about-bio", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .fromTo(".about-stat", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.2")
        .fromTo(".about-tag", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.4)" }, "-=0.2")
        .fromTo(".about-links", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-section" id="about" ref={sectionRef}>
      <div className="about-me">

        {/* Open to work badge */}
        <div className="about-badge">
          <MdCircle className="about-badge-dot" />
          Open to Opportunities
        </div>

        {/* Section label */}
        <h3 className="about-label">{config.about.title}</h3>

        {/* Hook headline */}
        <p className="about-hook">
          I build things that live on the internet — and on the blockchain.
        </p>

        {/* Bio paragraph */}
        <p className="about-bio">
          Full-stack developer & AI enthusiast based in Bengaluru. I specialise in
          React, Next.js, and FastAPI for web apps, Solidity & Hardhat for on-chain
          logic, and Python for AI pipelines. Currently pursuing B.E. in Information
          Science at M.S. Engineering College (2027).
        </p>

        {/* Stats row */}
        <div className="about-stats">
          {stats.map((s) => (
            <div className="about-stat" key={s.label}>
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Core skill tags */}
        <div className="about-tags-row">
          {coreSkills.map((skill) => (
            <span className="about-tag" key={skill}>{skill}</span>
          ))}
        </div>

        {/* Contact pill-links */}
        <div className="about-links">
          <a
            href={`tel:${config.social.phone}`}
            className="about-link-item"
            data-cursor="disable"
          >
            <MdPhone /> {config.social.phone}
          </a>
          <a
            href="https://www.linkedin.com/in/saurabh-kumar-59aa14265"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link-item about-link-highlight"
            data-cursor="disable"
          >
            LinkedIn <MdArrowOutward />
          </a>
          <a
            href="/resume/Saurabh_Kumar_Resume.pdf"
            download="Saurabh_Kumar_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link-item about-link-highlight"
            data-cursor="disable"
          >
            Resume ↓
          </a>
          <span className="about-link-item about-location">
            <MdLocationOn /> {config.social.location}
          </span>
        </div>

      </div>
    </div>
  );
};

export default About;
