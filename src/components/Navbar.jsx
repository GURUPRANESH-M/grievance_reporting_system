import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("token"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Grievance System</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/submit" style={styles.link}>Submit Grievance</Link>
        <Link to="/view" style={styles.link}>View Grievances</Link>

        {!user ? (
          <>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/login" style={styles.link}>Login</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
  },
  logo: { margin: 0 },
  links: { display: "flex", gap: "15px" },
  link: { color: "white", textDecoration: "none", fontSize: "16px" },
  button: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Navbar;
