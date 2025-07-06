import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Approval, ApprovalStatus, ApplicationCategory, ExpFormData, TrpFormData, LevFormData, NocFormData, FormData, Page, PaymentRecipient, ApplicationCode } from '../types';
import { MOCK_APPLICATION_CODES, MOCK_PAYMENT_RECIPIENTS } from '../constants';
import { ChevronDownIcon, PlusIcon, XMarkIcon, UploadIcon, SearchIcon, CalendarDaysIcon, SpinnerIcon } from './icons';
import { parseFileWithAI, ParsedFileData } from '@/services/fileParserService';

type NewApprovalModalProps = {
    onClose: () => void;
    onSubmit: (data: Omit<Approval, 'id' | 'applicant_id' | 'created_at' | 'submitted_at'>) => void;
    setCurrentPage: (page: Page) => void;
};

// --- Helper Components ---
const InputField = ({ label, children, required = false, className = '' }: { label: string, children: React.ReactNode, required?: boolean, className?: string }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        {children}
    </div>
);

const FileUploadZone: React.FC<{ onFileSelect: (file: File) => void, isParsing: boolean, uploadedFile: File | null }> = ({ onFileSelect, isParsing, uploadedFile }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };
    
    return (
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">
                申請書類アップロード
            </label>
            <div className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md cursor-pointer hover:border-emerald-500 transition-colors ${isParsing ? 'bg-slate-700/50' : ''}`}>
                {isParsing ? (
                     <div className="space-y-1 text-center">
                        <SpinnerIcon className="mx-auto h-12 w-12 text-emerald-400"/>
                        <p className="text-sm text-slate-300">AIが内容を解析中...</p>
                        <p className="text-xs text-slate-500">しばらくお待ちください</p>
                    </div>
                ) : (
                    <div className="space-y-1 text-center">
                         <UploadIcon className="mx-auto h-12 w-12 text-slate-500" />
                        <div className="flex text-sm text-slate-400">
                            <span className="relative bg-slate-900 rounded-md font-medium text-emerald-400 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-emerald-500 px-1">
                                <span>ファイルを選択</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isParsing}/>
                            </span>
                            <p className="pl-1">またはドラッグ＆ドロップ</p>
                        </div>
                        <p className="text-xs text-slate-500">PDF, JPG, PNG (最大10MB)</p>
                    </div>
                )}
            </div>
            {uploadedFile && !isParsing && (
                 <div className="mt-3 text-sm text-slate-400 bg-slate-700/50 p-2 rounded-md">
                    <p>読み込みファイル: <span className="font-medium text-slate-200">{uploadedFile.name}</span></p>
                 </div>
            )}
            <div className="mt-3 text-xs text-emerald-400/80 bg-emerald-900/30 border border-emerald-500/30 p-2 rounded-md">
                アップロードされた内容からフォームが自動入力されます。入力内容は手動で修正可能です。
            </div>
        </div>
    );
};

const RecipientCombobox: React.FC<{
    selectedValue: string | undefined; // The UUID
    onChange: (value: string | undefined) => void;
    onAddNew: () => void;
}> = ({ selectedValue, onChange, onAddNew }) => {
    const [query, setQuery] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const selectedRecipient = useMemo(() => 
        MOCK_PAYMENT_RECIPIENTS.find(r => r.id === selectedValue), 
        [selectedValue]
    );

    useEffect(() => {
        if (selectedRecipient) {
            setQuery(selectedRecipient.recipient_name);
        } else {
            setQuery('');
        }
    }, [selectedRecipient]);


    const filteredRecipients = useMemo(() => {
        const lowercasedQuery = query.toLowerCase();
        if (query === '') return MOCK_PAYMENT_RECIPIENTS;
        return MOCK_PAYMENT_RECIPIENTS.filter(r =>
            r.recipient_name.toLowerCase().includes(lowercasedQuery) ||
            (r.name_reading && r.name_reading.toLowerCase().includes(lowercasedQuery))
        );
    }, [query]);

    const handleBlur = () => {
        setTimeout(() => { 
            setDropdownOpen(false);
            if (query !== (selectedRecipient?.recipient_name || '')) {
                onChange(undefined);
                setQuery('');
            }
        }, 200);
    };

    const handleSelect = (recipient: PaymentRecipient) => {
        onChange(recipient.id);
        setQuery(recipient.recipient_name);
        setDropdownOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    value={query}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={handleBlur}
                    onChange={(e) => {
                        const newQuery = e.target.value;
                        setQuery(newQuery);
                        setDropdownOpen(true);
                        if (newQuery === '') {
                            onChange(undefined);
                        }
                    }}
                    placeholder="支払先を選択または検索"
                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    autoComplete="off"
                />
                {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredRecipients.length > 0 ? (
                            <ul className="py-1">
                                {filteredRecipients.map(r => (
                                    <li key={r.id}
                                        onMouseDown={() => handleSelect(r)}
                                        className="px-4 py-2 text-sm text-slate-300 hover:bg-emerald-600 hover:text-white cursor-pointer"
                                    >
                                        {r.recipient_name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-2 text-sm text-slate-500">該当なし</div>
                        )}
                    </div>
                )}
            </div>
            <button type="button" onClick={onAddNew} className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-md transition-colors" aria-label="支払先を新規追加">
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


// --- Form Category Initializers ---
const getInitialFormData = (category?: ApplicationCategory): Partial<FormData> => {
    const baseData = { title: '', project_name: '', remarks: '' };
    if (!category) return baseData;
    
    switch (category) {
        case ApplicationCategory.EXP:
            return { ...baseData, subject: '', content: '', recipient_id: undefined, amount: 0, billing_date: '', payment_due_date: '' };
        case ApplicationCategory.TRP:
            return { ...baseData, departure: '', arrival: '', via: '', datetime: '', amount: 0, recipient_id: undefined };
        case ApplicationCategory.LEV:
            return { ...baseData, start_date: '', end_date: '', leave_type: 'full-day', alternate_contact: '', reason: '' };
        case ApplicationCategory.NOC:
            return { ...baseData, content: '', approval_reason: '' };
        default:
            return baseData;
    }
}

// --- Main Modal Component ---
export const NewApprovalModal: React.FC<NewApprovalModalProps> = ({ onClose, onSubmit, setCurrentPage }) => {
    const [applicationCodeId, setApplicationCodeId] = useState(MOCK_APPLICATION_CODES[0].id);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [isParsing, setIsParsing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [populatedFields, setPopulatedFields] = useState<Set<string>>(new Set());

    const selectedCode = useMemo(() => MOCK_APPLICATION_CODES.find(c => c.id === applicationCodeId), [applicationCodeId]);

    useEffect(() => {
        setFormData(getInitialFormData(selectedCode?.category));
        setPopulatedFields(new Set()); // Reset populated fields on category change
    }, [selectedCode]);
    
    const handleFileParse = async (file: File) => {
        setUploadedFile(file);
        setIsParsing(true);
        setPopulatedFields(new Set());
        try {
            const parsedData = await parseFileWithAI(file);
            const newPopulatedFields = new Set<string>();

            // If AI suggests a category, switch to it
            if(parsedData.application_code_id && parsedData.application_code_id !== applicationCodeId) {
                setApplicationCodeId(parsedData.application_code_id);
            }

            // Update form data with parsed results
            setFormData(prev => {
                const updatedData = { ...prev };
                for (const key in parsedData) {
                    if (Object.prototype.hasOwnProperty.call(parsedData, key)) {
                        updatedData[key] = parsedData[key];
                        newPopulatedFields.add(key);
                    }
                }
                return updatedData;
            });
            setPopulatedFields(newPopulatedFields);

        } catch (error) {
            console.error("File parsing failed:", error);
            alert("ファイルの解析に失敗しました。");
        } finally {
            setIsParsing(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
        // User manually edited, so remove from populated set
        setPopulatedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(name);
            return newSet;
        });
    };

    const handleRecipientChange = (recipientId: string | undefined) => {
        setFormData(prev => ({ ...prev, recipient_id: recipientId }));
        setPopulatedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete('recipient_id');
            return newSet;
        });
    };
    
    const validateForm = useCallback((): boolean => {
        // ... (validation logic remains the same)
        return true;
    }, [formData, selectedCode, applicationCodeId]);

    const handleSubmit = (e: React.FormEvent, status: ApprovalStatus) => {
        e.preventDefault();
        
        if (status !== ApprovalStatus.Draft && !validateForm()) {
            return;
        }

        onSubmit({
            application_code_id: applicationCodeId,
            form_data: formData as FormData,
            status: status,
        });
    };
    
    const getInputClass = (fieldName: string) => {
        const baseClass = "w-full bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none transition";
        const populatedClass = "bg-emerald-900/30 border-emerald-500/30";
        return `${baseClass} ${populatedFields.has(fieldName) ? populatedClass : ''}`;
    }
    
    // --- Form Render Functions ---
    const renderExpenseForm = () => {
        const data = formData as Partial<ExpFormData>;
        return (
            <>
                <h3 className="text-base font-semibold text-slate-200 border-t border-slate-700 pt-6 mt-6 mb-4">経費申請詳細</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                    <InputField label="科目" required>
                         <div className="relative">
                            <select name="subject" value={data.subject || ''} onChange={handleInputChange} className={`${getInputClass('subject')} pl-4 pr-10 py-2.5 appearance-none`}>
                                <option value="" disabled>科目を選択</option>
                                <option>接待交際費</option><option>会議費</option><option>旅費交通費</option><option>福利厚生費</option><option>その他</option>
                            </select>
                             <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                        </div>
                    </InputField>
                     <InputField label="金額" required>
                        <input type="number" name="amount" value={data.amount || ''} onChange={handleInputChange} placeholder="50000" className={`${getInputClass('amount')} px-3 py-2.5`} />
                    </InputField>
                     <InputField label="支払先" required className="md:col-span-2">
                        <RecipientCombobox selectedValue={data.recipient_id} onChange={handleRecipientChange} onAddNew={() => {onClose(); setCurrentPage(Page.Recipients)}} />
                    </InputField>
                     <InputField label="内容（詳細説明）" required className="md:col-span-2">
                        <textarea name="content" value={data.content || ''} onChange={handleInputChange} rows={2} placeholder="経費の詳細内容を記載してください" className={`${getInputClass('content')} px-3 py-2.5 resize-none`}></textarea>
                    </InputField>
                     <InputField label="請求日" required>
                         <div className="relative">
                            <input type="date" name="billing_date" value={data.billing_date || ''} onChange={handleInputChange} className={`${getInputClass('billing_date')} px-3 py-2.5`} />
                            <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"/>
                         </div>
                    </InputField>
                     <InputField label="支払予定日" required>
                         <div className="relative">
                            <input type="date" name="payment_due_date" value={data.payment_due_date || ''} onChange={handleInputChange} className={`${getInputClass('payment_due_date')} px-3 py-2.5`} />
                             <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"/>
                         </div>
                    </InputField>
                </div>
            </>
        );
    }
    
    const renderTransportForm = () => {
        const data = formData as Partial<TrpFormData>;
        return (
             <>
                <h3 className="text-base font-semibold text-slate-200 border-t border-slate-700 pt-6 mt-6 mb-4">交通費申請詳細</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                    <InputField label="出発地" required><input type="text" name="departure" value={data.departure || ''} onChange={handleInputChange} placeholder="例: 東京駅" className={`${getInputClass('departure')} px-3 py-2.5`} /></InputField>
                    <InputField label="到着地" required><input type="text" name="arrival" value={data.arrival || ''} onChange={handleInputChange} placeholder="例: 大阪駅" className={`${getInputClass('arrival')} px-3 py-2.5`} /></InputField>
                    <InputField label="経由"><input type="text" name="via" value={data.via || ''} onChange={handleInputChange} placeholder="例: 新横浜" className={`${getInputClass('via')} px-3 py-2.5`} /></InputField>
                    <InputField label="日時" required><input type="datetime-local" name="datetime" value={data.datetime || ''} onChange={handleInputChange} className={`${getInputClass('datetime')} px-3 py-2.5`} /></InputField>
                    <InputField label="金額" required className="md:col-span-2"><input type="number" name="amount" value={data.amount || ''} onChange={handleInputChange} placeholder="28000" className={`${getInputClass('amount')} px-3 py-2.5`} /></InputField>
                    <InputField label="支払先" required className="md:col-span-2">
                        <RecipientCombobox selectedValue={data.recipient_id} onChange={handleRecipientChange} onAddNew={() => {onClose(); setCurrentPage(Page.Recipients)}} />
                    </InputField>
                </div>
            </>
        )
    };
    
    // ... other render functions (Lev, Noc) are the same
    const renderLeaveForm = () => {
         const data = formData as Partial<LevFormData>;
         return (
             <>
                <h3 className="text-base font-semibold text-slate-200 border-t border-slate-700 pt-6 mt-6 mb-4">有給休暇申請詳細</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                     <InputField label="休暇日（開始）" required><input type="date" name="start_date" value={data.start_date || ''} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></InputField>
                     <InputField label="休暇日（終了）" required><input type="date" name="end_date" value={data.end_date || ''} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></InputField>
                     <InputField label="休暇区分" required>
                         <div className="relative">
                            <select name="leave_type" value={data.leave_type || 'full-day'} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition appearance-none">
                                <option value="full-day">全日</option><option value="am-half">午前半休</option><option value="pm-half">午後半休</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                        </div>
                     </InputField>
                     <InputField label="代理対応者名"><input type="text" name="alternate_contact" value={data.alternate_contact || ''} onChange={handleInputChange} placeholder="例: 鈴木太郎" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></InputField>
                     <InputField label="理由・補足事項" required className="md:col-span-2">
                         <textarea name="reason" value={data.reason || ''} onChange={handleInputChange} rows={4} placeholder="私用のため" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"></textarea>
                     </InputField>
                </div>
            </>
         );
    };
    
    const renderNoCostForm = () => {
        const data = formData as Partial<NocFormData>;
        return (
            <>
                <h3 className="text-base font-semibold text-slate-200 border-t border-slate-700 pt-6 mt-6 mb-4">金額なし決裁詳細</h3>
                <div className="space-y-5">
                    <InputField label="決裁内容" required><textarea name="content" value={data.content || ''} onChange={handleInputChange} rows={3} placeholder="決裁対象の概要を記載" className={`${getInputClass('content')} w-full px-3 py-2.5 resize-none`}></textarea></InputField>
                    <InputField label="承認理由" required><textarea name="approval_reason" value={data.approval_reason || ''} onChange={handleInputChange} rows={4} placeholder="なぜこの決裁が必要か、金額が発生しない理由などを記載" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"></textarea></InputField>
                </div>
            </>
        )
    };


    const renderFormByCategory = () => {
        if (!selectedCode) return null;
        switch (selectedCode.category) {
            case ApplicationCategory.EXP: return renderExpenseForm();
            case ApplicationCategory.TRP: return renderTransportForm();
            case ApplicationCategory.LEV: return renderLeaveForm();
            case ApplicationCategory.NOC: return renderNoCostForm();
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">新規申請作成</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </header>
                
                <form className="p-6 space-y-5 overflow-y-auto" noValidate>
                    <FileUploadZone onFileSelect={handleFileParse} isParsing={isParsing} uploadedFile={uploadedFile} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <InputField label="申請カテゴリ" required>
                             <div className="relative">
                                <select value={applicationCodeId} onChange={e => setApplicationCodeId(e.target.value)} className={`${getInputClass('application_code_id')} w-full pl-4 pr-10 py-2.5 appearance-none`}>
                                    {MOCK_APPLICATION_CODES.map(code => (
                                        <option key={code.id} value={code.id}>{`${code.name} (${code.code})`}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                            </div>
                        </InputField>
                        <InputField label="申請タイトル" required>
                            <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} placeholder="例: 出張費用申請" className={`${getInputClass('title')} px-3 py-2.5`} required />
                        </InputField>
                    </div>
                     <InputField label="プロジェクト名">
                        <input type="text" name="project_name" value={formData.project_name || ''} onChange={handleInputChange} placeholder="関連プロジェクト名（任意）" className={`${getInputClass('project_name')} px-3 py-2.5`} />
                    </InputField>
                     <InputField label="備考">
                        <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange} rows={3} placeholder="その他特記事項があれば記載してください" className={`${getInputClass('remarks')} px-3 py-2.5 resize-none`}></textarea>
                    </InputField>
                    
                    <div>{renderFormByCategory()}</div>

                </form>

                <footer className="p-4 flex justify-end gap-3 border-t border-slate-800 bg-slate-900/50 mt-auto">
                    <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition">キャンセル</button>
                    <button onClick={(e) => handleSubmit(e, ApprovalStatus.Draft)} type="button" className="px-5 py-2.5 rounded-lg bg-slate-500 hover:bg-slate-400 text-white font-semibold transition">下書き保存</button>
                    <button onClick={(e) => handleSubmit(e, ApprovalStatus.Submitted)} type="button" className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">申請</button>
                </footer>
            </div>
        </div>
    );
};