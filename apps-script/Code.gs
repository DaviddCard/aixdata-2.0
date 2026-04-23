// AIXDATA 2026 — Registration handler
// Deploy as: Extensions > Apps Script > Deploy > New deployment
//   Type: Web app | Execute as: Me | Who has access: Anyone
// Copy the Web App URL into SHEET_ENDPOINT in js/main.js

function doPost(e) {
  try {
    var data   = JSON.parse(e.postData.contents);
    var sheet  = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'First Name', 'Last Name',
        'CSULB Email', 'Major', 'Experience Level', 'Team Name'
      ]);
    }

    sheet.appendRow([
      new Date().toISOString(),
      data.fname || '',
      data.lname || '',
      data.email || '',
      data.major || '',
      data.exp   || '',
      data.team  || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allows preflight CORS requests from the browser
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
