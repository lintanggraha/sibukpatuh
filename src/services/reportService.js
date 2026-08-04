/**
 * reportService.js
 * Service untuk generate laporan PDF dan Excel
 * Digunakan oleh Gap Analysis dan Compliance Simulator
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

// ─── Konstanta Branding ───────────────────────────────────────────────────────
const BRAND = {
  name: 'SibukPatuh',
  tagline: 'Platform Edukasi Kepatuhan & Keamanan Siber',
  url: 'sibukpatuh.net',
  colors: {
    primary: [37, 99, 235],      // blue-600
    success: [22, 163, 74],      // green-600
    warning: [202, 138, 4],      // yellow-600
    danger: [220, 38, 38],       // red-600
    dark: [15, 23, 42],          // slate-900
    muted: [100, 116, 139],      // slate-500
    light: [241, 245, 249],      // slate-100
    white: [255, 255, 255],
  },
};

// ─── Helper: Format tanggal ───────────────────────────────────────────────────
function formatDate(date = new Date()) {
  return date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatDateTime(date = new Date()) {
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Helper: Status badge color untuk PDF ────────────────────────────────────
function statusColor(status) {
  if (status === 'Covered' || status === 'success') return BRAND.colors.success;
  if (status === 'Partial' || status === 'warning') return BRAND.colors.warning;
  return BRAND.colors.danger;
}

function statusLabel(status, isEn = false) {
  const map = {
    Covered: isEn ? 'Covered' : 'Terpenuhi',
    Partial: isEn ? 'Partial' : 'Sebagian',
    Gap: isEn ? 'Gap' : 'Kesenjangan',
    danger: isEn ? 'Violation / High Risk' : 'Pelanggaran / Risiko Tinggi',
    warning: isEn ? 'Attention / Warning' : 'Perhatian / Warning',
    success: isEn ? 'Safe / Compliant' : 'Aman / Compliant',
  };
  return map[status] || status;
}

// ─────────────────────────────────────────────────────────────────────────────
//  PDF: Header & Footer helper
// ─────────────────────────────────────────────────────────────────────────────
function addPdfHeader(doc, title, subtitle, pageWidth) {
  // Background strip
  doc.setFillColor(...BRAND.colors.primary);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...BRAND.colors.white);
  doc.text(BRAND.name, 14, 11);

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(186, 210, 255);
  doc.text(BRAND.url, 14, 17);

  // Report title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.colors.white);
  doc.text(title, pageWidth / 2, 11, { align: 'center' });

  // Subtitle / date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(186, 210, 255);
  doc.text(subtitle, pageWidth / 2, 17, { align: 'center' });

  // Generated date (right side)
  doc.setFontSize(7);
  doc.text(`Digenerate: ${formatDateTime()}`, pageWidth - 14, 17, { align: 'right' });

  doc.setTextColor(...BRAND.colors.dark);
}

function addPdfFooter(doc, pageWidth, pageHeight, pageNum, totalPages) {
  doc.setFillColor(...BRAND.colors.light);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.colors.muted);
  doc.text(
    `${BRAND.name} — ${BRAND.tagline}  |  ${BRAND.url}`,
    14, pageHeight - 4,
  );
  doc.text(
    `Halaman ${pageNum} dari ${totalPages}`,
    pageWidth - 14, pageHeight - 4,
    { align: 'right' },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORT: Gap Analysis → PDF
// ─────────────────────────────────────────────────────────────────────────────
export function exportGapAnalysisPDF({ sourceName, targetName, stats, results, isEn = false }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const title = isEn ? 'Gap Analysis Report' : 'Laporan Gap Analysis';
  const subtitle = `${sourceName}  →  ${targetName}  |  ${formatDate()}`;

  // ── Cover summary ──────────────────────────────────────────────────────────
  addPdfHeader(doc, title, subtitle, pageWidth);

  let y = 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.colors.dark);
  doc.text(isEn ? 'Executive Summary' : 'Ringkasan Eksekutif', 14, y);

  y += 6;
  const summaryData = [
    [
      { content: isEn ? 'Total Controls' : 'Total Kontrol', styles: { fontStyle: 'bold', fillColor: BRAND.colors.light } },
      { content: String(stats.total), styles: { halign: 'center' } },
      { content: isEn ? 'Covered' : 'Terpenuhi', styles: { fontStyle: 'bold', fillColor: BRAND.colors.light } },
      { content: `${stats.covered} (${stats.coveredPct}%)`, styles: { halign: 'center', textColor: BRAND.colors.success } },
      { content: isEn ? 'Partial' : 'Sebagian', styles: { fontStyle: 'bold', fillColor: BRAND.colors.light } },
      { content: `${stats.partial} (${stats.partialPct}%)`, styles: { halign: 'center', textColor: BRAND.colors.warning } },
      { content: 'Gap', styles: { fontStyle: 'bold', fillColor: BRAND.colors.light } },
      { content: `${stats.gap} (${stats.gapPct}%)`, styles: { halign: 'center', textColor: BRAND.colors.danger } },
    ],
  ];

  autoTable(doc, {
    startY: y,
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ── Detail table ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(isEn ? 'Detailed Gap Analysis' : 'Detail Gap Analysis', 14, y);
  y += 4;

  const head = [[
    isEn ? 'Control ID' : 'ID Kontrol',
    isEn ? `Requirement (${sourceName})` : `Persyaratan (${sourceName})`,
    isEn ? 'Status' : 'Status',
    isEn ? `Coverage (${targetName})` : `Cakupan (${targetName})`,
    isEn ? 'Gap / Notes' : 'Kesenjangan / Catatan',
  ]];

  const body = results.map((item) => [
    item.sourceRef || item.req?.id || '',
    item.req?.name || '',
    statusLabel(item.status, isEn),
    item.targetDetail || '-',
    item.gapReason || item.targetNote || '-',
  ]);

  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: 'striped',
    headStyles: {
      fillColor: BRAND.colors.primary,
      textColor: BRAND.colors.white,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 60 },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 70 },
      4: { cellWidth: 'auto' },
    },
    didParseCell(data) {
      if (data.column.index === 2 && data.section === 'body') {
        const status = results[data.row.index]?.status;
        data.cell.styles.textColor = statusColor(status);
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
    didDrawPage(data) {
      const pg = doc.internal.getCurrentPageInfo().pageNumber;
      const total = doc.internal.getNumberOfPages();
      addPdfFooter(doc, pageWidth, pageHeight, pg, total);
    },
  });

  // Footer pada halaman pertama jika hanya 1 halaman
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPdfFooter(doc, pageWidth, pageHeight, i, totalPages);
  }

  const filename = `GapAnalysis_${sourceName}_vs_${targetName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORT: Gap Analysis → Excel
// ─────────────────────────────────────────────────────────────────────────────
export async function exportGapAnalysisExcel({ sourceName, targetName, stats, results, isEn = false }) {
  const wb = new ExcelJS.Workbook();
  wb.creator = BRAND.name;
  wb.created = new Date();

  // ── Sheet 1: Summary ───────────────────────────────────────────────────────
  const wsSummary = wb.addWorksheet(isEn ? 'Summary' : 'Ringkasan');

  // Header branding
  wsSummary.mergeCells('A1:F1');
  const titleCell = wsSummary.getCell('A1');
  titleCell.value = `${BRAND.name} — ${isEn ? 'Gap Analysis Report' : 'Laporan Gap Analysis'}`;
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsSummary.getRow(1).height = 28;

  wsSummary.mergeCells('A2:F2');
  const subCell = wsSummary.getCell('A2');
  subCell.value = `${sourceName}  →  ${targetName}  |  Digenerate: ${formatDateTime()}`;
  subCell.font = { italic: true, size: 9, color: { argb: 'FF64748B' } };
  subCell.alignment = { horizontal: 'center' };

  wsSummary.addRow([]);

  // Summary stats
  const statsHeader = wsSummary.addRow([
    isEn ? 'Total Controls' : 'Total Kontrol',
    isEn ? 'Covered' : 'Terpenuhi',
    isEn ? 'Partial' : 'Sebagian',
    'Gap',
    isEn ? 'Coverage %' : 'Persentase Terpenuhi',
    isEn ? 'Gap %' : 'Persentase Kesenjangan',
  ]);
  statsHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
    cell.alignment = { horizontal: 'center' };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } } };
  });

  const statsRow = wsSummary.addRow([
    stats.total,
    stats.covered,
    stats.partial,
    stats.gap,
    `${stats.coveredPct}%`,
    `${stats.gapPct}%`,
  ]);
  statsRow.getCell(2).font = { bold: true, color: { argb: 'FF16A34A' } };
  statsRow.getCell(3).font = { bold: true, color: { argb: 'FFCA8A04' } };
  statsRow.getCell(4).font = { bold: true, color: { argb: 'FFDC2626' } };
  statsRow.eachCell((cell) => { cell.alignment = { horizontal: 'center' }; });

  wsSummary.columns = [
    { width: 20 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 18 }, { width: 18 },
  ];

  // ── Sheet 2: Detail ────────────────────────────────────────────────────────
  const wsDetail = wb.addWorksheet(isEn ? 'Detail' : 'Detail Analisis');

  // Header branding
  wsDetail.mergeCells('A1:E1');
  const detailTitle = wsDetail.getCell('A1');
  detailTitle.value = `${BRAND.name} — ${isEn ? 'Detailed Gap Analysis' : 'Detail Gap Analysis'}: ${sourceName} → ${targetName}`;
  detailTitle.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  detailTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  detailTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsDetail.getRow(1).height = 24;

  wsDetail.addRow([]);

  const detailHeader = wsDetail.addRow([
    isEn ? 'Control ID' : 'ID Kontrol',
    isEn ? `Requirement (${sourceName})` : `Persyaratan (${sourceName})`,
    'Status',
    isEn ? `Coverage (${targetName})` : `Cakupan (${targetName})`,
    isEn ? 'Gap / Notes' : 'Kesenjangan / Catatan',
  ]);
  detailHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    cell.alignment = { horizontal: 'center', wrapText: true };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF1D4ED8' } } };
  });

  const statusColorMap = {
    Covered: 'FF16A34A',
    Partial: 'FFCA8A04',
    Gap: 'FFDC2626',
  };

  results.forEach((item, idx) => {
    const row = wsDetail.addRow([
      item.sourceRef || item.req?.id || '',
      item.req?.name || '',
      statusLabel(item.status, isEn),
      item.targetDetail || '-',
      item.gapReason || item.targetNote || '-',
    ]);

    // Zebra stripe
    if (idx % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      });
    }

    // Status cell color
    const statusCell = row.getCell(3);
    statusCell.font = { bold: true, color: { argb: statusColorMap[item.status] || 'FF374151' } };
    statusCell.alignment = { horizontal: 'center' };

    row.eachCell((cell) => {
      cell.alignment = { ...cell.alignment, wrapText: true, vertical: 'top' };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } } };
    });
  });

  wsDetail.columns = [
    { width: 16 },
    { width: 50 },
    { width: 18 },
    { width: 55 },
    { width: 55 },
  ];

  // ── Sheet 3: Gap Only ──────────────────────────────────────────────────────
  const wsGap = wb.addWorksheet(isEn ? 'Gaps Only' : 'Hanya Kesenjangan');

  wsGap.mergeCells('A1:E1');
  const gapTitle = wsGap.getCell('A1');
  gapTitle.value = isEn ? `Gap Items — ${sourceName} vs ${targetName}` : `Item Kesenjangan — ${sourceName} vs ${targetName}`;
  gapTitle.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  gapTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
  gapTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsGap.getRow(1).height = 24;

  wsGap.addRow([]);

  const gapHeader = wsGap.addRow([
    isEn ? 'Control ID' : 'ID Kontrol',
    isEn ? `Requirement (${sourceName})` : `Persyaratan (${sourceName})`,
    isEn ? 'Description' : 'Deskripsi',
    isEn ? 'Gap Reason' : 'Alasan Kesenjangan',
    isEn ? 'Recommended Action' : 'Tindakan yang Disarankan',
  ]);
  gapHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
    cell.alignment = { horizontal: 'center', wrapText: true };
  });

  const gapItems = results.filter((r) => r.status === 'Gap' || r.status === 'Partial');
  gapItems.forEach((item) => {
    const row = wsGap.addRow([
      item.sourceRef || item.req?.id || '',
      item.req?.name || '',
      item.req?.desc || '',
      item.gapReason || item.targetNote || isEn ? 'Not covered by target framework' : 'Tidak dicakup oleh framework target',
      isEn ? 'Review and implement corresponding controls' : 'Tinjau dan implementasikan kontrol yang sesuai',
    ]);
    row.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFFECACA' } } };
    });
  });

  wsGap.columns = [
    { width: 16 }, { width: 50 }, { width: 50 }, { width: 55 }, { width: 55 },
  ];

  // ── Download ───────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GapAnalysis_${sourceName}_vs_${targetName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORT: Compliance Simulator → PDF
// ─────────────────────────────────────────────────────────────────────────────
export function exportSimulatorPDF({ scenario, results, isEn = false }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const title = isEn ? 'Compliance Simulation Report' : 'Laporan Simulasi Kepatuhan';
  const subtitle = formatDate();

  addPdfHeader(doc, title, subtitle, pageWidth);

  let y = 36;

  // ── Scenario summary ───────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.colors.dark);
  doc.text(isEn ? 'Simulation Scenario' : 'Skenario Simulasi', 14, y);
  y += 5;

  const scenarioRows = [
    [isEn ? 'Industry' : 'Industri', scenario.industries?.join(', ') || '-'],
    [isEn ? 'Server Location' : 'Lokasi Server', scenario.locations?.join(', ') || '-'],
    [isEn ? 'Data Types' : 'Jenis Data', scenario.dataTypes?.join(', ') || '-'],
    [isEn ? 'System Managers' : 'Pengelola Sistem', scenario.usages?.join(', ') || '-'],
    [isEn ? 'Target Frameworks' : 'Framework Target', scenario.targets?.join(', ') || '-'],
  ];

  autoTable(doc, {
    startY: y,
    body: scenarioRows,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, fillColor: BRAND.colors.light },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ── Risk summary count ─────────────────────────────────────────────────────
  const dangerCount = results.filter((r) => r.severity === 'danger').length;
  const warningCount = results.filter((r) => r.severity === 'warning').length;
  const successCount = results.filter((r) => r.severity === 'success').length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(isEn ? 'Risk Summary' : 'Ringkasan Risiko', 14, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    body: [[
      { content: isEn ? `${dangerCount} Violations` : `${dangerCount} Pelanggaran`, styles: { textColor: BRAND.colors.danger, fontStyle: 'bold', halign: 'center', fillColor: [254, 242, 242] } },
      { content: isEn ? `${warningCount} Warnings` : `${warningCount} Peringatan`, styles: { textColor: BRAND.colors.warning, fontStyle: 'bold', halign: 'center', fillColor: [255, 251, 235] } },
      { content: isEn ? `${successCount} Compliant` : `${successCount} Patuh`, styles: { textColor: BRAND.colors.success, fontStyle: 'bold', halign: 'center', fillColor: [240, 253, 244] } },
    ]],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 4 },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ── Findings detail ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(isEn ? 'Compliance Findings' : 'Temuan Kepatuhan', 14, y);
  y += 4;

  const findingsHead = [[
    '#',
    isEn ? 'Area / Framework' : 'Area / Framework',
    isEn ? 'Risk Level' : 'Tingkat Risiko',
    isEn ? 'Finding' : 'Temuan',
    isEn ? 'Recommendation' : 'Rekomendasi',
  ]];

  const findingsBody = results.map((res, idx) => [
    idx + 1,
    res.framework,
    statusLabel(res.severity, isEn),
    res.message,
    res.recommendation || '-',
  ]);

  autoTable(doc, {
    startY: y,
    head: findingsHead,
    body: findingsBody,
    theme: 'striped',
    headStyles: {
      fillColor: BRAND.colors.primary,
      textColor: BRAND.colors.white,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 38 },
      2: { cellWidth: 28, halign: 'center' },
      3: { cellWidth: 55 },
      4: { cellWidth: 'auto' },
    },
    didParseCell(data) {
      if (data.column.index === 2 && data.section === 'body') {
        const severity = results[data.row.index]?.severity;
        data.cell.styles.textColor = statusColor(severity);
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPdfFooter(doc, pageWidth, pageHeight, i, totalPages);
  }

  const filename = `ComplianceSimulator_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORT: Compliance Simulator → Excel
// ─────────────────────────────────────────────────────────────────────────────
export async function exportSimulatorExcel({ scenario, results, isEn = false }) {
  const wb = new ExcelJS.Workbook();
  wb.creator = BRAND.name;
  wb.created = new Date();

  // ── Sheet 1: Scenario ──────────────────────────────────────────────────────
  const wsScenario = wb.addWorksheet(isEn ? 'Scenario' : 'Skenario');

  wsScenario.mergeCells('A1:B1');
  const scTitle = wsScenario.getCell('A1');
  scTitle.value = `${BRAND.name} — ${isEn ? 'Compliance Simulation Report' : 'Laporan Simulasi Kepatuhan'}`;
  scTitle.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
  scTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  scTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsScenario.getRow(1).height = 28;

  wsScenario.mergeCells('A2:B2');
  const scSub = wsScenario.getCell('A2');
  scSub.value = `Digenerate: ${formatDateTime()}`;
  scSub.font = { italic: true, size: 9, color: { argb: 'FF64748B' } };
  scSub.alignment = { horizontal: 'center' };

  wsScenario.addRow([]);

  const scenarioData = [
    [isEn ? 'Industry' : 'Industri', scenario.industries?.join(', ') || '-'],
    [isEn ? 'Server Location' : 'Lokasi Server', scenario.locations?.join(', ') || '-'],
    [isEn ? 'Data Types' : 'Jenis Data', scenario.dataTypes?.join(', ') || '-'],
    [isEn ? 'System Managers' : 'Pengelola Sistem', scenario.usages?.join(', ') || '-'],
    [isEn ? 'Target Frameworks' : 'Framework Target', scenario.targets?.join(', ') || '-'],
  ];

  scenarioData.forEach(([label, value]) => {
    const row = wsScenario.addRow([label, value]);
    row.getCell(1).font = { bold: true };
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    row.eachCell((cell) => {
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } } };
      cell.alignment = { wrapText: true };
    });
  });

  wsScenario.columns = [{ width: 28 }, { width: 70 }];

  // ── Sheet 2: Findings ──────────────────────────────────────────────────────
  const wsFindings = wb.addWorksheet(isEn ? 'Findings' : 'Temuan');

  wsFindings.mergeCells('A1:E1');
  const fTitle = wsFindings.getCell('A1');
  fTitle.value = isEn ? 'Compliance Findings' : 'Temuan Kepatuhan';
  fTitle.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  fTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  fTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsFindings.getRow(1).height = 24;

  wsFindings.addRow([]);

  const fHeader = wsFindings.addRow([
    '#',
    isEn ? 'Area / Framework' : 'Area / Framework',
    isEn ? 'Risk Level' : 'Tingkat Risiko',
    isEn ? 'Finding' : 'Temuan',
    isEn ? 'Recommendation' : 'Rekomendasi',
  ]);
  fHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    cell.alignment = { horizontal: 'center', wrapText: true };
  });

  const severityColorMap = {
    danger: 'FFDC2626',
    warning: 'FFCA8A04',
    success: 'FF16A34A',
  };
  const severityBgMap = {
    danger: 'FFFEF2F2',
    warning: 'FFFFFBEB',
    success: 'FFF0FDF4',
  };

  results.forEach((res, idx) => {
    const row = wsFindings.addRow([
      idx + 1,
      res.framework,
      statusLabel(res.severity, isEn),
      res.message,
      res.recommendation || '-',
    ]);

    row.getCell(1).alignment = { horizontal: 'center' };
    row.getCell(3).font = { bold: true, color: { argb: severityColorMap[res.severity] || 'FF374151' } };
    row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: severityBgMap[res.severity] || 'FFFFFFFF' } };
    row.getCell(3).alignment = { horizontal: 'center' };

    row.eachCell((cell) => {
      cell.alignment = { ...cell.alignment, wrapText: true, vertical: 'top' };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } } };
    });
  });

  wsFindings.columns = [
    { width: 6 }, { width: 35 }, { width: 24 }, { width: 60 }, { width: 60 },
  ];

  // ── Download ───────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ComplianceSimulator_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
