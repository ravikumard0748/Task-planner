import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { scheduleTasks } from "../services/api";

function TaskScheduler() {
  const [tasksText, setTasksText] = useState(
    '[{"task_id":"T1","task_name":"Product specs","estimated_hours":8}]'
  );
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [startDate, setStartDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tasks = JSON.parse(tasksText);
      const data = await scheduleTasks({
        tasks,
        hours_per_day: Number(hoursPerDay),
        start_date: startDate,
      });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Unable to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-grid">
      <motion.form initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" onSubmit={handleSchedule}>
        <h2 className="glow-text" style={{ marginTop: 0, fontSize: 20 }}>
          Smart Task Scheduler
        </h2>
        <p className="muted">Build a realistic day-wise plan with critical path awareness.</p>

        <label style={{ fontSize: 13 }}>Tasks JSON Array</label>
        <textarea className="text-area" value={tasksText} onChange={(e) => setTasksText(e.target.value)} required />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Hours Per Day</label>
        <input
          className="input-field"
          type="number"
          min="1"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(e.target.value)}
          required
        />

        <label style={{ fontSize: 13, display: "block", marginTop: 10 }}>Start Date</label>
        <input className="input-field" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

        <button className="glow-button" type="submit" disabled={loading}>
          {loading ? "SCHEDULING..." : "GENERATE SCHEDULE"}
        </button>

        {error && <p style={{ color: "#ff7c9c", fontSize: 13 }}>{error}</p>}
      </motion.form>

      <motion.section initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>Calendar Output</h3>
          <CalendarClock size={16} color="#00f5ff" />
        </div>

        {loading && <p className="thinking-dots">AI AGENT THINKING<span>.</span><span>.</span><span>.</span></p>}

        {!loading && !result && <p className="muted">No schedule generated yet.</p>}

        {result && (
          <div style={{ display: "grid", gap: 10 }}>
            {(result.schedule || []).map((day, i) => (
              <div key={`${day.date}-${i}`} style={{ border: "1px solid rgba(0,245,255,.2)", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{day.date}</strong>
                  <span className="badge">{day.total_hours}h</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  {(day.tasks_for_day || []).join(", ") || "No tasks"}
                </div>
              </div>
            ))}

            <div>
              <strong>Critical Path:</strong> {(result.critical_path || []).join(" -> ") || "N/A"}
            </div>
            <div>
              <strong>Buffer Days:</strong> {result.buffer_days ?? "N/A"}
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default TaskScheduler;
