function getLatestVersion(accountId,containerId){
 return TagManager.Accounts.Containers.Version_headers.latest(
      'accounts/'+ accountId +'/containers/'+ containerId);
};
function buildContainerHierrachy(accounts){
  var data = [];
  accounts.forEach(function(account){
    
    var containerList = getContainers(account.accountId);
    containerList.forEach(function(container) {
      var latestVersion = getLatestVersion(account.accountId,container.containerId);
      data.push([
        account.name,
        container.name,
        container.publicId,
        container.usageContext,
        latestVersion.containerVersionId,
        latestVersion.numTags,
        latestVersion.numTriggers,
        latestVersion.numVariables
      ]);
    });

  });
  return data;
};

function buildData(){
  var accounts = getAccounts();
  return buildContainerHierrachy(accounts);
};

function getContainers(accountId){
  return TagManager.Accounts.Containers.list('accounts/'+accountId,
  {fields:'container(name,publicId,usageContext,containerId)'}).container; 
  // returns all accounts and the fields account name and ID only
};

function getAccounts(){
  return TagManager.Accounts.list({fields:'account(name,accountId)'}).account; 
  // returns all accounts and the fields account name and ID only
};

function populateData(sheet, data, numberOfColumns){
  var range = sheet.getRange(2,1,data.length,numberOfColumns);
  range.setValues(data);
};

function buildHeaders(sheet, headers) {
  var range = sheet.getRange(1,1,1,headers.length);
  range.setValues([headers])
};


function buildSheet(){
  var headers = ['Account Name','Container name','Container ID','Target Platform','Latest Version ID','Number of tags','Number of triggers','Number of variables'];
  var sheetName = "GTM Hierrachy";
  // check if the current sheet has the name of sheetName
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if(!sheet){
    //if sheet does not exist, create a new sheet
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  } else{
    // if it does exist, we will clear its contents
    sheet.clear()
  }
  buildHeaders(sheet, headers);
  populateData(sheet,buildData(), headers.length);
  return;
};

function onOpen() {
  // go to google sheets and create an add-on, the name of add-on will be the name of project
  var menu = SpreadsheetApp.getUi().createAddonMenu();
  menu.addItem("Fetch GTM Hierrachy","buildSheet");
  menu.addToUi();
}
