function popup(){
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