import React from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

function Navbar({ activeTitle }) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="glass-card"
      style={{
        position: "sticky",
        top: 12,
        zIndex: 20,
        marginBottom: 16,
        padding: "14px 18px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(140deg, rgba(0,245,255,.35), rgba(155,89,255,.35))",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Bot color="#00f5ff" />
          </div>
          <div>
            <div className="glow-text" style={{ fontSize: 16, letterSpacing: 1.2 }}>
              AGENTIC TASK CONTROL
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              Autonomous Planning Operating Surface
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles color="#9b59ff" size={16} />
          <span className="badge" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: 1 }}>
            {activeTitle}
          </span>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
