#!/usr/bin/env node
const charset = require('superagent-charset');
const superAgent = charset(require('superagent'));
const cheerio = require('cheerio')
const readline = require('readline')
const colors = require('colors')

// 创建readlinde.Interface 实现命令行交互
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '<<<---按下回车查看笑话--->>>'
})
let url = 'http://xiaohua.zol.com.cn/new/'
let page = 1

let jokeStories = []
let jokeTitles = []
// 载入笑话并存入数组中
function loadJokes(){
      // 数组中的笑话不足三条时就请求下一页的数据
    if( jokeStories.length < 3 ){
        superAgent
        .get(url + page + '.html')
        .charset('gbk') 
        .end((err, res)=>{
            if(err) console.error(err)
            const $ = cheerio.load(res.text, {decodeEntities: false})
            const jokeTit = $('.article-summary .article-title a')
            const jokeList = $('.article-summary .summary-text')
            jokeList.each(function(i, item){
                jokeStories.push($(this).text()) 
            })
            jokeTit.each(function(i, item){
                jokeTitles.push($(this).text()) 
            })            
            page++            
        })
    }
}
rl.prompt()
loadJokes()
// 按下回车键显示一条笑话
rl.on('line', (line) => {
    if(jokeStories.length>0 && jokeTitles.length>0){
        console.log('======================')
        console.log( ('tit：' + jokeTitles.shift()).bgCyan.black) 
        console.log(('ctx：' + jokeStories.shift()).bgCyan.black) 
        loadJokes()
    }else{
        console.log('正在加载中~~~'.green)
    }
    rl.prompt()
}).on('close', () => {
    console.log('Bye!')
    process.exit(0)
})