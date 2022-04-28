const puppeteer = require('puppeteer'); 

const func_page = (() => { 
    let arr = []; 
    const imgs = document.querySelectorAll('.webpreview-item');
    imgs.forEach(function (item) {
        console.log(item.childNodes[0]);
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
(async () => {
    const url_addr = 'https://max.book118.com';
    // const browser = await puppeteer.launch(); 
    const browser = await puppeteer.launch({headless: false, slowMo: 1000, devtools: true});
    const page = await browser.newPage();  
    await page.goto(url_addr);
    const result = await page.evaluate(func_page);

    console.log("result:" + result);
    // await page.screenshot({path: 'd:/book118.png'})
})()
