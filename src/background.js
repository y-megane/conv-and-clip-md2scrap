//Add context menu (Right click menu)
chrome.contextMenus.create({
  title: "Markdown to Scrapbox",
  type: "normal",
  contexts: ["selection"],
  onclick: clipMd2Scrap(),
});
chrome.contextMenus.create({
  title: "Scrapbox to Markdown",
  type: "normal",
  contexts: ["selection"],
  onclick: clipScrap2Md(),
});

function copyToClipboard(text) {
  const backgroundPage = chrome.extension.getBackgroundPage();
  let textarea = document.getElementById("clipboard_object");
  if (!textarea) {
    textarea = backgroundPage.document.createElement("textarea");
    textarea.setAttribute("id", "clipboard_object");
    backgroundPage.document.body.appendChild(textarea);
  }
  textarea.value = text;
  textarea.select();
  document.execCommand("copy");
  console.log(text); //DEBUG
}

function clipMd2Scrap(info, tab) {
  return function (info, tab) {
    const selectedText = info.selectionText;
    console.log(selectedText); //DEBUG

    const convertedText = md2scrap(selectedText);
    console.log(convertedText); //DEBUG

    copyToClipboard(convertedText);
  };
}
function clipScrap2Md(info, tab) {
  return function (info, tab) {
    const selectedText = info.selectionText;
    console.log(selectedText); //DEBUG

    const convertedText = scrap2md(selectedText);
    console.log(convertedText); //DEBUG

    copyToClipboard(convertedText);
  };
}

//Convert markdown text to Scrapbox syntax
//TODO
function md2scrap(mdText) {
  return "md2scrap";
}

//Convert Scrapbox text to markdown syntax
//TODO
function scrap2md(mdText) {
  return "scrap2md";
}
