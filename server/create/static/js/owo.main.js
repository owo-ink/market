<<<<<<< HEAD
// Mon Jul 01 2019 22:43:54 GMT+0800 (GMT+08:00)
=======
// Tue Jul 02 2019 14:26:11 GMT+0800 (GMT+08:00)
>>>>>>> 50db891d33673544706a968e6549292c48bf48d6

"use strict";

/* 方法合集 */
var _owo = {
  /* 对象合并方法 */
  assign: function assign(a, b) {
    var newObj = {};

    for (var key in a) {
      newObj[key] = a[key];
    }

    for (var key in b) {
      newObj[key] = b[key];
    }

    return newObj;
  },

  /* 运行页面初始化方法 */
  runCreated: function runCreated(pageFunction, entryDom) {
    pageFunction.created.apply(_owo.assign(pageFunction, {
      $el: entryDom,
      data: pageFunction.data,
      activePage: window.owo.activePage
    }));
  },

  /* 注册事件监听 */
  registerEvent: function registerEvent(pageFunction, entryDom) {
    // 判断是否包含事件监听
    if (pageFunction.event) {
      if (!window.owo.state.event) window.owo.state.event = {};

      for (var iterator in pageFunction.event) {
        if (!window.owo.state.event[iterator]) window.owo.state.event[iterator] = [];
        window.owo.state.event[iterator].push({
          dom: entryDom,
          pageName: window.owo.activePage,
          fun: pageFunction.event[iterator],
          script: pageFunction
        });
      }
    }
  }
};

if (!document.getElementsByClassName) {
  /* 解决低版本浏览器没有getElementsByClassName的问题 */
  document.getElementsByClassName = function (className, element) {
    var children = (element || document).getElementsByTagName('*');
    var elements = new Array();

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var classNames = child.className.split(' ');

      for (var j = 0; j < classNames.length; j++) {
        if (classNames[j] == className) {
          elements.push(child);
          break;
        }
      }
    }

    return elements;
  };
}
/* 运行页面所属的方法 */


_owo.handlePage = function (pageName, entryDom) {
  _owo.handleEvent(entryDom, null, entryDom);
  /* 判断页面是否有自己的方法 */


  var newPageFunction = window.owo.script[pageName];
  if (!newPageFunction) return; // console.log(newPageFunction)
  // 如果有created方法则执行

  if (newPageFunction.created) {
    _owo.runCreated(newPageFunction, entryDom);
  } // 注册事件监听


  _owo.registerEvent(newPageFunction, entryDom); // 判断页面是否有下属模板,如果有运行所有模板的初始化方法


  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key];

    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = document.querySelectorAll('[template="' + key + '"]'); // 有时候在更改html时会将某些块进行删除

      if (domList.length == 0) {
        console.info('无法找到页面组件:' + key);
      } // console.log(domList.length)


      for (var ind = 0; ind < domList.length; ind++) {
        _owo.runCreated(templateScript, domList[ind]); // 注册事件监听


        _owo.registerEvent(templateScript, domList[ind]);
      }
    }
  }
};
/* owo事件处理 */


