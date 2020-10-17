const gpNum = 20, 
di = 1, 
num = Math.pow(10, -5);

function Str(num) {
  return String(num.toFixed(1)).replace(/\.0/g, "");
}

function getLine(x1, y1, x2, y2, x) {
  var slope = (y1 - y2) / (x1 - x2);
  return slope * (x - x1) + y1;
}

function line(arr, x) {
  x = x - 0.5;
  var leng = arr.length, 
  hei = 40 / (leng - 1), 
  num = 0;
  if (leng === 0) 
    return;
  else if (leng === 1) 
    return arr[0];
  else {
    for (var i = 0; i < leng; i++) {
      if (i + 1 >= leng) {
        break;
      }
      if (x >= -20 + i * hei && x < -20 + (i + 1) * hei) {
        num = i;
        break;
      }
    }
    return getLine(-20 + num * hei, arr[num], -20 + (num + 1) * hei, arr[num + 1], x);
  }
}

function getMap() {
  var data = {};
  for (var x = 0; x <= 40; x += di) {
    data[Str(x)] = [];
    for (var y = 0; y <= 40; y += di) {
      data[Str(x)][Str(y)] = Infinity;
    }
  }
  return data;
}

function drawGraph(f1, f2) {
  let f = function(x, y) {
    return f1(x, y) - f2(x, y);
  };
  values = getMap();
  let result = [];
  for (let i = 0; i <= 40; i += di) {
    for (let j = 0; j <= 40; j += di) 
      values[Str(i)][Str(j)] = f(i - 20, j - 20);
  }
  for (let i = 40; i > 0; i -= 4) {
    let line = [];
    for (let j = 0; j < 40; j += 2) {
      let data = [true, false, false, false, false, false, false, false];
      for (let k = 0; k < 4; k++) 
        for (let l = 0; l < 2; l++) 
          if (!(values[Str(j + l)][Str(i - k)] < num && values[Str(j + l + di)][Str(i - k)] < num && values[Str(j + l)][Str(i - k - di)] < num && values[Str(j + l + di)][Str(i - k - di)] < num) 
          && !(values[Str(j + l)][Str(i - k)] > num && values[Str(j + l + di)][Str(i - k)] > num && values[Str(j + l)][Str(i - k - di)] > num && values[Str(j + l + di)][Str(i - k - di)] > num)
          && (!isNaN(values[Str(j + l)][Str(i - k)]) && !isNaN(values[Str(j + l + di)][Str(i - k)]) && !isNaN(values[Str(j + l)][Str(i - k - di)]) && !isNaN(values[Str(j + l + di)][Str(i - k - di)]))
          ) 
            data[l * 4 + k] = true;
      line.push(getBraille(data));
    }
    result.push(line.join(''));
  }
  return result.join('\n');
}

function getBraille(arr) { // by Nub
  const MAP = [0, 1, 2, 6, 3, 4, 5, 7];
  let result = 0;
  arr.forEach((e, i) => {
    if (e) {
      result += Math.pow(2, MAP[i]);
    }
  });
  return String.fromCharCode(result + 10240);
}

function deleteFirst(str, ident) {
  let array = str.split(ident);
  array.splice(0, 1);
  return array.join(ident);
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  let text = msg;
  let title = msg + '의 그래프\n';
  if (msg.indexOf('꺾은선') == 0) {
    text = 'y=line([' + deleteFirst(text, ' ').split(' ').join('') + '], x)';
    title = '꺾은선그래프\n';
  }
  if (text.indexOf('=') != -1 && text.match(/=/g).length == 1) {
    var f1 = function(x, y) {
      return eval(text.split('=')[0]);
    };
    var f2 = function(x, y) {
      return eval(text.split('=')[1]);
    };
    replier.reply(title + drawGraph(f1, f2));
  }
}
