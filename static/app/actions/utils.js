export function checkStatus (response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

export function getCSRF () {
  var metas = document.getElementsByTagName('meta');

  for (var i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") == 'csrf-token') {
      return metas[i].getAttribute("content");
    }
  }

  return '';
}
