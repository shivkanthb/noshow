import ext from "./utils/ext";
import storage from "./utils/storage";

var toggleElement = document.querySelector('.toggle-switch');
var toggleON = document.querySelector('.fa-toggle-on');
var toggleOFF = document.querySelector('.fa-toggle-off');

toggleON.addEventListener('click', function(e) {
  console.log('Toggle ON clicked');
  setRunning(false);
});

toggleOFF.addEventListener('click', function(e) {
  console.log('Toggle OFF clicked');
  setRunning(true);
});

var setRunning = (set) => {
  if (set) {
    console.log('set to true');
    storage.set({ isRunning: true }, function() {
      displayToggleButtons();
    });
  } else {
    console.log('set to false');
    storage.set({ isRunning: false }, function() {
      displayToggleButtons();
    });
  }
}

var displayToggleButtons = () => {
  storage.get('isRunning', function(resp) {
    
    console.log(JSON.stringify(resp));
    var isRunning = resp.isRunning;
    if (isRunning) {
      toggleON.style.display = 'block';
      toggleOFF.style.display = 'none'
    } else {
      toggleON.style.display = 'none';
      toggleOFF.style.display = 'block';
    }

  });
}

storage.get('isRunning', function(resp) {
  if (resp.isRunning === undefined) {
    setRunning(true);
    return;
  } else 
    displayToggleButtons();
});




var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if (color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
  var json = JSON.stringify(data);
  return (`
  <div class="site-description">
    <h3 class="title">${data.title}</h3>
    <p class="description">${data.description}</p>
    <a href="${data.url}" target="_blank" class="url">${data.url}</a>
  </div>
  <div class="action-container">
    <button data-bookmark='${json}' id="save-btn" class="btn btn-primary">Save</button>
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;  
  } else {
    renderMessage("Sorry, could not extract this page's title and URL")
  }
}

var DT;
var suppressNotification = (data) => {
  // alert(data.val);
  DT = data;
  if (data) {
    renderMessage("some message now -  "+ data.val);
  } else {
    renderMessage('Got nothing');
  }
  
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  // alert(activeTab.url);
  // chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
  // chrome.tabs.sendMessage(activeTab.id, { action: 'suppress' }, suppressNotification);
  // chrome.tabs.sendMessage(activeTab.id, { action: 'suppress-notification' }, function(message) {
  //   console.log(message);
  // });
});

popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#save-btn")) {
    e.preventDefault();
    var data = e.target.getAttribute("data-bookmark");
    ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
      if(response && response.action === "saved") {
        renderMessage("Your bookmark was saved successfully!");
      } else {
        renderMessage("Sorry, there was an error while saving your bookmark.");
      }
    })
  }
});

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
