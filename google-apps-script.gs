// ============================================================================
//  Natiq Academy — lidlarni Google Sheets'ga yozish (Apps Script Web App)
//  1) sheets.new -> yangi jadval oching
//  2) Extensions -> Apps Script -> shu kodni joylang -> Saqlang
//  3) Deploy -> New deployment -> type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//  4) Deploy -> URL'ni nusxa oling
//  5) panel.html ichidagi  const SHEETS_WEBHOOK_URL = '';  ga o'sha URL'ni qo'ying
// ============================================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lidlar')
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Lidlar');
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Sana', 'F.I.SH', 'Telefon', 'Kurs']);
    }
    sh.appendRow([new Date(), data.name || '', data.phone || '', data.course || '']);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}
