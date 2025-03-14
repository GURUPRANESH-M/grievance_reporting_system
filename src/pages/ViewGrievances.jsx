import { useState, useEffect } from "react";

const ViewGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    // Decode token to get user ID
    const decodeToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id; // Assuming your JWT payload contains { id: "user123" }
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    };

    const fetchedUserId = decodeToken(token);
    if (fetchedUserId) {
      setUserId(fetchedUserId);
    }

    fetchGrievances(token);
  }, []);

  const fetchGrievances = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/grievances", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Unauthorized. Please log in.");

      const data = await response.json();
      setGrievances(data);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch(`http://localhost:5000/api/grievances/${id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to upvote grievance");

      const data = await response.json();

      // Update UI to reflect the new upvote count
      setGrievances(grievances.map(g =>
        g._id === id ? { ...g, upvotes: data.upvotes, upvotedBy: data.message === "Upvoted" ? [...g.upvotedBy, userId] : g.upvotedBy.filter(uid => uid !== userId) } : g
      ));
    } catch (error) {
      console.error("Error upvoting grievance:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Grievance List</h2>
      {loading ? <p>Loading...</p> : null}
      {grievances.length === 0 && !loading ? <p>No grievances found.</p> : null}

      {grievances.map((grievance) => {
        const hasUpvoted = grievance.upvotedBy.includes(userId);
        
        return (
          <div key={grievance._id} style={styles.card}>
            <h3>{grievance.title}</h3>
            <p><strong>Category:</strong> {grievance.category}</p>
            <p>{grievance.description}</p>
            {grievance.imageUrl && (
              <img
                src={`http://localhost:5000${grievance.imageUrl}`} 
                alt="Grievance"
                style={styles.image}
              />
            )}
            <p><strong>Upvotes:</strong> {grievance.upvotes}</p>
            <button 
              onClick={() => handleUpvote(grievance._id)}
              style={{ backgroundColor: hasUpvoted ? "green" : "gray", color: "white" }}
            >
              {hasUpvoted ? "Upvoted" : "Upvote"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "20px" },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    marginTop: "10px",
  },
};

export default ViewGrievances;
