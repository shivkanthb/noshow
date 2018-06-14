import ext from "./utils/ext";
import storage from "./utils/storage";


var websites = {
  FB: 0,
  TWITTER: 1,
  YOUTUBE: 2
};

var suppress = () => {
  storage.get('isRunning', function(resp) {
    var isRunning = resp.isRunning;
    if (isRunning) {
      console.log(isRunning);
      console.log('Calling suppress again');
      setTimeout(sNotification, 1000);
    } 
  });
}

var removeOverlay = () => {
  var overlayElement = document.querySelector('.noshow-overlay');
  if (overlayElement)
    document.documentElement.removeChild(overlayElement);
}

function onRequest(request, sender, sendResponse) {
 if (request.action === 'suppress') {
    sendResponse(suppress())
  } else if (request.action === 'call-suppress') {
    console.log('new method called');
    setTimeout(sNotification, 10);
    // sendResponse(sNotification());
  }
}

var overlay = () => {
  console.log('The body of the element');

  var overlayElement = document.createElement('div');
  overlayElement.setAttribute('class', 'noshow-overlay');
  var overlayElementText = document.createElement('div');
  overlayElementText.setAttribute('class', 'noshow-overlay-text');
  overlayElementText.innerHTML = 'Loading....';
  overlayElement.appendChild(overlayElementText);
  overlayElement.setAttribute('style', 'position: fixed; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: #FFF; z-index: 9999');
  // document.body.style.backgroundColor = "green";
  // this is so dope. being able to append to the current tab even before the body or head is available
  document.documentElement.appendChild(overlayElement);
  console.log(document.body);

}

var hideCollection = (elementsToHide, website) => {

  // hiding all the necessary notification elements
  elementsToHide.forEach(function(ele) {
    ele.setAttribute('style','display:none');
  });

  // modify the title
  if (website === websites.FB) {
    document.title = 'Facebook';
    // also if facebook, hide the floating notifications too.
    var floatingElements = document.querySelectorAll('.lfloat');
    floatingElements.forEach(function(fE) {
      fE.setAttribute('style', 'display: none');
    });
  } else if (website === websites.TWITTER) {
    document.title = 'Twitter';
  } else if (website === websites.YOUTUBE) {
    document.title = 'YouTube';
  }

}

var sNotification = () => {
  console.log('suppressing that shit');
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var domain = document.location.hostname;
  var elementsToHide = '';
  var website = '';

  if (domain.indexOf('youtube.com') !== -1) {
    console.log('found youtube');
    website = websites.YOUTUBE;
    elementsToHide = document.querySelectorAll('#notification-count');
  } else if (domain.indexOf('facebook.com') !== -1) {
    elementsToHide = document.querySelectorAll('.jewelCount');
    website = websites.FB;
  } else if (domain.indexOf('twitter.com') !== -1) {
    elementsToHide = document.querySelectorAll('.count-inner');
    website = websites.TWITTER;
  } else {
    console.log('Ignoring this link');
  }

  if (elementsToHide && elementsToHide.length) {
    console.log('Caught it man');
    hideCollection(elementsToHide, website);
  } else {
    console.log('Not found in this page..' );
  }

  removeOverlay();
}

/* init
 * Starting point for contentscript.js
 */
var init = () => {

  storage.get('isRunning', function(resp) {
    var isRunning = resp.isRunning;
    if (isRunning) {
      overlay();
      // Call the suppress
      setTimeout(sNotification, 1000);
    } 
  });  

}

init();

ext.runtime.onMessage.addListener(onRequest);