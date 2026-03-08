import React from "react";
import "./BusInfo.css";
// 정류장 메세지 띄울 때 쓰는 컴포넌트

const BusInfo = ({ busInfo }) => {
  if (!busInfo) {
    busInfo = {
      busNumber: "-",
      // checkDate: "-",
      // capacity: "-",
      // company: "-",
    };
  }

  return (
    <div className="station-info-container">
      {/* 버스 정보 */}
      <div className="info-section">
        <h3>버스 정보</h3>
        <div className="info-row">
          <span>버스 번호</span>
          <span>{busInfo.busNumber}</span>
        </div>
        {/* <div className="info-row">
          <span>점검 일자</span>
          <span>{busInfo.checkDate}</span>
        </div>
        <div className="info-row">
          <span>승차 정원</span>
          <span>{busInfo.capacity}</span>
        </div>
        <div className="info-row">
          <span>버스 회사</span>
          <span>{busInfo.company}</span>
        </div> */}
      </div>
    </div>
  );
};

export default BusInfo;
