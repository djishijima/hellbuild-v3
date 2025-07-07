-- Insert sample application codes
INSERT INTO application_codes (code, name, category, description) VALUES
('EXP001', '経費申請', 'EXP', '一般的な経費申請'),
('TRP001', '交通費申請', 'TRP', '交通費の申請'),
('LEV001', '有給休暇申請', 'LEV', '有給休暇の申請'),
('NOC001', '金額なし決裁', 'NOC', '金額を伴わない決裁申請')
ON CONFLICT (code) DO NOTHING;

-- Insert sample users
INSERT INTO users (employee_id, email, name, role, phone) VALUES
('EMP001', 'admin@bunshodo.com', '管理者', 'admin', '03-1234-5678'),
('EMP002', 'manager@bunshodo.com', 'マネージャー', 'manager', '03-1234-5679'),
('EMP003', 'user@bunshodo.com', 'ユーザー', 'user', '03-1234-5680')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert sample payment recipients
INSERT INTO payment_recipients (
    recipient_name, company_name, bank_code, bank_name, 
    branch_code, branch_name, account_type, account_number, account_holder
) VALUES
('東京リスマチック', '東京リスマチック株式会社', '0001', 'みずほ銀行', '001', '本店', '普通', '1234567', 'トウキョウリスマチック'),
('東印工組政策審議会', '東印工組政策審議会', '0005', '三菱UFJ銀行', '002', '新宿支店', '普通', '2345678', 'トウインコウクミセイサクシンギカイ'),
('ピコシステム', 'ピコシステム株式会社', '0009', '三井住友銀行', '003', '渋谷支店', '普通', '3456789', 'ピコシステム')
ON CONFLICT DO NOTHING;

-- Insert sample customers
INSERT INTO customers (name, industry, contact_name, phone, email, address) VALUES
('株式会社サンプル', '製造業', '田中太郎', '03-1111-2222', 'tanaka@sample.co.jp', '東京都千代田区1-1-1'),
('テスト商事株式会社', '商社', '佐藤花子', '06-3333-4444', 'sato@test-corp.com', '大阪府大阪市2-2-2'),
('デモ技術株式会社', 'IT', '鈴木一郎', '03-5555-6666', 'suzuki@demo-tech.jp', '東京都渋谷区3-3-3')
ON CONFLICT DO NOTHING;
