import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [player, setPlayer] = useState({
    name: "",
    role: "",
    age: "",
    teamId: null,
    imageUrl: "",
    joinDate: "",
    matchesPlayed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/teams")
      .then((res) => setTeams(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/players/${id}`)
      .then((res) => {
        setPlayer(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPlayer((prev) => ({ ...prev, imageUrl: localPreview }));

    const fileData = new FormData();
    fileData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: fileData,
      });
      setUploading(false);

      if (res.ok) {
        const imageUrl = await res.text();
        setPlayer((prev) => ({ ...prev, imageUrl }));
        Swal.fire("Success", "Image uploaded successfully", "success");
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      setUploading(false);
      console.error("Error uploading file:", err);
      Swal.fire("Error", "Something went wrong during upload", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/players/update/${id}`, player)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Player Updated",
          text: "The player has been updated successfully.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => navigate(`/players/${id}`));
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Something went wrong while updating the player.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Retry",
        });
      });
  };
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Edit Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={player.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Role</label>
          <select
            name="role"
            value={player.role}
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
          <label className="block text-gray-700">Team</label>
          <select
            name="teamId"
            value={player.teamId || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Select a team --</option>
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
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={player.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={player.joinDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Matches Played</label>
          <input
            type="number"
            name="matchesPlayed"
            value={player.matchesPlayed}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            min="0"
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
          {player.imageUrl && (
            <img
              src={player.imageUrl}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
