import React, { useState, useMemo } from 'react';
import { MOCK_LEADS, MOCK_CUSTOMERS, MOCK_USERS } from '../constants';
import { Lead } from '../types';
import { SearchIcon, PlusIcon } from './icons';

const customerMap = new Map(MOCK_CUSTOMERS.map(c => [c.id, c]));
const userMap = new Map(MOCK_USERS.map(u => [u.id, u]));

const getStatusPillClass = (status: 'open' | 'closed' | 'lost') => {
  switch (status) {
    case 'open':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'closed':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'lost':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-slate-600 text-slate-300';
  }
};

export const Leads: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = useMemo(() => {
        return MOCK_LEADS.filter(lead =>
            lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerMap.get(lead.customer_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">営業案件管理</h1>
                    <p className="text-sm text-slate-400">営業案件の作成・管理を行います</p>
                </div>
                 <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規案件登録
                </button>
            </div>
            
            <div className="mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="案件名、顧客名で検索..."
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
                            <th scope="col" className="px-6 py-3">案件名</th>
                            <th scope="col" className="px-6 py-3">顧客名</th>
                            <th scope="col" className="px-6 py-3">担当者</th>
                            <th scope="col" className="px-6 py-3">見積金額</th>
                            <th scope="col" className="px-6 py-3">ステータス</th>
                            <th scope="col" className="px-6 py-3">更新日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredLeads.map(lead => (
                            <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{lead.title}</td>
                                <td className="px-6 py-4 text-slate-300">{customerMap.get(lead.customer_id)?.name}</td>
                                <td className="px-6 py-4 text-slate-300">{userMap.get(lead.responsible_user_id)?.name}</td>
                                <td className="px-6 py-4 text-slate-300 text-right">{lead.estimated_amount.toLocaleString()} 円</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusPillClass(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{new Date(lead.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredLeads.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当する案件が見つかりません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};
