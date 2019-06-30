const ws = new WebSocket("ws://" + window.location.host)
ws.onopen = function() {
  console.log('连接成功!')
  ws.send(JSON.stringify({
    type: "clent-init"
  }))
  ws.onmessage = function (ms) {
    const message = JSON.parse(ms.data)
    console.log(message)
    var type = message.type
    if (type === 'reload') {
      location.reload()
    }
  }
}

document.body.onclick = function (e) {
  // console.log(ws)
  // console.log(e.target)
  ws.send(JSON.stringify({
    type: "check",
    data: e.target.getAttribute('owo-id')
  }))
}