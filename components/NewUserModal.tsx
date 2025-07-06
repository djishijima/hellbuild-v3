
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { XMarkIcon } from './icons';

type NewUserModalProps = {
    onClose: () => void;
    onSubmit: (user: User) => void;
};

const InputField = ({ label, children, required = false, className = '' }: { label: string, children: React.ReactNode, required?: boolean, className?: string }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        {children}
    </div>
);

export const NewUserModal: React.FC<NewUserModalProps> = ({ onClose, onSubmit }) => {
    const [newUser, setNewUser] = useState<Partial<User>>({
        role: UserRole.User,
        status: UserStatus.Active,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!newUser.name?.trim()) newErrors.name = '氏名は必須です。';
        if (!newUser.email?.trim()) {
            newErrors.email = 'メールアドレスは必須です。';
        } else if (!/^\S+@\S+\.\S+$/.test(newUser.email)) {
            newErrors.email = '有効なメールアドレスを入力してください。';
        }
        if (!newUser.employee_id?.trim()) newErrors.employee_id = '社員IDは必須です。';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const finalUser: User = {
                id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Generate temporary unique ID
                employee_id: newUser.employee_id!,
                email: newUser.email!,
                name: newUser.name!,
                role: newUser.role!,
                status: newUser.status!,
                avatar_url: newUser.avatar_url || `https://i.pravatar.cc/150?u=${newUser.employee_id}`,
            };
            onSubmit(finalUser);
        }
    };

    return (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">新規ユーザー追加</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </header>
                
                <form className="p-6 space-y-5 overflow-y-auto" onSubmit={handleSubmit} noValidate>
                    <InputField label="氏名" required>
                        <input type="text" name="name" onChange={handleInputChange} className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors`} />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </InputField>
                     <InputField label="メールアドレス" required>
                        <input type="email" name="email" onChange={handleInputChange} className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors`} />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </InputField>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="社員ID" required>
                            <input type="text" name="employee_id" onChange={handleInputChange} className={`w-full bg-slate-800 border ${errors.employee_id ? 'border-red-500' : 'border-slate-700'} rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors`} />
                             {errors.employee_id && <p className="text-red-400 text-xs mt-1">{errors.employee_id}</p>}
                        </InputField>
                         <InputField label="役職" required>
                            <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none">
                                {Object.values(UserRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </InputField>
                    </div>
                     <InputField label="ステータス" required>
                        <select name="status" value={newUser.status} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none">
                            {Object.values(UserStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </InputField>
                    <InputField label="アバターURL (任意)">
                        <input type="text" name="avatar_url" onChange={handleInputChange} placeholder="空の場合は自動生成されます" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors" />
                    </InputField>
                </form>

                <footer className="p-4 flex justify-end gap-3 border-t border-slate-800 bg-slate-900/50 mt-auto">
                    <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition">キャンセル</button>
                    <button onClick={handleSubmit} type="submit" className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">保存</button>
                </footer>
            </div>
        </div>
    );
};
