import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterProvider } from "@/contexts/FilterContext";
import { Sidebar } from "../components/Sidebar";
import { MobileSidebar } from "../components/mobile/MobileSidebar";
import { DashboardOverview } from "../components/DashboardOverview";
import { LeadManagement } from "../components/LeadManagement";
import { IntegrationHub } from "../components/IntegrationHub";
import { BlandAI } from "../components/BlandAI";
import { Reports } from "../components/Reports";
import { Settings } from "../components/Settings";
import { QualifiedLeadsView } from "../components/leads/QualifiedLeadsView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [qualificationFilter, setQualificationFilter] = useState<string | null>(
    null
  );
  const isMobile = useIsMobile();

  const handleQualificationClick = (status: string) => {
    setQualificationFilter(status);
  };

  const handleBackToDashboard = () => {
    setQualificationFilter(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setQualificationFilter(null);
  };

  const renderContent = () => {
    if (qualificationFilter) {
      return (
        <QualifiedLeadsView
          status={qualificationFilter}
          onBack={handleBackToDashboard}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview onQualificationClick={handleQualificationClick} />
        );
      case "leads":
        return <LeadManagement />;
      case "integrations":
        return <IntegrationHub />;
      case "bland-ai":
        return <BlandAI />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return (
          <DashboardOverview onQualificationClick={handleQualificationClick} />
        );
    }
  };

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/80 to-secondary/60 morphing-bg">
        <div className="flex w-full">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          )}

          {/* Mobile Sidebar */}
          {isMobile && (
            <MobileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}

          {/* Main Content */}
          <main
            className={`flex-1 md:max-h-screen overflow-y-auto overflow-auto ${
              isMobile ? "p-4 pt-16" : "p-10"
            }`}
          >
            <div className="slide-up-fade">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </FilterProvider>
  );
};

export default Index;
