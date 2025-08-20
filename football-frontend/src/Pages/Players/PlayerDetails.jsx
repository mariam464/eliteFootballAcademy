import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/players/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Player not found");
        return res.json();
      })
      .then((playerData) => {
        setPlayer(playerData);
        if (playerData.teamId) {
          fetch(`http://localhost:8080/teams/${playerData.teamId}`)
            .then((res) => res.json())
            .then((teamData) => {
              setPlayer((prev) => ({ ...prev, teamName: teamData.name }));
            });
        }
      })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/players/delete/${id}`, {
          method: "DELETE",
        }).then(() => {
          Swal.fire("Deleted!", "The player has been deleted.", "success");
          navigate("/players");
        });
      }
    });
  };

  if (loading) return <p className="text-center text-lg">Loading player...</p>;
  if (!player)
    return <p className="text-center text-red-500">Player not found</p>;

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={player.imageUrl || "https://via.placeholder.com/150"}
            alt={player.name}
            className="w-36 h-36 rounded-full object-cover shadow-md border"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-800">{player.name}</h2>
            <p className="text-gray-600 text-lg">
              Role: <span className="font-semibold">{player.role}</span>
            </p>
            <p className="text-gray-600 text-lg">
              Age: <span className="font-semibold">{player.age}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Team</p>
            <p className="text-lg font-semibold text-gray-800">
              {player.teamName || "No team assigned"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Join Date</p>
            <p className="text-lg font-semibold text-gray-800">
              {player.joinDate
                ? new Date(player.joinDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Matches Played</p>
            <p className="text-lg font-semibold text-gray-800">
              {player.matchesPlayed ?? 0}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Player ID</p>
            <p className="text-lg font-semibold text-gray-800">{player.id}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link
            to={`/players/edit/${player.id}`}
            className="px-5 py-2.5 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
