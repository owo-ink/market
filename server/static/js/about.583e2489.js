(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{"02f4":function(t,e,a){var i=a("4588"),n=a("be13");t.exports=function(t){return function(e,a){var r,s,o=String(n(e)),c=i(a),l=o.length;return c<0||c>=l?t?"":void 0:(r=o.charCodeAt(c),r<55296||r>56319||c+1===l||(s=o.charCodeAt(c+1))<56320||s>57343?t?o.charAt(c):r:t?o.slice(c,c+2):s-56320+(r-55296<<10)+65536)}}},"0390":function(t,e,a){"use strict";var i=a("02f4")(!0);t.exports=function(t,e,a){return e+(a?i(t,e).length:1)}},1071:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"edit-box"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"text-input",attrs:{type:"text",placeholder:"请输入模板名称!"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.templateFile,expression:"templateFile"}],staticClass:"text-input",attrs:{type:"text",placeholder:"请输入文件名称!"},domProps:{value:t.templateFile},on:{input:function(e){e.target.composing||(t.templateFile=e.target.value)}}}),a("select",{directives:[{name:"model",rawName:"v-model",value:t.browser,expression:"browser"}],on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.browser=e.target.multiple?a:a[0]}}},[a("option",{attrs:{value:"兼容各种浏览器"}},[t._v("兼容各种浏览器")]),a("option",{attrs:{value:"兼容现代浏览器"}},[t._v("兼容现代浏览器")])]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.type,expression:"type"}],on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.type=e.target.multiple?a:a[0]}}},t._l(t.info.type,function(e){return a("option",{domProps:{value:e.value}},[t._v(t._s(e.name))])}),0),a("div",{staticClass:"check-box"},[t._l(t.info.style,function(e,i){return a("div",{staticClass:"check-item"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.checkStyle,expression:"checkStyle"}],attrs:{type:"checkbox",id:"style"+i},domProps:{value:e.name,checked:Array.isArray(t.checkStyle)?t._i(t.checkStyle,e.name)>-1:t.checkStyle},on:{change:function(a){var i=t.checkStyle,n=a.target,r=!!n.checked;if(Array.isArray(i)){var s=e.name,o=t._i(i,s);n.checked?o<0&&(t.checkStyle=i.concat([s])):o>-1&&(t.checkStyle=i.slice(0,o).concat(i.slice(o+1)))}else t.checkStyle=r}}}),a("label",{staticClass:"text",attrs:{for:"style"+i}},[t._v(t._s(e.name))])])}),a("div",{staticClass:"clear"})],2),a("div",{staticClass:"check-box"},[t._l(t.info.script,function(e,i){return a("div",{staticClass:"check-item"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.checkScript,expression:"checkScript"}],attrs:{type:"checkbox",id:"script"+i},domProps:{value:e.name,checked:Array.isArray(t.checkScript)?t._i(t.checkScript,e.name)>-1:t.checkScript},on:{change:function(a){var i=t.checkScript,n=a.target,r=!!n.checked;if(Array.isArray(i)){var s=e.name,o=t._i(i,s);n.checked?o<0&&(t.checkScript=i.concat([s])):o>-1&&(t.checkScript=i.slice(0,o).concat(i.slice(o+1)))}else t.checkScript=r}}}),a("label",{staticClass:"text",attrs:{for:"script"+i}},[t._v(t._s(e.name))])])}),a("div",{staticClass:"clear"})],2),a("div",{staticClass:"edit"},[a("div",{staticClass:"left"},[a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],domProps:{value:t.value},on:{input:function(e){e.target.composing||(t.value=e.target.value)}}}),a("WaterRipple",{staticClass:"send",attrs:{text:"发布"},on:{onClick:t.send}})],1),a("editTag",{model:{value:t.control,callback:function(e){t.control=e},expression:"control"}})],1)])},n=[],r=(a("7f7f"),a("bc3a")),s=a.n(r),o=a("79fa"),c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"edit-tag-box"},[t._l(t.value,function(e,i){return e?a("div",{staticClass:"tag-item"},[a("div",{staticClass:"label"},[t._v(t._s(e.label))]),a("div",{staticClass:"edit icon",on:{click:function(a){return t.showEditTagBox(e,i)}}},[t._v("")]),a("div",{staticClass:"delete icon",on:{click:function(a){return t.deleteTag(e,i)}}},[t._v("")])]):t._e()}),a("WaterRipple",{staticClass:"creat",attrs:{text:"添加标签"},on:{onClick:function(e){t.showAddTagBox=!0}}}),a("div",{directives:[{name:"show",rawName:"v-show",value:t.showAddTagBox||null!==t.editTagID,expression:"showAddTagBox || editTagID !== null"}],staticClass:"add-tag-box"},[a("div",{staticClass:"close icon",on:{click:function(e){t.showAddTagBox=!1,t.editTagID=null}}},[t._v("")]),a("div",{staticClass:"add-box"},[a("div",{staticClass:"title-bar"},[t._v(t._s(t.showAddTagBox?"添加标签":"修改标签"))]),a("AutoEntry",{attrs:{name:"标签字段",type:String},model:{value:t.addTag.name,callback:function(e){t.$set(t.addTag,"name",e)},expression:"addTag.name"}}),a("SelectEntry",{attrs:{text:"标签类型",option:t.typeSelectList,def:"string"},model:{value:t.addTag.type,callback:function(e){t.$set(t.addTag,"type",e)},expression:"addTag.type"}}),a("SelectEntry",{attrs:{text:"标签模式",option:t.modelSelectList,def:"template"},model:{value:t.addTag.model,callback:function(e){t.$set(t.addTag,"model",e)},expression:"addTag.model"}}),a("AutoEntry",{attrs:{name:"标签名称",type:String},model:{value:t.addTag.label,callback:function(e){t.$set(t.addTag,"label",e)},expression:"addTag.label"}}),a("TextareaEntry",{attrs:{name:"标签数值"},model:{value:t.addTag.value,callback:function(e){t.$set(t.addTag,"value",e)},expression:"addTag.value"}}),t.showAddTagBox?a("WaterRipple",{staticClass:"add-tag",attrs:{text:"确定添加"},on:{onClick:t.addNewTag}}):a("WaterRipple",{staticClass:"add-tag",attrs:{text:"确定修改"},on:{onClick:t.editTag}})],1)])],2)},l=[],u=a("7618"),d=(a("a481"),a("5119")),v=a("1b9c"),p=a("efaa"),g={props:{value:Array},data:function(){return{editTagID:null,showAddTagBox:!1,typeSelectList:[{value:"string",text:"字符串"},{value:"array",text:"数组"},{value:"color",text:"颜色"},{value:"object",text:"对象"},{value:"number",text:"数字"}],modelSelectList:[{value:"template",text:"模板插值"},{value:"prop",text:"prop传值"}],addTag:{name:"",type:"string",label:"",value:"",model:"template"}}},components:{AutoEntry:d["a"],SelectEntry:v["a"],TextareaEntry:p["a"],WaterRipple:o["a"]},created:function(){},methods:{deleteTag:function(t,e){var a=this,i=window.confirm('确认删除 "'.concat(t.label,'" 这个标签吗!'));if(i){var n=JSON.parse(JSON.stringify(this.value));n.splice(e,1),s.a.post("https://owo.ink/changeControl",{id:this.$route.params.id,data:n}).then(function(t){0===t.data.err&&a.$emit("input",n)})}},editTag:function(){var t=this,e=JSON.parse(JSON.stringify(this.value));e[this.editTagID]=this.addTag,"array"!==this.addTag.type&&"object"!==this.addTag.type||(e[this.editTagID].value=e[this.editTagID].value.replace(/\r/g,""),e[this.editTagID].value=e[this.editTagID].value.replace(/\n/g,""),e[this.editTagID].value=e[this.editTagID].value.replace(/ /g,""),e[this.editTagID].value=e[this.editTagID].value.replace(/},]/g,"}]"),e[this.editTagID].value=e[this.editTagID].value.replace(/},}/g,"}}"),e[this.editTagID].value=e[this.editTagID].value.replace(/],]/g,"]]"),e[this.editTagID].value=JSON.parse(e[this.editTagID].value)),this.$emit("input",e),s.a.post("https://owo.ink/changeControl",{id:this.$route.params.id,data:e}).then(function(e){0===e.data.err&&(t.editTagID=null,alert("修改成功!"))})},showEditTagBox:function(t,e){var a=Object(u["a"])(t.value);"object"!==a&&"array"!==a||(t.value=JSON.stringify(t.value)),this.addTag=t,this.editTagID=e},addNewTag:function(){var t=this,e=JSON.parse(JSON.stringify(this.value));e||(e=[]);var a=JSON.parse(JSON.stringify(this.addTag));"array"===a.type||"object"===a.type?(a.value=a.value.replace(/\r/g,""),a.value=a.value.replace(/\n/g,""),a.value=a.value.replace(/ /g,""),a.value=a.value.replace(/},]/g,"}]"),a.value=a.value.replace(/],]/g,"]]"),a.value=a.value.replace(/},}/g,"}}"),a.value=JSON.parse(a.value)):"number"===a.type&&(a.value=parseInt(a.value)),e.push(a),s.a.post("https://owo.ink/changeControl",{id:this.$route.params.id,data:e}).then(function(a){0===a.data.err&&(t.addTag={name:"",type:"string",label:"",value:"",model:"template"},t.$emit("input",e),alert("添加成功!"),t.showAddTagBox=!1)})}}},f=g,m=(a("e47a"),a("2877")),h=Object(m["a"])(f,c,l,!1,null,"622f89a8",null),y=h.exports,x={name:"edit",data:function(){return{info:{},name:"",templateFile:"",browser:"兼容各种浏览器",type:"header",value:"",control:[],checkStyle:[],checkScript:[]}},components:{editTag:y,WaterRipple:o["a"]},beforeCreate:function(){var t=this;"new"===this.$route.params.id?s.a.get("https://owo.ink/getInfo").then(function(e){t.info=e.data.data}):s.a.get("https://owo.ink/getInfo?id=".concat(this.$route.params.id)).then(function(e){var a=e.data;t.info=a.data,a.templateInfo&&(t.name=a.templateInfo.name,t.checkStyle=JSON.parse(a.templateInfo.styleList),t.checkScript=JSON.parse(a.templateInfo.scriptList),t.templateFile=a.templateInfo.templateFile,t.value=a.fileData,t.type=a.templateInfo.type,t.control=JSON.parse(a.templateInfo.control))})},methods:{send:function(){var t={id:this.$route.params.id,name:this.name,templateFile:this.templateFile,styleList:this.checkStyle.length>0?'["'.concat(this.checkStyle.join('","'),'"]'):"[]",scriptList:this.checkScript.length>0?'["'.concat(this.checkScript.join('","'),'"]'):"[]",browser:this.browser,control:"[]",type:this.type,value:this.value};"new"===this.$route.params.id?s.a.post("https://owo.ink/saveTemplateFile",t).then(function(t){0===t.data.err&&window.history.back(-1)}):s.a.post("https://owo.ink/updataTemplateFile",t).then(function(t){0===t.data.err&&window.history.back(-1)})}}},b=x,k=(a("82bd"),Object(m["a"])(b,i,n,!1,null,"e58b3f6e",null));e["default"]=k.exports},"214f":function(t,e,a){"use strict";a("b0c5");var i=a("2aba"),n=a("32e9"),r=a("79e5"),s=a("be13"),o=a("2b4c"),c=a("520a"),l=o("species"),u=!r(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),d=function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var a="ab".split(t);return 2===a.length&&"a"===a[0]&&"b"===a[1]}();t.exports=function(t,e,a){var v=o(t),p=!r(function(){var e={};return e[v]=function(){return 7},7!=""[t](e)}),g=p?!r(function(){var e=!1,a=/a/;return a.exec=function(){return e=!0,null},"split"===t&&(a.constructor={},a.constructor[l]=function(){return a}),a[v](""),!e}):void 0;if(!p||!g||"replace"===t&&!u||"split"===t&&!d){var f=/./[v],m=a(s,v,""[t],function(t,e,a,i,n){return e.exec===c?p&&!n?{done:!0,value:f.call(e,a,i)}:{done:!0,value:t.call(a,e,i)}:{done:!1}}),h=m[0],y=m[1];i(String.prototype,t,h),n(RegExp.prototype,v,2==e?function(t,e){return y.call(t,this,e)}:function(t){return y.call(t,this)})}}},"314c":function(t,e,a){"use strict";var i=a("bdd8"),n=a.n(i);n.a},3846:function(t,e,a){a("9e1e")&&"g"!=/./g.flags&&a("86cc").f(RegExp.prototype,"flags",{configurable:!0,get:a("0bfb")})},"4ddd":function(t,e,a){},"520a":function(t,e,a){"use strict";var i=a("0bfb"),n=RegExp.prototype.exec,r=String.prototype.replace,s=n,o="lastIndex",c=function(){var t=/a/,e=/b*/g;return n.call(t,"a"),n.call(e,"a"),0!==t[o]||0!==e[o]}(),l=void 0!==/()??/.exec("")[1],u=c||l;u&&(s=function(t){var e,a,s,u,d=this;return l&&(a=new RegExp("^"+d.source+"$(?!\\s)",i.call(d))),c&&(e=d[o]),s=n.call(d,t),c&&s&&(d[o]=d.global?s.index+s[0].length:e),l&&s&&s.length>1&&r.call(s[0],a,function(){for(u=1;u<arguments.length-2;u++)void 0===arguments[u]&&(s[u]=void 0)}),s}),t.exports=s},"5f1b":function(t,e,a){"use strict";var i=a("23c6"),n=RegExp.prototype.exec;t.exports=function(t,e){var a=t.exec;if("function"===typeof a){var r=a.call(t,e);if("object"!==typeof r)throw new TypeError("RegExp exec method returned something other than an Object or null");return r}if("RegExp"!==i(t))throw new TypeError("RegExp#exec called on incompatible receiver");return n.call(t,e)}},"6b54":function(t,e,a){"use strict";a("3846");var i=a("cb7c"),n=a("0bfb"),r=a("9e1e"),s="toString",o=/./[s],c=function(t){a("2aba")(RegExp.prototype,s,t,!0)};a("79e5")(function(){return"/a/b"!=o.call({source:"a",flags:"b"})})?c(function(){var t=i(this);return"/".concat(t.source,"/","flags"in t?t.flags:!r&&t instanceof RegExp?n.call(t):void 0)}):o.name!=s&&c(function(){return o.call(this)})},"82bd":function(t,e,a){"use strict";var i=a("c4eb"),n=a.n(i);n.a},a481:function(t,e,a){"use strict";var i=a("cb7c"),n=a("4bf8"),r=a("9def"),s=a("4588"),o=a("0390"),c=a("5f1b"),l=Math.max,u=Math.min,d=Math.floor,v=/\$([$&`']|\d\d?|<[^>]*>)/g,p=/\$([$&`']|\d\d?)/g,g=function(t){return void 0===t?t:String(t)};a("214f")("replace",2,function(t,e,a,f){return[function(i,n){var r=t(this),s=void 0==i?void 0:i[e];return void 0!==s?s.call(i,r,n):a.call(String(r),i,n)},function(t,e){var n=f(a,t,this,e);if(n.done)return n.value;var d=i(t),v=String(this),p="function"===typeof e;p||(e=String(e));var h=d.global;if(h){var y=d.unicode;d.lastIndex=0}var x=[];while(1){var b=c(d,v);if(null===b)break;if(x.push(b),!h)break;var k=String(b[0]);""===k&&(d.lastIndex=o(v,r(d.lastIndex),y))}for(var w="",S=0,T=0;T<x.length;T++){b=x[T];for(var C=String(b[0]),_=l(u(s(b.index),v.length),0),$=[],I=1;I<b.length;I++)$.push(g(b[I]));var D=b.groups;if(p){var E=[C].concat($,_,v);void 0!==D&&E.push(D);var N=String(e.apply(void 0,E))}else N=m(C,v,_,$,D,e);_>=S&&(w+=v.slice(S,_)+N,S=_+C.length)}return w+v.slice(S)}];function m(t,e,i,r,s,o){var c=i+t.length,l=r.length,u=p;return void 0!==s&&(s=n(s),u=v),a.call(o,u,function(a,n){var o;switch(n.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,i);case"'":return e.slice(c);case"<":o=s[n.slice(1,-1)];break;default:var u=+n;if(0===u)return a;if(u>l){var v=d(u/10);return 0===v?a:v<=l?void 0===r[v-1]?n.charAt(1):r[v-1]+n.charAt(1):a}o=r[u-1]}return void 0===o?"":o})}})},b0c5:function(t,e,a){"use strict";var i=a("520a");a("5ca1")({target:"RegExp",proto:!0,forced:i!==/./.exec},{exec:i})},bdd8:function(t,e,a){},c4eb:function(t,e,a){},d879:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"create-box"},[a("iframe",{attrs:{src:"http://127.0.0.1:8004/create/"}}),a("div",{staticClass:"tool"},[a("div",{staticClass:"add",on:{click:t.addDiv}},[t._v("DIV")]),a("div",{staticClass:"add",on:{click:t.addText}},[t._v("H1")]),a("div",{staticClass:"add",on:{click:t.addOWO}},[t._v("OWO")])]),t._m(0),t.active&&t.active.style?a("div",{staticClass:"control"},[t._l(t.active.style,function(e,i){return["width"===i?a("AutoEntry",{attrs:{name:"宽度",type:String},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"height"===i?a("AutoEntry",{attrs:{name:"高度",type:String},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"font-size"===i?a("AutoEntry",{attrs:{name:"字体大小",type:String},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"background-color"===i?a("ColorEntry",{attrs:{name:"背景颜色"},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"background-image"===i?a("AutoEntry",{attrs:{name:"背景图片",type:String},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"background-size"===i?a("AutoEntry",{attrs:{name:"图片大小",type:String},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"background-repeat"===i?a("SelectEntry",{attrs:{text:"背景平铺方式",option:t.repeatOption,def:"string"},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"text-align"===i?a("SelectEntry",{attrs:{text:"对齐方式",option:t.textAlignOption,def:"string"},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):"position"===i?a("SelectEntry",{attrs:{text:"定位方式",option:t.positionOption,def:"string"},on:{input:function(e){return t.create()}},model:{value:t.active.style[i],callback:function(e){t.$set(t.active.style,i,e)},expression:"active.style[key]"}}):t._e()]}),t.active.style.position&&"absolute"===t.active.style.position||"fixed"===t.active.style.position?a("div",{staticClass:"position-box box-show"},[a("div",{staticClass:"title"},[t._v("坐标位置")]),a("div",{staticClass:"box"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style.top,expression:"active.style.top"}],staticClass:"top",attrs:{type:"text"},domProps:{value:t.active.style.top},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"top",e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style.right,expression:"active.style.right"}],staticClass:"right",attrs:{type:"text"},domProps:{value:t.active.style.right},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"right",e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style.bottom,expression:"active.style.bottom"}],staticClass:"bottom",attrs:{type:"text"},domProps:{value:t.active.style.bottom},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"bottom",e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style.left,expression:"active.style.left"}],staticClass:"left",attrs:{type:"text"},domProps:{value:t.active.style.left},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"left",e.target.value)}}})])]):t._e(),a("div",{staticClass:"margin-box box-show"},[a("div",{staticClass:"title"},[t._v("外边距")]),a("div",{staticClass:"box"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style["margin-top"],expression:"active.style['margin-top']"}],staticClass:"top",attrs:{type:"text"},domProps:{value:t.active.style["margin-top"]},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"margin-top",e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style["margin-right"],expression:"active.style['margin-right']"}],staticClass:"right",attrs:{type:"text"},domProps:{value:t.active.style["margin-right"]},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"margin-right",e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style["margin-bottom"],expression:"active.style['margin-bottom']"}],staticClass:"bottom",attrs:{type:"text"},domProps:{value:t.active.style["margin-bottom"]},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"margin-bottom",e.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:t.active.style["margin-left"],expression:"active.style['margin-left']"}],staticClass:"left",attrs:{type:"text"},domProps:{value:t.active.style["margin-left"]},on:{blur:function(e){return t.create()},input:function(e){e.target.composing||t.$set(t.active.style,"margin-left",e.target.value)}}})])]),t.active.text?a("TextareaEntry",{attrs:{name:"文本"},on:{blur:function(e){return t.create()}},model:{value:t.active.text,callback:function(e){t.$set(t.active,"text",e)},expression:"active.text"}}):t._e()],2):t._e()])},n=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dom-check"},[a("div",{staticClass:"item"},[t._v("html")]),a("div",{staticClass:"item"},[t._v("body")])])}],r=(a("ac6a"),a("c5f6"),a("6b54"),a("5119")),s=a("ea69"),o=a("1b9c"),c=a("efaa"),l={name:"create",components:{AutoEntry:r["a"],ColorEntry:s["a"],SelectEntry:o["a"],TextareaEntry:c["a"]},data:function(){return{ws:null,domData:{type:"div",id:"root",style:{"font-size":"14px",height:"100%",width:"100%","background-image":"unset","background-size":"unset","background-repeat":"unset"},text:"",children:[]},bodyStyle:{},active:{},textAlignOption:[{value:"left",text:"居左"},{value:"center",text:"居中"},{value:"right",text:"居右"}],positionOption:[{value:"static",text:"无定位"},{value:"absolute",text:"绝对定位(父元素)"},{value:"fixed",text:"绝对定位(浏览器窗口)"},{value:"relative",text:"相对定位"}],repeatOption:[{value:"unset",text:"默认值"},{value:"repeat",text:"垂直方向和水平方向重复"},{value:"repeat-x",text:"水平方向重复"},{value:"repeat-y",text:"垂直方向重复"},{value:"no-repeat",text:"不重复"}]}},created:function(){var t=this;this.active=this.domData,this.ws=new WebSocket("ws://127.0.0.1:8004"),this.ws.onopen=function(){t.ws.send(JSON.stringify({type:"init"})),t.ws.onmessage=function(e){var a=JSON.parse(e.data);"check"===a.type&&t.activeID(t.domData,a.data),console.log("收到消息: ",a)}}},methods:{GenNonDuplicateID:function(t){return Number(Math.random().toString().substr(3,t)+Date.now()).toString(36)},addDiv:function(){this.active.children.push({type:"div",text:"",style:{"font-size":"14px",height:"200px",width:"100%","background-color":"#ffffff",position:"static",top:"unset",right:"unset",bottom:"unset",left:"unset","margin-top":"unset","margin-right":"unset","margin-bottom":"unset","margin-left":"unset","background-image":"unset","background-size":"unset","background-repeat":"unset"},id:this.GenNonDuplicateID(8),children:[]}),this.ws.send(JSON.stringify({type:"create",data:this.domData}))},addText:function(){this.active.children.push({type:"h1",text:"asdasdasd",style:{"font-size":"14px","text-align":"left",position:"unset",top:"unset",right:"unset",bottom:"unset",left:"unset","margin-top":"unset","margin-right":"unset","margin-bottom":"unset","margin-left":"unset","background-image":"unset"},id:this.GenNonDuplicateID(8),children:[]}),this.create()},addOWO:function(){var t=prompt("请输入owo代码","");t&&(this.active.children.push({type:"owo",value:t,id:this.GenNonDuplicateID(8),children:[]}),this.create())},create:function(){this.ws.send(JSON.stringify({type:"create",data:this.domData}))},activeID:function(t,e){var a=this;console.log("查找ID：".concat(e)),t.id===e?(console.log("符合",t),this.active=t):t.children&&t.children.forEach(function(t){a.activeID(t,e)})}}},u=l,d=(a("314c"),a("2877")),v=Object(d["a"])(u,i,n,!1,null,"d38f0ad0",null);e["default"]=v.exports},e47a:function(t,e,a){"use strict";var i=a("4ddd"),n=a.n(i);n.a}}]);
//# sourceMappingURL=about.583e2489.js.map