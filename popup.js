/**
 * Set div to display some string
 *
 * @ param {string} statusText - Text displayed by div, for updates and links
 *
 */
function setStatus(statusText) {
  document.getElementById("status").textContent = statusText;
}

//accepts stringified tab list
function saveSession(jsontabs) {
  //  Var name here so that its latest name 
  var name = document.getElementById("input_name").value;
  var urllist = jsontabs;
  if(!name) {
    setStatus("Please enter a session name!");
    console.log("No session name");
  }
  else {
    chrome.storage.local.set({"name": name, "urls": urllist}, function() {
      setStatus("Saved " + name + "!");
      console.log("Saved " + name);
      document.getElementById("input_name").value = "";
    });
  }
}

function getSession() {
  chrome.storage.local.get("name", function (value) {
    console.log("Retrieved " + value["name"] + " with urls ");
    setStatus("Retrieved " + value["name"] + "!");
  });
  chrome.storage.local.get("urls", function (value) {
    var test = JSON.parse(value["urls"]);  // returns the array
    test.forEach(function(entry) {
      console.log(entry);
    })
  });
}

/** 
 * Gets the selected tabs, returns list of urls 
 * Used with saveSession() to pair session name and urls
 *
 */
function getSelectedTabs(callback) {
  // Select all highlighted tabs, if none selected, automatically active tab
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

document.addEventListener("DOMContentLoaded", function() {
  // Listen for submit from form, same as button click
  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevents reload due to submit
    getSelectedTabs(call);
  });
  // Listen for button click
  document.getElementById("button").onclick = function () {
    saveSession();
  };
  // Listen for get button
  document.getElementById("get").onclick = function () {
    getSession();
  };
  // Get selected tabs url
  document.getElementById("tab").onclick = function () {
    getSelectedTabs(call);
  }
});

// contains the array in array form
function call(array) {
  console.log("Selected tabs pushed into list:");
  console.log(array);
  console.log("Parsing to JSON")
  var jsontabs = JSON.stringify(array);
  console.log("Done parsing");
  console.log(jsontabs);
  console.log("now saving");
  saveSession(jsontabs);
}
