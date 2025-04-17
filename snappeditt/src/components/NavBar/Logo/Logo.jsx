import { Link } from "react-router-dom";
import logo from "@/assets/images/SE-1.png";
import "./Logo.css"

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/">
        <img src={logo || "/placeholder.svg"} alt="SnappEditt" loading="lazy" />
      </Link>
    </div>
  );
};

export default Logo;
