# 露出コントラスト補正コマンド

```ps1
Get-ChildItem -Path .\pages -Filter *.png |
  ForEach-Object {
      & gm.exe convert $_.FullName -level 0,50% -sigmoidal-contrast 5,50% $_.FullName
      Write-Host "✔ 補正完了:" $_.Name
  }
```