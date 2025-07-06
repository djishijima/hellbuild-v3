import React, { useState, useMemo } from 'react';
import { MOCK_CUSTOMERS, MOCK_USERS } from '../constants';
import { Customer } from '../types';
import { SearchIcon, PlusIcon } from './icons';

const userMap = new Map(MOCK_USERS.map(u => [u.id, u]));

export const CustomerManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = useMemo(() => {
        return MOCK_CUSTOMERS.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        );
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">顧客管理</h1>
                    <p className="text-sm text-slate-400">顧客情報の作成・管理を行います</p>
                </div>
                 <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規顧客登録
                </button>
            </div>
            
            <div className="mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="顧客名、担当者名、連絡先で検索..."
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
                            <th scope="col" className="px-6 py-3">顧客名</th>
                            <th scope="col" className="px-6 py-3">業種</th>
                            <th scope="col" className="px-6 py-3">担当者</th>
                            <th scope="col" className="px-6 py-3">連絡先</th>
                            <th scope="col" className="px-6 py-3">更新日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{customer.name}</td>
                                <td className="px-6 py-4 text-slate-300">{customer.industry}</td>
                                <td className="px-6 py-4 text-slate-300">{customer.contact_name}</td>
                                <td className="px-6 py-4 text-slate-300">
                                    <div>{customer.phone}</div>
                                    <div className="text-xs text-slate-400">{customer.email}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{new Date(customer.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredCustomers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当する顧客が見つかりません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};
