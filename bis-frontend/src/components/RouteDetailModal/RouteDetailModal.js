import React, { useEffect, useState } from "react";
import {
  fetchRouteStops,
  fetchRouteBusesWithStops,
  fetchRouteBuses,
} from "../../utils/routeApi";
import BstpBusInfo from "../BstpBusinfo/BstpBusInfo"; // 정류장 및 버스 정보 컴포넌트 import
import ArrivalInfo from "../ArrivalInfo/ArrivalInfo"; // 정류장 및 버스 정보 컴포넌트 import
import "./RouteDetailModal.css";
import busIcon from "../../images/bus_icon.png";

const RouteDetailModal = ({ routeId, routeNumber, onClose }) => {
  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState({
    start: "",
    middle: "",
    end: "",
  });
  const [lastStopSqno, setLastStopSqno] = useState(null); // 마지막 정류장의 sqno
  const [stationInfo, setStationInfo] = useState(null); // 정류장 정보
  const [arrivalInfo, setArrivalInfo] = useState(null); // 도착 예정 정보
  const [selectedStop, setSelectedStop] = useState(null); // 선택된 정류장 정보
  const [buses, setBuses] = useState([]); // 노선의 버스 정보들

  const mockArrivalInfo = {
    arrivals: [
      { busNumber: "전북71자 1006", eta: "2분" },
      { busNumber: "전북71자 2002", eta: "3분" },
    ],
  };

  useEffect(() => {
    let intervalId;

    if (routeId) {
      const fetchData = () => {
        fetchRouteStops(routeId).then((stopsData) => {
          const start = stopsData[0]?.name || "";
          const end = stopsData[stopsData.length - 1]?.name || "";
          const middle =
              stopsData[Math.floor(stopsData.length / 2)]?.name || "";
          setRouteInfo({ start, middle, end });
          setStops(stopsData);

          const lastSqno = stopsData[stopsData.length - 1]?.sqno; // 마지막 정류장의 sqno 설정
          setLastStopSqno(lastSqno);

          // 첫 번째 정류장을 기본 선택
          if (stopsData.length > 0) {
            setSelectedStop(stopsData[0]);
          }

          fetchRouteBuses(routeId).then((busesData) => {
            const updatedBuses = busesData.map((bus) => {
              const closestStop = stopsData.reduce((prev, curr) =>
                  Math.abs(curr.sqno - bus.sqno) < Math.abs(prev.sqno - bus.sqno)
                      ? curr
                      : prev
              );
              return {
                ...bus,
                sqno: closestStop.sqno,
              };
            });

            setBuses(updatedBuses);
          });
        });
      };

      fetchData();

      intervalId = setInterval(fetchData, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [routeId]);

  const chunkedStops = [];
  for (let i = 0; i < stops.length; i += 8) {
    const stopGroup = stops.slice(i, i + 8);
    chunkedStops.push((i / 8) % 2 === 1 ? stopGroup.reverse() : stopGroup);
  }

  const handleStopClick = (stop) => {
    setSelectedStop(stop);

    const currentStopIndex = stops.findIndex((s) => s.sqno === stop.sqno);
    const currentStop = stops[currentStopIndex];
    const nextStop = stops[currentStopIndex + 1] || null;

    setStationInfo({
      stopName: currentStop.name,
      bitType: currentStop.bitType || "LCD",
      nextStop: nextStop ? nextStop.name : "없음",
    });

    setArrivalInfo(mockArrivalInfo);
  };

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-body">
            <div className="modal-header">
              {routeNumber}번 노선
              <button className="close-button" onClick={onClose}>
                닫기
              </button>
            </div>

            <div className="content-container">
              <div className="route-map">
                <div className="route-path-info">
                  <span>{routeInfo.start}</span> &gt; <span>{routeInfo.middle}</span> &gt; <span>{routeInfo.end}</span>
                </div>
                {chunkedStops.map((stopGroup, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="route-line"
                        style={{ justifyContent: groupIndex % 2 === 0 ? "flex-start" : "flex-end" }}
                    >
                      {stopGroup.map((stop, index) => (
                          <React.Fragment key={index}>
                            <div
                                className="stop-group"
                                onClick={() => handleStopClick(stop)}
                                style={{ cursor: "pointer" }}
                            >
                              <div className="stop">
                                <div className="stop-circle"></div>
                                <span className="stop-name">{stop.name}</span>
                                {buses.some((bus) => bus.sqno === stop.sqno) && (
                                    <div className="bus-icon">
                                      <img
                                          src={busIcon}
                                          alt="Bus"
                                          className="bus-image"
                                      />
                                    </div>
                                )}
                              </div>
                              {index < stopGroup.length - 1 && <div className="route-line-connector"></div>}
                            </div>
                          </React.Fragment>
                      ))}
                    </div>
                ))}
              </div>

              <div className="station-info-panel">
                <BstpBusInfo stationInfo={stationInfo} />
                {arrivalInfo && <ArrivalInfo arrivalInfo={arrivalInfo} />}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RouteDetailModal;
