import React, { useState, useMemo } from 'react';
import { MOCK_OCR_DOCUMENTS } from '../constants';
import { OcrDocument } from '../types';
import { SearchIcon, PlusIcon } from './icons';

const getStatusPillClass = (status: 'pending' | 'processing' | 'complete' | 'error') => {
  switch (status) {
    case 'pending': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    case 'processing': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'complete': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'error': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default: return 'bg-slate-600 text-slate-300';
  }
};

export const OcrDocuments: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocuments = useMemo(() => {
        return MOCK_OCR_DOCUMENTS.filter(doc =>
            doc.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">公文書OCR</h1>
                    <p className="text-sm text-slate-400">PDFや画像からテキストを抽出・管理します</p>
                </div>
                 <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規アップロード
                </button>
            </div>
            
            <div className="mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="文書タイトルで検索..."
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
                            <th scope="col" className="px-6 py-3">文書タイトル</th>
                            <th scope="col" className="px-6 py-3">ページ数</th>
                            <th scope="col" className="px-6 py-3">用紙サイズ</th>
                            <th scope="col" className="px-6 py-3">ステータス</th>
                            <th scope="col" className="px-6 py-3">アップロード日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredDocuments.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{doc.title}</td>
                                <td className="px-6 py-4 text-slate-300">{doc.page_count}</td>
                                <td className="px-6 py-4 text-slate-300">{doc.paper_size}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusPillClass(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredDocuments.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当する文書が見つかりません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};
