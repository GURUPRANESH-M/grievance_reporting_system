import { useState, useEffect } from "react";

const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grievances");
        const data = await response.json();
        setGrievances(data);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };

    fetchGrievances();
  }, []);

  return (
    <div>
      <h2>Grievance List</h2>
      {grievances.length === 0 ? (
        <p>No grievances submitted yet.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {grievances.map((grievance) => (
            <li key={grievance._id} style={styles.grievanceItem}>
              <h3>{grievance.title}</h3>
              <p><strong>Category:</strong> {grievance.category}</p>
              <p>{grievance.description}</p>

              {grievance.category === "Campus Environment" && grievance.imageUrl && (
                <img
                  src={grievance.imageUrl}
                  alt="Grievance"
                  style={styles.image}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  grievanceItem: {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    height: "auto",
    marginTop: "10px",
    borderRadius: "5px",
  },
};

export default GrievanceList;
