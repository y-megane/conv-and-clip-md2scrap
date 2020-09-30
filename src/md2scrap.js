//Convert markdown text to Scrapbox syntax
function md2scrap(mdText) {
  // console.log(mdText);
  const textArray = mdText.split(/\r\n|\r|\n/);
  // console.log(textArray);
  let scrapArray = [];
  let isInCodeblock = false;

  for (const line of textArray) {
    // console.log(line);
    // console.log(replace(line));
    if (isInCodeblock) {
      if (isEndOfCodeBlock(line)) {
        isInCodeblock = false;
      } else {
        scrapArray.push(" " + line);
      }
    } else {
      if (isStartOfCodeBlock(line)) {
        isInCodeblock = true;
        scrapArray.push(replaceCodeBlock(line));
      } else {
        scrapArray.push(replace(line));
      }
    }
  }
  return scrapArray.join("\n");
}

function isStartOfCodeBlock(line) {
  return line.match(/^```(.*)/);
}

function isEndOfCodeBlock(line) {
  return line.match(/^```/);
}

function replaceCodeBlock(mdText) {
  // Code block WITHOUT extention or file name.
  if (mdText.match(/^```$/)) {
    return "code:text";
  }
  // Code block WITH extention or file name.
  return mdText.replace(/```(.+:)?(.+)?/, "code:$2");
}

function replace(mdText) {
  //header
  let out = mdText;

  //h1
  out = out.replace(/^# (.+)/, "[*** $1]");
  //h2
  out = out.replace(/^## (.+)/, "[** $1]");
  //h3 or lower
  out = out.replace(/^###+ (.+)/, "[* $1]");

  //font
  //bold
  out = out.replace(/(^|\s)\*\*(\S.+?)\*\*(\s|$)/, "$1[* $2]$3");
  //italic
  out = out.replace(/(^|\s)\*(\S.+?)\*(\s|$)/, "$1[/ $2]$3");
  out = out.replace(/(^|\s)_(\S.+?)_(\s|$)/, "$1[/ $2]$3");
  //strikethrough
  out = out.replace(/(^|\s)~(\S.+?)~(\s|$)/, "$1[- $2]$3");

  //blockquotes
  // syntax is same. do nothing.

  //unordered list
  out = out.replace(/^(  ){3}[*|-] (\S.+)/, "    $2");
  out = out.replace(/^(  ){2}[*|-] (\S.+)/, "   $2");
  out = out.replace(/^(  ){1}[*|-] (\S.+)/, "  $2");
  out = out.replace(/^[*|-] (\S.+)/, " $1");

  //ordered list
  out = out.replace(/^(  ){3}[0-9]\. (\S.+)/, "    $2");
  out = out.replace(/^(  ){2}[0-9]\. (\S.+)/, "   $2");
  out = out.replace(/^(  ){1}[0-9]\. (\S.+)/, "  $2");
  out = out.replace(/^[0-9]\. (\S.+)/, " $1");

  //image
  out = out.replace(/!\[.*\]\((\S+)( "\S+")?\)/, "[$1]");

  //link
  out = out.replace(/\[(.+)\]\((\S+)( "\S+")?\)/, "[$1 $2]");

  //horizontal line
  out = out.replace(/^---$/, "[/icons/hr.icon]");
  out = out.replace(/^\*\*\*$/, "[/icons/hr.icon]");

  //escape

  return out;
}

module.exports = md2scrap;
