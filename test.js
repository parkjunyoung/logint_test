var { assert, expect } = require('chai');
var puppeteer = require('puppeteer');

//입력 할 텍스트
var insert_name =  "insert_" + Math.random().toString(36).substring(2, 15);
var insert_description = "insert_" + Math.random().toString(36).substring(2, 15);

//수정 할 텍스트
var modi_name = "update_" + Math.random().toString(36).substring(2, 15);
var modi_description = "update_" + Math.random().toString(36).substring(2, 15);

before(async()=>{
    //브라우저 열기
    browser = await puppeteer.launch();
    page = await browser.newPage(); 

    // alert 및 confirm yes 클릭
    page.on("dialog", (dialog) => {
        dialog.accept();
    });
    
});


describe( 'CRUD체크', () => {

    it( '웹사이트 로딩', async () => {
        const response = await page.goto('http://localhost:3000/', {timeout: 0, waitUntil: 'domcontentloaded'});
        assert.strictEqual( response.status(), 200 , "웹사이트 응답 없음");
    });

    it( '작성하기 클릭', async () => { 
        expect( await page.$('.btn-default') , " 버튼 btn-default 없음" ).to.not.null;
        await page.click('.btn-default');
        await page.waitForSelector('.btn-primary')
    }).timeout(5000);


    it( '글 작성하기', async () => {
        expect( await page.$('.btn-primary') , " 버튼 btn-primary 없음" ).to.not.null;
        await page.evaluate((a,b) => {
            document.querySelector('input[name=name]').value = a;
            document.querySelector('textarea[name=description]').value = b;
            document.querySelector('.btn-primary').click();
        }, insert_name, insert_description);
    }).timeout(5000);

    it( '작성한 텍스트 맞는지 확인', async () => { 
        await page.waitForSelector('.btn-default');
        const tdName = await page.$eval('table tr:nth-child(2) td:nth-child(1) a', td => td.textContent.trim() );
        const tdDescription = await page.$eval('table tr:nth-child(2) td:nth-child(2)', td => td.textContent.trim() );

        assert.equal( tdName , insert_name , '제목이 일치하지 않음');
        assert.equal( tdDescription , insert_description , '내용이 일치하지 않음');
    });

    it( '상세페이지 클릭', async () => { 
        expect( await page.$('table tr:nth-child(2) td:nth-child(1) a') 
            , "상세피이지 링크가 없음" ).to.not.null;
        await page.click('table tr:nth-child(2) td:nth-child(1) a');
    }).timeout(5000);

    it( '수정하기 클릭', async () => { 
        await page.waitForSelector('.btn-primary');
        expect( await page.$('.btn-primary') , " 수정버튼 btn-primary 없음" ).to.not.null;
        await page.click('.btn-primary');
        await page.waitForSelector('.btn-primary');
    }).timeout(5000);

    it( '글 수정하기', async () => { 
        await page.waitForSelector('.btn-primary');
        await page.evaluate((a,b) => {
            document.querySelector('input[name=name]').value = a;
            document.querySelector('textarea[name=description]').value = b;
            document.querySelector('.btn-primary').click();
        }, modi_name, modi_description);
    }).timeout(5000);


    it( '수정한 텍스트 맞는지 확인', async () => { 
        await page.waitForSelector('.btn-default');
        const nameText = await page.$eval('.panel-heading', head => head.textContent.trim() );
        const descriptionText = await page.$eval('.panel-body', body => body.textContent.trim() );

        assert.equal( nameText , modi_name , '제목이 일치하지 않음');
        assert.equal( descriptionText , modi_description , '내용이 일치하지 않음');
    });

    it( '글목록으로 클릭', async () => { 
        expect( await page.$('.btn-default') , " 목록으로 버튼 btn-default 없음" ).to.not.null;
        await page.click('.btn-default');
        await page.waitForSelector('.btn-default');
    }).timeout(5000);

    it( '삭제하기 버튼 클릭', async () => { 
        expect( await page.$('.btn-danger') , " 삭제 btn-danger 없음" ).to.not.null;
        await page.click('.btn-danger');
    }).timeout(5000);

    it( '삭제 되어서 row가 없는지 체크', async () => { 
        await page.waitForSelector('.btn-default')
        const trCounts = await page.$$eval('table tr', trs => trs.length);
        assert.equal( trCounts, 1, '삭제가 되지 않았습니다.');
    });


    
    

});
// 브라우저 닫기
after(async()=>{
    await browser.close();
});