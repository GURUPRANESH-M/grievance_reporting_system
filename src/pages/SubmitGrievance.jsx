import { useState } from "react";

const SubmitGrievance = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal"); // Default category
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Check if file is larger than 2MB
        setMessage("Image size should be less than 2MB.");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to submit a grievance.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: formData, // Send FormData
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Grievance submitted successfully!");
        setTitle("");
        setDescription("");
        setCategory("Personal");
        setImage(null);
        setImagePreview(null);
      } else {
        setMessage(data.error || "Failed to submit grievance.");
      }
    } catch (error) {
      console.error("Error submitting grievance:", error); // Debugging
      setMessage("Error submitting grievance.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Submit a Grievance</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Personal">Personal</option>
          <option value="Campus Environment">Campus Environment</option>
        </select>

        {category === "Campus Environment" && (
          <>
            <label>Attach Image (Max 2MB):</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
            )}
          </>
        )}

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    color: "green",
    fontWeight: "bold",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  imagePreview: {
    width: "100%",
    height: "auto",
    marginTop: "10px",
    borderRadius: "5px",
  },
};

export default SubmitGrievance;
