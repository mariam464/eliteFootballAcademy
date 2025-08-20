import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [freeCoaches, setFreeCoaches] = useState([]);
  const [freePlayers, setFreePlayers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    coachId: null,
    playerIds: [],
    homeMatchIds: [],
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/teams/${id}`).then((res) => {
      const t = res.data;
      setTeam(t);
      setForm({
        name: t.name || "",
        imageUrl: t.imageUrl || "",
        coachId: t.coach ? t.coach.id : null,
        playerIds: t.players ? t.players.map((p) => p.id) : [],
      });
    });

    axios
      .get("http://localhost:8080/players/free")
      .then((res) => setFreePlayers(res.data));
    axios
      .get("http://localhost:8080/coaches/free")
      .then((res) => setFreeCoaches(res.data));
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageUrl: localPreview }));

    const fileData = new FormData();
    fileData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: fileData,
      });

      if (res.ok) {
        const uploadedImageUrl = await res.text();
        setForm((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      Swal.fire("Error", "Something went wrong during upload", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .patch(`http://localhost:8080/teams/update/${id}`, form)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Team Updated",
          text: "The team has been updated successfully.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => navigate(`/teams/${id}`));
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Something went wrong while updating the team.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Retry",
        });
      });
  };

  const togglePlayer = (playerId) => {
    setForm((prev) => {
      const exists = prev.playerIds.includes(playerId);
      return {
        ...prev,
        playerIds: exists
          ? prev.playerIds.filter((id) => id !== playerId)
          : [...prev.playerIds, playerId],
      };
    });
  };

  if (!team) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Edit Team: {team.name}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Team Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Current Coach</label>
          {team.coach ? (
            <p className="p-2 bg-gray-100 rounded">{team.coach.name}</p>
          ) : (
            <p className="italic text-gray-500">No coach assigned</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Replace with Free Coach
          </label>
          <select
            value={form.coachId || ""}
            onChange={(e) =>
              setForm({
                ...form,
                coachId: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="border p-2 w-full rounded"
          >
            <option value="">-- Keep current / Replace--</option>
            {freeCoaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Players</label>

          <p className="mb-1 font-semibold">Current:</p>
          {team.players.length > 0 ? (
            team.players.map((p) => (
              <label key={p.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.playerIds.includes(p.id)}
                  onChange={() => togglePlayer(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))
          ) : (
            <p className="italic text-gray-500">No players assigned</p>
          )}

          <p className="mt-3 mb-1 font-semibold">Free Players:</p>
          {freePlayers.map((p) => (
            <label key={p.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.playerIds.includes(p.id)}
                onChange={() => togglePlayer(p.id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg shadow"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
