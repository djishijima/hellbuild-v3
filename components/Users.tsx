
import React, { useState, useMemo } from 'react';
import { MOCK_USERS } from '../constants';
import { User, UserRole, UserStatus } from '../types';
import { SearchIcon, PlusIcon } from './icons';
import { NewUserModal } from './NewUserModal';

const getRolePillClass = (role: UserRole) => {
  switch (role) {
    case UserRole.Admin:
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case UserRole.Manager:
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case UserRole.User:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    default:
      return 'bg-slate-600 text-slate-300';
  }
};

const getStatusPillClass = (status: UserStatus) => {
  switch (status) {
    case UserStatus.Active:
      return 'bg-green-500/20 text-green-400';
    case UserStatus.Inactive:
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-slate-600 text-slate-300';
  }
};


export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });

    const sortedUsers = useMemo(() => {
        let sortableItems = [...users];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [users, sortConfig]);
    
    const filteredUsers = useMemo(() => {
        return sortedUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.employee_id.includes(searchTerm)
        );
    }, [sortedUsers, searchTerm]);
    
    const requestSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddNewUser = (newUser: User) => {
        setUsers(prevUsers => [newUser, ...prevUsers]);
        setIsModalOpen(false);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">ユーザー管理</h1>
                    <p className="text-sm text-slate-400">システムユーザーの作成、編集、削除を行います</p>
                </div>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規ユーザー追加
                </button>
            </div>
            
            <div className="mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="氏名、メールアドレス、社員IDで検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-lg bg-slate-800/80 border border-slate-700 rounded-full pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 bg-slate-950/50 rounded-lg border border-slate-800">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('name')}>氏名</th>
                            <th scope="col" className="px-6 py-3">連絡先</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('employee_id')}>社員ID</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('role')}>役職</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('status')}>ステータス</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                    <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-slate-300">{user.email}</td>
                                <td className="px-6 py-4 text-slate-300">{user.employee_id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getRolePillClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusPillClass(user.status)}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当するユーザーが見つかりません。</p>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <NewUserModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddNewUser}
                />
            )}
        </div>
    );
};
