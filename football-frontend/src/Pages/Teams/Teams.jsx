import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "../../assets/Icons/add.png";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes] = await Promise.all([
          fetch("http://localhost:8080/teams")
        ]);

        if (!teamsRes.ok) throw new Error("Failed to fetch teams");

        const teamsData = await teamsRes.json();
        setTeams(teamsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-xl mx-auto sm:text-center">
          <h3 className="text-white text-3xl font-semibold sm:text-4xl">
            Our Teams
          </h3>
          <p className="text-white mt-3">
            Meet the teams at Legacy Football Academy. Browse players, coaches,
            and achievements.
          </p>
          <button
            onClick={() => navigate("/teams/add")}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            <img
              src={AddIcon}
              alt="Add Team"
              className="inline mr-2 my-2 w-5 h-5"
            />
            Add Team
          </button>
        </div>

        <div className="mt-12">
          {loading && <p className="text-center text-white">Loading teams...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && teams.length === 0 && (
            <p className="text-center text-white">No teams available.</p>
          )}

          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {teams.map((team) => (
              <li key={team.id}>
                <div className="w-full h-60 sm:h-52 md:h-56">
                  <img
                    src={team.imageUrl || "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover object-center shadow-md rounded-xl"
                    alt={team.name}
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg text-yellow-500 font-semibold">
                    {team.name}
                  </h4>
                  <p className="text-white">
                    {team.coach ? team.coach.name : "Coach not assigned"}
                  </p> 

                  
                  <Link
                    to={`/teams/${team.id}`}
                    className="mt-3 inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-yellow-500 transition"
                  >
                    View Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
