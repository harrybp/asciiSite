//--------------------ROTATING GAME--------------------------------------------
//   By HarryBP
//
//  TODO:
//    - Fix bug where ball hits end of line and travels up it
//
//
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  Creates game canvas of given size and position and adds to body
function createCanvasRotate(width, height, left, top){
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  canvas.style.cssText += "position:absolute; left: " + left +"px; top: "+ top+ "px; margin: auto; width: " + width + "px; height: " + height + "px; border: 0px solid black; background-color: white;";
  document.body.insertBefore(canvas, document.body.firstChild);
  gameSize = height;
  init();
}

//-----------------------------------------------------------------------------
//  Called to start a new game
function init(){
  console.log('d')
  frameLength = 8;
  paused = dead = false;
  rotateSpeed = 1/128;
  score = direction =  0;
  balls = [];
  balls.push(addBall({x:20,y:20}));
  lines = [
    { a: { x: 2*gameSize/8, y: 2*gameSize/8 }, b: { x: 7 *gameSize/16, y: 2* gameSize/8 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 2*gameSize/8, y: 2*gameSize/8 }, b: { x: 2* gameSize/8, y: 7* gameSize/16 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 6*gameSize/8, y: 2*gameSize/8 }, b: { x: 9 *gameSize/16, y: 2* gameSize/8 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 6*gameSize/8, y: 2*gameSize/8 }, b: { x: 6* gameSize/8, y: 7* gameSize/16 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 6*gameSize/8, y: 6*gameSize/8 }, b: { x: 6 *gameSize/8, y: 9* gameSize/16 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 6*gameSize/8, y: 6*gameSize/8 }, b: { x: 9* gameSize/16, y: 6* gameSize/8 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 2*gameSize/8, y: 6*gameSize/8 }, b: { x: 2 *gameSize/8, y: 9* gameSize/16 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 2*gameSize/8, y: 6*gameSize/8 }, b: { x: 7* gameSize/16, y: 6* gameSize/8 }, rotate: true, colour: '#00796B', count: 0 },
    { a: { x: 10, y: 2*gameSize/8 }, b: { x: 10, y: 6*gameSize/8 }, rotate: false, colour: '#F57C00', count: 0 },
    { a: { x: 2*gameSize/8, y: 10 }, b: { x: 6*gameSize/8, y: 10 }, rotate: false, colour: '#F57C00', count: 0 },
    { a: { x: gameSize-10, y: 2*gameSize/8 }, b: { x: gameSize-10, y: 6*gameSize/8 }, rotate: false, colour: '#F57C00', count: 0 },
    { a: { x: 2*gameSize/8, y: gameSize-10 }, b: { x: 6*gameSize/8, y: gameSize-10 }, rotate: false, colour: '#F57C00', count: 0 },
  ];
  rotateLines(Math.PI/4)
  startGame();
}

//-----------------------------------------------------------------------------
//  Called when a ball escapes
function gameOver(){
  for(var lineIndex in lines){ lines[lineIndex].colour = "#FFFFFF"; }
  balls = [];
  dead = true;
  stopGame();
}

//-----------------------------------------------------------------------------
//  Adds a new ball to the game at position 'pos' travelling towards the center
function addBall(pos){
  var ball = {
    position: { x: pos.x, y: pos.y },
    speed: { x: 20, y: 20 },
    radius: gameSize/64,
    colour: "#000000",
  }
  regulateSpeed(ball.speed,gameSize/256);
  return ball;
}

//-----------------------------------------------------------------------------
//  Game loop - Calls update Frame repeatedly
var start = frameLoop = null;
function startGame() { if(dead) stopGame(); else if(!frameLoop) frameLoop = window.requestAnimationFrame(step); }
function stopGame() { if(frameLoop) { window.cancelAnimationFrame(frameLoop); frameLoop = undefined;  } }
function step(timestamp){
  frameLoop = undefined;
  if(!start) start = timestamp;
  var progress = timestamp - start;
  if(progress > frameLength){
    start = timestamp;
    if(!paused){
      updateR();
    }
  }
 startGame();
}



//-----------------------------------------------------------------------------
//  updateRs all entities every frame
function updateR(){
  rotateLines(rotateSpeed * direction);
  for(var ballIndex in balls){
    var ball = balls[ballIndex];
    if(ball.position.x < 0 || ball.position.x > gameSize || ball.position.y < 0 || ball.position.y > gameSize) gameOver();
    ball.position.x += ball.speed.x;
    ball.position.y += ball.speed.y;
    for(var lineIndex in lines){
      var line = lines[lineIndex];
      if(line.count > 0) line.count--;
      if(line.count == 1) score++;
      if(distToSegment(ball.position,line.a, line.b) <= ball.radius){
        line.count = 20;
        ball.speed = bounce(line,ball);
        if(direction != 0 && line.rotate){
          ball.position = rotate(ball.position, rotateSpeed*direction);
          ball.speed = applyRotateForce(ball, rotateSpeed);
        }
      }
    }
    ball.speed = regulateSpeed(ball.speed,gameSize/128);
  }
  draw();

}

