import "./Benefits.css";

import { FaClone, FaHandshake, FaInfinity, FaUsers } from "react-icons/fa";


const Benefits = () => {
  let benefits = [
    {
      icon: <FaClone></FaClone>,
      title: "Replicate Style",
      id: 1,
    },
    {
      icon: <FaUsers></FaUsers>,
      title: "Dedicated Team",
      id: 2,
    },
    {
      icon: <FaInfinity></FaInfinity>,
      title: "Unlimited Redo",

      id: 3,
    },
    {
      icon: <FaHandshake></FaHandshake>,
      title: "Expert Consultation",
      id: 4,
    },
  ];
  const allBenefits = benefits.map((benefit) => {
    return (
      <div className="benefits-item" key={benefit.id}>
        <div className="benefit-icon">{benefit.icon}</div>
        <div className="benefit-text">
          <h3 className="benefit-title">{benefit.title}</h3>
        </div>
      </div>
    );
  });
  return (
    <div className="sub-container main-benefit">
      <div className="benefits">{allBenefits}</div>
    </div>
  );
};
export default Benefits;
