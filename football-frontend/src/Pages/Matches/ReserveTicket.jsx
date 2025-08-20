import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ReserveTicket() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    type: "Regular",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/matches/${matchId}`)
      .then((res) => {
        setMatch(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load match.");
        setLoading(false);
      });
  }, [matchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  const ticket = {
    ...formData,
    matchId: match.id,
    reservingDate: new Date().toISOString(),
  };

  axios
    .post("http://localhost:8080/tickets/add", ticket)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Ticket Reserved",
        text: "Your ticket has been reserved successfully.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(() => navigate("/matches"));
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not reserve the ticket. Please try again.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Retry",
      });
    });
};

  if (loading) return <p className="text-center mt-10">Loading match...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Reserve Ticket</h2>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p>
          <strong>Match:</strong> {match.homeTeamName} vs {match.awayTeamName}
        </p>
        <p>
          <strong>Date:</strong> {new Date(match.date).toLocaleString()}
        </p>
        <p>
          <strong>Location:</strong> {match.location}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Your Name</label>
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
