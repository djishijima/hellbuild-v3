
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ApprovalDashboard } from './components/ApprovalDashboard';
import { RecipientManagement } from './components/RecipientManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { Leads } from './components/Leads';
import { Tasks } from './components/Tasks';
import { OcrDocuments } from './components/OcrDocuments';
import { Transcriptions } from './components/Transcriptions';
import { Users } from './components/Users';
import { Page, User } from './types';
import { MOCK_USERS } from './constants';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  // Centralize user state. Default to admin for demonstration.
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[3]); 

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Approvals:
        return <ApprovalDashboard setCurrentPage={setCurrentPage} />;
      case Page.Customers:
        return <CustomerManagement />;
      case Page.Recipients:
        return <RecipientManagement />;
      case Page.Leads:
        return <Leads />;
      case Page.Tasks:
        return <Tasks />;
      case Page.OcrDocuments:
        return <OcrDocuments />;
      case Page.Transcriptions:
        return <Transcriptions />;
      case Page.Users:
        return <Users />;
      // Add cases for other pages here, for now they can fallback to Dashboard
      case Page.Manual:
      case Page.Subjects:
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentUser={currentUser}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
