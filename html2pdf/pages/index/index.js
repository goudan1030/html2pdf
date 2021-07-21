// index.js
// 获取应用实例
const app = getApp()
var  YOUR_VALUE
var downloadUrl
var util = require('../../utils/html');

Page({
  data: {
    htmlurl:'请粘贴需要转换的链接',
    downloadUrl:null,
    swipers:[
      {url:'/static/images/home/banner1.jpg'},
      {url:'/static/images/home/banner2.jpg'}
    ]
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    })
    //分享给朋友
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  //粘贴剪贴板内容到输入框
  zhantieInput: function(e){
    var _this=this;
    wx.getClipboardData({
      success (res){
        YOUR_VALUE = res.data
        _this.setData({      
          htmlurl:YOUR_VALUE,
          result: res.data
        })
        console.log(res.data)
        console.log(YOUR_VALUE)
      }
   })

  },
//解析文档
jiexiBtn : function(e){
    wx.showToast({
    title: '加载中...',
    icon:'loading',
    duration: 20000, // 提示的延迟时间，默认1500
    mask:true,
  })
  wx.request({
    url: 'https://api.gugudata.com/imagerecognition/html2pdf',//API比如我调用了聚合头条api，这个是免费的
    method :"POST",
    data:{
      appkey:'47UHXZTWYEE8',
      type:'URL',
      content:YOUR_VALUE
    },
    header: {
    'content-type': 'application/x-www-form-urlencoded' ,// 默认值
    },
    success: (res) => {
      console.log('YOUR_VALUE',YOUR_VALUE);
      downloadUrl = res.data.Data
    console.log(res)
    console.log(res.data);
    console.log(res.data.Data);
    wx.showToast({
      title: "成功", // 提示的内容
      icon: "success", // 图标，默认success
      image: "", // 自定义图标的本地路径，image 的优先级高于 icon
      duration: 3000, // 提示的延迟时间，默认1500
      mask: false, // 是否显示透明蒙层，防止触摸穿透
      success: function () {
          console.log("接口调用成功的回调函数");
      },
      fail: function () {
          console.log("接口调用失败的回调函数");
      },
      complete: function () {
          console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
      }
  })
    },
    fail: (err) => {
    console.log(err)
    }
    })
},
// //下载文档
// DownBtm: function(e){
//   var url = downloadUrl;
//   //下载文件，生成临时地址
//   wx.downloadFile({
//     url: url, 
//     success(res) {
//       // console.log(res)
//       //保存到本地
//       wx.saveFile({
//         tempFilePath: res.tempFilePath,
//         success: function (res) {
//           const savedFilePath = res.savedFilePath;
//           // 打开文件
//           wx.openDocument({
//             filePath: 'savedFilePath',
//             success:function(res){
//               console.log('打开文档成功');
//             }
//           })
//         },
//         fail: function (err) {
//           console.log('保存失败：', err)
//         }
//       });
//     },
//     fail:function(err){
//       console.log('下载失败',err);
//     }
//   })
// },
//下载文件
DownBtm:function(e){
  wx.getSavedFileList({  // 获取文件列表
    success(res) {
      res.fileList.forEach((val, key) => { // 遍历文件列表里的数据
        // 删除存储的垃圾数据
        wx.removeSavedFile({
          filePath: val.filePath
        });
      })
    }
  })
  wx.setClipboardData({
    data:downloadUrl,
    success:function(res){
      console.log(res.data);
      wx.showToast({
        title: '复制成功！',
      })
    }
  })
  wx.downloadFile({
        url: downloadUrl,
        success: function (res) {
          const tempFilePath = res.tempFilePath;
          // 保存文件
          wx.saveFile({
            tempFilePath,
            success: function (res) {
              const savedFilePath = res.savedFilePath;
              // 打开文件
              wx.openDocument({
                showMenu:true,
                filePath: savedFilePath,
                fileType:'pdf',
                success: function (res) {
                  console.log('打开文档成功')
                },
              });
            },
            fail: function (err) {
              console.log('保存失败：', err)
            }
          });
        },
        fail: function (err) {
          console.log('下载失败：', err);
        },
      });
},

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onShow: function (res) {let that = this;
    wx.getClipboardData({success: function (res) {// 匹配地址
      YOUR_VALUE = res.data
      let result = util.handleUrl(res.data);// 如果地址相同则不在显示
      if(result == that.data.prase_address){return;
        }
        wx.showModal({title: '检测到链接，是否粘贴？',
        content: result,
        showCancel: true,//是否显示取消按钮
        cancelText: "取消",//默认是“取消”
        cancelColor: '#ff9900',//取消文字的颜色
        confirmText: "粘贴",//默认是“确定”
        confirmColor: '#ff9900',//确定文字的颜色
        success: function (res) {if (res.cancel) {

            } else {
              that.setData({
                htmlurl: result,
              })
            }
          },
        })
      },fail: function (res) { },complete: function (res) {
       },
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
