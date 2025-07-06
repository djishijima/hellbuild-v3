
import React from 'react';
import { Page, User, UserRole } from '../types';
import { ChartPieIcon, DocumentDuplicateIcon, BuildingOffice2Icon, UserIcon, BriefcaseIcon, FunnelIcon, ListBulletIcon, BookOpenIcon, BanknotesIcon, BuildingStorefrontIcon, DocumentTextIcon, MicrophoneIcon } from './icons';

type SidebarProps = {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    currentUser: User;
}

const NavItem: React.FC<{
    page: Page;
    label: string;
    icon: React.ReactNode;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}> = ({ page, label, icon, currentPage, setCurrentPage }) => {
    const isActive = currentPage === page;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                }}
                className={`flex items-center p-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
            >
                {icon}
                <span className="ml-3 font-medium">{label}</span>
            </a>
        </li>
    );
};

const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <p className="px-2 mt-5 mb-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">{title}</p>
        <ul className="space-y-1">
            {children}
        </ul>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, currentUser }) => {
    const iconClass = "w-6 h-6 transition-colors duration-200";

    return (
        <aside className="w-64 bg-slate-900/70 border-r border-slate-800 flex flex-col p-4 shrink-0">
            <div className="flex items-center h-16 px-2 mb-4">
                 <div className="bg-emerald-500/20 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.431 13.808L18.219 12L16.43 10.191L12.863 13.784L11.074 11.995L9.286 10.207L5.718 13.8L7.506 15.59L11.073 12.023L12.862 13.812L16.431 13.808Z" fill="currentColor"></path><path d="M11.074 2L5.72 7.354L3.932 5.566L2.143 7.354L5.72 10.931L11.074 5.577L16.428 10.931L21.782 5.577L19.994 3.789L18.205 5.577L12.852 2H11.074Z" fill="currentColor"></path><path d="M11.074 21.999L12.863 20.21L16.43 13.804L12.863 13.775L11.074 15.564L7.506 15.589L5.718 13.799L2.15 17.368L3.938 19.156L5.727 17.368L11.074 21.999Z" fill="currentColor"></path></svg>
                 </div>
                <h1 className="text-lg font-bold text-slate-200">
                    文教堂印刷<br/>
                    <span className="text-xs font-normal text-slate-400">統合業務管理システム</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
                <NavSection title="基本機能">
                    <NavItem page={Page.Dashboard} label="ダッシュボード" icon={<ChartPieIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page={Page.Approvals} label="上申管理" icon={<DocumentDuplicateIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </NavSection>

                <NavSection title="営業・顧客">
                    <NavItem page={Page.Customers} label="顧客管理" icon={<BuildingOffice2Icon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page={Page.Leads} label="営業案件" icon={<BriefcaseIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page={Page.Tasks} label="タスク管理" icon={<ListBulletIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </NavSection>
                
                <NavSection title="高度機能">
                    <NavItem page={Page.OcrDocuments} label="公文書OCR" icon={<DocumentTextIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <NavItem page={Page.Transcriptions} label="音声文字起こし" icon={<MicrophoneIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </NavSection>

                 {currentUser.role === UserRole.Admin && (
                    <NavSection title="システム管理">
                        <NavItem page={Page.Manual} label="マニュアル" icon={<BookOpenIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <NavItem page={Page.Users} label="ユーザー管理" icon={<UserIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <NavItem page={Page.Subjects} label="科目管理" icon={<BanknotesIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <NavItem page={Page.Recipients} label="支払先管理" icon={<BuildingStorefrontIcon className={iconClass} />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </NavSection>
                 )}
            </nav>
            <div className="mt-auto pt-4 border-t border-slate-800">
                <a href="#" className="flex items-center p-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rotate-180"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                    <span className="ml-3 font-medium">ログアウト</span>
                </a>
            </div>
        </aside>
    );
};
