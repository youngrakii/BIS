import React, { useEffect, useRef } from "react";
import "./RouteMap.css";

export default function RouteMap({ routes }) {
  const mapRef = useRef(null);
  const mapObjectsRef = useRef({
    polylines: [],
    markers: [],
    infoWindows: [],
  });

  const clearMapObjects = React.useCallback(() => {
    mapObjectsRef.current.polylines.forEach((polyline) =>
        polyline.setMap(null)
    );
    mapObjectsRef.current.markers.forEach((marker) => marker.setMap(null));
    mapObjectsRef.current.infoWindows.forEach((infoWindow) =>
        infoWindow.close()
    );

    mapObjectsRef.current = {
      polylines: [],
      markers: [],
      infoWindows: [],
    };
  }, []);

  const updateRoutes = React.useCallback(() => {
    if (!mapRef.current) return;

    clearMapObjects();

    const colors = [
      "#FF0000",
      "#0000FF",
      "#008000",
      "#FFA500",
      "#800080",
      "#00FFFF",
      "#FFC0CB",
      "#808080",
      "#FFFF00",
      "#8B4513",
    ];

    routes.forEach((route, index) => {
      const color = colors[index % colors.length];

      // 버스 경로 표시
      if (route.vertices && route.vertices.length > 0) {
        const path = route.vertices.map(
            (vertex) => new window.kakao.maps.LatLng(vertex.ycord, vertex.xcord)
        );

        const polyline = new window.kakao.maps.Polyline({
          path,
          strokeWeight: 5,
          strokeColor: color,
          strokeOpacity: 0.7,
          strokeStyle: "solid",
        });

        polyline.setMap(mapRef.current);
        mapObjectsRef.current.polylines.push(polyline);
      }

      // 버스 정류장 마커 및 InfoWindow 설정
      if (route.busStops && route.busStops.length > 0) {
        route.busStops.forEach((stop) => {
          const position = new window.kakao.maps.LatLng(stop.ycord, stop.xcord);

          // SVG 아이콘 정의 추가
          const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" fill="#4B89DC" rx="4"/>
                                    <text x="12" y="16.5" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">B</text>
                                    </svg>`;
          const encodedSvg = btoa(svgString);

// 마커 이미지 생성
          const busStopImage = new window.kakao.maps.MarkerImage(
              `data:image/svg+xml;base64,${encodedSvg}`,
              new window.kakao.maps.Size(20, 20), // 아이콘 크기 조정
              {
                offset: new window.kakao.maps.Point(14, 14)
              }
          );

// 커스텀 이미지를 적용한 마커 생성
          const marker = new window.kakao.maps.Marker({
            position,
            image: busStopImage,  // 커스텀 이미지 적용
            map: mapRef.current,
          });


          // InfoWindow에 정류장명 및 도착 예정 정보 표시
          const infowindowContent = `
  <div style="padding:15px; font-size:12px; line-height:1.8; width:250px;">
    <strong>정류장:</strong> ${stop.bstpNm} <br/>
    <strong>도착 예정:</strong>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      ${
              stop.arrivals && stop.arrivals.length > 0
                  ? stop.arrivals
                      .map(
                          (arrival) => `
                  <div style="display: flex; justify-content: space-between;">
                    <span>${arrival.busNumber}번</span>
                    <span>${arrival.eta}</span>
                  </div>`
                      )
                      .join("")
                  : `
            <div style="display: flex; justify-content: space-between;">
              <span>전북71자 1006</span>2분 후 도착</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>전북71자 2002</span>3분 후 도착</span>
            </div>`
          }
    </div>
  </div>
`;


          const infowindow = new window.kakao.maps.InfoWindow({
            content: infowindowContent,
            removable: false,
          });

          window.kakao.maps.event.addListener(marker, "mouseover", () =>
              infowindow.open(mapRef.current, marker)
          );
          window.kakao.maps.event.addListener(marker, "mouseout", () =>
              infowindow.close()
          );

          mapObjectsRef.current.markers.push(marker);
          mapObjectsRef.current.infoWindows.push(infowindow);
        });
      }
    });
  }, [routes, clearMapObjects]);

  const initializeMap = React.useCallback(() => {
    window.kakao.maps.load(() => {
      if (!mapRef.current) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(35.9259206, 126.6156607),
          level: 7,
        };
        mapRef.current = new window.kakao.maps.Map(container, options);
      }
      updateRoutes();
    });
  }, [updateRoutes]);

  useEffect(() => {
    if (!window.kakao) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => initializeMap();
    } else {
      initializeMap();
    }

    return () => {
      clearMapObjects();
    };
  }, [initializeMap, clearMapObjects]);

  useEffect(() => {
    if (!mapRef.current) return;
    updateRoutes();
  }, [updateRoutes]);

  return <div id="map" className="route-map"></div>;
}
