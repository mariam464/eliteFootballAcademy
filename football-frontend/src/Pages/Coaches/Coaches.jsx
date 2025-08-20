import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "../../assets/Icons/add.png";

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8080/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/coaches")
      .then((res) => res.json())
      .then((data) => setCoaches(data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-xl mx-auto sm:text-center">
          <h3 className="text-white text-3xl font-semibold sm:text-4xl">
            Coaches
          </h3>
          <p className="text-white mt-3">
            Manage your football coaches here – view details, edit or delete.
          </p>
          <button
            onClick={() => navigate("/coaches/add")}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            <img
              src={AddIcon}
              alt="Add Coach"
              className="inline mr-2 my-2 w-5 h-5"
            />
            Add Coach
          </button>
        </div>
        <div className="mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {coaches.map((coach) => (
              <li key={coach.id}>
                <div className="w-full h-60 sm:h-52 md:h-56">
                  <img
                    src={coach.imageUrl}
                    className="w-full h-full object-cover object-center shadow-md rounded-xl"
                    alt={coach.name}
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg text-white font-semibold">
                    {coach.name}
                  </h4>
                  <h4 className="text-lg text-white font-medium">
                    {teams.find((team) => team.id === coach.teamId)?.name ||
                      "Unassigned to Team"}
                  </h4>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/coaches/${coach.id}`)}
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
