import React from "react";

function KPICards() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>Traffic Flow</h3>
        <p>320 vehicles/hr</p>
      </div>

      <div style={styles.card}>
        <h3>PM2.5 Level</h3>
        <p>85 µg/m³</p>
      </div>

      <div style={styles.card}>
        <h3>Air Quality</h3>
        <p>Unhealthy</p>
      </div>

      <div style={styles.card}>
        <h3>Model Accuracy</h3>
        <p>82%</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
  },
};

export default KPICards;
