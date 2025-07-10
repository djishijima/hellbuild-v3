-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order due to dependencies)
DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- 企業テーブル
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  employees VARCHAR(50),
  revenue BIGINT,
  status VARCHAR(50) DEFAULT 'prospect',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 連絡先テーブル
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  position VARCHAR(100),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 案件テーブル
CREATE TABLE deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL,
  stage VARCHAR(50) DEFAULT 'qualification',
  probability INTEGER DEFAULT 0,
  close_date DATE,
  owner VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 稟議テーブル
CREATE TABLE approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  requester_name VARCHAR(255) NOT NULL,
  requester_department VARCHAR(100),
  approver_name VARCHAR(255),
  approver_department VARCHAR(100),
  submitted_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  approved_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_deals_company_id ON deals(company_id);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_approvals_deal_id ON approvals(deal_id);
CREATE INDEX idx_approvals_status ON approvals(status);

-- Row Level Security (RLS) を無効化（開発環境用）
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE approvals DISABLE ROW LEVEL SECURITY;

-- 公開アクセス許可
GRANT ALL ON companies TO anon, authenticated;
GRANT ALL ON contacts TO anon, authenticated;
GRANT ALL ON deals TO anon, authenticated;
GRANT ALL ON approvals TO anon, authenticated;

-- シーケンス権限
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- テーブル作成確認
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('companies', 'contacts', 'deals', 'approvals')
ORDER BY tablename;
