-- サンプル企業データ
INSERT INTO companies (name, industry, employees, revenue, status) VALUES
('株式会社ABC', 'IT・ソフトウェア', '500-1000', 5000000000, 'customer'),
('XYZ商事', '商社・卸売', '100-500', 2000000000, 'prospect'),
('株式会社DEF', '製造業', '1000+', 10000000000, 'customer'),
('テクノロジー株式会社', 'IT・ソフトウェア', '50-100', 500000000, 'prospect'),
('グローバル企業', '金融・保険', '500-1000', 8000000000, 'customer');

-- サンプル連絡先データ
INSERT INTO contacts (name, email, phone, position, company_id, status) VALUES
('田中太郎', 'tanaka@abc.com', '03-1234-5678', '営業部長', 
 (SELECT id FROM companies WHERE name = '株式会社ABC'), 'active'),
('佐藤花子', 'sato@xyz.com', '03-2345-6789', 'マネージャー', 
 (SELECT id FROM companies WHERE name = 'XYZ商事'), 'active'),
('山田次郎', 'yamada@def.co.jp', '03-3456-7890', '取締役', 
 (SELECT id FROM companies WHERE name = '株式会社DEF'), 'active'),
('鈴木一郎', 'suzuki@tech.co.jp', '03-4567-8901', 'CTO', 
 (SELECT id FROM companies WHERE name = 'テクノロジー株式会社'), 'prospect'),
('高橋美咲', 'takahashi@global.com', '03-5678-9012', '部長', 
 (SELECT id FROM companies WHERE name = 'グローバル企業'), 'customer');

-- サンプル案件データ
INSERT INTO deals (title, company_id, contact_id, amount, stage, probability, close_date, owner, description) VALUES
('年間保守契約', 
 (SELECT id FROM companies WHERE name = '株式会社ABC'),
 (SELECT id FROM contacts WHERE name = '田中太郎'),
 2400000, 'negotiation', 75, '2024-02-15', '営業担当A', '年間保守契約の更新案件'),
('システム導入プロジェクト',
 (SELECT id FROM companies WHERE name = 'XYZ商事'),
 (SELECT id FROM contacts WHERE name = '佐藤花子'),
 8500000, 'proposal', 50, '2024-03-01', '営業担当B', '新システム導入の提案'),
('追加ライセンス',
 (SELECT id FROM companies WHERE name = '株式会社DEF'),
 (SELECT id FROM contacts WHERE name = '山田次郎'),
 320000, 'closed-won', 100, '2024-01-20', '営業担当C', '追加ユーザーライセンス'),
('クラウド移行支援',
 (SELECT id FROM companies WHERE name = 'テクノロジー株式会社'),
 (SELECT id FROM contacts WHERE name = '鈴木一郎'),
 1200000, 'qualification', 25, '2024-04-01', '営業担当D', 'クラウドインフラ移行支援'),
('セキュリティ強化',
 (SELECT id FROM companies WHERE name = 'グローバル企業'),
 (SELECT id FROM contacts WHERE name = '高橋美咲'),
 3500000, 'negotiation', 80, '2024-02-28', '営業担当E', 'セキュリティシステム強化');

-- サンプル稟議データ
INSERT INTO approvals (deal_id, title, description, amount, status, priority, requester_name, requester_department, approver_name, approver_department, due_date) VALUES
((SELECT id FROM deals WHERE title = '年間保守契約'),
 '株式会社ABC - 年間保守契約', '年間保守契約の承認をお願いします。継続顧客との重要な契約です。', 2400000, 'pending', 'high', '営業担当A', '営業部', '営業部長', '営業部', '2024-02-01'),
((SELECT id FROM deals WHERE title = 'システム導入プロジェクト'),
 'XYZ商事 - システム導入', 'システム導入プロジェクトの承認をお願いします。大型案件のため慎重な検討が必要です。', 8500000, 'pending', 'high', '営業担当B', '営業部', '営業部長', '営業部', '2024-02-15'),
((SELECT id FROM deals WHERE title = 'セキュリティ強化'),
 'グローバル企業 - セキュリティ強化', 'セキュリティシステム強化の承認をお願いします。', 3500000, 'approved', 'medium', '営業担当E', '営業部', '営業部長', '営業部', '2024-01-25');

-- データ確認クエリ
SELECT 'companies' as table_name, count(*) as record_count FROM companies
UNION ALL
SELECT 'contacts' as table_name, count(*) as record_count FROM contacts
UNION ALL
SELECT 'deals' as table_name, count(*) as record_count FROM deals
UNION ALL
SELECT 'approvals' as table_name, count(*) as record_count FROM approvals
ORDER BY table_name;
