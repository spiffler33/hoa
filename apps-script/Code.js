/**
 * Beachhead Feedback — Google Apps Script
 *
 * Fully generic: reads JSON keys from the POST body,
 * auto-creates headers on first submission, and appends rows.
 * If the form fields change, this script never needs updating.
 */

var SHEET_NAME = 'Yes Lifers — Founder Wedge Feedback';

function getOrCreateSheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SHEET_ID');

  if (sheetId) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {
      // Sheet was deleted or unshared — recreate
    }
  }

  var ss = SpreadsheetApp.create(SHEET_NAME);
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = getOrCreateSheet();
  var sheet = ss.getActiveSheet();

  // Build ordered keys — timestamp first, then name, then rest alphabetically
  var keys = Object.keys(data).filter(function (k) { return k !== 'name'; });
  keys.sort();
  var orderedKeys = ['name'].concat(keys);

  // Write headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    var headers = ['Timestamp'].concat(orderedKeys.map(formatHeader));
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  // Build row
  var row = [new Date().toISOString()];
  orderedKeys.forEach(function (key) {
    var val = data[key];
    if (Array.isArray(val)) val = val.join(', ');
    row.push(val || '');
  });

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatHeader(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}
