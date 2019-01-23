import os
import sys
import json
import hashlib
import requests
import http.client
import pymysql.cursors
from django.http import HttpResponse

styleListDB = []
scriptListDB = []

def writeFile (path, data):
  f = open(path, 'w', encoding='utf-8')
  f.write(data)
  f.close()

def savePage (tempUrl, templateID, styleLsit, scriptList):
  url = 'http://127.0.0.1:3000/'
  d = '<!DOCTYPE html><html lang="zh-CN"><head><title>demo</title><meta charset="utf-8"><!-- *styles* --><link rel="stylesheet" href="./main.css"></head><body><temple name="templeName"></temple><script src="./main.js" type="text/javascript"></script><!-- *script* --></body></html>'
  # 替换掉模板路径
  d = d.replace('templeName', tempUrl)
  # 替换style
  styleString = ''
  for style in styleLsit:
    print(styleListDB)
    # 从style列表中取出此项的url
    for styleItem in styleListDB:
      print(styleItem)
      if (styleItem['name'] == style):
        styleString += '<link rel="stylesheet" href="' + styleItem['url'] + '">'
        break
  d = d.replace('<!-- *styles* -->', styleString)

  # 替换style
  scriptString = ''
  for script in scriptList:
    # 从style列表中取出此项的url
    for scriptItem in scriptListDB:
      if (scriptItem['name'] == script):
        scriptString += '<script type="text/javascript" src="' + scriptItem['url'] + '"></script>'
        break
  d = d.replace('<!-- *script* -->', scriptString)

  r = requests.post(url, data=d)
  # print(r.json())
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
  # 获取模板列表
  cursor.execute("SELECT * FROM template")
  templateList = cursor.fetchall()
  # 获取style列表
  cursor.execute("SELECT * FROM style")
  global styleListDB
  styleListDB = cursor.fetchall()
  # 获取script列表
  cursor.execute("SELECT * FROM script")
  global scriptListDB
  scriptListDB = cursor.fetchall()
  # print("Database version : %s " % data)
  
  # 关闭数据库连接
  connection.close()
  response = HttpResponse(json.dumps(templateList))
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
    resData = json.loads(request.body)['data']
    # 打开并读取文件
    templateFile = open('./server/template/' + resData['templateFile'], encoding='utf-8')
    # print(templateFile)
    template = templateFile.read()
    templateFile.close()

    
    if (resData['control']):
      # 对文件进行处理
      controlList = resData['control']
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
    savePage('http://127.0.0.1:8000/static/' + md5.hexdigest() + '.page', md5.hexdigest(), json.loads(resData['styleList']), json.loads(resData['scriptList']))

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