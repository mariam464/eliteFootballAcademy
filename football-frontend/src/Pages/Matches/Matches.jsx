// src/pages/MatchesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, teamsRes] = await Promise.all([
          axios.get("http://localhost:8080/matches"),
          axios.get("http://localhost:8080/teams"),
        ]);
        setMatches(matchesRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading matches...</p>;

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t.name]));
  const upcomingMatches = matches.filter((m) => m.upcoming);
  const pastMatches = matches.filter((m) => !m.upcoming);

  const handleDelete = async (matchId) => {
    try {
      await axios.delete(`http://localhost:8080/matches/delete/${matchId}`);
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      Swal.fire("Deleted!", "The match has been deleted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete the match.", "error");
    }
  };

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Matches</h2>
        <button
          onClick={() => navigate("/matches/add")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Match
        </button>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Upcoming Matches
        </h3>
        {upcomingMatches.length === 0 ? (
          <p>No upcoming matches.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {upcomingMatches.map((match) => (
              <li
                key={match.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="text-gray-600 text-sm">
                    {new Date(match.date).toLocaleString()}
                  </p>
                  <p className="text-gray-800 font-semibold mt-1">
                    {teamMap[match.homeTeamId] || "Unknown Home Team"} vs{" "}
                    {match.awayTeamName}
                  </p>
                  <p className="text-gray-600 mt-1">{match.location}</p>
                </div>
                <button
                  onClick={() => navigate(`/matches/${match.id}/reserve`)}
                  className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Reserve Ticket
                </button>
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Are you sure?",
                      text: "This action cannot be undone!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) handleDelete(match.id);
                    })
                  }
                  className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Past Matches</h3>
        {pastMatches.length === 0 ? (
          <p>No past matches.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {pastMatches.map((match) => (
              <li
                key={match.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="text-gray-600 text-sm">
                    {new Date(match.date).toLocaleString()}
                  </p>
                  <p className="text-gray-800 font-semibold mt-1">
                    {teamMap[match.homeTeamId] || "Unknown Home Team"}{" "}
                    {match.home_team_score} - {match.away_team_score}{" "}
                    {match.awayTeamName}
                  </p>
                  <p className="text-gray-600 mt-1">{match.location}</p>
                </div>
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Are you sure?",
                      text: "This action cannot be undone!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) handleDelete(match.id);
                    })
                  }
                  className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
