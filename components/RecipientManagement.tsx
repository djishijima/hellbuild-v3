import React, { useState, useMemo } from 'react';
import { MOCK_PAYMENT_RECIPIENTS } from '../constants';
import { PaymentRecipient } from '../types';
import { SearchIcon, BuildingStorefrontIcon, PlusIcon } from './icons';

const RecipientCard: React.FC<{ recipient: PaymentRecipient }> = ({ recipient }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 flex flex-col">
        <div className="flex-grow">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{recipient.recipient_name}</h3>
                    <p className="text-xs text-slate-400">{recipient.name_reading}</p>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p><span className="font-medium text-slate-500 w-20 inline-block">法人名:</span> {recipient.company_name}</p>
                <p><span className="font-medium text-slate-500 w-20 inline-block">銀行:</span> {recipient.bank_name} ({recipient.bank_code})</p>
                <p><span className="font-medium text-slate-500 w-20 inline-block">口座種別:</span> {recipient.account_type}</p>
                <p><span className="font-medium text-slate-500 w-20 inline-block">電話:</span> {recipient.phone_number}</p>
                <p><span className="font-medium text-slate-500 w-20 inline-block">Email:</span> {recipient.email}</p>
            </div>
        </div>
        <div className="mt-5 flex gap-2">
            <button className="flex-1 px-4 py-2 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">詳細</button>
            <button className="flex-1 px-4 py-2 text-sm rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">編集</button>
        </div>
    </div>
);


export const RecipientManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRecipients = useMemo(() => {
        return MOCK_PAYMENT_RECIPIENTS.filter(recipient =>
            recipient.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recipient.name_reading && recipient.name_reading.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (recipient.phone_number && recipient.phone_number.includes(searchTerm))
        );
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">支払先管理</h1>
                    <p className="text-sm text-slate-400">取引先・支払先情報の管理</p>
                </div>
                 <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規支払先登録
                </button>
            </div>
            
            <div className="mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="支払先名、カナ、電話番号で検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-lg bg-slate-800/80 border border-slate-700 rounded-full pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecipients.map(recipient => (
                        <RecipientCard key={recipient.id} recipient={recipient} />
                    ))}
                </div>
                {filteredRecipients.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当する支払先が見つかりません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};