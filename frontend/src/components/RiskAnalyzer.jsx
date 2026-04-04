import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { analyzeRisk } from "../services/api";

const levelColor = {
  High: "rgba(255, 92, 122, 0.22)",
  Medium: "rgba(255, 184, 77, 0.2)",
  Low: "rgba(0, 255, 179, 0.18)",
};

function RiskAnalyzer() {
  const [plan, setPlan] = useState('{"milestones":["Design","Development","Launch"]}');
  const [timeline, setTimeline] = useState('{"duration_days":30}');
  const [resources, setResources] = useState('{"team":4,"budget":"$20k"}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        plan: JSON.parse(plan),
        timeline: JSON.parse(timeline),
        resources: JSON.parse(resources),
      };
      const data = await analyzeRisk(payload);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Unable to analyze risks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-grid">
      <motion.form initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" onSubmit={handleAnalyze}>
        <h2 className="glow-text" style={{ marginTop: 0, fontSize: 20 }}>
          Risk Analyzer & Mitigation Planner
        </h2>
        <p className="muted">Scan timeline pressure and resource constraints to predict delivery threats.</p>

        <label style={{ fontSize: 13 }}>Plan JSON</label>
        <textarea className="text-area" value={plan} onChange={(e) => setPlan(e.target.value)} required />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Timeline JSON</label>
        <textarea className="text-area" value={timeline} onChange={(e) => setTimeline(e.target.value)} required />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Resources JSON</label>
        <textarea className="text-area" value={resources} onChange={(e) => setResources(e.target.value)} required />

        <button type="submit" className="glow-button" disabled={loading}>
          {loading ? "ANALYZING..." : "RUN RISK SCAN"}
        </button>

        {error && <p style={{ color: "#ff7c9c", fontSize: 13 }}>{error}</p>}
      </motion.form>

      <motion.section initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>Risk Matrix</h3>
          <ShieldAlert size={16} color="#00f5ff" />
        </div>

        {loading && <p className="thinking-dots">AI AGENT THINKING<span>.</span><span>.</span><span>.</span></p>}
        {!loading && !result && <p className="muted">Risk matrix and mitigation strategy output will appear here.</p>}

        {result && (
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <strong>Overall Risk Score:</strong> {result.overall_risk_score ?? "N/A"}/100
            </div>

            {(result.risks || []).map((risk, i) => (
              <div
                key={risk.risk_id || i}
                style={{
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid rgba(0,245,255,.2)",
                  background: levelColor[risk.impact] || "rgba(255,255,255,.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{risk.risk_name || "Unnamed Risk"}</strong>
                  <AlertTriangle size={15} color="#ff9a5c" />
                </div>
                <p style={{ fontSize: 13, margin: "8px 0" }}>
                  Probability: {risk.probability} | Impact: {risk.impact}
                </p>
                <p className="muted" style={{ margin: "6px 0" }}>
                  <strong>Mitigation:</strong> {risk.mitigation_strategy}
                </p>
                <p className="muted" style={{ margin: 0 }}>
                  <strong>Contingency:</strong> {risk.contingency_plan}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default RiskAnalyzer;
