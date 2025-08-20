// src/pages/ReserveTicketPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ReserveTicketS() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    type: "Regular",
    matchId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, teamsRes] = await Promise.all([
          axios.get("http://localhost:8080/matches"),
          axios.get("http://localhost:8080/teams"),
        ]);

        setMatches(matchesRes.data.filter((m) => m.upcoming));
        setTeams(teamsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t.name]));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:8080/tickets/add", formData);

    Swal.fire({
      icon: "success",
      title: "Ticket Reserved",
      text: "Your ticket has been reserved successfully.",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then(() => navigate("/tickets"));
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Could not reserve the ticket. Please try again.",
      confirmButtonColor: "#d33",
      confirmButtonText: "Retry",
    });
  }
};

  if (loading) return <p className="text-center mt-10">Loading matches...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Reserve Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Ticket Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Match</label>
          <select
            name="matchId"
            value={formData.matchId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select a match --</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {new Date(m.date).toLocaleString()} | {teamMap[m.homeTeamId]} vs{" "}
                {m.awayTeamName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Reserve Ticket
        </button>
      </form>
    </div>
  );
}
