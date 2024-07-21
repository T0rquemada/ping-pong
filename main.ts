import * as r from 'raylib';

interface Player {
    posX: number;
    posY: number;
    speed: number;
    size: number;
    width: number;
    height: number;
    score: number;
}

interface Ball {
    active: boolean;
    posX: number;
    posY: number;
    speedX: number;
    speedY: number;
    size: number;
}

function createPlayer(posX: number, posY: number): Player {
    return {
        posX: posX,
        posY: posY,
        speed: 5,
        size: 10,
        width: 20,
        height: 80,
        score: 0
    };
}

function createBall(posX: number, posY: number): Ball {
    return {
        active: false,
        posX: posX,
        posY: posY,
        speedX: 5,
        speedY: 5,
        size: 10
    };
}

const screen_width = 800;
const screen_height = 300;

const player1 = createPlayer(screen_width / 6, screen_height / 2);
const player2 = createPlayer(screen_width - (screen_width / 6), screen_height / 2);
const ball = createBall(screen_width/2, screen_height/2);

function handle_collision() {
    // Player & Screen borders
    function player_screen() {
        // Player1
        if (player1.posY <= 0) player1.posY = 0; // Up
        if (player1.posY + player1.height >= screen_height) player1.posY = screen_height - player1.height; // Down

        // Player2
        if (player2.posY <= 0) player2.posY = 0; // Up
        if (player2.posY + player2.height >= screen_height) player2.posY = screen_height - player2.height; // Down
    }

    // Ball & Screen top and bottom borders
    function ball_screen() {
        if (ball.posY - ball.size <= 0) ball.speedY = -(ball.speedY);
        if (ball.posY - ball.size >= screen_height) ball.speedY = -(ball.speedY);

        if (ball.posX <= 0) {
            ball.active = false;
            player2.score++;
        }

        if (ball.posX >= screen_width) {
            ball.active = false;
            player1.score++;
        }
    }

    function ball_player() {
        let ball_posX = ball.posX + ball.speedX;
        let ball_playe1_x = ball_posX >= player1.posX && ball_posX <= player1.posX + player1.width;
        let ball_playe2_x = ball_posX >= player2.posX && ball_posX <= player2.posX + player2.width;

        let ball_posY = ball.posY + ball.speedY;
        let ball_playe1_y = ball_posY >= player1.posY && ball_posY <= player1.posY+player1.height;
        let ball_playe2_y = ball_posY >= player2.posY && ball_posY <= player2.posY+player2.height;

        if (ball_playe1_x && ball_playe1_y) ball.speedX = -(ball.speedX);
        if (ball_playe2_x && ball_playe2_y ) ball.speedX = -(ball.speedX);
    }

    player_screen();
    ball_screen();
    ball_player();
}

function launch_ball() {
    ball.active = true;
}

function handle_move() {
    // Player1
    if (r.IsKeyDown(r.KEY_W)) player1.posY -= player1.speed;
    if (r.IsKeyDown(r.KEY_S)) player1.posY += player1.speed;

    // Player2
    if (r.IsKeyDown(r.KEY_UP)) player2.posY -= player2.speed;
    if (r.IsKeyDown(r.KEY_DOWN)) player2.posY += player2.speed;

    // Ball launch
    if (ball.active == false && r.IsKeyDown(r.KEY_SPACE)) {
        launch_ball();
    }
}

function draw_game() {
    r.BeginDrawing();
        r.ClearBackground(r.RAYWHITE);

        r.DrawText(`Player 1: ${player1.score} | Player 2: ${player2.score}`, screen_width/3, 40, 24, r.BLACK);

        r.DrawRectangle(player1.posX, player1.posY, player1.width, player1.height, r.BLACK);
        r.DrawRectangle(player2.posX, player2.posY, player2.width, player2.height, r.BLACK);
        
        if (ball.active) {
            ball.posX += ball.speedX;
            ball.posY += ball.speedY;
        } else {
            ball.posX = screen_width/2;
            ball.posY = screen_height/2;
            r.DrawText("Press [Space] to start game", screen_width/4, screen_height-40, 24, r.BLACK);
        }
        
        r.DrawCircle(ball.posX, ball.posY, ball.size, r.RED);
    r.EndDrawing();
}

function gameLoop() {
    while (!r.WindowShouldClose()) {
        handle_move();
        handle_collision();
        draw_game();
    }
}

function main() {
    r.InitWindow(screen_width, screen_height, "Ping Pong");
    r.SetTargetFPS(60);

    gameLoop();

    r.CloseWindow();
}

main();
