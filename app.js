const btnSave = document.querySelector('#save-btn');
const btnFetch = document.querySelector('#fetch-btn');
const CLIENT_ID = '558387392870-fpeql69ghqsug21q5rp38k16nbptok4v.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDnhz63X6fTZX13dPk_z2trVdERMR6drWs';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/drive";
let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let sectSave = document.getElementById('save');
let sectFetch = document.getElementById('fetch');
let frstFetch = true;
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    }, function(error) {
      appendPre(JSON.stringify(error, null, 2));
    });
 }
 function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        sectSave.style.display = 'block';
        sectFetch.style.display = 'block';
    } else {
        const par = document.querySelector("#res");
        while(par.children.length!=0){
          par.removeChild(par.firstElementChild);
        }
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        sectSave.style.display = 'none';
        sectFetch.style.display = 'none';
    }
}
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut().then(function () {
      auth2.disconnect();
  });
} 

btnSave.addEventListener("click",(event)=>{
    event.preventDefault();
    write();
    document.getElementById("form1").reset();
    let toastLiveExample = document.getElementById('liveToast')
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
})
btnFetch.addEventListener("click",(event)=>{
    event.preventDefault();
    if(!firstFetch){
      const par = document.querySelector("#res");
      while(par.children.length!=0){
        par.removeChild(par.firstElementChild);
      }
    }
    fetch();
    firstFetch = false;
})

function appendResult(value){
  const parent = document.querySelector("#res");
  const newEle = document.createElement("li");
  newEle.innerHTML = value;
  parent.appendChild(newEle);
}

function fetch(){
    var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: '1vmcuKFFfPfW1iUR0T1SaC85Hc7HKysKP9pMTw5eoVGE',  // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    ranges: 'Sheet1',  // TODO: Update placeholder value.

    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    // valueRenderOption: ValueRenderOption.FORMATTED_VALUE // TODO: Update placeholder value.

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    // dateTimeRenderOption: '',  // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    const res = response.result.valueRanges[0].values;
    
    let present = false;;
    for(let i=1;i<res.length;i++){
      if(res[i][0]==document.querySelector("#sfirst-name").value){
        present=true;
        appendResult(res[i][0] +' '+res[i][1]);
      }
    }
    if(!present){
      appendResult("No Matching First Name Found");
    }
    document.querySelector("#sfirst-name").value = "";

  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}
  function write(){
    var values = [
      [
      // Cell values ...
      document.querySelector('#first-name').value,document.querySelector('#last-name').value
      ]
    ];
    var body = {
      values: values
    };
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: '1vmcuKFFfPfW1iUR0T1SaC85Hc7HKysKP9pMTw5eoVGE',
      range: 'Sheet1',
      valueInputOption: 'RAW',
      resource: body
    }).then((response) => {
      var result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
    });
  }