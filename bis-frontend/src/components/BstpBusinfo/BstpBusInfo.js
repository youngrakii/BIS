import React from "react";
import "./BstpBusInfo.css";
// 정류장 메세지 띄울 때 쓰는 컴포넌트
const BstpBusInfo = ({ stationInfo }) => {
  if (!stationInfo) {
    stationInfo = {
      stopName: "-",
      bitType: "-",
      nextStop: "-",
    };
  }

  return (
    <div className="station-info-container">
      {/* 정류장 정보 */}
      <div className="info-section">
        <h3>정류장 정보</h3>
        <div className="info-row">
          <span>정류장 명</span>
          <span>{stationInfo.stopName}</span>
        </div>
        <div className="info-row">
          <span>BIT 유형</span>
          <span>{stationInfo.bitType}</span>
        </div>
        <div className="info-row">
          <span>다음 정류장</span>
          <span>{stationInfo.nextStop}</span>
        </div>
      </div>
    </div>
  );
};

export default BstpBusInfo;
