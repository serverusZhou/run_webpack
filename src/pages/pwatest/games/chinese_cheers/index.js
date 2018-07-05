
import Draw from './draw'
// 绘画象棋主方法
const clientWidth = document.body.clientWidth;
const clientHeight = document.body.clientHeight;

const draw = new Draw();
// 默认参数
const set_o = {
    'canvasId': null, // canvas的id
    'canvasElement': null, // canvas节点
    'ctx': null, // canvas 2d 对象
    'qiJu': null, // 棋子布局
    'canvas': {
        w: clientWidth, // 初始将canvas的宽度设为屏宽
        h: clientHeight // 初始将canvas的高度设为屏高
    },
    'cheers': {
        width: 0, // 具体棋盘的宽度
        height: 0, // 具体棋盘的高度
        cellSize: 60,  // 棋格大小
        lineWidth: 2, // 画笔大小
        strokeStyle: "#000", // 画笔颜色
        markLen: 30,  // 标记长度
        markPadding: 10 // 标记间距
    }
}

// 初始棋局
const qiJu = [
    ['车', '马', '相', '仕', '帅', '仕', '相', '马', '车'],
    [],
    ['', '炮', '', '', '', '', '', '炮', ''],
    ['兵', '', '兵', '', '兵', '', '兵', '', '兵'],
    [],
    [],
    ['卒', '', '卒', '', '卒', '', '卒', '', '卒'],
    ['', '炮', '', '', '', '', '', '炮', ''],
    [],
    ['車', '馬', '象', '士', '将', '士', '象', '馬', '車'],
]

export default class CnCheers {
    constructor(_set) {
        this._set = _set;
        _set && _set.canvasId && document.getElementById(_set.canvasId) && this.init();
    }
    init() {
        let self = this;
        Object.assign(self.set = {}, set_o, this._set); // 将传的参数和默认参数合并到set中
        //check参数是否正确
        if (self.set.cheers.cellSize * 8 > self.set.canvas.w)
            console.warn('样式计算出错 \n \t所有棋子所需的宽度已经超出棋盘的宽度');
        self.set.canvasElement = document.getElementById(self.set.canvasId); // 获取canvas节点
        self.set.ctx = self.set.canvasElement.getContext("2d");
        self.set.qiJu = qiJu;
        self.render();
    }
    render() {
        let self = this, ele = self.set.canvasElement;
        ele.width = self.set.canvas.w, ele.height = self.set.canvas.h;// 将宽高赋值给canvas元素
        draw.drawQiPan(self.set);
    }
}