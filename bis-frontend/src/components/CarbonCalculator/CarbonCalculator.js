import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./CarbonCalculator.css";

const CarbonCalculator = ({ markers }) => {
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [distance, setDistance] = useState(0);
    const [busEmission, setBusEmission] = useState(0);
    const [carEmission, setCarEmission] = useState(0);
    const [savedEmission, setSavedEmission] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const chartRef = useRef(null);

    const calculateDistance = (coord1, coord2) => {
        const R = 6371; // Earth radius in km
        const toRad = (value) => (value * Math.PI) / 180;

        const dLat = toRad(coord2.lat - coord1.lat);
        const dLon = toRad(coord2.lng - coord1.lng);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coord1.lat)) *
            Math.cos(toRad(coord2.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    useEffect(() => {
        if (startStation && endStation) {
            const coord1 = { lat: startStation.ycord, lng: startStation.xcord };
            const coord2 = { lat: endStation.ycord, lng: endStation.xcord };

            const calculatedDistance = calculateDistance(coord1, coord2);
            setDistance(calculatedDistance);

            const busEmissionValue = (calculatedDistance * 0.12).toFixed(2);
            const carEmissionValue = (calculatedDistance * 0.24).toFixed(2);

            setBusEmission(busEmissionValue);
            setCarEmission(carEmissionValue);
            setSavedEmission((carEmissionValue - busEmissionValue).toFixed(2));
        }
    }, [startStation, endStation]);

    useEffect(() => {
        if (distance > 0) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const ctx = document.getElementById("emissionChart").getContext("2d");
            chartRef.current = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["자동차", "버스"],
                    datasets: [
                        {
                            label: "탄소 배출량 (kg CO₂)",
                            data: [parseFloat(carEmission), parseFloat(busEmission)],
                            backgroundColor: ["#FF6B6B", "#1E90FF"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                },
            });
        }
    }, [busEmission, carEmission]);

    return (
        <div className="carbon-calculator-wrapper">
            <button
                onClick={() => setIsVisible(!isVisible)}
                style={{ marginBottom: "15px", padding: "10px 20px", backgroundColor: "#2E8B57", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                탄소 배출량 계산기
            </button>

            {isVisible && (
                <div className="carbon-calculator" style={{ width: "350px", padding: "20px", backgroundColor: "#f9f9f9" }}>
                    <h3 style={{ color: "#2E8B57", textAlign: "center", fontSize: "1.5rem", marginBottom: "15px" }}>탄소 배출량 계산기</h3>
                    <div className="station-selector">
                        <label style={{ color: "#555", fontWeight: "bold" }}>출발 정류장:</label>
                        <select
                            onChange={(e) =>
                                setStartStation(markers.find((m) => m.bstpNm === e.target.value))
                            }>
                            <option value="">출발 정류장 선택</option>
                            {markers.map((marker, index) => (
                                <option key={index} value={marker.bstpNm}>
                                    {marker.bstpNm}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="station-selector">
                        <label style={{ color: "#555", fontWeight: "bold" }}>도착 정류장:</label>
                        <select
                            onChange={(e) =>
                                setEndStation(markers.find((m) => m.bstpNm === e.target.value))
                            }>
                            <option value="">도착 정류장 선택</option>
                            {markers.map((marker, index) => (
                                <option key={index} value={marker.bstpNm}>
                                    {marker.bstpNm}
                                </option>
                            ))}
                        </select>
                    </div>

                    {distance > 0 && (
                        <>
                            <p style={{ color: "#4B0082", fontWeight: "bold" }}>거리: {distance} km</p>
                            <p style={{ color: "#FF4500", fontWeight: "bold" }}>자동차 배출량: {carEmission} kg CO₂</p>
                            <p style={{ color: "#1E90FF", fontWeight: "bold" }}>버스 배출량: {busEmission} kg CO₂</p>
                            <canvas id="emissionChart" width="400" height="200"></canvas>
                            <p style={{ color: "#2E8B57", fontWeight: "bold", marginTop: "15px", textAlign: "center", fontSize: "1.2rem" }}>절약: {savedEmission} kg CO₂</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CarbonCalculator;
