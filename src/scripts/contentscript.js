import ext from "./utils/ext";

var suppress = () => {
  setTimeout(sNotification, 1000);
}

var removeOverlay = () => {
  var overlayElement = document.querySelector('.noshow-overlay');
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

var sNotification = () => {
  console.log('suppressing that shit');
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var domain = document.location.hostname;
  var elementsToHide = '';

  if (domain.indexOf('youtube.com') !== -1) {
    console.log('found youtube');
    elementsToHide = document.querySelectorAll('#notification-count');
  } else if (domain.indexOf('facebook.com') !== -1) {
    elementsToHide = document.querySelectorAll('.jewelCount');
  } else if (domain.indexOf('twitter.com') !== -1) {
    elementsToHide = document.querySelectorAll('.count-inner');
  } else {
    console.log('Ignoring this link');
  }
  console.log(domain);

  if (elementsToHide && elementsToHide.length) {
    console.log('Caught it man');
    console.log(elementsToHide);
    elementsToHide.forEach(function(ele) {
      ele.setAttribute('style','display:none');
    });
  } else {
    console.log('Not found in this page..' );
  }

  removeOverlay();
}

overlay();
// Call the suppress
// sNotification();
// setTimeout(sNotification, 1000);

ext.runtime.onMessage.addListener(onRequest);