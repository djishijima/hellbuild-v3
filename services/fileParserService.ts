
import { ApplicationCategory } from '@/types';

// This is a mock of a more complex data structure you'd get from a real AI parsing service.
// It includes potential fields across different form types.
export interface ParsedFileData {
    title?: string;
    application_code_id?: string;
    project_name?: string;
    amount?: number;
    content?: string;
    description?: string;
    billing_date?: string;
    payment_due_date?: string;
    recipient_id?: string;
    departure?: string;
    arrival?: string;
    datetime?: string;
    subject?: string;
    // ... any other fields
}

/**
 * Simulates calling a backend AI service (like Gemini or Document AI) to parse a file.
 * In a real application, this would involve uploading the file and calling a cloud function.
 * Here, we use the filename to determine the mock response.
 * @param file The file to be "analyzed".
 * @returns A promise that resolves to the parsed data.
 */
export const parseFileWithAI = async (file: File): Promise<ParsedFileData> => {
    // Simulate API call delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fileName = file.name.toLowerCase();

    // Example 1: Expense Report PDF - "経費申請書_2025年7月_山田.pdf"
    if (fileName.includes('経費申請書') && fileName.includes('pdf')) {
        return {
            title: '出張経費レポート（山田様）',
            application_code_id: 'code-exp-01', // 経費
            project_name: '山田プロジェクト',
            amount: 45800,
            content: `2025/07/20 東京 -> 福岡 航空券および現地交通費`,
            billing_date: '2025-07-20',
            payment_due_date: '2025-08-31',
            recipient_id: '4b9d0e1f-2a3b-4c5d-6e7f8a9b0c1e2f3a', // JR
        };
    }

    // Example 2: Transportation receipt image - "交通費領収書_タクシー_7月10日.jpg"
    if (fileName.includes('交通費領収書') && (fileName.includes('jpg') || fileName.includes('png'))) {
        return {
            title: 'タクシー代精算 (7/10)',
            application_code_id: 'code-trp-01', // 交通費
            amount: 3250,
            departure: '渋谷本社',
            arrival: '新宿クライアント先',
            datetime: '2025-07-10T14:30',
            recipient_id: '5c0e1f2a-3b4c-5d6e-7f8a9b0c1e2f3a4b', // 日本交通
        };
    }
    
    // Example 3: General Invoice - "請求書_サンプル商事_INV-001.pdf"
    if (fileName.includes('請求書')) {
         return {
            title: `請求書対応 (${file.name.replace(/\.[^/.]+$/, "")})`,
            application_code_id: 'code-exp-01', // 経費
            amount: 150000,
            recipient_id: '1e6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c', // 株式会社サンプル商事
            content: `請求書No. INV-001 の支払い`,
            subject: '業務委託費',
            billing_date: '2025-07-01',
            payment_due_date: '2025-07-31',
        };
    }

    // Default fallback if no specific pattern matches
    return {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension from filename
        content: `ファイル '${file.name}' の内容を確認し、詳細を記載してください。`,
    };
};