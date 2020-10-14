//Convert markdown text to Scrapbox syntax
function md2scrap(mdText) {
  const textArray = mdText.split(/\r\n|\r|\n/);
  let scrapArray = [];
  let isInCodeblock = false;
  let isInTableBlock = false;

  for (const line of textArray) {
    if (isInCodeblock) {
      if (isEndOfCodeBlock(line)) {
        isInCodeblock = false;
      } else {
        scrapArray.push(" " + line);
      }
    } else if (isInTableBlock) {
      if (RegExp(/\|(\s*:?-+:?\s*\|)+/).test(line)) {
        continue;
      }
      if (isTableRow(line)) {
        scrapArray.push(replaceTableRow(line));
      } else {
        isInTableBlock = false;
        scrapArray.push(replace(line));
      }
    } else {
      if (isStartOfCodeBlock(line)) {
        isInCodeblock = true;
        scrapArray.push(replaceCodeBlock(line));
      } else if (isTableRow(line)) {
        isInTableBlock = true;
        scrapArray.push("table:table");
        scrapArray.push(replaceTableRow(line));
      } else {
        // Other general syntax.
        scrapArray.push(replace(line));
        isInTableBlock = false;
      }
    }
  }
  return scrapArray.join("\n");
}

function isStartOfCodeBlock(line) {
  return RegExp(/^```(.*)/).test(line);
}

function isEndOfCodeBlock(line) {
  return RegExp(/^```/).test(line);
}

function isTableRow(line) {
  return RegExp(/^\|(.*\|).*\|$/).test(line);
}

function replaceCodeBlock(mdText) {
  // Code block WITHOUT extention or file name.
  if (RegExp(/^```$/).test(mdText)) {
    return "code:text";
  }
  // Code block WITH extention or file name.
  return mdText.replace(/```(.+:)?(.+)?/, "code:$2");
}

function replaceTableRow(mdText) {
  let scrapText = mdText
    .replace(/^\|\s*/, " ")
    .replace(/\s*\|$/, "")
    .replace(/\s*\|\s*\.*/g, "\t");
  return scrapText;
}

function replace(mdText) {
  let out = mdText;

  //Header
  //h1
  out = out.replace(/^# (.+)/, "[*** $1]");
  //h2
  out = out.replace(/^## (.+)/, "[** $1]");
  //h3 or lower
  out = out.replace(/^###+ (.+)/, "[* $1]");

  //Font
  //bold
  out = out.replace(/(^|\s)\*\*(\S.+?)\*\*(\s|$)/, "$1[* $2]$3");
  //italic
  out = out.replace(/(^|\s)\*(\S.+?)\*(\s|$)/, "$1[/ $2]$3");
  out = out.replace(/(^|\s)_(\S.+?)_(\s|$)/, "$1[/ $2]$3");
  //strikethrough
  out = out.replace(/(^|\s)~(\S.+?)~(\s|$)/, "$1[- $2]$3");

  //Blockquotes
  // syntax is same. do nothing.

  //List
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

  //Image
  out = out.replace(/!\[.*\]\((\S+)( "\S+")?\)/, "[$1]");

  //Link
  out = out.replace(/\[(.+)\]\((\S+)( "\S+")?\)/, "[$1 $2]");

  //Horizontal line
  out = out.replace(/^---$/, "[/icons/hr.icon]");
  out = out.replace(/^\*\*\*$/, "[/icons/hr.icon]");

  //escape
  out = out.replace(/^\\#/, "#");
  out = out.replace(/^\\>/, ">");
  out = out.replace(/^\s*\\([*-])/, "$1");
  out = out.replace(/^\\\\/, "\\");
  out = out.replace(/^\\`/, "`");

  return out;
}

// module.exports = md2scrap;
