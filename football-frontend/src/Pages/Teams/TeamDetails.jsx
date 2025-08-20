import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/teams/${id}`)
      .then((res) => setTeam(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!team) return <p className="text-center mt-10">Loading...</p>;
   
  const today = new Date();
  const upcomingMatches = team.homeMatches.filter(
    (match) => new Date(match.date) >= today
  );
  const pastMatches = team.homeMatches.filter(
    (match) => new Date(match.date) < today
  );

    const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/teams/delete/${id}`);
      Swal.fire("Deleted!", "The Team has been deleted.", "success");
      navigate("/teams");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete the Team.", "error");
    }
  };

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 text-center">
        <div className="max-w-xl mx-auto">
          <h3 className="text-white text-3xl font-semibold sm:text-4xl">
            {team.name}
          </h3>
          <p className="text-white mt-3">
            Meet our coach and amazing players who bring {team.name} to life.
          </p>
        </div>

        
        {team.coach && (
          <div className="mt-12 flex justify-center">
            <div className="max-w-xs bg-white shadow-lg rounded-lg p-6 text-center">
              <img
                src={team.coach.imageUrl}
                className="w-32 h-32 mx-auto rounded-full object-cover"
                alt={team.coach.name}
              />
              <h4 className="text-gray-700 font-semibold sm:text-xl mt-4">
                {team.coach.name}
              </h4>
              <p className="text-yellow-700">Head Coach</p>
              <p className="text-gray-600 mt-2">
                Age: {team.coach.age}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Players Grid */}
        <div className="mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {team.players.map((player, idx) => (
              <li key={idx}>
                <div className="max-w-xs bg-white shadow rounded-lg p-4 text-center mx-auto">
                  <div className="w-24 h-24 mx-auto">
                    <img
                      src={player.imageUrl}
                      className="w-full h-full rounded-full object-cover"
                      alt={player.name}
                    />
                  </div>
                  <h4 className="text-gray-700 font-semibold sm:text-lg mt-2">
                    {player.name}
                  </h4>
                  <p className="text-yellow-700">{player.role}</p>
                  <p className="text-gray-600 mt-2">
                    {player.age ? `Age: ${player.age}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Upcoming Matches
        </h3>
        {upcomingMatches.length === 0 ? (
          <p className="text-white">No upcoming matches.</p>
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
                    {match.homeTeamName} vs {match.awayTeamName}
                  </p>
                  <p className="text-gray-600 mt-1">{match.location}</p>
                </div>
                <button
                  onClick={() => navigate(`/matches/${match.id}/reserve`)}
                  className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Reserve Ticket
                </button>
         
              </li>
            ))}
          </ul>
        )}
      </div>

      
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Past Matches
        </h3>
        {pastMatches.length === 0 ? (
          <p className="text-white">No past matches.</p>
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
                    {match.homeTeamName} {match.homeTeamScore} - {match.awayTeamScore} {match.awayTeamName}
                  </p>
                  <p className="text-gray-600 mt-1">{match.location}</p>
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>

        
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/teams/${id}/edit`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit Team
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
                                  if (result.isConfirmed) handleDelete(id);
                                })}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Team
          </button>
        </div>
      </div>
    </section>
  );
}
