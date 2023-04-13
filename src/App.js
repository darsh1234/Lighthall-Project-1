import React, { useState, useEffect } from "react";
import { isMobileOnly } from "react-device-detect";

function App() {
  const [clicks, setClicks] = useState(
    JSON.parse(localStorage.getItem("clicks")) || {}
  );
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    if (isMobileOnly) {
      // Mobile devices may not have a reliable IP address, so we skip the detection
      return;
    }

    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setUserCountry(data.country_name);
      })
      .catch((error) => {
        console.error("Error fetching user country:", error);
      });
  }, []);

  const handleClick = () => {
    const country = userCountry || "Unknown"; // Use the detected country or fallback to "Unknown"
    setClicks((prevClicks) => {
      const newClicks = { ...prevClicks };
      newClicks[country] = (newClicks[country] || 0) + 1;
      localStorage.setItem("clicks", JSON.stringify(newClicks));
      return newClicks;
    });
  };

  return (
    <div>
      <h1>Click Counter</h1>
      <p>Click count: {Object.values(clicks).reduce((a, b) => a + b, 0)}</p>
      <button onClick={handleClick}>Click me</button>
      <h2>Geographic Distribution of Clicks</h2>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Click Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(clicks).map(([country, count]) => (
            <tr key={country}>
              <td>{country}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
