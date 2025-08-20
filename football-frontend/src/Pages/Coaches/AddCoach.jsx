import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddCoach() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [coach, setCoach] = useState({
    name: "",
    age: "",
    teamId: null,
    joinDate: "",
    imageUrl: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/teams")
      .then((res) => {
        const unassignedTeams = res.data.filter((team) => !team.coach);
        setTeams(unassignedTeams);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoach((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileData = new FormData();
      fileData.append("file", file);

      try {
        const res = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: fileData,
        });

        if (res.ok) {
          const imageUrl = await res.text();
          setFormData((prev) => ({ ...prev, imageUrl }));
        } else {
          alert("Failed to upload image");
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/coaches/add", coach)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Coach Added",
          text: "The coach has been added successfully.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => navigate("/coaches"));
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Something went wrong while adding the coach.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Retry",
        });
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Add Coach</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={coach.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={coach.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Team</label>
          <select
            name="teamId"
            value={coach.teamId || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Select a team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={coach.joinDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          {coach.imageUrl && (
            <img
              src={coach.imageUrl}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Add Coach
        </button>
      </form>
    </div>
  );
}
