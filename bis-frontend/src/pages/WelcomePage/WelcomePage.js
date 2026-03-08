import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./WelcomePage.css"; // 스타일링을 위한 CSS 파일

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="welcome-page">
      <Header />
      <div className="button-container">
        <button onClick={() => handleNavigation("/simulator")}>
          시뮬레이터
        </button>
        <button onClick={() => navigate("/route-details")}>
          노선 선택 및 상세
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
