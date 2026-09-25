// Google Apps Script՝ հյուրերի հաստատումները գրում է Sheet-ի մեջ
const SHEET_ID = '1dLJ3aJw-AJXEqUua6VLV_AEgRSffP8kD793CF1hsRjY';
const TAB = 'Հաստատումներ';
const HEAD = ['Ամսաթիվ', 'Անուն Ազգանուն', 'Ում կողմից', 'Կգա՞', 'Անձերի քանակ', 'Ուղերձ'];

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(TAB);
  if (sh) return sh;
  sh = ss.insertSheet(TAB);
  sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD])
    .setBackground('#b8893a').setFontColor('#ffffff').setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 36);
  sh.setFrozenRows(1);
  [150, 220, 130, 90, 120, 380].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.getRange('A:F').setVerticalAlignment('middle').setFontFamily('Arial');
  sh.getRange('F:F').setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sh.getRange('C:E').setHorizontalAlignment('center');
  // Այո՝ կանաչ, Ոչ՝ կարմիր
  const rng = sh.getRange('D2:D');
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Այո').setBackground('#d9ead3').setFontColor('#274e13').setRanges([rng]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Ոչ').setBackground('#f4cccc').setFontColor('#990000').setRanges([rng]).build(),
  ]);
  // Հերթափոխվող տողերի գույն
  sh.getRange('A2:F').applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  return sh;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // JS-ից ուղարկված parameters-ները
    var p = e.parameter;

    var name = p.name || '';
    var side = p.side || '';        // Հարսի / Փեսայի կողմ
    var attend = p.attend || '';    // Այո / Ոչ
    var guests = p.guests || '0';  // Հյուրերի քանակ
    var message = p.message || '';
    var date = new Date().toLocaleString("hy-AM"); // Ամսաթիվը

    // Ավելացնում ենք Google Sheet-ի մեջ
    sheet.appendRow([date, name, side, attend, guests, message]);

    return ContentService.createTextOutput("Success");
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString());
  }
}

function doGet() { return ContentService.createTextOutput('RSVP endpoint is running'); }