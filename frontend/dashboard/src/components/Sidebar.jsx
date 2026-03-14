import React from "react";

function Sidebar({ setPage }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>SmartSimulation</h2>

      <ul style={styles.menu}>
        <li onClick={() => setPage("dashboard")}>Dashboard</li>

        <li onClick={() => setPage("prediction")}>Prediction</li>
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1e293b",
    color: "white",
    padding: "20px",
    position: "fixed",
  },

  title: {
    marginBottom: "30px",
  },

  menu: {
    listStyle: "none",
    padding: 0,
    lineHeight: "40px",
    cursor: "pointer",
  },
};

export default Sidebar;
