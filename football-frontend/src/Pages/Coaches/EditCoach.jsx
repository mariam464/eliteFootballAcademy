import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditCoach() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coach, setCoach] = useState({
    name: "",
    age: "",
    teamId: null,
    joinDate: "",
    imageUrl: "",
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachRes = await axios.get(`http://localhost:8080/coaches/${id}`);
        const coachData = coachRes.data;

        const teamsRes = await axios.get("http://localhost:8080/teams");
        const allTeams = teamsRes.data;

        const availableTeams = allTeams.filter(
          (team) => !team.coach || team.coach.id === coachData.id
        );

        setCoach(coachData);
        setTeams(availableTeams);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCoach((prev) => ({
      ...prev,
      [name]: name === "teamId" ? (value ? Number(value) : null) : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));

      const fileData = new FormData();
      fileData.append("file", file);

      try {
        const res = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: fileData,
        });

        if (res.ok) {
          const imagePath = await res.text();
          const fullUrl = `http://localhost:8080/${imagePath}`;
          setCoach((prev) => ({ ...prev, imageUrl: fullUrl }));
        } else {
          Swal.fire("Error", "Failed to upload image", "error");
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8080/coaches/update/${id}`, coach)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Coach Updated",
          text: "The coach has been updated successfully.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => navigate(`/coaches/${id}`));
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Something went wrong while updating the coach.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Retry",
        });
      });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Edit Coach</h2>
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
          {(previewImage || coach.imageUrl) && (
            <img
              src={previewImage || coach.imageUrl}
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
