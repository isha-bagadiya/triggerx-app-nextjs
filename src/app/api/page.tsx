"use client";
import React, { useState } from "react";
import { Typography } from "../components/ui/Typography";
import AnimatedTabs from "../components/leaderboard/AnimatedTabs";
import QuickStartGuide from "../components/api/QuickGuide";
import GenerateApi from "../components/api/GenerateApi";
import Documentation from "../components/api/Documentation";

const tabs = [
  { id: "documentation", label: "Documentation" },
  { id: "api-creation", label: "API Creation" },
];

function Api() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <>
      <Typography variant="h1" color="primary" className="mb-10">
        API Documentation
      </Typography>
      <AnimatedTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div>
        {activeTab === "api-creation" && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full justify-between">
            <GenerateApi />
            <QuickStartGuide />
          </div>
        )}
        {activeTab === "documentation" && (
          <div>
            <Documentation />
          </div>
        )}
      </div>
    </>
  );
}

export default Api;
