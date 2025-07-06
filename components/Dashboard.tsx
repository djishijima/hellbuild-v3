import React from 'react';
import { MOCK_APPROVALS } from '../constants';
import { ApprovalStatus } from '../types';

const StatCard: React.FC<{ title: string; value: number | string; description: string;}> = ({ title, value, description }) => (
    <div className="bg-slate-800/50 border border-slate-700/80 rounded-lg p-5">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
);

export const Dashboard: React.FC = () => {

    const stats = {
        total: MOCK_APPROVALS.length,
        pending: MOCK_APPROVALS.filter(a => a.status === ApprovalStatus.Submitted).length,
        approved: MOCK_APPROVALS.filter(a => a.status === ApprovalStatus.Approved).length,
        rejected: MOCK_APPROVALS.filter(a => a.status === ApprovalStatus.Rejected || a.status === ApprovalStatus.Returned).length,
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-100">ダッシュボード</h1>
                <p className="text-sm text-slate-400">上申システムの概要と状態を確認できます</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="総申請数" value={stats.total} description="全期間" />
                <StatCard title="承認待ち" value={stats.pending} description="要承認" />
                <StatCard title="承認済み" value={stats.approved} description="完了済み" />
                <StatCard title="却下/差戻" value={stats.rejected} description="要修正" />
            </div>

             <div className="mt-8 bg-slate-800/50 border border-slate-700/80 rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4">システム状態</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-400 font-semibold">正常</span>
                    </div>
                    <p className="text-slate-400 text-sm">HELLBUILD approval system is running.</p>
                </div>
                 <div className="text-xs text-slate-500 mt-4">
                    <p>データベース: <span className="text-green-400">接続済み</span></p>
                    <p>最終確認: {new Date().toLocaleString('ja-JP')}</p>
                 </div>
            </div>

        </div>
    );
};
