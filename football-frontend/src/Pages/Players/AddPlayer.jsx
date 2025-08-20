import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddPlayer() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    age: "",
    matchesPlayed: 0,
    joinDate: "",
    teamId: null,
    imageUrl: "",
  });


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://localhost:8080/teams", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch teams: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        alert(
          "Could not load teams. Check backend is running and CORS settings."
        );
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
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

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:8080/players/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Player Added",
        text: `${formData.name} has been added successfully!`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Go to Players",
      }).then(() => navigate("/players"));
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while adding the player.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Retry",
      });
    }
  } catch (err) {
    console.error("Error adding player:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Unable to connect to the server.",
      confirmButtonColor: "#d33",
    });
  }
};

  return (
    <section className="py-14">
      <div className="max-w-lg mx-auto px-4">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Add Player
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg space-y-4"
        >

          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="10"
              max="60"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Matches played
            </label>
            <input
              type="number"
              name="matchesPlayed"
              value={formData.matchesPlayed}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Join Date</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">-- Select Role --</option>
              <option value="GK">GK - Goalkeeper</option>
              <option value="RB">RB - Right Back</option>
              <option value="LB">LB - Left Back</option>
              <option value="CB">CB - Center Back</option>
              <option value="CM">CM - Central Midfielder</option>
              <option value="RM">RM - Right Midfielder</option>
              <option value="LM">LM - Left Midfielder</option>
              <option value="RW">RW - Right Winger</option>
              <option value="LW">LW - Left Winger</option>
              <option value="CF">CF - Center Forward</option>
              <option value="ST">ST - Striker</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Team</label>
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value="">-- Select Team --</option>
              {teams.map((team) => (
                <option
                  key={team.id}
                  value={team.id}
                  disabled={team.players?.length >= 11} 
                >
                  {team.name} ({team.players?.length || 0}/11)
                </option>
              ))}
            </select>

          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/players")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
