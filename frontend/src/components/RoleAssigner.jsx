import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Network, Users } from "lucide-react";
import { assignRoles } from "../services/api";

function RoleAssigner() {
  const [goal, setGoal] = useState("Ship an MVP in 6 weeks");
  const [teamMembersText, setTeamMembersText] = useState(
    '[{"name":"Ava","skills":["React","UI"]},{"name":"Noah","skills":["Flask","Python"]}]'
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const team_members = JSON.parse(teamMembersText);
      const data = await assignRoles({ goal, team_members });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Unable to assign roles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-grid">
      <motion.form initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" onSubmit={handleAssign}>
        <h2 className="glow-text" style={{ marginTop: 0, fontSize: 20 }}>
          Multi-Agent Role Assigner
        </h2>
        <p className="muted">Distribute responsibilities by matching objectives to team capabilities.</p>

        <label style={{ fontSize: 13 }}>Project Goal</label>
        <input className="input-field" value={goal} onChange={(e) => setGoal(e.target.value)} required />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Team Members JSON</label>
        <textarea className="text-area" value={teamMembersText} onChange={(e) => setTeamMembersText(e.target.value)} required />

        <button type="submit" className="glow-button" disabled={loading}>
          {loading ? "ASSIGNING..." : "ASSIGN ROLES"}
        </button>

        {error && <p style={{ color: "#ff7c9c", fontSize: 13 }}>{error}</p>}
      </motion.form>

      <motion.section initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>Team Assignment Grid</h3>
          <Network size={16} color="#00f5ff" />
        </div>

        {loading && <p className="thinking-dots">AI AGENT THINKING<span>.</span><span>.</span><span>.</span></p>}
        {!loading && !result && <p className="muted">Assignments and collaboration points show up here.</p>}

        {result && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {(result.assignments || []).map((item, i) => (
                <div
                  key={`${item.agent_name}-${i}`}
                  style={{
                    border: "1px solid rgba(0,245,255,.2)",
                    borderRadius: 12,
                    padding: 12,
                    background: "rgba(255,255,255,.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{item.agent_name}</strong>
                    <span className="badge">{item.workload_percentage}% load</span>
                  </div>
                  <p className="muted" style={{ margin: "8px 0" }}>
                    <Users size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                    {item.role}
                  </p>
                  <div style={{ fontSize: 13 }}>
                    <strong>Tasks:</strong> {(item.assigned_tasks || []).join(", ")}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(item.skills_used || []).map((skill, idx) => (
                      <span key={`${skill}-${idx}`} className="badge">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <strong>Collaboration Points:</strong>
              <ul style={{ paddingLeft: 18 }}>
                {(result.collaboration_points || []).map((point, i) => (
                  <li key={`${point}-${i}`}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default RoleAssigner;
