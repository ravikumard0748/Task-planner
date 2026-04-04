import React from "react";
import { motion } from "framer-motion";

function Sidebar({ tabs, activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="glass-card"
      style={{
        width: collapsed ? 84 : 240,
        transition: "width 0.24s ease",
        margin: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <button
        type="button"
        className="glow-button"
        onClick={() => setCollapsed((p) => !p)}
        style={{ width: "100%", marginBottom: 8, padding: "9px 12px" }}
      >
        {collapsed ? "EXPAND" : "COLLAPSE"}
      </button>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            title={tab.label}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              width: "100%",
              borderRadius: 12,
              border: active ? "1px solid #00f5ff" : "1px solid rgba(0,245,255,0.14)",
              background: active
                ? "linear-gradient(135deg, rgba(0,245,255,.20), rgba(155,89,255,.16))"
                : "rgba(255,255,255,0.02)",
              color: active ? "#00f5ff" : "#c5cdf2",
              padding: "11px 10px",
              cursor: "pointer",
            }}
          >
            <Icon size={16} />
            {!collapsed && <span style={{ fontSize: 13 }}>{tab.label}</span>}
          </button>
        );
      })}
    </motion.aside>
  );
}

export default Sidebar;
