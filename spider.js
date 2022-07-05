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
    const targetFrameUrl = 'view42.book118.com';    
    if (frame.url().includes(targetFrameUrl)) {
        const view = frame.waitForSelector('#view'); 
        dumpView(view, indent);
        console.dir(frame);
    }

    for (const child of frame.childFrames()) {
      dumpFrameTree(child, indent + '  ');
    }
}

function dumpView(view, indent)
{
    console.log(indent + view);
}

function dumpFrame(frame)
{
    const targetFrameUrl = 'view42.book118.com';    
    if (frame.url().includes(targetFrameUrl)) {
        console.log("frame content:");
        console.log((frame.content()));
        console.log("frame dir:");
        console.dir(frame);
        const child_view = frame.waitForSelector("#view");
        dumpView(child_view);
    }
}

(async () => {
    const url_addr = 'https://max.book118.com';
    // const browser = await puppeteer.launch(); 
    const browser = await puppeteer.launch({headless: false, slowMo: 100, devtools: true,
      args: [
        // '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ], 
      ignoreDefaultArgs: ['--enable-automation']
    });
    const page = await browser.newPage();  
    await page.goto(url_addr);
    await page.click('#btn_preview_remain');
    await page.mainFrame().childFrames();
    // await page.waitForNavigation();

    dumpPage(await page.frames());
    dumpFrameTree(await page.mainFrame(), '');
    
    const main_content = await page.waitForSelector('#layui-layer1 > div > div > iframe');
    const frame = await main_content.contentFrame();
    const PageCount = await frame.waitForSelector('#PageCount');
    console.dir(PageCount);
    const PageCountTxt = await frame.$eval('#PageCount', el => el.innerHTML);
    console.log("PageCountTxt:" + PageCountTxt);
    
    for (var i = 0; i < PageCountTxt; i += 1) {
        await frame.click('#pageNext');
        var cur_path = 'd:/' + i + ".png";
        var cur_view_id = '#view' + i;

        const cur_page_txt = await frame.$eval(cur_view_id, el => el.innerHTML);
        console.log("cur_page_txt:" + cur_page_txt);  
        const cur_page = await frame.waitForSelector(cur_view_id);
        console.dir(cur_page);
        // cur_page.screenshot({path: cur_path});
    }

    const result = await page.evaluate(func_page);
    console.log("page content:");
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

    const child_frames = await page.mainFrame().childFrames()
    for (var i of child_frames) {
        dumpFrame(i);
    }
    
})()
