export async function fetchRouteStops(route_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/route/busstops/${route_id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((stop) => ({
      name: stop.bstpNm,
      id: stop.bstpId,
      sqno: stop.pointSqno,
    }));
  } catch (error) {
    console.error("Failed to fetch route stops:", error);
    return [];
  }
}

// 노선의 운행중인 버스들의 지난 정류장 조회(RouteDetailModal에 사용)
export async function fetchRouteBusesWithStops(route_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/route/${route_id}/buses/stops`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((stop) => ({
      id: stop.obuId,
      sqno: stop.pointSqno,
    }));
  } catch (error) {
    console.error("Failed to fetch route stops:", error);
    return [];
  }
}

// 노선의 운영중인 버스 위치 조회
export async function fetchRouteBuses(route_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/simulator/locations/${route_id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((bus) => ({
      obuId: bus.obuId,
      sqno: bus.passagePointSqNo,
    }));
  } catch (error) {
    console.error("Failed to fetch route stops:", error);
    return [];
  }
}

// 정류장 및 버스 도착 정보 조회
export async function fetchStationInfo(stop_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/station/${stop_id}/info`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      stopName: data.bstpNm,
      bitType: data.bitType,
      nextStop: data.nextBstpNm,
      busNumber: data.busNo,
      checkDate: data.checkDate,
      capacity: data.capacity,
      company: data.busCompany,
      arrivals: data.arrivals.map((arrival) => ({
        busNumber: arrival.busNo,
        eta: arrival.eta,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch station info:", error);
    return null;
  }
}
