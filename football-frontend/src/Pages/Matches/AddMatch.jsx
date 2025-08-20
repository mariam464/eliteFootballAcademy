import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function AddMatch() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState({
    date: "",
    location: "",
    homeTeamId: "",
    awayTeamName: "",
    home_team_score: 0,
    away_team_score: 0,
    isUpcoming: true,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/teams")
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setMatch((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  axios
    .post("http://localhost:8080/matches/add", match)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Match Added",
        text: "The match has been added successfully.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      }).then(() => navigate("/matches"));
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while adding the match.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Retry"
      });
    });
};

  if (loading) return <p className="text-center mt-10">Loading teams...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Add Match</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={match.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={match.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Home Team</label>
          <select
            name="homeTeamId"
            value={match.homeTeamId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select Home Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Away Team Name</label>
          <input
            type="text"
            name="awayTeamName"
            value={match.awayTeamName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Home Team Score</label>
            <input
              type="number"
              name="home_team_score"
              value={match.home_team_score}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Away Team Score</label>
            <input
              type="number"
              name="away_team_score"
              value={match.away_team_score}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Add Match
        </button>
      </form>
    </div>
  );
}
