// AIXDATA 2026 — Registration handler
// Deploy as: Extensions > Apps Script > Deploy > New deployment
//   Type: Web app | Execute as: Me | Who has access: Anyone
// Copy the Web App URL into SHEET_ENDPOINT in js/main.js

function doPost(e) {
  try {
    var fname = e.parameter.fname || '';
    var lname = e.parameter.lname || '';
    var email = e.parameter.email || '';
    var major = e.parameter.major || '';
    var exp   = e.parameter.exp   || '';
    var team  = e.parameter.team  || '';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'First Name', 'Last Name',
        'CSULB Email', 'Major', 'Experience Level', 'Team Name'
      ]);
    }

    sheet.appendRow([new Date().toISOString(), fname, lname, email, major, exp, team]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.fname) {
      var sheet = SpreadsheetApp.openById('1zG47BIdWjWQM35p-RWcRCgYQ921-a9C16wY4xtuZreQ').getActiveSheet();
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp','First Name','Last Name','CSULB Email','Major','Experience Level','Team Name']);
      }
      sheet.appendRow([
        new Date().toISOString(),
        e.parameter.fname || '',
        e.parameter.lname || '',
        e.parameter.email || '',
        e.parameter.major || '',
        e.parameter.exp   || '',
        e.parameter.team  || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({success:false,error:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
