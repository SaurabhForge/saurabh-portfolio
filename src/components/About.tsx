import "./styles/About.css";
import { config } from "../config";
import { MdArrowOutward, MdPhone, MdLocationOn } from "react-icons/md";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description}
        </p>
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
          <span className="about-link-item about-location">
            <MdLocationOn /> {config.social.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;
