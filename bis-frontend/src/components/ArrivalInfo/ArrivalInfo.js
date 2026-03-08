import React from "react";
import "./ArrivalInfo.css";
// 정류장 메세지 띄울 때 쓰는 컴포넌트
const ArrivalInfo = ({ arrivalInfo }) => {
  if (!arrivalInfo) {
    return <p className="loading-text">정보를 불러오는 중...</p>;
  }

  return (
    <div className="station-info-container">
      {/* 도착 예정 정보 */}
      <div className="info-section">
        <h3>도착예정정보</h3>
        {arrivalInfo.arrivals.map((arrival, index) => (
          <div className="info-row" key={index}>
            <span>{arrival.busNumber}번</span>
            <span>{arrival.eta}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrivalInfo;