_owo.handleEvent = function (tempDom, templateName, entryDom) {
  // console.log(templateName)
  var activePage = window.owo.script[owo.activePage];

  if (tempDom.attributes) {
    for (var ind = 0; ind < tempDom.attributes.length; ind++) {
      var attribute = tempDom.attributes[ind]; // 判断是否为owo的事件
      // ie不支持startsWith

      if (attribute.name[0] == '@') {
        var eventName = attribute.name.slice(1);
        var eventFor = attribute.textContent;

        switch (eventName) {
          case 'show':
            {
              // 初步先简单处理吧
              var temp = eventFor.replace(/ /g, ''); // 取出条件

              var condition = temp.split("==");

              if (activePage.data[condition[0]] != condition[1]) {
                tempDom.style.display = 'none';
              }

              break;
            }

          default:
            {
              // 处理事件 使用bind防止闭包
              tempDom["on" + eventName] = function (event) {
                // 因为后面会对eventFor进行修改所以使用拷贝的
                var eventForCopy = this; // 判断页面是否有自己的方法

                var newPageFunction = window.owo.script[window.owo.activePage]; // console.log(this.attributes)

                if (templateName) {
                  // 如果模板注册到newPageFunction中，那么证明模板没有script那么直接使用eval执行
                  if (newPageFunction.template) {
                    newPageFunction = newPageFunction.template[templateName];
                  }
                } // 待优化可以单独提出来
                // 取出参数


                var parameterArr = [];
                var parameterList = eventForCopy.match(/[^\(\)]+(?=\))/g);

                if (parameterList && parameterList.length > 0) {
                  // 参数列表
                  parameterArr = parameterList[0].split(','); // 进一步处理参数

                  for (var i = 0; i < parameterArr.length; i++) {
                    var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, ""); // console.log(parameterValue)
                    // 判断参数是否为一个字符串

                    if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
                      parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
                    }

                    if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
                      parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
                    } // console.log(parameterArr[i])

                  }

                  eventForCopy = eventForCopy.replace('(' + parameterList + ')', '');
                } else {
                  // 解决 @click="xxx()"会造成的问题
                  eventForCopy = eventForCopy.replace('()', '');
                } // console.log(newPageFunction)
                // 如果有方法,则运行它


                if (newPageFunction[eventForCopy]) {
                  // 绑定window.owo对象
                  // console.log(tempDom)
                  // 待测试不知道这样合并会不会对其它地方造成影响
                  newPageFunction.$el = entryDom;
                  newPageFunction.$event = event;
                  newPageFunction[eventForCopy].apply(newPageFunction, parameterArr);
                } else {
                  // 如果没有此方法则交给浏览器引擎尝试运行
                  eval(eventForCopy);
                }
              }.bind(eventFor);
            }
        }
      }
    }
  }

  if (tempDom.children) {
    // 递归处理所有子Dom结点
    for (var i = 0; i < tempDom.children.length; i++) {
      var childrenDom = tempDom.children[i]; // console.log(childrenDom)

      var newTemplateName = templateName;

      if (tempDom.attributes['template'] && tempDom.attributes['template'].textContent) {
        newTemplateName = tempDom.attributes['template'].textContent;
      } // 待修复，逻辑太混乱了


      var _temp = tempDom.attributes['template'] ? tempDom : entryDom;

      if (newTemplateName === owo.entry) {
        _owo.handleEvent(childrenDom, null, _temp);
      } else {
        _owo.handleEvent(childrenDom, newTemplateName, _temp);
      }
    }
  } else {
    console.info('元素不存在子节点!');
    console.info(tempDom);
  }
}; // 页面资源加载完毕事件


_owo.ready = function () {
  var page = owo.entry;
  window.owo.activePage = page;
  var entryDom = document.getElementById('o-' + page);

  if (entryDom) {
    _owo.handlePage(page, entryDom);
  } else {
    console.error('找不到页面入口! 设置的入口为: ' + page);
  } // 设置状态为dom准备完毕


  window.owo.state.isRrady = true; // 判断是否有需要运行的其他方法

  if (window.owo.state.created != undefined) {
    window.owo.state.created.forEach(function (element) {
      // 运行对应的方法
      element();
    });
  }
};
/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */


_owo.whenReady = function () {
  //这个函数返回whenReady()函数
  var funcs = []; //当获得事件时，要运行的函数

  var ready = false; //当触发事件处理程序时,切换为true
  //当文档就绪时,调用事件处理程序

  function handler(e) {
    if (ready) return; //确保事件处理程序只完整运行一次
    //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好

    if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
      return;
    } //运行所有注册函数
    //注意每次都要计算funcs.length
    //以防这些函数的调用可能会导致注册更多的函数


    for (var i = 0; i < funcs.length; i++) {
      funcs[i].call(document);
    } //事件处理函数完整执行,切换ready状态, 并移除所有函数


    ready = true;
    funcs = null;
  } //为接收到的任何事件注册处理程序


  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false);
    document.addEventListener('readystatechange', handler, false); //IE9+

    window.addEventListener('load', handler, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', handler);
    window.attachEvent('onload', handler);
  } //返回whenReady()函数


  return function whenReady(fn) {
    if (ready) {
      fn.call(document);
    } else {
      funcs.push(fn);
    }
  };
}(); // 执行页面加载完毕方法


_owo.whenReady(_owo.ready);

function switchPage(oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam.split('&')[0];
  var newPage = newUrlParam.split('&')[0]; // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页

  if (oldPage === undefined) {
    oldPage = owo.entry;
  }

  var oldDom = document.getElementById('o-' + oldPage);

  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none';
  } // 查找页面跳转后的page


  var newDom = document.getElementById('o-' + newPage); // console.log(newDom)

  if (newDom) {
    // 隐藏掉旧的节点
    newDom.style.display = 'block';
  } else {
    console.error('页面不存在!');
    return;
  }

  window.owo.activePage = newPage;

  _owo.handlePage(newPage, newDom);
}