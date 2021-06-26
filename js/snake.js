var BLOCK_SIZE = 20 //每格是20个像素
var BLOCK_COUNT = 20 //20个格子

var gameInterval
var snake
var mode
var apple
var score
var level

function mode1() {
    mode = '1'
    gamaStart()
}
function mode2() {
    mode = '2'
    gamaStart()
}

function gamaStart() {
    
    snake ={
        body: [
            { x:BLOCK_COUNT/2 , y:BLOCK_COUNT/2 }
        ],
        size: 5,
        direction:{ x:0 , y:-1}
    }
    putApple()
    updateScore(0)
    
    // gameInterval = setInterval(gameRoutine, 750)//每1000毫秒，执行一次
    updateGameLevel(1)
}

function updateGameLevel(newLevel) {
    level = newLevel
    
    if (gameInterval) {
      clearInterval(gameInterval)
    }
    gameInterval = setInterval(gameRoutine, 1000 / ((0.4*level)+4))
  }
  

function gameRoutine(){
    moveSnake() //蛇移动 

    if(snakeIsDead()){
        gameover()//游戏结束
        return
    }
    //如果蛇碰到了苹果，吃苹果！
    if (snake.body[0].x === apple.x &&
        snake.body[0].y === apple.y) {
            eatApple()
        }
    updateCanvas() //更新画布
}

function moveSnake(){
    var newBlock = {
        x: snake.body[0].x + snake.direction.x, //新区块 x坐标
        y: snake.body[0].y + snake.direction.y //新区块 y坐标
    }

    snake.body.unshift(newBlock) //加在数组最前面


    while(snake.body.length > snake.size){
        snake.body.pop()  //蛇移动后 尾巴断掉
    }
}

function updateCanvas(){
    var canvas = document.getElementById('canvas_id') //取画布
    var context = canvas.getContext('2d') //取得画布的context

    context.fillStyle = 'black' //用黑色填满
    context.fillRect(0,0,canvas.width,canvas.height) //填充的范围
    //为每一个格子填充颜色
    context.fillStyle = 'lime'
    for(var i=0;i<snake.body.length;i++){
        context.fillRect(
            snake.body[i].x * BLOCK_SIZE + 1,
            snake.body[i].y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1 
        )
    }
    //draw 苹果
    context.fillStyle = 'red'
    context.fillRect(
        apple.x * BLOCK_SIZE + 1,
        apple.y * BLOCK_SIZE + 1,
        BLOCK_SIZE - 1,
        BLOCK_SIZE - 1
    )
}
//在页面加载完成后 onPageLoaded 方法会被调用。
window.onload = onPageLoaded


function onPageLoaded() {
    //建立事件监听器
    document.addEventListener('keydown', handleKeyDown)
}

function handleKeyDown(event) {
    if(mode === '1'){
        var originX = snake.direction.x
        var originY = snake.direction.y

        if(event.keyCode === 37){//左键
            snake.direction.x = originY
            snake.direction.y = -originX
        } else if(event.keyCode === 39){//右键
            snake.direction.x = -originY
            snake.direction.y = originX
        }
    }else if(mode === '2'){
        // keycode:  ←37 ↑38 →39 ↓40  w87  s83 a65 d68
        if(event.keyCode === 65){
            snake.direction.x = -1
            snake.direction.y = 0
        }else if(event.keyCode === 87){
            snake.direction.x = 0
            snake.direction.y = -1
        }else if(event.keyCode === 68){
            snake.direction.x = 1
            snake.direction.y = 0
        }else if(event.keyCode === 83){
            snake.direction.x = 0
            snake.direction.y = 1
        }
    }
    // u 85 i 73
    if(event.keyCode === 85){
        mode1()
    }
    if(event.keyCode === 73){
        mode2()
    }
}

function snakeIsDead(){
    //碰墙
    if(snake.body[0].x < 0){
        return true
    }else if(snake.body[0].x >= BLOCK_COUNT){
        return true
    }else if(snake.body[0].y < 0){
        return true
    }else if(snake.body[0].y >= BLOCK_COUNT){
        return true
    }

    //撞身体
    for(var i=1;i<snake.body.length;i++){
        if(snake.body[0].x === snake.body[i].x &&
            snake.body[0].y === snake.body[i].y){
                return true
            }
    }
    //都没撞，没死...
    return false
}

function gameover() {
    //停止更新画布
    clearInterval(gameInterval)
}

function putApple() {
    
    //随机放置苹果
    apple = {
        x: Math.floor(Math.random() * BLOCK_COUNT),
        y: Math.floor(Math.random() * BLOCK_COUNT)
      }
    //判断苹果有没有放在蛇身上
    for(var i=0;i<snake.body.length;i++){
        if (snake.body[i].x === apple.x && snake.body[i].y === apple.y) {
        putApple()
        break
        }
    }

    
}

function eatApple(){
    snake.size +=1
    putApple()
    updateScore(score + 100)
    updateGameLevel(level + 1)
}
//更新分数
function updateScore(newScore) {
    score = newScore
    document.getElementById('score_id').innerHTML = score
}

