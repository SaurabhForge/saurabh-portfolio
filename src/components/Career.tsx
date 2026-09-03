import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {config.experiences.map((exp, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                  <span className="career-location">{exp.location}</span>
                </div>
                <h3>{exp.period.includes("Present") ? "NOW" : exp.period.split(" - ")[1]}</h3>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="certifications-section">
          <h3 className="cert-title">Certifications</h3>
          <div className="cert-grid">
            {config.certifications.map((cert, index) => (
              <div key={index} className="cert-card">
                <div className="cert-badge">✓</div>
                <div className="cert-info">
                  <h4>{cert.title}</h4>
                  <p>{cert.issuer} · {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
