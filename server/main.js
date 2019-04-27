'use strict'
const fs = require('fs')
const path = require('path')
const express = require('./node_modules/express')
const app = express()
const crypto = require('crypto')
const owo = require('@owo/owo')
const bodyParser = require('./node_modules/body-parser')

const jsonParser = bodyParser.json() // 获取JSON解析器中间件

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next();
})

// 静态目录
app.use('/', express.static('static'))
app.use('/public', express.static('temp'))

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

// 生成html页面
function creatHtml (tempUrl, templateID, styleLsit, scriptList) {
  console.log(styleLsit, scriptList)
  let styleArr = []
  let scriptArr = []
  styleLsit.forEach(style => {
    // 从style列表中取出此项的url
    styleListDB.forEach(styleItem => {
      if (styleItem['name'] == style) {
        styleArr.push({
          name: styleItem.name,
          src: styleItem.url
        })
      }
    })
  })

  scriptList.forEach(script => {
    // 从style列表中取出此项的url
    scriptListDB.forEach(scriptItem => {
      if (scriptItem['name'] == script) {
        scriptArr.push({
          name: scriptItem.name,
          src: scriptItem.url
        })
      }
    })
  })

  // 生成页面配置
  let config = {
    // 项目根目录
    root: "/src",
    // 项目入口文件
    entry: "home",
    // 页面标题
    title: '页面',
    // 输出目录
    outFolder: './temp/' + templateID,
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
    scriptList: scriptArr,
    // 使用到的样式列表
    styleList: styleArr,
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
  console.log(styleArr, scriptArr)
  const pack = new owo(config, () => {})
  pack.pack()
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
    if (controlList) {
      controlList.forEach(control => {
        if (typeof control['value'] === 'object') {
          control['value'] = JSON.stringify(control['value'])
        }
        templateData = templateData.replace('{{--' + control['name'] + '--}}', control['value'])
      })
    }
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
    
    console.log(`收到数据:`, body["data"])
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
    user     : 'owo',
    password : 'owo',
    database : 'owo'
  })
  connection.connect()
  connection.query(`SELECT * FROM type`, (error, typeResults, typeFields) => {
    // 判断是否为修改
    if (req.query && req.query.id) {
      console.log(`根据ID查找模板: ${req.query.id}`)
      // 根据id查找对应模板
      connection.query(`SELECT * FROM template WHERE id=${req.query.id}`, (error, templateData, typeFields) => {
        connection.end()
        if (error) throw error
        // console.log(templateData)
        res.send({
          err: 0,
          data: {
            type: typeResults,
            style: styleListDB,
            script: scriptListDB
          },
          templateInfo: templateData[0],
          fileData: fs.readFileSync(`./template/${templateData[0].templateFile}`, 'utf8')
        })
      })
    } else {
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
    }
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

// 更新模板文件
app.all('/updataTemplateFile', jsonParser, function(req, res){
  const body = req.body
  if (body && body.value) {
    // 连接数据库
    const connection = mysql.createConnection({
      host     : 'cdb-iphpadts.cd.tencentcdb.com',
      port     : 10035,
      user     : 'ozzx',
      password : 'ozzx',
      database : 'ozzx'
    })
    connection.connect()
    const sql = `UPDATE template SET name = "${body.name}", styleList = '${body.styleList}', scriptList = '${body.scriptList}',  browser = "${body. browser}", type = "${body.type}"  WHERE id = '${body.id}'`
    console.log(`执行SQL：${sql}`)
    connection.query(sql, (error, results, fields) => {
      connection.end()
      if (error) throw error
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