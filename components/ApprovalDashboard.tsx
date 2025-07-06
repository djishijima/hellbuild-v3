import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_APPROVALS, MOCK_USERS, MOCK_APPLICATION_CODES, MOCK_PAYMENT_RECIPIENTS } from '../constants';
import { Approval, ApprovalStatus, User, ApplicationCode, ExpFormData, TrpFormData, LevFormData, NocFormData, ApplicationCategory, Page, FormData } from '../types';
import { SearchIcon, ChevronDownIcon, SparklesIcon, XCircleIcon, PaperClipIcon, PlusIcon } from './icons';
import { summarizeText } from '../services/geminiService';
import { NewApprovalModal } from './NewApprovalModal';

// Helper to get status color
const getStatusPillClass = (status: ApprovalStatus) => {
  switch (status) {
    case ApprovalStatus.Approved:
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case ApprovalStatus.Submitted:
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case ApprovalStatus.Rejected:
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case ApprovalStatus.Returned:
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case ApprovalStatus.Draft:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    default:
      return 'bg-slate-600 text-slate-300';
  }
};

// Helper to get status japanese text
const getStatusText = (status: ApprovalStatus) => {
    const map = {
        [ApprovalStatus.Approved]: '承認済',
        [ApprovalStatus.Submitted]: '申請中',
        [ApprovalStatus.Rejected]: '却下',
        [ApprovalStatus.Returned]: '差戻',
        [ApprovalStatus.Draft]: '下書き'
    };
    return map[status];
};

const userMap = new Map<string, User>(MOCK_USERS.map(u => [u.id, u]));
const codeMapById = new Map<string, ApplicationCode>(MOCK_APPLICATION_CODES.map(c => [c.id, c]));
const recipientMap = new Map(MOCK_PAYMENT_RECIPIENTS.map(r => [r.id, r]));


type ApprovalDashboardProps = {
    setCurrentPage: (page: Page) => void;
};


