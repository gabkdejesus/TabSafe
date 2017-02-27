function setStatus(statusText) {
  document.getElementById("status").textContent = statusText;
}

function addLink(inp) {
  var link = inp;
  if(!link) {
    setStatus("Please enter a session name!");
  }
  else {
    chrome.storage.sync.set({"name": link}, function() {
      setStatus("Saved " + link + "!");
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

// function submit(e) {
//   var key = e.keyCode || e.which;
//   if(key == 13) {
//     var name = document.getElementById("input_name").value;
//     console.log(name);
//     addLink(name);
//   }
// }

document.addEventListener("DOMContentLoaded", function() {
  // Listen for submit from form
  document.getElementById("form").addEventListener("input", function () {
    var name = document.getElementById("input_name").value;
    document.getElementById("form").addEventListener("submit", function () {
      addLink(name);
    });
  });
  // Listen for button click
  document.getElementById("button").onclick = function () {
    var name = document.getElementById("input_name").value;
    addLink(name);
    };
});
