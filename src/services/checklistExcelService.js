import ExcelJS from 'exceljs';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const STATUS_VALUES = new Set(['Sudah', 'Parsial', 'Belum']);

const HEADER_ALIASES = {
  source: ['sumber', 'source', 'framework', 'regulasi'],
  id: ['id kontrol', 'control id', 'id', 'kode', 'code'],
  name: ['nama kontrol', 'control name', 'name', 'kontrol', 'requirement'],
  description: ['deskripsi', 'description', 'regulatory description', 'detail regulasi'],
  status: ['status implementasi', 'implementation status', 'status', 'state'],
  evidence: ['catatan / bukti', 'catatan/bukti', 'notes / evidence', 'notes', 'evidence', 'bukti'],
};

function normalizeHeader(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ');
}

function normalizeText(value, maxLength = 12000) {
  return String(value ?? '')
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function normalizeStatus(value) {
  const status = normalizeText(value, 40).toLowerCase();
  if (['sudah', 'implemented', 'compliant', 'complete', 'completed', 'yes', 'done'].includes(status)) return 'Sudah';
  if (['parsial', 'partial', 'in progress', 'in-progress', 'partially implemented'].includes(status)) return 'Parsial';
  if (['belum', 'not implemented', 'not implemented yet', 'gap', 'no', 'todo'].includes(status)) return 'Belum';
  return '';
}

function cellValue(cell) {
  if (cell?.value && typeof cell.value === 'object') {
    if ('result' in cell.value) return cell.value.result;
    if ('richText' in cell.value) return cell.value.richText.map((part) => part.text).join('');
    if ('text' in cell.value) return cell.value.text;
  }
  return cell?.value ?? '';
}

function findHeaderRow(worksheet) {
  const maxRows = Math.min(worksheet.rowCount, 20);
  for (let rowNumber = 1; rowNumber <= maxRows; rowNumber += 1) {
    const values = worksheet.getRow(rowNumber).values || [];
    const normalized = values.map(normalizeHeader);
    const hasId = normalized.some((value) => HEADER_ALIASES.id.includes(value));
    const hasStatus = normalized.some((value) => HEADER_ALIASES.status.includes(value));
    if (hasId && hasStatus) return rowNumber;
  }
  throw new Error('Header checklist tidak ditemukan. Gunakan file XLSX hasil export SibukPatuh.');
}

function mapHeaders(worksheet, headerRowNumber) {
  const headers = {};
  worksheet.getRow(headerRowNumber).eachCell((cell, columnNumber) => {
    const value = normalizeHeader(cellValue(cell));
    Object.entries(HEADER_ALIASES).forEach(([key, aliases]) => {
      if (aliases.includes(value) && headers[key] === undefined) headers[key] = columnNumber;
    });
  });
  if (headers.id === undefined || headers.status === undefined) {
    throw new Error('Kolom wajib "ID Kontrol" dan "Status Implementasi" tidak ditemukan.');
  }
  return headers;
}

export async function exportChecklistExcel({ items = [], locale = 'id' }) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Belum ada data checklist untuk diekspor.');

  const isEnglish = locale === 'en';
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SibukPatuh';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Checklist');
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').value = isEnglish ? 'SibukPatuh — Compliance Self-Assessment Checklist' : 'SibukPatuh — Checklist Self-Assessment Kepatuhan';
  worksheet.getCell('A1').font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 26;

  worksheet.mergeCells('A2:F2');
  worksheet.getCell('A2').value = isEnglish
    ? 'Edit only Implementation Status and Notes / Evidence, then import this file back into SibukPatuh.'
    : 'Edit hanya kolom Status Implementasi dan Catatan / Bukti, lalu import kembali file ini ke SibukPatuh.';
  worksheet.getCell('A2').font = { italic: true, color: { argb: 'FF475569' } };
  worksheet.getCell('A2').alignment = { wrapText: true };
  worksheet.getRow(2).height = 30;

  worksheet.addRow([]);
  const header = worksheet.addRow(isEnglish
    ? ['Source', 'Control ID', 'Control Name', 'Regulatory Description', 'Implementation Status', 'Notes / Evidence']
    : ['Sumber', 'ID Kontrol', 'Nama Kontrol', 'Deskripsi Regulasi', 'Status Implementasi', 'Catatan / Bukti']);
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF1E40AF' } } };
  });

  items.forEach((item, index) => {
    const row = worksheet.addRow([
      normalizeText(item.source, 100),
      normalizeText(item.id, 120),
      normalizeText(item.name, 500),
      normalizeText(item.description, 4000),
      STATUS_VALUES.has(item.status) ? item.status : 'Belum',
      normalizeText(item.evidence, 12000),
    ]);
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'top', wrapText: true };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } } };
    });
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      });
    }
    const statusCell = row.getCell(5);
    statusCell.font = { bold: true, color: { argb: item.status === 'Sudah' ? 'FF15803D' : item.status === 'Parsial' ? 'FFA16207' : 'FFB91C1C' } };
  });

  worksheet.views = [{ state: 'frozen', ySplit: 4 }];
  worksheet.autoFilter = { from: 'A4', to: `F${worksheet.rowCount}` };
  worksheet.columns = [
    { width: 18 }, { width: 18 }, { width: 38 }, { width: 70 }, { width: 22 }, { width: 60 },
  ];

  const instruction = workbook.addWorksheet(isEnglish ? 'Instructions' : 'Petunjuk');
  instruction.addRows([
    [isEnglish ? 'Import guidance' : 'Petunjuk import'],
    [isEnglish ? 'Keep the header row unchanged.' : 'Jangan mengubah nama header kolom.'],
    [isEnglish ? 'Allowed statuses: Implemented, Partial, Not implemented.' : 'Status yang diterima: Sudah, Parsial, Belum.'],
    [isEnglish ? 'Do not include passwords, API keys, tokens, or other secrets in the evidence column.' : 'Jangan memasukkan password, API key, token, atau rahasia lain pada kolom evidens.'],
    [isEnglish ? 'After editing, return to Checklist Tools and choose Import XLSX.' : 'Setelah selesai mengisi, kembali ke Checklist Tools lalu pilih Import XLSX.'],
  ]);
  instruction.getColumn(1).width = 110;
  instruction.getRow(1).font = { bold: true, size: 13, color: { argb: 'FF0F766E' } };
  instruction.getColumn(1).alignment = { wrapText: true, vertical: 'top' };
  instruction.eachRow((row) => { row.height = 24; });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: XLSX_MIME });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Checklist_SibukPatuh_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importChecklistExcel(file) {
  if (!file || !/\.xlsx$/i.test(file.name)) throw new Error('Pilih file Excel dengan format .xlsx.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Ukuran file terlalu besar. Maksimal 10 MB.');

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const worksheet = workbook.getWorksheet('Checklist') || workbook.worksheets[0];
  if (!worksheet) throw new Error('Workbook tidak memiliki worksheet yang dapat dibaca.');

  const headerRowNumber = findHeaderRow(worksheet);
  const headers = mapHeaders(worksheet, headerRowNumber);
  const items = [];
  const errors = [];
  const seen = new Set();

  for (let rowNumber = headerRowNumber + 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const raw = {};
    Object.entries(headers).forEach(([key, columnNumber]) => { raw[key] = cellValue(row.getCell(columnNumber)); });
    const hasAnyValue = Object.values(raw).some((value) => normalizeText(value));
    if (!hasAnyValue) continue;

    const id = normalizeText(raw.id, 120);
    const status = normalizeStatus(raw.status);
    if (!id) {
      errors.push(`Baris ${rowNumber}: ID Kontrol wajib diisi.`);
      continue;
    }
    if (!status) {
      errors.push(`Baris ${rowNumber}: status harus Sudah, Parsial, atau Belum.`);
      continue;
    }

    const item = {
      source: normalizeText(raw.source, 100) || 'imported',
      id,
      name: normalizeText(raw.name, 500) || id,
      description: normalizeText(raw.description, 4000) || '-',
      status,
      evidence: normalizeText(raw.evidence, 12000),
    };
    const key = `${item.source}::${item.id}`.toLowerCase();
    if (seen.has(key)) {
      errors.push(`Baris ${rowNumber}: duplikat ${item.source} / ${item.id}; baris ini dilewati.`);
      continue;
    }
    seen.add(key);
    items.push(item);
  }

  if (items.length === 0) throw new Error(errors[0] || 'Tidak ada baris checklist valid yang ditemukan.');
  return { items, errors };
}
