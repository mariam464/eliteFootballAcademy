import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function AddTeam() {
  const navigate = useNavigate();
  const [team, setTeam] = useState({
    name: "",
    coachId: "",
    playerIds: [],
    imageUrl: "",
  });
  const [freePlayers, setFreePlayers] = useState([]);
  const [unassignedCoaches, setUnassignedCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/players/free"),
      axios.get("http://localhost:8080/coaches/free"),
    ])
      .then(([playersRes, coachesRes]) => {
        setFreePlayers(playersRes.data);
        setUnassignedCoaches(coachesRes.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setTeam((prev) => ({ ...prev, imageUrl: localPreview }));

    const fileData = new FormData();
    fileData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: fileData,
      });

      if (res.ok) {
        const uploadedImageUrl = await res.text();
        setTeam((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
        Swal.fire("Success", "Image uploaded successfully", "success");
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      Swal.fire("Error", "Something went wrong during upload", "error");
    }
  };

  const handlePlayerSelect = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setTeam((prev) => ({ ...prev, playersIds: options }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: team.name,
      coachId: team.coachId || null,
      playersIds: team.playersIds,
      imageUrl: team.imageUrl,
    };

    axios
      .post("http://localhost:8080/teams/add", payload)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Team Added ",
          text: "Your team has been added successfully!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => navigate("/teams"));
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add team. Please try again.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Retry",
        });
      });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Add Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Team Name</label>
          <input
            type="text"
            name="name"
            value={team.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Coach</label>
          <select
            name="coachId"
            value={team.coachId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Select Coach --</option>
            {unassignedCoaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Players</label>
          <select
            multiple
            name="playersIds"
            value={team.playersIds}
            onChange={handlePlayerSelect}
            className="w-full px-4 py-2 border rounded-lg h-32"
          >
            {freePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.role})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">
            Hold Ctrl (Windows) or Command (Mac) to select multiple players
          </p>
        </div>

        <div>
          <label className="block text-gray-700">Upload Logo</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {team.imageUrl && (
            <img
              src={team.imageUrl}
              alt="Team Logo"
              className="mt-3 w-32 h-32 object-cover rounded-lg shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Add Team
        </button>
      </form>
    </div>
  );
}
