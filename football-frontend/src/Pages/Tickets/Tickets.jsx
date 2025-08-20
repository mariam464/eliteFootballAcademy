import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, matchesRes, teamsRes] = await Promise.all([
          axios.get("http://localhost:8080/tickets"),
          axios.get("http://localhost:8080/matches"),
          axios.get("http://localhost:8080/teams"),
        ]);

        setTickets(ticketsRes.data);
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

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t.name]));

  const handleDelete = (ticketId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This ticket will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/tickets/delete/${ticketId}`);
          setTickets(tickets.filter((t) => t.id !== ticketId));
          Swal.fire("Deleted!", "The ticket has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete ticket.", "error");
        }
      }
    });
  };

  if (loading) return <p className="text-center mt-10">Loading tickets...</p>;

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Tickets</h2>
        <button
          onClick={() => navigate("/tickets/reserve")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Reserve Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {tickets.map((ticket) => {
            const match = matches.find((m) => m.id === ticket.matchId);
            const homeTeamName = match ? teamMap[match.homeTeamId] : "Unknown";
            return (
              <li
                key={ticket.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="text-gray-600 text-sm">
                    Customer: {ticket.customerName}
                  </p>
                  <p className="text-gray-600 text-sm">Type: {ticket.type}</p>
                  <p className="text-gray-600 text-sm">
                    Match:{" "}
                    {match
                      ? `${homeTeamName} vs ${match.awayTeamName}`
                      : "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Reserved at:{" "}
                    {ticket.reservingDate
                      ? new Date(ticket.reservingDate).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
