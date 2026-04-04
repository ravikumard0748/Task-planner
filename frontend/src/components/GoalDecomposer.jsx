import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Zap } from "lucide-react";
import { decomposeGoal } from "../services/api";

function GoalDecomposer() {
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await decomposeGoal({ goal });
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to decompose goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-grid">
      <motion.form
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-card"
        onSubmit={handleSubmit}
      >
        <h2 className="glow-text" style={{ marginTop: 0, fontSize: 20 }}>
          Autonomous Goal Decomposer
        </h2>
        <p className="muted">Convert strategic goals into actionable dependency-aware tasks.</p>

        <label htmlFor="goal-input" style={{ fontSize: 13 }}>
          High-Level Goal
        </label>
        <textarea
          id="goal-input"
          className="text-area"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Launch a mobile app in 30 days"
          required
        />

        <button type="submit" className="glow-button" disabled={loading || !goal.trim()}>
          {loading ? "DECOMPOSING..." : "RUN AI DECOMPOSER"}
        </button>

        {error && (
          <p style={{ color: "#ff7c9c", fontSize: 13, marginTop: 12 }}>
            {error}
          </p>
        )}
      </motion.form>

      <motion.section initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>Task Dependency Graph</h3>
          <GitBranch color="#00f5ff" size={16} />
        </div>

        {loading && (
          <div className="thinking-dots" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Zap color="#00f5ff" size={16} />
            <span>AI AGENT THINKING.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <p className="muted">No tasks yet. Run decomposition to view structured output.</p>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {tasks.map((task, i) => (
            <motion.div
              key={task.task_id || i}
              className="fade-up"
              style={{
                border: "1px solid rgba(0,245,255,.2)",
                borderRadius: 12,
                padding: 12,
                background: "rgba(255,255,255,.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{task.task_name || "Untitled Task"}</strong>
                <span className={`badge priority-${(task.priority || "low").toLowerCase()}`}>
                  {task.priority || "Low"}
                </span>
              </div>
              <p className="muted" style={{ margin: "8px 0" }}>
                {task.description}
              </p>
              <div style={{ fontSize: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span>Task ID: {task.task_id || "N/A"}</span>
                <span>Hours: {task.estimated_hours ?? "N/A"}</span>
                <span>Category: {task.category || "General"}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12 }}>
                Depends on: {Array.isArray(task.depends_on) && task.depends_on.length ? task.depends_on.join(", ") : "None"}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default GoalDecomposer;
