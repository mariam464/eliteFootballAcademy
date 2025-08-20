const API_URL = "http://localhost:8080";

export async function getTeams() {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

export async function createTeam(team) {
  const res = await fetch(`${API_URL}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team),
  });

  if (!res.ok) throw new Error("Failed to create team");
  return res.json();
}

export async function deleteTeam(id) {
  const res = await fetch(`${API_URL}/teams/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete team");
}
