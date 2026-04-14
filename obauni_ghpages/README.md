# 大馬大学（おおばだいがく） — Oba University

架空の東京都内私立大学のウェブサイトです。

## GitHub Pages への公開手順

1. このリポジトリを GitHub に push する
2. リポジトリの **Settings → Pages** を開く
3. **Source** を `Deploy from a branch` に設定
4. **Branch** を `main`（または `master`）、フォルダを `/ (root)` に設定
5. **Save** をクリック
6. しばらく待つと `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

## ページ構成

| ファイル | ページ |
|---|---|
| `index.html` | トップページ |
| `about.html` | 大学案内（学長挨拶・沿革） |
| `faculties.html` | 学部・大学院 一覧 |
| `faculty-literature.html` | 文学部 |
| `faculty-economics.html` | 経済学部 |
| `faculty-law.html` | 法学部 |
| `faculty-arts.html` | 芸術学部 |
| `student-life.html` | 学生生活 |
| `clubs.html` | サークル・課外活動 |
| `facilities.html` | 施設案内 |
| `portal.html` | 在学生ポータル（ログイン画面） |
| `admissions.html` | 入試情報 |
| `research.html` | 研究活動 |
| `career.html` | 就職・進路 |
| `international.html` | 国際交流 |
| `library.html` | 図書館 |
| `access.html` | アクセス・キャンパスマップ |
| `news.html` | お知らせ一覧 |

## ローカルでの確認

```bash
# Python が入っていれば
python -m http.server 8000
# → http://localhost:8000 で確認
```

---

*架空のコンテンツです。実在の人物・団体・機関とは一切関係ありません。*
