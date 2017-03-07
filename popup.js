
/**
 * Set div to display some string
 *
 * @ param {string} statusText - Text displayed by div, for updates and links
 *
 */
function setStatus(statusText) {
  document.getElementById("status").textContent = statusText;
}

/**
 * Saves session (name - tabs) pair
 *
 * @ param {JSON stringified list} tabs - The tabs of a session
 *
 */
function saveSession(tabs) {
  // //  Var name here so that its latest name 
  // var name = String(document.getElementById("input_name").value);
  // if(!name) {
  //   setStatus("Please enter a session name!");
  //   console.log("No session name");
  // }
  // else {
  //   chrome.storage.local.set({name: "session", "tabs": tabs}, function() {
  //     setStatus("Saved session " + name + "!");
  //     console.log("Saved session " + name + " with tabs " + tabs);
  //     document.getElementById("input_name").value = "";
  //   });
  // }
  var name = String(document.getElementById("input_name").value);
    chrome.storage.local.get({names: []}, function (result) {
    var names = result.names;
    names.push({name: name});  // keyPairId is becoming a string?
    names.push({tabs: tabs});
    chrome.storage.local.set({names: names}, function () {
      console.log("Saving done");
    });
  });
}

function getSession() {
  chrome.storage.local.get(null, function (result) {
    console.log("[GET]"); 

    var names = result.names;  // no need to json stringify
    var sessionName = String(document.getElementById("input_name").value);

    var count = 0;
    names.forEach(function(pair) {
      if(pair["name"] == sessionName) {
        var tabs = names[count + 1];
        console.log(tabs);
        console.log(tabs["tabs"]);
        tabs["tabs"].forEach(function(tab) {
          chrome.tabs.create({url:tab});
        })
      }
      count += 1;
    });
  });
}

function getAllSessions() {
  var name = String(document.getElementById("input_name").value);
  console.log("[GET ALL]");
  chrome.storage.local.get(null, function(values) {
    for (key in values) {
      console.log(values[key]);
    }
  })
}

/** 
 * Gets the selected tabs, returns list of urls 
 * Used with saveSession() to pair session name and urls
 *
 */
function getSelectedTabs(callback) {
  // Select all highlighted tabs, if none selected, automatically active tab
  console.log("[SAVE]");
  var queryInfo = { highlighted: true };
  var tabUrlList = new Array();
  chrome.tabs.query(queryInfo, function(tabs) {
    console.log("Detected selected tabs:");
    // for each tab in tabs selected, log the url
    for(tab in tabs) {
      var url = tabs[tab].url;
      tabUrlList.push(url);
      console.log(url);
    }
    if(callback) {
      callback(tabUrlList);
    }
  });
}

function clearSessions() {
  chrome.storage.local.clear();
  console.log("Session cleared");
}

document.addEventListener("DOMContentLoaded", function() {
  // Listen for submit from form, same as button click
  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevents reload due to submit
    getSelectedTabs(call);
  });
  // Listen for button click
  document.getElementById("save").onclick = function () {
    getSelectedTabs(call);
  };
  // Listen for get button
  document.getElementById("get").onclick = function () {
    getSession();
  };
  // Clear sessions
  document.getElementById("clear").onclick = function () {
    clearSessions();
  }
});

// try {
//   chrome.storage.local.get({"count"}, function(value) {
//     console.log("current session: " + value["count"]);
//     var sessionCount = value["count"];
//   });
// }
// catch(err) {
//   var sessionCount = 0;
//   console.log("Error reading session count");
//   console.log(err.message);
// }

// contains the array of tabs
function call(array) {
  console.log("Selected tabs pushed into array:");
  console.log(array);
  // console.log("Stringifying array to JSON")
  // var jsontabs = JSON.stringify(array);
  // console.log("Stringify complete. Now saving.");
  saveSession(array);
  // saveSession(jsontabs);
  // removed json stringify since this was double layering it, making it harder to extract
}
