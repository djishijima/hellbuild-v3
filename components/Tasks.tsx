import React, { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_USERS } from '../constants';
import { Task } from '../types';
import { SearchIcon, PlusIcon } from './icons';

const userMap = new Map(MOCK_USERS.map(u => [u.id, u]));

const getStatusPillClass = (status: 'todo' | 'in_progress' | 'done') => {
  switch (status) {
    case 'todo': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    case 'in_progress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'done': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    default: return 'bg-slate-600 text-slate-300';
  }
};

const getPriorityPillClass = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low': return 'text-slate-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-red-400 font-bold';
    default: return 'text-slate-300';
  }
};


export const Tasks: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = useMemo(() => {
        return MOCK_TASKS.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userMap.get(task.assignee_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">タスク管理</h1>
                    <p className="text-sm text-slate-400">個人のタスク、プロジェクトタスクを管理します</p>
                </div>
                 <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規タスク作成
                </button>
            </div>
            
            <div className="mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="タスク名、担当者名で検索..."
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
                            <th scope="col" className="px-6 py-3">タイトル</th>
                            <th scope="col" className="px-6 py-3">担当者</th>
                            <th scope="col" className="px-6 py-3">期限</th>
                            <th scope="col" className="px-6 py-3">優先度</th>
                            <th scope="col" className="px-6 py-3">進捗</th>
                            <th scope="col" className="px-6 py-3">更新日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredTasks.map(task => (
                            <tr key={task.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                                <td className="px-6 py-4 text-slate-300">{userMap.get(task.assignee_id)?.name}</td>
                                <td className="px-6 py-4 text-slate-300">{task.due_date}</td>
                                <td className={`px-6 py-4 capitalize ${getPriorityPillClass(task.priority)}`}>{task.priority}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusPillClass(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{new Date(task.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredTasks.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当するタスクが見つかりません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};
