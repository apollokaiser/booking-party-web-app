const XLSX = require('xlsx');
const fs = require('fs-extra');
function processExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    console.log(workbook.getImage());
    // Truy cập và in ra dữ liệu từ file excel
    const excelData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    // Lấy dữ liệu từ ô chứa hình

    // Xử lý các dữ liệu từ file Excel ở đây

    // Lưu vào MySQL ở đây

    // Sau khi xử lý xong, xóa file Excel
    fs.unlinkSync(filePath);
}
async function readExcelFile(filePath) {
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const data = await workbook.xlsx.readFile(filePath);

const worksheet = workbook.worksheets[0];
for (const image of worksheet.getImages()) {
  console.log('processing image row', image.range.tl.nativeRow, 'col', image.range.tl.nativeCol, 'imageId', image.imageId);
  // fetch the media item with the data (it seems the imageId matches up with m.index?)
  const img = workbook.model.media.find(m => m.index === image.imageId);
  fs.writeFileSync(`${image.range.tl.nativeRow}.${image.range.tl.nativeCol}.${img.name}.${img.extension}`, img.buffer);
}
}

module.exports = {processExcelFile,readExcelFile}