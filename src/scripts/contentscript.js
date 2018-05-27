import ext from "./utils/ext";

var suppress = () => {
  // var elementsToHide = document.querySelectorAll('#notification-count');
  // // alert(elementsToHide);
  // console.log(elementsToHide);
  // elementsToHide.forEach(function(ele) {
  //   ele.setAttribute('style','display:none');
  // });
  console.log('Dope aff');

  var elementsToHide = document.querySelectorAll('#notification-count');
  if (elementsToHide.length) {
    console.log('Caught it');
    console.log(elementsToHide);
    elementsToHide.forEach(function(ele) {
      ele.setAttribute('style','display:none');
    });
  } else {
    console.log('Not found damnit');
  }
  var data = {
    val: document.location.href
  }

  return data;
}

function onRequest(request, sender, sendResponse) {
 if (request.action === 'suppress') {
    sendResponse(suppress())
    // console.log('Bruh');
    // supress()
    // sendResponse('done');
  } else if (request.action === 'call-suppress') {
    console.log('new method called');
    setTimeout(sNotification, 10);
    // sendResponse(sNotification());
  }
}

var sNotification = () => {
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var domain = document.location.hostname;
  var elementsToHide;

  if (domain.indexOf('youtube.com') !== -1) {
    elementsToHide = document.querySelectorAll('#notification-count');
  } else if (domain.indexOf('facebook.com') !== -1) {
    elementsToHide = document.querySelectorAll('.jewelCount');
  } else if (domain.indexOf('twitter.com') !== -1) {
    elementsToHide = document.querySelectorAll('.count-inner');
  } else {
    console.log('Ignore this link');
  }
  console.log(domain);

  if (elementsToHide.length) {
    console.log('Caught it man');
    console.log(elementsToHide);
    elementsToHide.forEach(function(ele) {
      ele.setAttribute('style','display:none');
    });
  } else {
    console.log('Not found in this page..' );
  }
}

// Call the suppress
// sNotification();
setTimeout(sNotification, 50);

ext.runtime.onMessage.addListener(onRequest);