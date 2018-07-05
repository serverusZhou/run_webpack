export default class Draw {
    // 画棋盘
    drawQiPan({ canvasElement, ctx, qiJu, canvas, cheers }) {
        let { w, h } = canvas;
        let { width, height, cellSize, lineWidth, strokeStyle, markLen, markPadding, rowNum = 9, columnNum = 8 } = cheers;
        width = cellSize * columnNum, height = cellSize * rowNum;
        let startX = (w - width) / 2, startY = (h - height) / 2;


        let bodys = [];
        let radius = cellSize / 2;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        let cX = 0, cY = 0, rX = 0, rY = 0;
        for (let i = 0; i <= rowNum; i++) {
            cX = startX;
            cY = startY + (i * cellSize);
            ctx.moveTo(cX, cY);
            ctx.lineTo(cX + w, cY);
            bodys[i] = bodys[i] || [];
            for (let k = 0; k <= columnNum; k++) {
                rX = startX + (k * cellSize);
                rY = startY + (i * cellSize);
                bodys[i][k] = bodys[i][k] || {};
                bodys[i][k].x = rX;
                bodys[i][k].y = rY;
                bodys[i][k].r = i;
                bodys[i][k].c = k;
                if (i == 4 && k != 0 && k != 8 || i == 9) {
                    continue;
                }
                ctx.moveTo(rX, cY);
                ctx.lineTo(rX, rY + cellSize);
            }
        }
        ctx.stroke();


        
        ctx.restore();
        let fontOffsetY = bodys[4][0].y + radius;
        ctx.fillStyle = "#000";
        ctx.font = "bold 40px Arial";
        ctx.textBaseline = "middle";
        ctx.fillText("汉", startX + cellSize, fontOffsetY);
        ctx.fillText("界", startX + cellSize * 2, fontOffsetY);
        ctx.fillText("楚", startX + cellSize * 5, fontOffsetY);
        ctx.fillText("河", startX + cellSize * 6, fontOffsetY);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.moveTo(bodys[0][3].x, bodys[0][3].y);
        ctx.lineTo(bodys[2][5].x, bodys[2][5].y);
        ctx.moveTo(bodys[0][5].x, bodys[0][5].y);
        ctx.lineTo(bodys[2][3].x, bodys[2][3].y);
        ctx.moveTo(bodys[7][3].x, bodys[7][3].y);
        ctx.lineTo(bodys[9][5].x, bodys[9][5].y);
        ctx.moveTo(bodys[7][5].x, bodys[7][5].y);
        ctx.lineTo(bodys[9][3].x, bodys[9][3].y);
        ctx.stroke();
        function drawTopLeft(x, y, l, o) {
            var s = x - o - l, e = s + l, c = y - o;
            ctx.moveTo(s, c);
            ctx.lineTo(e, c);
            ctx.lineTo(e, c - l);
        }
        function drawTopRight(x, y, l, o) {
            var s = x + o + l, e = s - l, c = y - o;
            ctx.moveTo(s, c);
            ctx.lineTo(e, c);
            ctx.lineTo(e, c - l);
        }
        function drawBottomLeft(x, y, l, o) {
            var s = x - o - l, e = s + l, c = y + o;
            ctx.moveTo(s, c);
            ctx.lineTo(e, c);
            ctx.lineTo(e, c + l);
        }
        function drawBottomRight(x, y, l, o) {
            var s = x + o + l, e = s - l, c = y + o;
            ctx.moveTo(s, c);
            ctx.lineTo(e, c);
            ctx.lineTo(e, c + l);
        }


        function drawX(r, c, pos) {
            var x = bodys[r][c].x,
                y = bodys[r][c].y;
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#000";
            if (pos[0]) {
                drawTopLeft(x, y, markLen, markPadding);
            }
            if (pos[1]) {
                drawTopRight(x, y, markLen, markPadding);
            }
            if (pos[2]) {
                drawBottomLeft(x, y, markLen, markPadding);
            }
            if (pos[3]) {
                drawBottomRight(x, y, markLen, markPadding);
            }
            ctx.stroke();
        }
        drawX(2, 1, [1, 1, 1, 1]);
        drawX(2, 7, [1, 1, 1, 1]);
        drawX(3, 0, [0, 1, 0, 1]);
        drawX(3, 2, [1, 1, 1, 1]);
        drawX(3, 4, [1, 1, 1, 1]);
        drawX(3, 6, [1, 1, 1, 1]);
        drawX(3, 8, [1, 0, 1, 0]);
        drawX(7, 1, [1, 1, 1, 1]);
        drawX(7, 7, [1, 1, 1, 1]);
        drawX(6, 0, [0, 1, 0, 1]);
        drawX(6, 2, [1, 1, 1, 1]);
        drawX(6, 4, [1, 1, 1, 1]);
        drawX(6, 6, [1, 1, 1, 1]);
        drawX(6, 8, [1, 0, 1, 0]);
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.rect(startX - 5, startY - 5, w + 10, h + 10);
        ctx.stroke();

    }
    // 根据棋局生成bodys
    generateQiJu(qiJu) {
        let qiJuArrayMap = [];
        for (var i = 0; i < qiJu.length; i++) {
            for (var k = 0; k < qiJu[i].length; k++) {
                if (qiJu[i][k] != '') {
                    qiJuArrayMap[i][k].qizi = new QiZi(this, i, k, qiJu[i][k], (this.redBottom && i > 5 || this.redBottom == false && i < 5) ? true : false);
                } else {
                    this.bodys[i][k].qizi = null;
                }
            }
        }
    }
    QiZi() {

    }
    drawQiPanLine() {

    }
}