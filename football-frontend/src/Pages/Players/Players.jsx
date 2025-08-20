import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "../../assets/Icons/add.png";
export default function Players() {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-xl mx-auto sm:text-center">
          <h3 className="text-white text-3xl font-semibold sm:text-4xl">
            Players
          </h3>
          <p className="text-white mt-3">
            Manage your football players here – view details, edit or delete.
          </p>
          <button
            onClick={() => navigate("/players/add")}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            <img
              src={AddIcon}
              alt="Add Player"
              className="inline mr-2 my-2 w-5 h-5"
            />
            Add Player
          </button>
        </div>
        <div className="mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {players.map((player) => (
              <li key={player.id}>
                <div className="w-full h-60 sm:h-52 md:h-56">
                  <img
                    src={player.imageUrl}
                    className="w-full h-full object-cover object-center shadow-md rounded-xl"
                    alt={player.name}
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg text-white font-semibold">
                    {player.name}
                  </h4>
                  <h4 className="text-lg text-white font-medium">
                    {player.teamName}
                  </h4>
                  <p className="text-white">{player.role}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/players/${player.id}`)}
                      className="px-3 py-1 bg-white text-black rounded-lg hover:bg-yellow-500"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
