var { assert, expect } = require('chai');
var puppeteer = require('puppeteer');

//회원가입 텍스트
var join_username =  "join_" + Math.random().toString(36).substring(2, 15);
var join_password =  "join_" + Math.random().toString(36).substring(2, 15);
var join_nickname =  "join_" + Math.random().toString(36).substring(2, 15);

// 로그인 후 상태 확인
var checkSession = async () => {
    await page.waitForSelector('.navbar');
    expect( await page.$('#join') , "회원가입 버튼이 없어야됨" ).to.null;
    expect( await page.$('#login') , "로그인 버튼이 없어야됨" ).to.null;
    expect( await page.$('#logout') , "로그아웃 버튼이 없음" ).to.not.null;
    
    const idText = await page.$eval('.navbar-right li a span', userid => userid.textContent.trim() );
    assert.equal( idText , join_username , '입력한 ID와 일치하지 않음');
};

before(async()=>{
    //브라우저 열기
    browser = await puppeteer.launch();
    page = await browser.newPage();    
    // alert 및 confirm yes 클릭
    page.on("dialog", (dialog) => {
        dialog.accept();
    });
});

describe( '회원가입 비회원 체크', () => {

    it( '웹사이트 로딩', async () => {
        const response = await page.goto('http://localhost:3000/', {timeout: 0, waitUntil: 'domcontentloaded'});
        assert.strictEqual( response.status(), 200 , "웹사이트 응답 없음");
    }).timeout(5000);

    it( '회원가입 클릭', async () => {
        expect( await page.$('#join') , "회원가입 버튼이 없음" ).to.not.null;
        await page.click('#join');
        await page.waitForSelector('input[type="submit"]');
    }).timeout(5000);

    it( '회원가입 입력', async () => {
        expect( await page.$('input[type="submit"]') , "가입하기 버튼이 없음" ).to.not.null;
        await page.evaluate((a,b,c) => {
            document.querySelector('input[name=username]').value = a;
            document.querySelector('input[name=password]').value = b;
            document.querySelector('input[name=password2]').value = b;
            document.querySelector('input[name=nickname]').value = c;
            document.querySelector('input[type="submit"]').click();
        }, join_username, join_password, join_nickname);
    }).timeout(5000);

    it( '로그인 클릭', async () => {
        await page.waitForSelector('#login');
        expect( await page.$('#login') , "로그인 버튼 #login 없음" ).to.not.null;
        await page.click('#login');
    }).timeout(5000);

    it( '로그인 입력', async () => {
        await page.waitForSelector('input[type="submit"]');
        expect( await page.$('input[type="submit"]') , "로그인 하기 버튼이 없음" ).to.not.null;
        await page.evaluate((a,b) => {
            document.querySelector('input[name=username]').value = a;
            document.querySelector('input[name=password]').value = b;
            document.querySelector('input[type="submit"]').click();
        }, join_username, join_password );
    }).timeout(5000);


    it( '로그인 후 확인', checkSession ).timeout(5000);

    it( 'Home 버튼 클릭', async () => {
        expect( await page.$('.navbar-brand') , "홈 버튼 navbar-brand 없음" ).to.not.null;
        await page.click('.navbar-brand');
    }).timeout(5000);

    it( '홈 화면 이동 후에도 세션 유지 되는지 확인', checkSession ).timeout(5000);

    it( '로그아웃 클릭', async () => {
        expect( await page.$('#logout') , "로그아웃 버튼 #logout 없음" ).to.not.null;
        await page.click('#logout');
    }).timeout(5000);


    it( '로그아웃 한후 상태 체크', async () => {
        await page.waitForSelector('.navbar');
        expect( await page.$('#logout') , "로그아웃 버튼이 없어야됨" ).to.null;
        expect( await page.$('#join') , "회원가입 버튼이 있어야됨" ).to.not.null;
        expect( await page.$('#login') , "로그인 버튼이 있어야됨" ).to.not.null;
        expect( await page.$('.navbar-right li a span') , "접속중인 ID 표시 안되야됨" ).to.null;

    }).timeout(5000);

    

});
// 브라우저 닫기
after(async()=>{
    await browser.close();
});