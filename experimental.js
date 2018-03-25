


function popover(key){
  doTabs(); 
  var width = 22;
  if(width > fullwidth-4) width = fullwidth-4;
  var data = wrap('yo yo yo yo yo yo ', width);

  console.log('s')
  var finished = '';
  var lines = text.split('\n');
  var writing = false;
  var startData, endData, difference;
  for(var x = 0; x < lines.length; x++){
    var start = lines[x].indexOf('<a href="#" onclick=popover("'+ key + '")');
    if(start >= 0){
      var end = lines[x].substring(start,lines[x].length);
      end = end.indexOf('</a>')+4+start;
      var linkText = strip(lines[x].substring(start,end));
      var padLeft = Math.floor((width - linkText.length) / 2);
      var padRight = width - linkText.length - padLeft;
      if(start - padLeft < 0){
        var dif = -(start - padLeft) +2;
        padRight += dif;
        padLeft -= dif;
      } else if(end + padRight >= lines[x].length){
        var dif2 = lines[x].length - (end+padRight)-2; 
        padRight += dif2;
        padLeft -= dif2;
      }
      startData = start - padLeft;
      endData = end + padRight;
      console.log('a')
      difference = lines[x].length - strip(lines[x]).length;
      lines[x] = lines[x].substring(0, startData-2) + ' '+ new Array(padLeft+1).join('_') +'[<a href="#" onclick=calculate()>' + linkText + "</a>]" + new Array(padRight+1).join('_') +' '+ lines[x].substring(endData+2, lines[x].length);
      writing = true;
      continue;
    }
    if(writing){
      if(data.length > 0){
        lines[x] = strip(lines[x]).substring(0, startData-2) + "| " + data.shift()+ " |" +lines[x].substring(endData+2-difference, lines[x].length);
      } else {
        lines[x] = strip(lines[x]).substring(0, startData-2) + ' ' + new Array(width+3).join("&#175;") +' ' + lines[x].substring(endData+2-difference, lines[x].length);
        writing = false;
      }
    }
  }
  document.body.innerHTML = lines.join('\n');


}

function pop(){
  console.log('p')
  var xPosition = fullwidth - 3 - Math.floor(fullwidth/10);
  var yPosition = 2;
  var data = [];
  var longest = globalNav.links.sort(function (a, b) { return b.text.length - a.text.length; })[0];
  for(var x = 0; x < globalNav.links.length; x++)
    data.push(pad((globalNav.links[x].active)? globalNav.links[x].text : '<a href="'+globalNav.links[x].link + '">'+globalNav.links[x].text + '</a>', longest, ' '));

}

function navpopup(){
  var lines = text.split('\n');
  var width = 0;
  for(var x = 0; x < globalNav.links.length; x++)
    if(globalNav.links[x].text.length > width) width = globalNav.links[x].text.length;
  var startBrand = Math.floor(fullwidth / 10) ;
  lines[1] = new Array(startBrand + 1).join(' ') + globalNav.brand + new Array(fullwidth-width-startBrand-globalNav.brand.length-2).join(' ') + new Array(width - startBrand + 1).join('_') + '[<a href="#", onclick="calculate()">X</a>]' + new Array(startBrand).join('_')
  for(var x = 0; x < globalNav.links.length; x++){
    lines[x+2] = lines[x+2].substring(0, fullwidth - width - 4) + '| ' + pad((globalNav.links[x].active)? globalNav.links[x].text : '<a href="'+globalNav.links[x].link + '">'+globalNav.links[x].text + '</a>', width, ' ') + " |";
  }
  lines[globalNav.links.length+2] = lines[x+2].substring(0, fullwidth - width - 4) + ' ' + new Array(width+3).join('&#175;') + " ";
  document.body.innerHTML = lines.join('\n');
  doTabs();
}


//
//
//
function splitText(content){
  var wordsRaw = content.split(' ');
  var words = [];
  var link = false;
  var totalWord = "";
  for(var x = 0; x< wordsRaw.length; x++){
    var word = wordsRaw[x];
    if(word.indexOf('<a') != -1){
      if(word.length > 2){
        words.push({text: strip(word.substring(0,word.indexOf('<a'))), link: link});
        word = word.substring(word.indexOf('<a'), word.length);
      }
      link = true;
      onclick = "";
      totalWord = word;
      continue;
    }
    if(!link){
      words.push({text: strip(word), link: link});
      continue;
    }
    totalWord += ' ' + word;
    if(word.indexOf('href=') != -1){
      var href = word.substring(6,word.length);
      href = href.substring(0, href.indexOf('"'));
    }
    if(word.indexOf('onclick=') != -1){
      var onclick = word.substring(8,word.length);
      onclick = onclick.substring(0, onclick.indexOf('>'));
    }
    if(word.indexOf("</a>") != -1){
      link = false;
      var links = strip(totalWord).split(' ');
      for(var y = 0; y < links.length; y++)
        words.push({text: links[y], link: true, href: href, onclick: onclick});
    } 
  }
  return words;
} 


