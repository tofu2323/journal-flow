# Journal Flow Infrastructure

このディレクトリには、Journal FlowアプリケーションのSupabaseインフラをプロビジョニングするためのTerraform設定が含まれています。

## アーキテクチャ概要

**ベストプラクティス**: 
- **Terraform**: インフラストラクチャ（プロジェクト作成、認証設定）の管理
- **Supabase CLI**: データベーススキーマとマイグレーションの管理

この分離により、データ損失のリスクを最小化し、適切なマイグレーション管理を実現します。

## 前提条件

1. **Terraform**: Terraform >= 1.0をインストール
2. **Supabase CLI**: Supabase CLIをインストール (`npm install -g supabase`)
3. **Supabaseアカウント**: Supabaseアカウントと組織を作成
4. **Supabaseアクセストークン**: Supabaseダッシュボードからアクセストークンを生成

## セットアップ

### 1. Terraformの設定

```bash
# 変数ファイルをコピー
cp terraform.tfvars.example terraform.tfvars

# terraform.tfvarsに実際の値を入力:
# - supabase_access_token: Supabaseアクセストークン
# - supabase_org_id: Supabase組織ID
# - supabase_region: 希望するリージョン (デフォルト: ap-northeast-1)
# - supabase_db_password_dev: 開発環境用の強力なパスワード
# - supabase_db_password_prod: 本番環境用の強力なパスワード
```

### 2. インフラストラクチャのデプロイ

```bash
# Terraformを初期化
terraform init

# デプロイ計画を確認
terraform plan

# インフラストラクチャをデプロイ
terraform apply
```

### 3. データベーススキーマの管理

```bash
# Supabaseプロジェクトにリンク（開発環境）
supabase link --project-ref <dev-project-id>

# マイグレーションを適用
supabase db push

# 本番環境の場合
supabase link --project-ref <prod-project-id>
supabase db push
```

## 環境

この設定では2つの環境を作成します：
- **開発環境**: `journal-flow-dev`
- **本番環境**: `journal-flow-prod`

各環境には以下が含まれます：
- Supabaseプロジェクトとデータベース
- 認証設定
- 適切なリダイレクトURL設定

## データベーススキーマ

スキーマは`supabase/migrations/`で管理され、以下を含みます：
- `profiles`: ユーザープロファイル情報
- `journals`: ユーザーに関連付けられたジャーナルエントリ
- `sync_metadata`: 同期追跡情報
- Row Level Security (RLS) ポリシーによるデータ分離
- タイムスタンプ自動更新のトリガー
- リアルタイム機能の有効化

## マイグレーション管理

### 新しいマイグレーションの作成
```bash
supabase migration new <migration_name>
```

### マイグレーションの適用
```bash
supabase db push
```

### スキーマの差分確認
```bash
supabase db diff
```

## 出力値

デプロイ成功後、以下が取得できます：
- 両環境のプロジェクトIDとURL
- クライアントサイド認証用の匿名キー
- サーバーサイド操作用のサービスロールキー

## 制限事項と手動設定が必要な項目

### Terraform プロバイダーの制限
現在のSupabase Terraformプロバイダーでは以下が制限されています：

1. **認証設定**: プロジェクト作成後、Supabaseダッシュボードで手動設定が必要
2. **APIキー**: anon keyとservice role keyはダッシュボードから手動取得
3. **詳細設定**: リアルタイム設定などは手動で有効化

### プロジェクト作成後の手動作業
1. Supabaseダッシュボードにログイン
2. 認証設定（サイトURL、リダイレクトURLなど）を設定
3. APIキーをコピーしてアプリケーション設定に追加
4. 必要に応じてリアルタイム機能を有効化

## セキュリティ注意事項

- `terraform.tfvars`をバージョン管理にコミットしない
- データベースアクセスには強力でユニークなパスワードを使用
- 機密性の高い出力値は安全に保存
- 本番デプロイ前にRLSポリシーを確認

## トラブルシューティング

1. **プロバイダー認証エラー**: Supabaseアクセストークンを確認
2. **組織が見つからない**: 組織IDを確認
3. **リージョンの可用性**: 選択したリージョンがSupabaseをサポートしているか確認
4. **マイグレーションエラー**: `supabase/migrations/`内のSQL構文を確認

## なぜこのアプローチなのか？

1. **データ安全性**: Terraformでスキーマを管理すると、リソース再作成時にデータが失われるリスクがあります
2. **マイグレーション管理**: Supabase CLIは段階的なスキーマ変更と適切なマイグレーション履歴を提供します
3. **開発体験**: ローカル開発環境とのシームレスな統合
4. **ベストプラクティス**: Supabaseコミュニティで推奨される標準的なアプローチです