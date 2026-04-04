import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { replanProject } from "../services/api";

function ReplannerPanel() {
  const [originalPlan, setOriginalPlan] = useState('{"tasks":["Design","Build","Test"]}');
  const [completedTasks, setCompletedTasks] = useState("Design");
  const [blockers, setBlockers] = useState("API delay");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReplan = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        original_plan: JSON.parse(originalPlan),
        completed_tasks: completedTasks
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        blockers: blockers
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const data = await replanProject(payload);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Unable to generate revised plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-grid">
      <motion.form initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" onSubmit={handleReplan}>
        <h2 className="glow-text" style={{ marginTop: 0, fontSize: 20 }}>
          Autonomous Progress Tracker
        </h2>
        <p className="muted">Compare completed work against blockers and auto-generate a revised schedule.</p>

        <label style={{ fontSize: 13 }}>Original Plan JSON</label>
        <textarea className="text-area" value={originalPlan} onChange={(e) => setOriginalPlan(e.target.value)} required />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Completed Tasks (comma-separated)</label>
        <input className="input-field" value={completedTasks} onChange={(e) => setCompletedTasks(e.target.value)} />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Blockers (comma-separated)</label>
        <input className="input-field" value={blockers} onChange={(e) => setBlockers(e.target.value)} />

        <button className="glow-button" type="submit" disabled={loading}>
          {loading ? "REPLANNING..." : "RUN RE-PLANNER"}
        </button>

        {error && <p style={{ color: "#ff7c9c", fontSize: 13 }}>{error}</p>}
      </motion.form>

      <motion.section initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>Original vs Revised</h3>
          <RefreshCw size={16} color="#00f5ff" />
        </div>

        {loading && <p className="thinking-dots">AI AGENT THINKING<span>.</span><span>.</span><span>.</span></p>}
        {!loading && !result && <p className="muted">Re-planned output will appear here.</p>}

        {result && (
          <div style={{ display: "grid", gap: 10 }}>
            <div><strong>Completed:</strong> {result.completed_percentage ?? "N/A"}%</div>
            <div><strong>Status:</strong> {result.overall_status || "N/A"}</div>
            <div><strong>Delayed Tasks:</strong> {(result.delayed_tasks || []).join(", ") || "None"}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ border: "1px solid rgba(0,245,255,.2)", borderRadius: 12, padding: 12 }}>
                <strong>Revised Schedule</strong>
                <ul style={{ paddingLeft: 18 }}>
                  {(result.revised_schedule || []).map((item, i) => (
                    <li key={`${item.task}-${i}`}>{item.task}{" -> "}{item.new_date}</li>
                  ))}
                </ul>
              </div>

              <div style={{ border: "1px solid rgba(155,89,255,.35)", borderRadius: 12, padding: 12 }}>
                <strong>Blocker Solutions</strong>
                <ul style={{ paddingLeft: 18 }}>
                  {(result.blocker_solutions || []).map((item, i) => (
                    <li key={`${item.blocker}-${i}`}>{item.blocker}: {item.suggested_fix}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default ReplannerPanel;
