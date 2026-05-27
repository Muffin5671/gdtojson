let lvlXML;
let lvlName;
let lvlData;

// b64 and gzip stolen from colon loollol
// i think he only had the b64 function to give support to older browsers
function b64Decode(str) { return Base64.atob(str.replace(/_/g, '/').replace(/-/g, '+')) }
function b64Encode(str) { return Base64.btoa(str).replace(/\//g, '_').replace(/\+/g, '-') }

function gzipDecode(str) {
  let toDecode = b64Decode(str, true)
  toDecode = new Uint8Array(toDecode.split('').map(x => x.charCodeAt(0)))
  return pako.inflate(toDecode, {to: 'string'})
}

async function getLvlData() {
  lvlXML = new DOMParser().parseFromString(await $("#file")[0].files[0].text(), "text/xml");

  lvlName = lvlXML.getElementsByTagName("s")[0].innerHTML;

  let element;
  for (let i = 0; lvlXML.getElementsByTagName("s")[i].startsWith("H4sIAAAAAAAAA"); i++) {
    element = lvlXML.getElementsByTagName("s")[i];
  }

  lvlData = gzipDecode(element.innerHTML);

  return true;
 }

$("#download")[0].addEventListener("click", async () => {
  await getLvlData();

  let lvlJSON = `{
  "name": "${lvlName}",
  "objects": [`;

  const split = lvlData.split(";");
  split.shift();
  split.forEach(obj => {
    let oS = obj.split(",");
    let objJSON = `,\n    {"obj": ${oS[1]}, "x": ${oS[3]}, "y": ${oS[5]}}`;
    lvlJSON = lvlJSON + objJSON;
  });
  lvlJSON = lvlJSON + "\n  ]\n}";

  let JSONFile = new File([lvlJSON], `${lvlName}.json`);
  saveAs(JSONFile);
});