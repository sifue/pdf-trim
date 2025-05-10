#!/usr/bin/env node
import { mkdir, readFile } from "node:fs/promises";
import { fromPath } from "pdf2pic";
import { PDFDocument } from "pdf-lib";

// ========== 設定 ==========
const SRC_PDF = "trimmed.pdf";
const OUT_DIR = "pages";
const DPI     = 300;
const PREFIX  = "page";
// ==========================

// 0) 仕向けフォルダ
await mkdir(OUT_DIR, { recursive: true });

// 1) トリム後 PDF の実サイズを取得
const pdfBuf = await readFile(SRC_PDF);
const doc    = await PDFDocument.load(pdfBuf);
const { width: ptW, height: ptH } = doc.getPages()[0].getSize();

// pt → px  (72 pt = 1 inch)
const wPx = Math.round(ptW * DPI / 72);
const hPx = Math.round(ptH * DPI / 72);

// 2) pdf2pic へ幅高さを明示
const store = fromPath(SRC_PDF, {
  density:     DPI,
  format:      "png",
  width:       wPx,
  height:      hPx,
  savePath:    OUT_DIR,
  saveFilename: PREFIX,
});

console.time("split");

await store.bulk(-1);
console.timeEnd("split");
console.log("✅ PNG 出力:", OUT_DIR);