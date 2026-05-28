let lvlXML;
let lvlName;
let lvlData;

// b64 and gzip stolen from colon loollol
// i think he only had the b64 function to give support to older browsers
function b64Decode(str) { return Base64.atob(str.replace(/_/g, '/').replace(/-/g, '+')) }
function b64Encode(str) { return Base64.btoa(str).replace(/\//g, '_').replace(/\+/g, '-') }

function gzipDecode(str) {
  try {
    let toDecode = b64Decode(str, true)
    toDecode = new Uint8Array(toDecode.split('').map(x => x.charCodeAt(0)))
    return pako.inflate(toDecode, {to: 'string'})
  } catch (e) {
    return undefined
  }
}

async function getLvlData() {
  lvlXML = new DOMParser().parseFromString(await $("#file")[0].files[0].text(), "text/xml");

  lvlName = lvlXML.getElementsByTagName("s")[0].innerHTML;

  let element;
  let i = 0;
  do {
    element = lvlXML.getElementsByTagName("s")[i];
    console.log(element);
    i++;
  } while (lvlXML.getElementsByTagName("s")[i].innerHTML.startsWith("H4sIA"))

  lvlData = gzipDecode(element.innerHTML);

  return true;
}

$("#download")[0].addEventListener("click", async () => {
  await getLvlData();

  let lvlJSON = {
    name: lvlName,
    objects: []
  };

  const split = lvlData.split(";");
  split.shift();
  
  for (let i = 0; i < (split.length - 1); i++) {
    let oS = split[i].split(",");
    lvlJSON.objects.push({ obj: Number(oS[1]), x: Number(oS[3]), y: Number(oS[5]) });
  }

  let JSONFile = new File([JSON.stringify(lvlJSON, undefined, 2)], `${lvlName}.json`);
  saveAs(JSONFile);
});