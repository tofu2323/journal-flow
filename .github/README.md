# GitHub Actions CI/CD Setup

このプロジェクトでは、Supabaseの公式ベストプラクティスに従ったCI/CDパイプラインを実装しています。

## ワークフロー概要

### 1. Infrastructure Deployment (`infrastructure.yml`)
- Terraformを使用したSupabaseインフラストラクチャの管理
- プルリクエストでのプラン確認
- mainブランチへのマージ時の自動デプロイ

### 2. Database Migration (`database.yml`)
- Supabase CLIを使用したマイグレーション管理
- ローカル環境でのマイグレーション検証
- 環境別の自動デプロイ

### 3. Application CI/CD (`application.yml`)
- React アプリケーションのテスト・ビルド・デプロイ
- プルリクエストでのプレビューデプロイ
- 環境別の本番デプロイ

## 必要なシークレット設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定してください：

### Repository Secrets

#### Supabase関連
```
SUPABASE_ACCESS_TOKEN=your-supabase-access-token
SUPABASE_ORG_ID=your-supabase-organization-id
SUPABASE_DB_PASSWORD_DEV=your-dev-database-password
SUPABASE_DB_PASSWORD_PROD=your-prod-database-password
SUPABASE_PROJECT_REF_DEV=your-dev-project-reference
SUPABASE_PROJECT_REF_PROD=your-prod-project-reference
```

#### デプロイメント関連
GitHub Pagesを使用するため、追加のデプロイメント用シークレットは不要です。
GITHUB_TOKENが自動的に使用されます。

### Repository Variables

```
SUPABASE_REGION=ap-northeast-1
```

## Environment設定

GitHub リポジトリの Settings > Environments で以下の環境を作成してください：

### development
- developブランチからのデプロイ用
- 開発環境のSupabaseプロジェクトと連携

### production
- mainブランチからのデプロイ用
- 本番環境のSupabaseプロジェクトと連携
- Protection rulesを設定して承認フローを追加することを推奨

## セットアップ手順

### 1. Supabaseアクセストークンの取得
1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. Settings > Access Tokens でトークンを生成
3. `SUPABASE_ACCESS_TOKEN` として設定

### 2. Supabase組織IDの取得
1. Supabase Dashboard の組織設定から組織IDを確認
2. `SUPABASE_ORG_ID` として設定

### 3. Terraformでインフラストラクチャをデプロイ
```bash
# ローカルでの初回セットアップ
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvarsに実際の値を入力
terraform init
terraform plan
terraform apply
```

### 4. プロジェクトリファレンスの取得
Terraformデプロイ後、出力されるプロジェクトIDを以下として設定：
- `SUPABASE_PROJECT_REF_DEV`
- `SUPABASE_PROJECT_REF_PROD`

### 5. GitHub Pagesの設定
1. リポジトリ設定でGitHub Pagesを有効化
2. Source を "GitHub Actions" に設定
3. 追加のシークレット設定は不要（GITHUB_TOKENを自動使用）

## ワークフローの動作

### プルリクエスト時
1. Terraformプランの確認とコメント
2. データベースマイグレーションの検証
3. アプリケーションのテスト・ビルド
4. プレビューデプロイ（設定されている場合）

### developブランチへのマージ時
1. 開発環境へのインフラストラクチャデプロイ
2. 開発環境へのマイグレーション適用
3. 開発環境へのアプリケーションデプロイ

### mainブランチへのマージ時
1. 本番環境へのインフラストラクチャデプロイ
2. 本番環境へのマイグレーション適用
3. 本番環境へのアプリケーションデプロイ

## トラブルシューティング

### Terraform関連
- アクセストークンの有効性を確認
- 組織IDが正しいか確認
- リージョンの可用性を確認

### Supabase CLI関連
- プロジェクトリファレンスが正しいか確認
- マイグレーションファイルの構文を確認

### アプリケーション関連
- Node.jsのバージョン互換性を確認
- 依存関係の更新状況を確認

## 参考資料

- [Supabase Terraform Guide](https://supabase.com/docs/guides/deployment/terraform)
- [Supabase GitHub Actions Example](https://github.com/supabase/supabase-action-example)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)