import os
import sys
import json
import hashlib
import requests
import http.client
import pymysql.cursors
from django.http import HttpResponse

def writeFile (path, data):
  f = open(path, 'w', encoding='utf-8')
  f.write(data)
  f.close()

def savePage (tempUrl, templateID):
  url = 'http://127.0.0.1:3000/'
  d = '<!DOCTYPE html><html lang="zh-CN"><head><title>demo</title><link rel="stylesheet" href="./main.css"></head><body><temple name="templeName"></temple><script src="./main.js" type="text/javascript"></script></body></html>'
  d = d.replace('templeName', tempUrl)
  r = requests.post(url, data=d)
  print(r.json())
  # 临时页面目录
  tempPath = './server/temp/' + templateID +'/'
  if (not os.path.exists(tempPath)):
    os.makedirs(tempPath)
    writeFile(tempPath + 'index.html', r.json()['html'])
    writeFile(tempPath + 'main.css', r.json()['style'])
    writeFile(tempPath + 'main.js', r.json()['script'])

def list(request):
  # 连接数据库
  connection = pymysql.connect(host='cdb-iphpadts.cd.tencentcdb.com', port=10035, user='ozzx', password='ozzx', db='ozzx', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
  # 使用 cursor() 方法创建一个游标对象 cursor
  cursor = connection.cursor()
  # 使用 execute()  方法执行 SQL 查询 
  cursor.execute("SELECT * FROM template")
  
  # 使用 fetchone() 方法获取单条数据.
  data = cursor.fetchall()
  
  print ("Database version : %s " % data)
  
  # 关闭数据库连接
  connection.close()
  response = HttpResponse(json.dumps(data))
  # 允许跨域
  response['Access-Control-Allow-Origin'] = '*' 
  response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS' 
  response['Access-Control-Max-Age'] = '1000' 
  response['Access-Control-Allow-Headers'] = '*'
  return response

def getTemplate(request, templateID):
  response = HttpResponse('{"err":1,msg:"模板不存在!"}')
  # 模板目录
  tempPath = './temp/' + templateID
  if (os.path.exists(tempPath)):
    # 打开并读取文件
    templateFile = open(tempPath, encoding='utf-8')
    # print(templateFile)
    template = templateFile.read()
    templateFile.close()
    response = HttpResponse(template)

  response['Access-Control-Allow-Origin'] = '*' 
  response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS' 
  response['Access-Control-Max-Age'] = '1000' 
  response['Access-Control-Allow-Headers'] = '*'
  return response

def creatTemplate(request):
  if (request.method == 'POST'):
    
    # 打开并读取文件
    templateFile = open('./server/template/copyright.page', encoding='utf-8')
    # print(templateFile)
    template = templateFile.read()
    templateFile.close()

    # 对文件进行处理
    controlList = json.loads(request.body)['data']['control']
    for control in controlList:
      # 模板替换
      template = template.replace('{{--' + control['name'] + '--}}', str(control['value']))
    
    
    # 计算MD5
    md5 = hashlib.md5()
    md5.update(template.encode('utf8'))

    
    # 判断模板文件是否已经存在
    tempPath = './server/temp/' + md5.hexdigest() + '.page'
    if (not os.path.exists(tempPath)):
      f = open(tempPath, 'w', encoding='utf-8')
      f.write(template)
      f.close()

    # 向页面生成服务请求生成页面
    savePage('http://127.0.0.1:8000/static/' + md5.hexdigest(), md5.hexdigest())

    response = HttpResponse('{"err":0,"templateID":"' + md5.hexdigest() + '"}',)
    
    # 允许跨域
    response['Access-Control-Allow-Origin'] = '*' 
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS' 
    response['Access-Control-Max-Age'] = '1000' 
    response['Access-Control-Allow-Headers'] = '*'
    return response
  else:
    response = HttpResponse('{"err":1,msg:"参数为空!"}')
    response['Access-Control-Allow-Origin'] = '*' 
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS' 
    response['Access-Control-Max-Age'] = '1000' 
    response['Access-Control-Allow-Headers'] = '*'
    return response