function wrap(content, width){
  var wordsSplit = splitText(content);
  var lines = [];
  var line = '';
  while(wordsSplit.length > 0){
    if(strip(line).length + strip(wordsSplit[0].text).length < width){
      var word = wordsSplit.shift();
      if(word.link) line += '<a href="' + word.href + '" onclick=' + word.onclick + ">" + word.text + "</a> ";
      else line += word.text + ' ';
      if(line.indexOf('\n') != -1){
        lines.push(pad(line.substring(0, line.indexOf('\n')), width, ' '));
        line = '';
      }
    } else if(strip(wordsSplit[0].text).length >= width ){
      var longword = wordsSplit.shift();
      console.log(longword);
      wordsSplit.unshift({text:longword.text.substring(longword.text.length/2, longword.text.length), link: longword.link, href: longword.href, onclick: longword.onclick});
      wordsSplit.unshift({text:longword.text.substring(0, longword.text.length/2), link: longword.link, href: longword.href, onclick: longword.onclick});
    } else {
      lines.push(pad(line, width, ' '));
      line = '';
    }
  }
  lines.push(pad(line, width, ' '));
  return lines;
}




function popup2(size, position){
  if(size > fullwidth) size = fullwidth;
  var pos = (typeof position != 'undefined')? position : 2;
  var popup = square(size, true);
  var fullheight = Math.floor(window.innerHeight / getLineHeight());
  var startH = Math.floor((fullheight - popup.length)/pos);
  var startW = Math.floor((fullwidth - size)/2);
  document.body.innerHTML = text;
  doTabs();
  var spans = document.body.querySelectorAll("span");
  for(var i = 0; i < spans.length; i++){
    if(spans[i].style.display == 'none')
      document.body.removeChild(spans[i]);
  }
  var lines = document.body.innerHTML.split('\n');
  var finished = '';
  for(var x = 0; x < startH + popup.length || x < lines.length; x++){
    var line = (x < lines.length-1)? strip(lines[x]) + '\n' : pad(' ', fullwidth, ' ') + '\n'; 
    if(x >= startH && x < startH + popup.length){
      line = line.substring(0, startW) + popup[x-startH] + line.substring(startW + size, line.length) ;
    }
    finished += line;
  }
  text = finished;
}

function popup3(){
  var fullheight = Math.floor(window.innerHeight/16);
  var height =Math.floor(fullheight /2); //25l lines
  var width = Math.floor(fullwidth/3);
  var lines = text.split('\n');
  var x = lines.length - 1;
  while(x < height + height/2){
    blankLine();
    x++;
  }
  var lines = text.split('\n');
  var content = '';
  var top = '&nbsp;';
  var middle = '|';
  var bottom = '&nbsp;';
  for(var x = 0; x < width-2; x++){
    top += '_';
    middle += '&nbsp;';
    bottom += '&#175;'
  }
  middle += '|';
  top += '&nbsp;';
  bottom += '&nbsp;';
  var startH = Math.floor((fullheight - height)/4) - 2;
  var startW = Math.floor((fullwidth - width)/2) ;
  for(var x = 0; x < lines.length; x++){
    var line = strip(lines[x]).replace(/&nbsp;/g, ' ');
    if(x == startH){
      content += line.substring(0, startW).replace(' ', '&nbsp;') + top + line.substring(fullwidth - startW , line.length) + '\n';
    } else if(x == startH + height) {
      content += line.substring(0, startW).replace(' ', '&nbsp;') + bottom + line.substring(fullwidth - startW , line.length) + '\n';
    } else if(x < startH + height && x > startH){
      content += line.substring(0, startW).replace(' ', '&nbsp;') + middle + line.substring(fullwidth - startW , line.length) + '\n';
    } else {
      content += lines[x] + '\n';
    }
  }
  text = content;
}