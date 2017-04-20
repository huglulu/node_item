const path = require('path')
const fs = require('fs')
const charset = require('superagent-charset');
const superAgent = charset(require('superagent'));
const cheerio = require('cheerio')
const EventEmitter = require('events')

const URL = 'http://www.mmonly.cc/tag/pl/'
const log = console.log
const imgRoot = path.resolve(process.cwd(), 'imgs')
let page = 1
let task = []

/**
 * Custom event
 */

class MyEmitter extends EventEmitter {}
const event = new MyEmitter()

event.on('loadItemEnd', () => {
	if (task.length != 0) {
		loadItem(task.shift())
	} else {
		log('')
		log(`page-${page} 已加载完毕`)
		page++
		loadPage()
	}
})

/**
 * Start
 */

log('product start')

if (!fs.existsSync(imgRoot)) {
	fs.mkdirSync(imgRoot)
}

try {
	loadPage()
} catch (err) {
	task = []
	loadPage()
}

/**
 * 加载列表页面
 * 读取列表项信息填充至task
 */
function loadPage () {
	down(URL+page+'.html').then( ($) => {
		log('')
		log(`loading page-${page}`)

		let girls = $('.ABox a')  // 列表项集合 a链接
		if (!girls.length) {
			log(`page-${page} 加载失败，未获取相应数据`)
			return			
		}

		girls.each((i, e) => {
			task.push({
				url: $(e).attr('href'),   //分页面地址
				title: $(e).find('img').attr('alt'), 
				preview: $(e).find('img').attr('src')  
			})
		})							
		log(`filling the ${page}`)
		loadItem(task.shift())  
	})
}

/**
 * 加载列表项页面
 * 加载列表项页面里的所有分页，并读取图片信息填充，传递给save函数
 */

function loadItem (obj) {
	let url = obj.url
	let brl = url.split('/')
	let url_1 = brl[5].split('.')[0]
	brl.pop()
	let url_2 = brl.join('/')
	let title = obj.title
	let preview = obj.preview
	let srcs = []

	log('')
	log(`开始检测 ${title}`)

	// 检测是否存储过当前项
	if (fs.existsSync(path.resolve(imgRoot, title))) {
		event.emit('loadItemEnd')
		log('数据已存在')
		return
	}

	log(`准备加载 ${title}`)

	down(url).then(($) => {           
		log(`准备处理 ${title}`)

		let imgs = $(`img[alt="${title}"]`)  
		// log(imgs)
		let pages = $(`[href^="${url_1}"]`)  // 分页所有a链接元素
		// log(pages)
		let pagesUrl = []
		pages.each((i, e) => {
			pagesUrl.push(url_2 +'/' + $(e).attr('href')) 
		})
		
		if (pagesUrl[0] == pagesUrl[1]) {
			pagesUrl[0] = pagesUrl[0].replace(/2.html/g,'1.html')
		}
		pagesUrl.pop()

		log(pagesUrl)
		log(`准备加载分页 ${title}`)

		Promise.all(pagesUrl.map(e => down(e))).then(result => {
			result.forEach((_$, index) => {

				_$(`img[alt="${title}"]`).each((_i,_e) => {
					srcs.push(_$(_e).attr('src'))   
				})
			})

			log(`准备储存图片 ${title}`)

			save({title: title, srcs: srcs, preview: preview}, r => {
				log(`存储完毕 ${title}`)
				event.emit('loadItemEnd')
			})
		})
	})
}

function save(data, callback) {
	let title = data.title
	let srcs = data.srcs 
	log(srcs)

	Promise.all(srcs.map(e => down(e, false))).then(result => {
		var imgPath = path.resolve(imgRoot, title) 
		fs.mkdirSync(path.resolve(imgPath))

		log(`开始储存图片 ${title}`)

		result.forEach((e, i) => {     
			fs.writeFileSync(path.resolve(imgPath, `${i}.jpg`), e.body, null)
		})

		callback && callback ()
	})
}

function down (url, hasProcess = true) {
	if (hasProcess) {
		return new Promise((resolve, reject) => {
			superAgent
				.get(url)
				.charset('gbk') 
				.end((err, res) => {
					err ? reject(err) : resolve(cheerio.load(res.text))
				})
		})
	} else {
		return new Promise((resolve, reject) => {
			superAgent
				.get(url)
				.end((err, res) => {
					err ? reject(err) : resolve(res)
				})
		})
	}
}