import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Wrench } from "lucide-react";
import { executeTask } from "../services/api";

function AgentExecutor() {
  const [taskDescription, setTaskDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExecute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await executeTask({ task_description: taskDescription });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Unable to execute task plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-grid">
      <motion.form initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" onSubmit={handleExecute}>
        <h2 className="glow-text" style={{ marginTop: 0, fontSize: 20 }}>
          AI Agent Executor
        </h2>
        <p className="muted">Generate ReAct style reasoning and actionable execution steps.</p>

        <label style={{ fontSize: 13 }}>Task Description</label>
        <textarea
          className="text-area"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Create user onboarding flow and analytics instrumentation"
          required
        />

        <button type="submit" className="glow-button" disabled={loading || !taskDescription.trim()}>
          {loading ? "EXECUTING..." : "RUN EXECUTOR"}
        </button>

        {error && <p style={{ color: "#ff7c9c", fontSize: 13 }}>{error}</p>}
      </motion.form>

      <motion.section initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>Reasoning Timeline</h3>
          <Bot size={16} color="#00f5ff" />
        </div>

        {loading && <p className="thinking-dots">AI AGENT THINKING<span>.</span><span>.</span><span>.</span></p>}
        {!loading && !result && <p className="muted">Execution timeline will appear here.</p>}

        {result && (
          <div style={{ display: "grid", gap: 10 }}>
            {(result.reasoning_steps || []).map((item, i) => (
              <motion.div
                key={item.step || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ border: "1px solid rgba(0,245,255,.2)", borderRadius: 12, padding: 12 }}
              >
                <strong>Step {item.step || i + 1}</strong>
                <p style={{ margin: "8px 0" }}><strong>Thought:</strong> {item.thought}</p>
                <p style={{ margin: "8px 0" }}><strong>Action:</strong> {item.action}</p>
                <p className="muted" style={{ margin: 0 }}><strong>Observation:</strong> {item.observation}</p>
              </motion.div>
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Wrench size={16} color="#9b59ff" />
              {(result.tools_required || []).map((tool, i) => (
                <span key={`${tool}-${i}`} className="badge">
                  {tool}
                </span>
              ))}
            </div>

            <div><strong>Estimated Completion:</strong> {result.estimated_completion || "N/A"}</div>
            <div><strong>Risk Factors:</strong> {(result.risk_factors || []).join(", ") || "None"}</div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default AgentExecutor;
