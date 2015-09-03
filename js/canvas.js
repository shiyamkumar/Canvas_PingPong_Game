$(function(){
    var canvas=document.getElementById("my-canvas");
    var ctx=canvas.getContext("2d");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var boardX = 0;
    var boardColor = "#ffffff";
    var boardWidth = 100;
    var boardHeight = 10;
    var ballX = canvasWidth/2;
    var ballY = 20;
    var ballRadius = 7;
    var ballColor = "#ffffff";
    var ballXDirection = 1;
    var ballYDirection = 0;
    var moveBallTimer;
    var ballXDiff = 0;
    var ballYDiff = 10
    var score = 0;


    createBoard();
    createBall();
    $("#my-canvas").bind({
        mousemove: function(e) {
            ctx.clearRect(0, 0,canvasWidth,canvasHeight);
            var mousePos = getMousePos(canvas, e);
            boardX = mousePos.x;
            // If board Goes out of Canvas - Block at Maximum
            boardX = (boardX+boardWidth) > canvasWidth ? canvasWidth-boardWidth : boardX;
            createBoard();
            createBall();
        }
    });
    $(".startGame").click(function(){
        gameInit();
    });

    function gameInit(){
        clearInterval(moveBallTimer);
        moveBallTimer = setInterval(function(){
            moveBall();
        },(1000/40));
    }
    function resetGame(){
        boardX = 0;
        ballX = canvasWidth/2;
        ballY = 20;
        ballXDirection = 1;
        ballYDirection = 0;
        ballXDiff = 0;
        ballYDiff = 10
        score = 0;
        ctx.clearRect(0, 0,canvasWidth,canvasHeight);
        clearInterval(moveBallTimer);
        createBoard();
        createBall();
    }
    function createBoard(){
        //top Board
        ctx.fillStyle = boardColor;
        ctx.fillRect(boardX,0,boardWidth,boardHeight);
        //bottom Board
        ctx.fillStyle = boardColor;
        ctx.fillRect(boardX,canvasHeight-boardHeight,boardWidth,boardHeight);
    }
    function createBall(){
        ctx.fillStyle = ballColor;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.fill();
    }
    function moveBall(){
        ctx.clearRect(0, 0,canvasWidth,canvasHeight);
        //Change Direction top/bottom Start
        if(ballYDirection){
            ballY -= ballYDiff;
            if(ballY <= 20){
                ballYDirection = 0;
                checkBallHit();
            }
        }
        else{
            ballY += ballYDiff;
            if(ballY >= canvasHeight-20){
                ballYDirection = 1;
                checkBallHit();
            }
        }
        //Change Direction top/bottom End

        //Change Direction left/right Start
        var ballDiameter = ballRadius*2;
        if(ballXDirection){
            ballX -= ballXDiff;
            if(ballX <= ballDiameter){
                ballXDirection = 0;
            }
        }
        else{
            ballX += ballXDiff;
            if(ballX >= canvasWidth-ballDiameter){
                ballXDirection = 1;
            }
        }
        //Change Direction left/right End
        createBall();
        createBoard();
    }
    function checkBallHit(){
        if( ballX > boardX-ballRadius && // check whether Ball hits after Board Start
            ballX-ballRadius < boardX+boardWidth // check whether Ball hits before Board End
            ){
            score++;
            //diff from center point of board(value can come in - or +)
            ballXDiff = boardX-ballX+(boardWidth/2);
            //to make value between 50 to -50
            if( ballXDiff > 0 ){
                ballXDiff = ballXDiff-ballRadius;
                ballXDirection = 1;
            }
            else{
                ballXDiff = ballXDiff+ballRadius;
                ballXDirection = 0;
            }
            ballXDiff = Math.ceil(Math.abs(ballXDiff/5)) || 1;
            ballYDiff = 10-ballXDiff || 1;
            //console.log(ballXDiff, ballYDiff, ballXDirection, ballYDirection);
        }
        else{
            alert("Your Score is "+score);
            resetGame();
            score = 0;
        }
    }
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
});