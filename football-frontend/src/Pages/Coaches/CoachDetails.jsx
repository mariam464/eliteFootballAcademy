// src/pages/CoachDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/coaches/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Coach not found");
        return res.json();
      })
      .then((coachData) => {
        setCoach(coachData);
        if (coachData.teamId) {
          fetch(`http://localhost:8080/teams/${coachData.teamId}`)
            .then((res) => res.json())
            .then((teamData) => {
              setCoach((prev) => ({ ...prev, teamName: teamData.name }));
            });
        }
      })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/coaches/delete/${id}`, {
          method: "DELETE",
        }).then(() => {
          Swal.fire("Deleted!", "The coach has been deleted.", "success");
          navigate("/coaches");
        });
      }
    });
  };

  if (loading) return <p className="text-center text-lg">Loading coach...</p>;
  if (!coach)
    return <p className="text-center text-red-500">Coach not found</p>;

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={coach.imageUrl || "https://via.placeholder.com/150"}
            alt={coach.name}
            className="w-36 h-36 rounded-full object-cover shadow-md border"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-800">{coach.name}</h2>
            <p className="text-gray-600 text-lg">
              Age: <span className="font-semibold">{coach.age}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Team</p>
            <p className="text-lg font-semibold text-gray-800">
              {coach.teamName || "No team assigned"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Join Date</p>
            <p className="text-lg font-semibold text-gray-800">
              {coach.joinDate
                ? new Date(coach.joinDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Coach ID</p>
            <p className="text-lg font-semibold text-gray-800">{coach.id}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link
            to={`/coaches/edit/${coach.id}`}
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
