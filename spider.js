const puppeteer = require('puppeteer'); 

const func_page = (() => {
    let arr = [];
    const imgs = document.querySelectorAll('.slide0');
    console.log("querySelectorAll:");
    console.log(document.textContent);
    imgs.forEach(function (item) {
        console.log("item:");
        console.log(item.childNodes[0].content().toString());
        // arr.push(item.childNodes.data-src);
    });
    return arr;
});

const func_dim = (() => {
    console.log("dim");
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
});

function dumpPage(frames) {
    console.log("frames len:" + frames.length);
    var idx;
    for (idx = 1; idx <= frames.length; idx += 1) {
        const frame = frames.find(index => idx);
        console.log("frame " + idx + ":" + frame.toString());
        const text = frame.url();
        console.log("url:" + text);
    }
}

function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    const targetFrameUrl = 'https://view42.book118.com';    
    if (frame.url().includes(targetFrameUrl)) {
        const view = frame.waitForSelector('#view'); 
        dumpView(view, indent);
    }

    for (const child of frame.childFrames()) {
      dumpFrameTree(child, indent + '  ');
    }
}

function dumpView(view, indent)
{
    console.log(indent + view);
}

(async () => {
    const url_addr = 'https://max.book118.com/index.shtm';
    // const browser = await puppeteer.launch(); 
    const browser = await puppeteer.launch({headless: false, slowMo: 1000, devtools: true});
    const page = await browser.newPage();  
    await page.goto(url_addr);
    await page.click('#btn_preview_remain');

    dumpPage(await page.frames());
    dumpFrameTree(await page.mainFrame(), '');

    var pageIdx = 0;
    const pageNum = 1;
    for (pageIdx; pageIdx < pageNum; pageIdx+=1) {
        console.log(pageIdx);
    }

    const result = await page.evaluate(func_page);
    console.log("content:");
    console.log((await page.content()));
    console.log("result toString:" + result.toString());
    const header = await page.waitForSelector('#header');
    dumpView(header, '    ');
    const main = await page.waitForSelector('#main');
    dumpView(main, '    ');
    const layer1 = await page.waitForSelector('#layui-layer1');
    dumpView(layer1, '    ');
    const layui = await page.waitForSelector('#layui-layer1 > div');
    dumpView(layui, '    ');
    await page.frames().map(frame => {
        console.log(frame.url())
    });
    const targetFrameUrl = 'https://view42.book118.com';
    const frame = await page.frames().find(frame => url().includes(targetFrameUrl));
})()
