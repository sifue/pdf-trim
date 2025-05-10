#!/usr/bin/env node
import fs from "node:fs/promises";
import { PDFDocument, degrees } from "pdf-lib";

// ========== 設定 ==========
const SRC  = "IMG_20250511_0002.pdf";
const DEST = "trimmed.pdf";
const keepWidthMm  = 62;    // 残す横幅
const keepHeightMm = 86;   // 残す縦幅
// ==========================

const mm2pt = (mm) => mm * 72 / 25.4;

const buf  = await fs.readFile(SRC);
const pdf  = await PDFDocument.load(buf);
const pages = pdf.getPages();

for (const page of pages) {
  /* 回転付きスキャン対策：
     90°/270°のページは先に 0° に戻す（内容は回転しないので実質「旗」解除） */
  page.setRotation(degrees(0));

  const { height } = page.getSize();          // pt
  const cropLeft   = 0;
  const cropBottom = height - mm2pt(keepHeightMm);
  const cropWidth  = mm2pt(keepWidthMm);
  const cropHeight = mm2pt(keepHeightMm);

  // ① 見せたい範囲
  page.setCropBox(cropLeft, cropBottom, cropWidth, cropHeight);
  // ② ページ自体のサイズも合わせる
  page.setMediaBox(cropLeft, cropBottom, cropWidth, cropHeight); // :contentReference[oaicite:1]{index=1}
}

await fs.writeFile(DEST, await pdf.save());
console.log("✅ Crop 完了 →", DEST);