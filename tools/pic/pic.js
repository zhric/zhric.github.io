let pLis = [];

/* 图片预览 */
function showPreview() {
    let file = utils.$("#input_pic")[0];
    let ua = navigator.userAgent.toLowerCase();
    let url = '';
    if (/msie/.test(ua)) {
        url = file.value;
    } else {
        url = window.URL.createObjectURL(file.files[0]);
    }
    utils.$("#img")[0].src = url;
}

function initStrs() {
    let charCanvas = utils.$("#canvas_char")[0];
    let ctx = charCanvas.getContext('2d');
    let chars = utils.$("#input_char")[0].value;
    for (let j = 0; j < chars.length; j++) {
        ctx.clearRect(0, 0, charCanvas.width, charCanvas.height);
        ctx.fillStyle = "black";
        ctx.fillText(chars[j], 5, charCanvas.height - 5);
        let charData = ctx.getImageData(0, 0, charCanvas.width, charCanvas.height).data;
        let ps = 0;
        for (let i = 0; i < charData.length; i += 4) {
            if (charData[i] > 0 || charData[i + 1] > 0 || charData[i + 2] > 0 || charData[i + 3] > 0) {
                ps++;
            }
        }
        pLis.push({str: chars[j], size: ps});
        pLis.sort((a, b) => {
            return a.size - b.size
        });
        pLis.forEach((t, i) => {
            if (i < pLis.length - 1 && t.size === pLis[i + 1].size) {
                pLis.splice(i, 1);
            }
        });
        pLis.avgp = 255 / pLis[pLis.length - 1].size;
        pLis.forEach(t => {
            t.maxP = Math.round(t.size * pLis.avgp);
        });
    }
}

function draw() {
    let imgCanvas = utils.$("#canvas_img")[0];
    let ctx = imgCanvas.getContext('2d');
    ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
    ctx.drawImage(utils.$("#img")[0], 0, 0, imgCanvas.width, imgCanvas.height);
    let imgData = ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height).data;
    let cls = [];
    for (let i = 0; i < imgData.length; i += 4) {
        if (i > 0 && i % (imgCanvas.width * 4) === 0) {
            cls.push("\n");
        }
        let cl = (imgData[i] * 19595 + imgData[i + 1] * 38469 + imgData[i + 2] * 7472) >> 16;
        // 快速定位字符串
        let ind = Math.floor(pLis.length * cl / 255);
        let abs = 255;
        let nav;
        if (ind <= 0) {
            nav = 1;
        } else if (ind >= pLis.length - 1) {
            nav = -1;
        } else {
            let _abs = Math.abs(cl - pLis[ind + 1].maxP);
            let _abs_ = Math.abs(cl - pLis[ind - 1].maxP);
            nav = _abs > _abs_ ? -1 : 1;
        }
        let p;
        if (pLis[ind]) {
            p = pLis[ind].str;
        } else if (ind < 0) {
            p = pLis[0].str;
        } else {
            p = pLis[pLis.length - 1].str;
        }
        for (let j = 0; ind + nav * j >= 0 && ind + nav * j < pLis.length; j++) {
            let _abs = Math.abs(cl - pLis[ind + nav * j].maxP);
            if (_abs < abs) {
                abs = _abs;
            } else {
                p = pLis[ind + nav * j - nav].str;
                break;
            }
        }
        cls.push(p);
    }
    utils.$("#output_pic")[0].innerText = cls.join('');
}

function copyRes() {
    let msg = utils.$("#msg")[0];
    utils.copyToClipboard(utils.$("#output_pic")[0].innerText, () => {
        msg.innerText = "拷贝成功"
    }, err => {
        msg.innerText = "拷贝失败: " + err
    });
}

window.addEventListener("load", () => {
    initStrs();
});