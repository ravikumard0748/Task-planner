import React from "react";
import { useMemo, useState } from "react";
import {
  Brain,
  Calendar,
  Bot,
  RefreshCw,
  Network,
  Shield,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GoalDecomposer from "./components/GoalDecomposer";
import TaskScheduler from "./components/TaskScheduler";
import AgentExecutor from "./components/AgentExecutor";
import ReplannerPanel from "./components/ReplannerPanel";
import RoleAssigner from "./components/RoleAssigner";
import RiskAnalyzer from "./components/RiskAnalyzer";

function App() {
  const tabs = useMemo(
    () => [
      { key: "decompose", label: "Goal Decomposer", icon: Brain },
      { key: "schedule", label: "Task Scheduler", icon: Calendar },
      { key: "execute", label: "Agent Executor", icon: Bot },
      { key: "replan", label: "Re-Planner", icon: RefreshCw },
      { key: "roles", label: "Role Assigner", icon: Network },
      { key: "risk", label: "Risk Analyzer", icon: Shield },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState("decompose");
  const [collapsed, setCollapsed] = useState(false);

  const activeTitle = tabs.find((tab) => tab.key === activeTab)?.label || "Agent Panel";

  return (
    <div className="app-shell">
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main style={{ flex: 1, padding: "12px 12px 16px 0" }}>
        <Navbar activeTitle={activeTitle} />

        {activeTab === "decompose" && <GoalDecomposer />}
        {activeTab === "schedule" && <TaskScheduler />}
        {activeTab === "execute" && <AgentExecutor />}
        {activeTab === "replan" && <ReplannerPanel />}
        {activeTab === "roles" && <RoleAssigner />}
        {activeTab === "risk" && <RiskAnalyzer />}
      </main>
    </div>
  );
}

export default App;