export const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({ setCurrentPage }) => {
    const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
    const [selectedApproval, setSelectedApproval] = useState<Approval | null>(approvals[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [summary, setSummary] = useState<string>('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState<string>('');

    const filteredApprovals = useMemo(() => {
        return approvals.filter(approval => {
            const applicant = userMap.get(approval.applicant_id);
            const appCode = codeMapById.get(approval.application_code_id);
            const formData = approval.form_data as FormData;
            const subject = formData.title || 'N/A';

            const matchesSearch = searchTerm === '' || 
                applicant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subject.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || appCode?.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [approvals, searchTerm, statusFilter, categoryFilter]);
    
    const handleSummarize = useCallback(async () => {
        if (!selectedApproval?.remarks) return;
        setIsSummarizing(true);
        setSummaryError('');
        setSummary('');
        try {
            const result = await summarizeText(selectedApproval.remarks);
            setSummary(result);
        } catch (error) {
            setSummaryError('要約の生成に失敗しました。');
            console.error(error);
        } finally {
            setIsSummarizing(false);
        }
    }, [selectedApproval]);

    const handleSelectApproval = (approval: Approval) => {
      setSelectedApproval(approval);
      setSummary('');
      setSummaryError('');
    };

    const handleAddNewApproval = (newApprovalData: Omit<Approval, 'id' | 'applicant_id' | 'created_at' | 'submitted_at'>) => {
        const newApproval: Approval = {
            ...newApprovalData,
            id: `appr-${Math.random().toString(36).substr(2, 9)}`,
            applicant_id: MOCK_USERS[0].id, // Mocking current user
            created_at: new Date().toISOString(),
            submitted_at: new Date().toISOString(),
        };
        setApprovals(prev => [newApproval, ...prev]);
        setIsModalOpen(false);
        setSelectedApproval(newApproval);
    };

    const renderFormData = (approval: Approval) => {
        const appCode = codeMapById.get(approval.application_code_id);
        if (!appCode) return <p>不明な申請カテゴリです。</p>;
        
        const DetailRow: React.FC<{ label: string; value?: React.ReactNode; isCurrency?: boolean; fullWidth?: boolean }> = ({ label, value, fullWidth }) => value ? (
            <div className={`py-2 border-b border-slate-700/50 ${fullWidth ? 'flex-col' : 'flex justify-between'}`}>
                <dt className="text-sm text-slate-400">{label}</dt>
                <dd className={`text-sm font-medium text-slate-200 ${fullWidth ? 'mt-1' : 'text-right'}`}>{value}</dd>
            </div>
        ) : null;

        const data = approval.form_data;

        return (
             <dl>
                <DetailRow label="件名" value={data.title} fullWidth/>
                {(() => {
                    switch (appCode.category) {
                        case ApplicationCategory.EXP:
                            const expData = data as ExpFormData;
                            const recipient = recipientMap.get(expData.recipient_id);
                            return <>
                                <DetailRow label="科目" value={expData.subject} />
                                <DetailRow label="支払先" value={recipient?.recipient_name} />
                                <DetailRow label="金額" value={`${expData.amount.toLocaleString()} 円`} />
                                <DetailRow label="請求日" value={expData.billing_date} />
                                <DetailRow label="支払予定日" value={expData.payment_due_date} />
                                <DetailRow label="内容" value={expData.content} fullWidth/>
                                {expData.receipt_url && <DetailRow label="領収書" value={<a href={expData.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center justify-end gap-1"><PaperClipIcon className="w-4 h-4" />添付ファイル</a>} />}
                            </>;
                        case ApplicationCategory.TRP:
                            const trpData = data as TrpFormData;
                             const trpRecipient = recipientMap.get(trpData.recipient_id);
                            return <>
                                <DetailRow label="区間" value={`${trpData.departure} → ${trpData.arrival}`} />
                                {trpData.via && <DetailRow label="経由" value={trpData.via} />}
                                <DetailRow label="日時" value={new Date(trpData.datetime).toLocaleString('ja-JP')} />
                                <DetailRow label="支払先" value={trpRecipient?.recipient_name} />
                                <DetailRow label="金額" value={`${trpData.amount.toLocaleString()} 円`} />
                                {trpData.receipt_url && <DetailRow label="領収書" value={<a href={trpData.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center justify-end gap-1"><PaperClipIcon className="w-4 h-4" />添付ファイル</a>} />}
                            </>;
                        case ApplicationCategory.LEV:
                            const levData = data as LevFormData;
                            return <>
                                <DetailRow label="休暇期間" value={`${levData.start_date} ~ ${levData.end_date}`} />
                                <DetailRow label="休暇区分" value={{ 'full-day': '終日', 'am-half': '午前半休', 'pm-half': '午後半休' }[levData.leave_type]} />
                                <DetailRow label="代理対応者" value={levData.alternate_contact} />
                                <DetailRow label="理由・補足事項" value={levData.reason} fullWidth/>
                            </>;
                        case ApplicationCategory.NOC:
                            const nocData = data as NocFormData;
                            return <>
                                <DetailRow label="決裁内容" value={nocData.content} fullWidth/>
                                <DetailRow label="承認理由" value={nocData.approval_reason} fullWidth/>
                                {nocData.attachment_url && <DetailRow label="添付ファイル" value={<a href={nocData.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center justify-end gap-1"><PaperClipIcon className="w-4 h-4" />添付ファイル</a>} />}
                            </>;
                        default:
                            return <p>このカテゴリの表示は未対応です。</p>;
                    }
                })()}
             </dl>
        );
    };


    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">上申管理</h1>
                    <p className="text-sm text-slate-400">上申の作成・管理・承認を行います</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md">
                    <PlusIcon className="w-5 h-5"/>
                    新規申請
                </button>
            </div>
            
            {/* Filters */}
            <div className="mb-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="件名、申請者名で検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>
                <div className="relative">
                     <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-40 appearance-none bg-slate-800/80 border border-slate-700 rounded-md pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                        <option value="all">全ステータス</option>
                        {Object.values(ApprovalStatus).map(s => <option key={s} value={s}>{getStatusText(s)}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
                <div className="relative">
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full sm:w-40 appearance-none bg-slate-800/80 border border-slate-700 rounded-md pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                        <option value="all">全カテゴリ</option>
                        {MOCK_APPLICATION_CODES.map(c => <option key={c.id} value={c.category}>{c.name}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Approvals List */}
                <div className="lg:col-span-2 bg-slate-950/50 rounded-lg border border-slate-800 overflow-y-auto">
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">申請者</th>
                                <th scope="col" className="px-6 py-3">カテゴリ</th>
                                <th scope="col" className="px-6 py-3">件名 / 内容</th>
                                <th scope="col" className="px-6 py-3">申請日</th>
                                <th scope="col" className="px-6 py-3 text-center">ステータス</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredApprovals.map(approval => {
                                const applicant = userMap.get(approval.applicant_id);
                                const appCode = codeMapById.get(approval.application_code_id);
                                const formData = approval.form_data as FormData;
                                const subject = formData.title || 'N/A';

                                return (
                                <tr key={approval.id} onClick={() => handleSelectApproval(approval)} className={`cursor-pointer transition-colors ${selectedApproval?.id === approval.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-200 font-medium">{applicant?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-400">{appCode?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{subject}</td>
                                    <td className="px-6 py-4 text-slate-400">{new Date(approval.submitted_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusPillClass(approval.status)}`}>
                                            {getStatusText(approval.status)}
                                        </span>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                   </div>
                   {filteredApprovals.length === 0 && <p className="text-center p-8 text-slate-500">該当する申請はありません。</p>}
                </div>
                
                {/* Details Panel */}
                <div className="lg:col-span-1 overflow-hidden">
                    {selectedApproval ? (
                        <div className="bg-slate-950/50 rounded-lg border border-slate-800 h-full flex flex-col">
                           <div className="p-5 border-b border-slate-800">
                               <h2 className="font-bold text-lg text-slate-100">申請詳細</h2>
                               <p className="text-sm text-slate-400">ID: {selectedApproval.id}</p>
                           </div>
                           <div className="p-5 flex-1 overflow-y-auto">
                                <h3 className="font-semibold text-slate-300 mb-3">申請内容</h3>
                                {renderFormData(selectedApproval)}

                                <h3 className="font-semibold text-slate-300 mt-6 mb-3">承認情報</h3>
                                <dl>
                                   <div className="flex justify-between py-2 border-b border-slate-700/50">
                                      <dt className="text-sm text-slate-400">申請者</dt>
                                      <dd className="text-sm font-medium text-slate-200">{userMap.get(selectedApproval.applicant_id)?.name}</dd>
                                  </div>
                                   <div className="flex justify-between py-2 border-b border-slate-700/50">
                                      <dt className="text-sm text-slate-400">承認者</dt>
                                      <dd className="text-sm font-medium text-slate-200">{selectedApproval.approver_id ? userMap.get(selectedApproval.approver_id)?.name : '未処理'}</dd>
                                  </div>
                                </dl>

                                {selectedApproval.remarks && (
                                  <>
                                    <h3 className="font-semibold text-slate-300 mt-6 mb-2">コメント / 備考</h3>
                                    <p className="text-sm text-slate-300 bg-slate-800 p-3 rounded-md whitespace-pre-wrap">{selectedApproval.remarks}</p>
                                    <button onClick={handleSummarize} disabled={isSummarizing} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                                        <SparklesIcon className="w-5 h-5"/>
                                        {isSummarizing ? 'AIが要約中...' : 'AIで要約する'}
                                    </button>
                                  </>
                                )}

                                {summary && (
                                     <div className="mt-4 p-3 bg-slate-800/70 border border-slate-700 rounded-lg">
                                        <h4 className="font-semibold text-indigo-400 text-sm flex items-center gap-2"><SparklesIcon className="w-4 h-4" /> AIによる要約</h4>
                                        <p className="text-sm text-slate-300 mt-2">{summary}</p>
                                    </div>
                                )}
                                {summaryError && (
                                     <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                                        <h4 className="font-semibold text-red-400 text-sm flex items-center gap-2"><XCircleIcon className="w-4 h-4" /> エラー</h4>
                                        <p className="text-sm text-slate-300 mt-2">{summaryError}</p>
                                    </div>
                                )}
                           </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-950/50 rounded-lg border-2 border-dashed border-slate-700 text-slate-500">
                            リストから申請を選択してください
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && <NewApprovalModal 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddNewApproval}
                setCurrentPage={setCurrentPage}
            />}
        </div>
    );
};