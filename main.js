let lvlXML;
let lvlName;
let lvlData;
// let lvlID;

// b64 and gzip stolen from colon loollol
// i think he only had the b64 function to give support to older browsers
function b64Decode(str) { return Base64.atob(str.replace(/_/g, '/').replace(/-/g, '+')) }
function b64Encode(str) { return Base64.btoa(str).replace(/\//g, '_').replace(/\+/g, '-') }

function gzipDecode(str) {
  let toDecode = b64Decode(str, true)
  toDecode = new Uint8Array(toDecode.split('').map(x => x.charCodeAt(0)))
  return pako.inflate(toDecode, {to: 'string'})
}

async function getLvlData(type) {
  switch (type) {
    case 0:
      lvlData = gzipDecode($("#textarea")[0].value);
      break;
    case 1:
      lvlXML = new DOMParser().parseFromString(await $("#file")[0].files[0].text(), "text/xml");
      break;
  }

  if (type == 1) lvlName = lvlXML.getElementsByTagName("s")[0].innerHTML
  else lvlName = "Unknown";
  // lvlID = Number(lvlXML.getElementsByTagName("i")[0].innerHTML);

  if (type == 1) {
    let element;
    let i = 0;
    do {
      element = lvlXML.getElementsByTagName("s")[i];
      i++;
    } while (lvlXML.getElementsByTagName("s")[i].innerHTML.startsWith("H4sIA"))

    lvlData = gzipDecode(element.innerHTML);
  }

  return true;
}

async function convertLvltoJSON(type) {
  try {
    await getLvlData(type);

    let lvlJSON = {
      name: lvlName,
      // id: lvlID,
      objects: []
    };

    const split = lvlData.split(";");
    split.shift();

    for (let i = 0; i < (split.length - 1); i++) {
      let oS = split[i].split(",");
      let objJSON = {
        obj: Number(oS[1]), 
        x: Number(oS[3]), 
        y: Number(oS[5]) 
      };
      
      lvlJSON.objects.push(objJSON);
    }

    let JSONFile = new File([JSON.stringify(lvlJSON, undefined, 2)], `${lvlName}.json`);
    saveAs(JSONFile);
  } catch (e) {
    alert(`There was an error converting the file:\n\n${e}`);
  }
}

$("#download")[0].addEventListener("click", () => {
  convertLvltoJSON(1);
});

$("#download2")[0].addEventListener("click", () => {
  convertLvltoJSON(0);
});