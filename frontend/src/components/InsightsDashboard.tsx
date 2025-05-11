import React from "react";
import PredictiveAnalytics from "./PredictiveAnalytics";
import RealtimeUpdates from "./RealtimeUpdates";

const InsightsDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Insights Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PredictiveAnalytics />
        <RealtimeUpdates />
      </div>
    </div>
  );
};

export default InsightsDashboard;
