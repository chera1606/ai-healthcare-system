import { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";
import AIAssistant from "./AIAssistant";
import MedicalReports from "./MedicalReports";
import Medication from "./Medication";
import HealthTimeline from "./HealthTimeline";
import HospitalFinder from "./HospitalFinder";
import Settings from "./Settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <MainContent activeTab={activeTab} />;
      case "ai-assistant":
        return <AIAssistant activeTab={activeTab} />;
      case "medical-reports":
        return <MedicalReports activeTab={activeTab} />;
      case "medication":
        return <Medication activeTab={activeTab} />;
      case "health-timeline":
        return <HealthTimeline activeTab={activeTab} />;
      case "hospital-finder":
        return <HospitalFinder activeTab={activeTab} />;
      case "settings":
        return <Settings activeTab={activeTab} />;
      default:
        return <MainContent activeTab={activeTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent font-sans">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-3 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Mobile Right Sidebar Toggle */}
      <button
        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-primary text-white p-3 rounded-lg shadow-lg"
      >
        📊
      </button>

      {/* Left Sidebar - Fixed Width 260px */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="absolute left-0 top-0 h-full w-[260px]">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      <div className="hidden lg:flex-shrink-0 lg:block" style={{ width: '260px' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Center Content - Fluid Flex */}
      {renderContent()}
      
      {/* Right Sidebar - Fixed Width 340px */}
      <div className={`fixed inset-0 z-40 lg:hidden ${rightSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setRightSidebarOpen(false)}></div>
        <div className="absolute right-0 top-0 h-full w-[340px]">
          <RightSidebar />
        </div>
      </div>
      <div className="hidden lg:flex-shrink-0 lg:block" style={{ width: '340px' }}>
        <RightSidebar />
      </div>
    </div>
  );
}
