'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const crypto = require('crypto')
const ozzx = require('ozzx')
const bodyParser = require('body-parser')


const jsonParser = bodyParser.json() // 获取JSON解析器中间件  

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next();
})

// 静态目录
app.use('/static', express.static('temp'))

// 连接数据库
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'cdb-iphpadts.cd.tencentcdb.com',
  port     : 10035,
  user     : 'ozzx',
  password : 'ozzx',
  database : 'ozzx'
})
 
connection.connect()

let styleListDB = []
let scriptListDB = []

// 获取样式列表
connection.query('SELECT * FROM style', (error, results, fields) => {
  if (error) throw error
  console.log('获取样式列表成功!')
  styleListDB = results
})

// 获取脚本列表
connection.query('SELECT * FROM script', (error, results, fields) => {
  if (error) throw error
  console.log('获取脚本列表成功!')
  scriptListDB = results
})

// 全部替换
function replaceAll (str, substr, newstr) {
  substr = substr.replace(/[.\\[\]{}()|^$?*+]/g, "\\$&")
  const re = new RegExp(substr, "g")
  return str.replace(re, newstr)
}


// 生成html页面
function creatHtml (tempUrl, templateID, styleLsit, scriptList) {
  // 生成页面配置
  let config = {
    // 项目根目录
    root: "/src",
    // 项目入口文件
    entry: "home",
    // 页面标题
    title: '页面',
    // 输出目录
    outFolder: "./dist",
    // 资源目录
    resourceFolder: "./src/resource",
    // head属性清单
    headList: [
      {
        'http-equiv': 'content-type',
        content: 'text/html; charset=UTF-8',
      },
      {
        name: 'viewport',
        content: 'initial-scale=1,user-scalable=no,maximum-scale=1',
      }
    ],
    // 使用到的外部脚本清单
    scriptList: [],
    // 使用到的样式列表
    styleList: [],
    // 页面清单
    pageList: [
      {
        // 是否为页面主入口
        main: true,
        isPage: true,
        name: 'home',
        src: tempUrl
      }
    ],
    // 输出配置
    outPut: {
      // 是否压缩css
      minifyCss: true,
      // 是否压缩js
      minifyJs: true,
      // 输出文件自动追加版本号，可以用来消除缓存
      addVersion: true,
    }
  }
  

  // 读取入口模板文件(一次性读取到内存中)
  const templeFile = path.join(__dirname, 'index.html')
  let htmlTemple = fs.readFileSync(templeFile, 'utf8')
  const dom = ozzx(htmlTemple, config)
  let htmlData = dom.html
  console.log(dom)
  // 替换样式
  dom.needReplaceCssList.forEach(element => {
    dom.style = replaceAll(dom.style, element[0], element[1])
  })

  let outPutStyle = ''
  let outPutScript = ''
  // 替换style
  scriptList.forEach(script => {
    // 从style列表中取出此项的url
    scriptListDB.forEach(scriptItem => {
      if (scriptItem['name'] == script) {
        outPutScript += `<script src="${scriptItem.url}"></script>\r\n`
      }
    })
  })
  
  outPutScript += `<script>${dom.script}\r\n</script>`

  styleLsit.forEach(style => {
    // 从style列表中取出此项的url
    styleListDB.forEach(styleItem => {
      if (styleItem['name'] == style) {
        outPutStyle += `<link rel="stylesheet" href="${styleItem.url}">\r\n`
      }
    })
  })
  outPutStyle += `<style>${dom.style}\r\n</style>`

  htmlData = htmlData.replace('<!-- css-output -->', outPutStyle)
  htmlData = htmlData.replace('<!-- script-output -->', outPutScript)
  fs.writeFileSync('./temp/' + templateID + '.html', htmlData)
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/templateList', (req, res) => {
  connection.query('SELECT * FROM template', (error, results, fields) => {
    if (error) throw error;
    res.send({
      err: 0,
      data: results
    })
  })
})

app.all('/creatTemplate', jsonParser, function(req, res){
  const body = req.body.data
  if (body) {
    // 读取模板文件
    let templateData = fs.readFileSync(`./template/${body['templateFile']}`, 'utf8')
    // 控制列表
    const controlList = body['control']
    controlList.forEach(control => {
      if (typeof control['value'] === 'object') {
        control['value'] = JSON.stringify(control['value'])
      }
      templateData = templateData.replace('{{--' + control['name'] + '--}}', control['value'])
    })
    // 计算MD5
    const md5 = crypto.createHash('md5')
    const md5Data = md5.update(templateData).digest('hex')

    // 判断模板文件是否已经存在
    const tempPath = './temp/' + md5Data + '.page'
    if (!fs.existsSync(tempPath)) {
      fs.writeFileSync(tempPath, templateData)
    }
    // 生成html页面
    if (!body['styleList']) body['styleList'] = []
    if (!body['scriptList']) body['scriptList'] = []
    if (typeof body['styleList'] === 'string') body['styleList'] = JSON.parse(body['styleList'])
    if (typeof body['scriptList'] === 'string') body['scriptList'] = JSON.parse(body['scriptList'])
    creatHtml(tempPath, md5Data, body['styleList'], body['scriptList'])
    res.end(JSON.stringify({
      err: 0,
      templateID: md5Data
    }))
  }
  res.end('{err:0}')
})

app.listen(8000, () => console.log('服务运行于8000端口!'))