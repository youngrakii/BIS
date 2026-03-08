import React, { useEffect, useState, useRef } from "react";
import "./SimulatorForm.css";
import busIcon from "../../images/bus_icon.png";

const SimulatorForm = ({ map }) => {
  const routeMapping = {
    1: "307000010",
    2: "307000020",
    3: "307000030",
    4: "307000070",
    5: "307000080",
    6: "307000090",
    7: "307000100",
    8: "307000110",
    9: "307000120",
    10: "307000130",
  };

  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedRouteName, setSelectedRouteName] =
    useState("노선을 선택하세요");
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [selectedBusName, setSelectedBusName] = useState("버스를 선택하세요");

  const [routeVertices, setRouteVertices] = useState([]);
  const busMarkerRef = useRef(null);
  // const busMarkerRef = useRef([]); // 마커 여러개
  const polylineRef = useRef(null); // Polyline 객체 참조
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!selectedRoute) return;

    console.log("Fetching buses for route:", selectedRoute);
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/simulator/buses/${selectedRoute}`
    )
      .then((response) => response.json())
      .then((data) => {
        setBuses(data);
      })
      .catch((error) => console.error("Error fetching buses:", error));
  }, [selectedRoute]);

  const startSimulation = async () => {
    if (!selectedRoute || !selectedBus) {
      alert("노선과 버스를 선택해주세요.");
      return;
    }

    try {
      console.log(
        "Starting simulation with route:",
        selectedRoute,
        "bus:",
        selectedBus
      );
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/simulator/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeId: selectedRoute, obuId: selectedBus }),
        }
      );

      const data = await response.json();
      console.log("Simulation started, route vertices:", data.vertices);
      setRouteVertices(data.vertices);

      const path = data.vertices.map(
        (vertex) => new window.kakao.maps.LatLng(vertex.ycord, vertex.xcord)
      );

      if (polylineRef.current) {
        polylineRef.current.setMap(null); // 기존 Polyline 제거
      }

      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polyline.setMap(map);
      polylineRef.current = polyline;

      console.log("Polyline set on map:", path);

      const firstVertex = data.vertices[0];
      const initialPosition = new window.kakao.maps.LatLng(
        firstVertex.ycord,
        firstVertex.xcord
      );

      if (!busMarkerRef.current) {
        busMarkerRef.current = new window.kakao.maps.Marker({
          position: initialPosition,
          map: map,
          image: new window.kakao.maps.MarkerImage(
            busIcon,
            new window.kakao.maps.Size(40, 40),
            { offset: new window.kakao.maps.Point(20, 20) }
          ),
        });
      } else {
        busMarkerRef.current.setPosition(initialPosition);
      }

      console.log("Bus marker initialized at position:", initialPosition);
      startLiveUpdate();
    } catch (error) {
      console.error("Error starting simulation:", error);
    }
  };

  const startLiveUpdate = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      try {
        console.log("Fetching live location for route:", selectedRoute);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/simulator/locations/${selectedRoute}`
        );
        const locations = await response.json();
        console.log("locations:", locations);
        console.log("selectedbus:", selectedBus);
        console.log("selectedBusName:", selectedBusName);

        if (locations.length > 0) {
          const targetLocation = locations.find(
            (location) => location.obuId === selectedBus
          );
          const xCord = targetLocation["xcord"];
          const yCord = targetLocation["ycord"];
          console.log("Live location received:", { xCord, yCord });

          const newPosition = new window.kakao.maps.LatLng(yCord, xCord);
          if (busMarkerRef.current) {
            busMarkerRef.current.setPosition(newPosition);
          } else {
            console.error("Bus marker reference is null.");
          }
        } else {
          console.warn("No location data received.");
        }
      } catch (error) {
        console.error("Error updating bus location:", error);
      }
    }, 5000);
  };

  const stopSimulation = () => {
    clearInterval(intervalRef.current);

    if (busMarkerRef.current) {
      busMarkerRef.current.setMap(null);
      busMarkerRef.current = null;
    }

    if (polylineRef.current) {
      polylineRef.current.setMap(null); // Polyline 제거
      polylineRef.current = null;
    }

    console.log("Simulation stopped, cleared polyline and marker.");
    setRouteVertices([]);
    alert("운행이 종료되었습니다.");
  };

  return (
    <div className="bus-form-container">
      <h2 className="bus-form-title">버스 시뮬레이터</h2>
      <div className="bus-form-field">
        <label className="bus-form-label">노선 번호</label>
        <select
          className="bus-form-select"
          value={selectedRoute}
          onChange={(e) => {
            setSelectedRoute(routeMapping[e.target.value]);
            setSelectedRouteName(`${e.target.value}번 노선`);
          }}>
          <option value="">{selectedRouteName}</option>
          {Object.keys(routeMapping).map((route) => (
            <option key={route} value={route}>
              {route}번 노선
            </option>
          ))}
        </select>
      </div>
      <div className="bus-form-field">
        <label className="bus-form-label">버스 번호</label>
        <select
          className="bus-form-select"
          value={selectedBus}
          onChange={(e) => {
            const selected = buses.find((bus) => bus.obuId === e.target.value);
            setSelectedBus(e.target.value);
            setSelectedBusName(selected ? selected.busNo : "버스를 선택하세요");
          }}>
          <option value="">{selectedBusName}</option>
          {buses.map((bus) => (
            <option key={bus.obuId} value={bus.obuId}>
              {bus.busNo}
            </option>
          ))}
        </select>
      </div>
      <div className="bus-form-button-container">
        <button className="bus-form-button start" onClick={startSimulation}>
          운행 시작
        </button>
        <button className="bus-form-button stop" onClick={stopSimulation}>
          운행 종료
        </button>
      </div>
    </div>
  );
};

export default SimulatorForm;
