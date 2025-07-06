import React, { useState, useMemo } from 'react';
import { MOCK_TRANSCRIPTIONS } from '../constants';
import { Transcription } from '../types';
import { SearchIcon, PlusIcon } from './icons';

const getStatusPillClass = (status: 'waiting' | 'transcribing' | 'complete' | 'error') => {
  switch (status) {
    case 'waiting': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    case 'transcribing': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'complete': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'error': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default: return 'bg-slate-600 text-slate-300';
  }
};

export const Transcriptions: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTranscriptions = useMemo(() => {
        return MOCK_TRANSCRIPTIONS.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">音声文字起こし</h1>
                    <p className="text-sm text-slate-400">長時間の音声ファイルをアップロードして文字起こしを行います</p>
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
                        placeholder="タイトルで検索..."
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
                            <th scope="col" className="px-6 py-3">言語</th>
                            <th scope="col" className="px-6 py-3">ステータス</th>
                            <th scope="col" className="px-6 py-3">アップロード日</th>
                            <th scope="col" className="px-6 py-3">更新日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredTranscriptions.map(item => (
                            <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                                <td className="px-6 py-4 text-slate-300 uppercase">{item.language}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusPillClass(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-slate-400">{new Date(item.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredTranscriptions.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">該当するファイルが見つかりません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};
