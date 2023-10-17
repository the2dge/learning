


function doPost(e) {
  var userEmail = e.parameter.email;
  var userPassword = e.parameter.password;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("UserLogin");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === userEmail && data[i][3] === userPassword) {  // Assuming column 3 is Email and column 4 is Password
      var userName = data[i][1];  // Assuming column 2 is the user's name
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Authenticated!',
        userName: userName  // Return the user's name
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({success: false, message: 'Authentication failed'})).setMimeType(ContentService.MimeType.JSON);
}


function doPost(e) {
    var userName = e.parameter.userName;
    var userEmail = e.parameter.userEmail;
    var testName = e.parameter.testName;
    var testScore = e.parameter.testScore;

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scores");

    try {
        sheet.appendRow([userName, userEmail, testName, testScore]);  // Adjust column order if necessary
        return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}