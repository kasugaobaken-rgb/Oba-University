大馬大学サイト ARG証拠連携版

アップロード時は、このフォルダ内の全ファイルを GitHub Pages の Oba-University リポジトリ直下へ反映してください。

重要ファイル:
- arg-daiba-helper.js
- style.css
- index.html / clubs.html / alumni-portal.html ほか全HTML

動作:
- 全ページ訪問時に localStorage.mogami_arg_visited_sites へ daiba を保存します。
- 各ページの「調査メモに保存」ボタンで localStorage.mogami_arg_evidence に証拠を保存します。
- 最上フォームに戻ると、添付できる証拠として表示されます。

主な証拠ID:
- daiba_site_found
- daiba_club_rule
- daiba_alumni_record
- daiba_occult_club

反映後に効かない場合:
1. GitHub Pagesに arg-daiba-helper.js がアップされているか確認
2. ブラウザキャッシュを更新（スマホならページ再読み込み）
3. 最上フォーム側で「調査メモを再読み込み」を押す
