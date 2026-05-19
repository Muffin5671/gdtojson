let lvlXML;
let lvlName;
let lvlData;

function b64Decode(str) { return Base64.atob(str.replace(/_/g, '/').replace(/-/g, '+')) }
function b64Encode(str) { return Base64.btoa(str).replace(/\//g, '_').replace(/\+/g, '-') }

async function getLvlData() {
  const lvlXML = new DOMParser().parseFromString(await $("#file")[0].files[0].text(), "text/xml");

  lvlName = lvlXML.getElementsByTagName("s")[0].innerHTML;
  lvlData = lvlXML.getElementsByTagName("s")[1].innerHTML;

  return true;
 }

$("#download")[0].addEventListener("click", () => {
  getLvlData();
});