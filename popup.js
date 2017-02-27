function setStatus(statusText) {
  document.getElementById("status").textContent = statusText;
}

function addLink(inp) {
  var link = inp;
  if(!link) {
    setStatus("Please enter a session name!");
  }
  else {
    chrome.storage.local.set({"name": link}, function() {
      setStatus("Saved " + link + "!");
      document.getElementById("input_name").value = "";
    })
  }
}


// chrome.storage.onChanged.addListener(function(changes, namespace) {
//         for (key in changes) {
//           var storageChange = changes[key];
//           console.log('Storage key "%s" in namespace "%s" changed. ' +
//                       'Old value was "%s", new value is "%s".',
//                       key,
//                       namespace,
//                       storageChange.oldValue,
//                       storageChange.newValue);
//         }
//       });


document.addEventListener("DOMContentLoaded", function() {
  // Listen for submit from form
  document.getElementById("form").addEventListener("input", function () {
    var name = document.getElementById("input_name").value;  // Constantly updates
    document.getElementById("form").addEventListener("submit", function (event) {
      event.preventDefault();  // Prevents reload due to submit
      addLink(name);
    });
  });
  // Listen for button click
  document.getElementById("button").onclick = function () {
    var name = document.getElementById("input_name").value;
    addLink(name);
  };
  // Listen for get button
  document.getElementById("get").onclick = function () {
    chrome.storage.local.get("name", function (value) {
      console.log(value);
      setStatus("Retrieved " + value["name"] + "!");
    })
  }
});
