'use strict'
const fs = require('fs')
const path = require('path')
const express = require('./node_modules/express')
const app = express()
const crypto = require('crypto')
const ozzx = require('./node_modules/ozzx/lib/page/body')
const bodyParser = require('./node_modules/body-parser')


// 获取ozzx模块目录
const corePath = path.join(__dirname, 'node_modules', 'ozzx', 'core')
const Tool = require(path.join(__dirname, 'node_modules', 'ozzx', 'lib', 'tool'))
const Cut = require(path.join(__dirname, 'node_modules', 'ozzx', 'lib', 'cut'))

const jsonParser = bodyParser.json() // 获取JSON解析器中间件

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next();
})

// 静态目录
app.use('/', express.static('temp'))

let styleListDB = []
let scriptListDB = []

// 连接数据库
const mysql      = require('./node_modules/mysql');
{
  const connection = mysql.createConnection({
    host     : 'cdb-iphpadts.cd.tencentcdb.com',
    port     : 10035,
    user     : 'ozzx',
    password : 'ozzx',
    database : 'ozzx'
  })
   
  connection.connect()
  
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
  
  connection.end()
}


// 全部替换
function replaceAll (str, substr, newstr) {
  substr = substr.replace(/[.\\[\]{}()|^$?*+]/g, "\\$&")
  const re = new RegExp(substr, "g")
  return str.replace(re, newstr)
}

// 读取指定目录文件
function loadFile (path) {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf8')
  } else {
    log.error(`file does not exist: ${path}`)
    return ''
  }
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
  // console.log(config)
  const dom = ozzx(htmlTemple, config)
  let htmlData = dom.html
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
  // 增加main.js
  outPutScript += `<script>${loadFile(path.join(corePath, 'main.js'))}\r\n</script>`
  // 增加SinglePage.js
  outPutScript += `<script>${loadFile(path.join(corePath, 'SinglePage.js'))}\r\n</script>`
  outPutScript = outPutScript.replace(/\\r  /g, '\r\n ')
  let coreScript = ''
  // 处理使用到的方法
  // console.log(htmlTemple)
  let toolList = Cut.stringArray(outPutScript, 'ozzx.tool.', '(')
  let toolList2 = Cut.stringArray(outPutScript, '$tool.', '(')
  // 数组去重
  toolList = new Set(toolList.concat(toolList2))
  toolList.forEach(element => {
    // console.log(element)
    coreScript += Tool.loadFile(path.join(corePath, 'tool', `${element}.js`))
  })

  outPutScript += `<script>${coreScript}\r\n</script>`

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

app.get('/getTemplateListByType', (req, res) => {
  const connection = mysql.createConnection({
    host     : 'cdb-iphpadts.cd.tencentcdb.com',
    port     : 10035,
    user     : 'ozzx',
    password : 'ozzx',
    database : 'ozzx'
  })
  connection.connect()
  connection.query(`SELECT * FROM template WHERE type='${req.query.type}'`, (templateError, templateResults, typeFields) => {
    connection.end()
    if (templateError) throw templateError
    res.send({
      err: 0,
      data: templateResults
    })
  })
})

app.get('/typeList', (req, res) => {
  const connection = mysql.createConnection({
    host     : 'cdb-iphpadts.cd.tencentcdb.com',
    port     : 10035,
    user     : 'ozzx',
    password : 'ozzx',
    database : 'ozzx'
  })
  connection.connect()
  // 查询类型列表
  connection.query('SELECT * FROM type', (typeError, typeResults, typeFields) => {
    if (typeError) throw typeError;
    connection.query(`SELECT * FROM template WHERE type='${typeResults[0].value}'`, (templateError, templateResults, typeFields) => {
      connection.end()
      if (templateError) throw templateError;
      res.send({
        err: 0,
        data: {
          template: templateResults,
          type: typeResults
        }
      })
    })
  })
})

app.all('/creatTemplate', jsonParser, function(req, res){
  const body = req.body.data
  if (body) {
    // 读取模板文件
    console.log(`读取文件: ./template/${body['templateFile']}`)
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
      // console.log(templateData)
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

app.all('/changeControl', jsonParser, function(req, res){
  const body = req.body
  if (body && body["data"]) {
    // 连接数据库
    const connection = mysql.createConnection({
      host     : 'cdb-iphpadts.cd.tencentcdb.com',
      port     : 10035,
      user     : 'ozzx',
      password : 'ozzx',
      database : 'ozzx'
    })
    connection.connect()
    console.log(`UPDATE template SET control = '${JSON.stringify(body["data"])}' WHERE id = '${body["id"]}'`)
    connection.query(`UPDATE template SET control = '${JSON.stringify(body["data"])}' WHERE id = '${body["id"]}'`, (error, results, fields) => {
      connection.end()
      if (error) throw error
      res.send({
        err: 0,
        message: results
      })
    })
  } else {
    res.end('{"err":1,"message": "数据不能为空!"}')
  }
  
})

// 获取分组等信息
app.get('/getInfo', (req, res) => {
  // 查询数据库获取标签列表
  const connection = mysql.createConnection({
    host     : 'cdb-iphpadts.cd.tencentcdb.com',
    port     : 10035,
    user     : 'ozzx',
    password : 'ozzx',
    database : 'ozzx'
  })
  connection.connect()
  connection.query(`SELECT * FROM type`, (error, typeResults, typeFields) => {
    connection.end()
    if (error) throw error
    res.send({
      err: 0,
      data: {
        type: typeResults,
        style: styleListDB,
        script: scriptListDB
      }
    })
  })
})

// 添加模板文件
app.all('/saveTemplateFile', jsonParser, function(req, res){
  const body = req.body
  if (body && body.value) {
    console.log(body)
    // 连接数据库
    const connection = mysql.createConnection({
      host     : 'cdb-iphpadts.cd.tencentcdb.com',
      port     : 10035,
      user     : 'ozzx',
      password : 'ozzx',
      database : 'ozzx'
    })
    connection.connect()
    const sql = `INSERT INTO template (name, templateFile, styleList, scriptList, browser, type) VALUES ('${body.name}', '${body.templateFile}', '${body.styleList}', '${body.scriptList}', '${body.browser}', '${body.type}')`
    // console.log(sql)
    connection.query(sql, (error, results, fields) => {
      connection.end()
      if (error) throw error
      console.log(results)
      fs.writeFileSync(`./template/${body.templateFile}`, body.value)
      res.send({
        err: 0
      })
    })
  } else {
    res.end('{"err":1,"message": "数据不能为空!"}')
  }
  
})

app.listen(8004, () => console.log('服务运行于8004端口!'))