//-----------------------------------------------------------------------------
//  Keeps the speed below max 
function regulateSpeed(speed, max){
  var actualSpeed = Math.sqrt(Math.pow(speed.x,2) + Math.pow(speed.y,2));
  if(actualSpeed > max){
    speed.x = speed.x * max/actualSpeed;
    speed.y = speed.y * max/actualSpeed;
  }
  return speed;
}

//-----------------------------------------------------------------------------
//  Returns the distance of a point from a line between two given points
function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegment(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt(dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) }));
}

//-----------------------------------------------------------------------------
//  Returns the speed of a ball after bouncing off a line
function dotProd(u, v){ return (u.x * v.x) + (u.y * v.y) }
function bounce(line, ball){
  var normal = getNormal(line);
  var intermediate = dotProd(ball.speed,normal)/dotProd(normal,normal);
  var u = { x: normal.x * intermediate, y: normal.y * intermediate };
  var w = { x: ball.speed.x - u.x, y: ball.speed.y - u.y };
  //console.log("u: " + u.x + "," + u.y + "  :  w: " + w.x + "," + w.y);
  return { x: w.x - u.x, y: w.y - u.y };
}

//-----------------------------------------------------------------------------
//  Returns the normal vector of a line given two points
function getNormal(line){
  surfaceVector = { x: line.a.x - line.b.x, y: line.a.y - line.b.y };
  return { x: surfaceVector.y,  y: - surfaceVector.x }
}

//-----------------------------------------------------------------------------
//  Paints a frame
function draw(){
  var dif = (canvas.style.width.substring(0,canvas.style.width.length-2) - canvas.style.height.substring(0,canvas.style.height.length-2) )/2;
  ctx.clearRect(dif,0,gameSize,gameSize);
  ctx.lineWidth=gameSize/100;
  for(var lineIndex in lines){
    var line = lines[lineIndex];
    ctx.strokeStyle = line.colour;
    if(line.count > 0) ctx.strokeStyle = '#84FFFF';
    ctx.beginPath();
    ctx.moveTo(dif+line.a.x, line.a.y);
    ctx.lineTo(dif+line.b.x, line.b.y);
    ctx.stroke();
  }
  for(var i in balls){
    var ball = balls[i];
    ctx.fillStyle = ball.colour;
    ctx.beginPath();
    ctx.arc(dif+ball.position.x,ball.position.y,ball.radius,0,2*Math.PI);
    ctx.fill();
  }
  ctx.font = (gameSize/256 * 15) + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(score, canvas.width/2, canvas.height/2); 
  if(dead){ 
    ctx.fillText('Game Over', canvas.width/2, canvas.height/8); 
    ctx.fillText('Press P to restart', canvas.width/2, 11*canvas.height/12); 
  } 
}

//-----------------------------------------------------------------------------
//  Rotates all lines around center by theta
function rotateLines(theta){
  for(var lineIndex in lines){
    var line = lines[lineIndex];
    if(line.rotate){
      line.a = rotate(line.a, theta);
      line.b = rotate(line.b, theta);
    }
  }
}

//-----------------------------------------------------------------------------
//  Returns a given point rotated by theta around the center
function rotate(point, theta){
  var temp = { x: point.x - gameSize/2, y: point.y - gameSize/2 };
  var rot = { x: (temp.x*Math.cos(theta))-(temp.y*Math.sin(theta)), y: (temp.x*Math.sin(theta))+(temp.y*Math.cos(theta)) }
  return { x: rot.x + gameSize/2, y : rot.y + gameSize/2 }
}

//-----------------------------------------------------------------------------
//  Apply rotational force from spinning lines onto the ball
function dist(a,b){ return(Math.sqrt(Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2))); }
function applyRotateForce(ball, theta){
  var speed = Math.abs(theta * direction * dist(ball.position, {x: gameSize/2, y: gameSize/2}))/2;
  var vector = { x: gameSize/2 - ball.position.x, y: gameSize/2 - ball.position.y }
  var tangent = { x: vector.y * direction, y: -vector.x * direction }
  var tangentMagnitude = Math.sqrt(Math.pow(tangent.x,2) + Math.pow(tangent.y,2));
  var unitTangent = { x: tangent.x / tangentMagnitude, y: tangent.y / tangentMagnitude };
  var tangent = { x: unitTangent.x * speed, y: unitTangent.y * speed }
  return { x: tangent.x + ball.speed.x, y: tangent.y + ball.speed.y }
}

//-----------------------------------------------------------------------------
//  Captures key presses
window.onkeydown = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if (key == 39) { direction = 1; }
  else if (key == 37) { direction = -1; }
  if(key == 80){ 
    if(dead) {
      init(); 
    } else {
      paused = !paused; 
    }
    
  }
}
window.onkeyup = function(e){
  var key = e.keyCode ? e.keyCode : e.which;
  if(key == 39 || key == 37){ direction = 0; }
}

