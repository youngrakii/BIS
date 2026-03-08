import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="home-icon" onClick={() => navigate("/")}>
        <span>🏠</span> {/* 홈 아이콘 */}
      </div>
      <h1>군산시 버스정보시스템</h1>
    </header>
  );
};

export default Header;
