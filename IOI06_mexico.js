let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "20px Arial";

let r = canvas.width / 2 - 50;
let ox = canvas.width / 2,
    oy = canvas.height / 2;
ctx.translate(ox, oy);

let n, m;
let coordinates;
let graph;

function draw() {
    ctx.clearRect(-ox, -oy, 2 * ox, 2 * oy);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.stroke();

    let input = document.getElementById("input").value.split(/\r?\n/);

    n = parseInt(input[0]);
    m = parseInt(input[1]);

    coordinates = new Array(n + 1);
    let theta = (2 * Math.PI) / n;
    for (i = 1; i <= n; i++) {
        coordinates[i] = [r * Math.cos(i * theta), r * Math.sin(i * theta)];

        ctx.beginPath();
        ctx.arc(coordinates[i][0], coordinates[i][1], 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(
            i,
            (r + 30) * Math.cos(i * theta),
            (r + 30) * Math.sin(i * theta)
        );
    }

    graph = new Array(n + 1);
    for (i = 0; i <= n; i++) {
        graph[i] = [];
        for (j = 0; j <= n; j++) graph[i].push(false);
    }

    for (i = 0; i < m; i++) {
        let edge = input[2 + i].split(" ");
        let a = parseInt(edge[0]),
            b = parseInt(edge[1]);
        graph[a][b] = graph[b][a] = true;

        ctx.beginPath();
        ctx.moveTo(coordinates[a][0], coordinates[a][1]);
        ctx.lineTo(coordinates[b][0], coordinates[b][1]);
        ctx.stroke();
    }
}

draw();

function solve() {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;

    let dp = new Array(n + 1);
    let vis = new Array(n + 1);
    for (i = 0; i <= n; i++) {
        dp[i] = new Array(n + 1);
        vis[i] = new Array(n + 1);
        for (j = 0; j <= n; j++) (dp[i][j] = [0, 0]), (vis[i][j] = [0, 0]);
    }

    function l(x) {
        return (x % n) + 1;
    }

    function r(x) {
        return ((x + n - 2) % n) + 1;
    }

    function check(a, b, p) {
        if (a == l(b)) return 1;

        if (!vis[a][b][p]) {
            let x, y;
            vis[a][b][p] = 1;
            x = r(a);
            y = l(b);
            let p1, p2;

            if (p) {
                p1 = graph[b][x] ? check(x, b, 0) : 0;
                p2 = graph[b][y] ? check(a, y, 1) : 0;
            } else {
                p1 = graph[a][x] ? check(x, b, 0) : 0;
                p2 = graph[a][y] ? check(a, y, 1) : 0;
            }
            if (p1) dp[a][b][p] = 1;
            else dp[a][b][p] = p2 ? 2 : 0;
        }
        return dp[a][b][p];
    }

    let curr;
    function rebuild_path(a, b, p) {
        if (p) {
            ctx.beginPath();
            ctx.moveTo(coordinates[curr][0], coordinates[curr][1]);
            ctx.lineTo(coordinates[b][0], coordinates[b][1]);
            ctx.stroke();
            
            curr = b;
        } else {
            ctx.beginPath();
            ctx.moveTo(coordinates[curr][0], coordinates[curr][1]);
            ctx.lineTo(coordinates[a][0], coordinates[a][1]);
            ctx.stroke();
            
            curr = a;
        }

        if (a == l(b)) return;

        if (dp[a][b][p] == 1) rebuild_path(r(a), b, 0);
        else rebuild_path(a, l(b), 1);
    }

    for (i = 1; i <= n; i++) {
        if (check(i, i, 0)) {
            curr = i;
            rebuild_path(i, i, 0);
            return;
        }
    }

    alert("No solution");
}
