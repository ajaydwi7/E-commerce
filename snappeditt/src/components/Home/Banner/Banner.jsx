import Video from "@/assets/video/SE-video.mp4";
import { useEffect, useState } from "react";
import "./Banner.css";
import { Link } from "react-router-dom";

const Banner = () => {
  const [text, setText] = useState("Edited"); // Initialize state for text


  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => (prev === "Edited" ? "Retouched" : "Edited")); // Toggle text
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="sub-container">
      <div className="banner">
        <div className="banner-text">
          <h1>
            Get Professionally <br />
            <span className="text">{text} </span> <br />
            Images without any Compromise
          </h1>
          <span className="is-buy-now">
            <button className="btn-rounded buy-now mb-4">
              <Link to={"/register"}>
                Get Started</Link></button>
          </span>
        </div>
        <div className="subject">
          <video className="banner-video" src={Video} preload="none" autoPlay loop muted />
        </div>
      </div>
    </div>
  );
};
export default Banner;
