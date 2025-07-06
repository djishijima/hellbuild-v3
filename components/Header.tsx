
import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from './icons';
import { User, Page } from '../types';

type HeaderProps = {
    currentUser: User;
    setCurrentPage: (page: Page) => void;
};

export const Header: React.FC<HeaderProps> = ({ currentUser, setCurrentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current?.contains(target as Node)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });
  
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setDropdownOpen(false);
  }

  return (
    <header className="bg-slate-950/70 backdrop-blur-lg border-b border-slate-800 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="flex items-center justify-end h-16">
          <div className="relative">
            <button
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-4 group"
            >
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{currentUser.name}</div>
                    <div className="text-xs text-slate-400">ID: {currentUser.employee_id}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-slate-600 group-hover:ring-emerald-500 transition-all overflow-hidden">
                    {currentUser.avatar_url ? (
                        <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-6 h-6 text-slate-300" />
                    )}
                </div>
            </button>
            {dropdownOpen && (
                <div
                    ref={dropdown}
                    className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10"
                >
                    <div className="p-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation(Page.Users); }} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition-colors">
                            <Cog6ToothIcon className="w-5 h-5" />
                            <span>プロフィール</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition-colors">
                            <ArrowLeftStartOnRectangleIcon className="w-5 h-5"/>
                            <span>ログアウト</span>
                        </a>
                    </div>
                </div>
            )}
          </div>
        </div>
    </header>
  );
};
