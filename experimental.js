
function addCanvas(){

}




function addPopups2(){  
  for(var x in globalPopups){
    if(globalPopups[x].active){
      var lines = document.body.innerHTML.split('\n');
      var finished = '';
      var popup = globalPopups[x];
      var square = getSquare(popup.size, popup.content, true);
      var startH = Math.floor((Math.floor(window.innerHeight / getLineHeight()) - square.length)/popup.position);
      var startW = Math.floor((fullwidth - popup.size)/2);
      for(var x = 0; x < startH + square.length || x < lines.length; x++){
        var line = (x < lines.length-1)? strip(lines[x]) + '\n' : pad(' ', fullwidth, ' ') + '\n'; 
        if(x >= startH && x < startH + square.length){
          line = line.substring(0, startW) + square[x-startH] + line.substring(startW + popup.size, line.length) ;
        }
        finished += line;
      }
      document.body.innerHTML = finished;
      if(typeof popup.function != 'undefined') eval(popup.function);
    }
  }
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