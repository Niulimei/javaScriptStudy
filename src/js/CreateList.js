function CreateList() {
  this.oWrap = document.createElement('div');
  this.copyright = document.createElement('div');
  this.header = document.createElement('div');
  this.initialize.apply(this, arguments);
  //这里的第一个this，是指用new调用构造函数之后生成的对象，那么第二个this也当然应该是指同一个对象。那句话就是this调用
  // initialize方法来初始化，这样就和单词“initialize”的意思对上了。
  this.click.call(this);
}
//prototype属性使你有能力向对象添加属性和方法
CreateList.prototype = {
  initialize: function(aData) {
    // console.log('dd', aData[0]);输出的是“第一课”所有内容
    // oDl:<dl>
    // oElem:<dd>
    var oDl, oElem, project, i;
    while (aData[0]) {
      oDl = document.createElement('dl');
      project = aData[0].project;
      for (i = 0; i < project.length; i++) {
        if (project[i].href) {
          oElem = document.createElement('dd');
          oElem.innerHTML =
            i +
            ') <a href="' +
            project[i].href +
            '" target="_blank">' +
            project[i].text +
            '</a>';
        } else {
          oElem = document.createElement('dt');
          oElem.innerHTML = project[i].text + '(' + (project.length - 1) + ')';
        }
        oDl.appendChild(oElem);
        oDl.style.height = '31px';
      }
      this.oWrap.appendChild(oDl);
      // shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
      aData.shift();
    }
    this.header.id = 'header';
    this.header.innerHTML = 'JavaScript学习示例集锦';
    this.oWrap.id = 'wrap';
    this.copyright.id = 'copyright';
    this.copyright.innerHTML =
      '第一课至项目案例来自于&mdash;Ferris;后面内容由W3cplus的大漠 提供';
    document.body.appendChild(this.header);
    document.body.appendChild(this.oWrap);
    document.body.appendChild(this.copyright);
  },
  click: function() {
    var that = this;
    this.oWrap.onclick = function(event) {
      var oEv, oTarget, oParent, i;
      oEv = event || window.event;
      // target事件属性：target事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口；
      // srcElement事件属性：在IE下，event对象有srcElement属性，但是没有target属性；Firefox下，event对象有target书香，但是没有srcElement属性，他两个作用是相当的
      // 所以，oTarget = oEv.target || oEv.srcElement;为了解决两种浏览器使用（兼容）
      oTarget = oEv.target || oEv.srcElement;
      // parentElement获取对象层次中的父对象；parentNode获取文档中的父对象
      oParent = oTarget.parentElement || oTarget.parentNode;
      oParent.height = (function() {
        var iHeight = 0;
        for (i = 0; i < oParent.children.length; i++)
          //offsetHeight属性：此属性可以获取元素的高度，高度值包括：元素内容+内边距+边框。不包括外边距和滚动条部分。
          iHeight += oParent.children[i].offsetHeight;
        return iHeight;
      })();
      // tagName 获取元素的标签名
      // toLowerCase()方法；
      // 定义：toLowerCase() 方法用于把字符串转换为小写。
      // 语法：var str = "String";
      // str .toLowerCase();// string
      // toUpperCase()方法；
      // 定义：toUpperCase()方法用于把字符串转换为大写。
      // 语法：var str = "string";
      // str.toUpperCase()//STRING
      if (oTarget.tagName.toUpperCase() === 'DT') {
        //siblings返回被选元素的所有同级元素
        //同级元素是共享相同父元素的元素
        var aSiblings = that.siblings(oParent),
          count,
          i;
        for (count = i = 0; i < aSiblings.length; i++) {
          that.startMove(
            aSiblings[i],
            oTarget.offsetHeight,
            'buffer',
            // callback
            function() {
              this.children[0].className = '';
              if (++count == aSiblings.length) {
                if (oParent.offsetHeight == oTarget.offsetHeight) {
                  oTarget.className = 'current';
                  that.startMove(oParent, oParent.height, 'flex');
                } else {
                  that.startMove(
                    oParent,
                    oTarget.offsetHeight,
                    'buffer',
                    function() {
                      oTarget.className = '';
                    }
                  );
                }
              }
            }
          );
        }
      }
    };
  },
  startMove: function(obj, iTarget, type, callback) {
    // console.log('startMove-obj', obj); // 父级的HTML，这里输出的是“第几课”中的所有内容的<html>
    // console.log('startMove-iTarget', iTarget); //oParent.height:31
    // console.log('startMove-type', type); // buffer
    // console.log('startMove-callback', callback);
    var that = this;
    clearInterval(obj.timer);
    obj.iSpeed = 0;
    obj.timer = setInterval(function() {
      that[type].call(that, obj, iTarget, callback);
    }, 30);
  },
  buffer: function(obj, iTarget, callback) {
    // console.log('buffer-obj', obj);
    // console.log('buffer-iTarget', iTarget);
    // console.log('buffer-callback', callback);
    //js实现缓冲运动效果的方法：目标点减去元素的当前位置的值除以5，因为offsetHeight的值是一直在变大，所以速度的值也是一直的变小
    obj.iSpeed = (iTarget - obj.offsetHeight) / 5;
    //解决小数点问题，取整
    //缓冲运动速度必须取整，而且正负分别考虑
    //ceil() 方法可对一个数进行上舍入；floor()方法执行的是向下取整计算
    obj.iSpeed =
      obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
    obj.offsetHeight == iTarget
      ? (clearInterval(obj.timer), callback && callback.call(obj)) //到达终点时要做的事
      : (obj.style.height = obj.offsetHeight + obj.iSpeed + 'px'); //到达终点之前要做的事
  },
  flex: function(obj, iTarget, callback) {
    // console.log('flex-obj', obj); //选中元素的html标签
    // console.log('flex-iTarget', iTarget); //被选中的元素高度是多少
    // console.log('flex-callback', callback);
    obj.iSpeed += (iTarget - obj.offsetHeight) / 6;
    obj.iSpeed *= 0.75;
    // abs返回数的绝对值
    if (
      Math.abs(iTarget - obj.offsetHeight) <= 1 &&
      Math.abs(obj.iSpeed) <= 1
    ) {
      clearInterval(obj.timer);
      obj.style.height = iTarget + 'px';
      callback && callback.call(obj);
    } else {
      obj.style.height = obj.offsetHeight + obj.iSpeed + 'px';
    }
  },
  siblings: function(element) {
    console.log('siblings', element);
    console.log('siblings', element.parentElement);
    var aTmp = [],
      oParent = element.parentElement || element.parentNode,
      i;
    for (i = 0; i < oParent.children.length; i++)
      element != oParent.children[i] && aTmp.push(oParent.children[i]);
    return aTmp;
  }
};
