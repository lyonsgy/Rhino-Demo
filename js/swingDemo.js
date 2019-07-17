importPackage(javax.swing) // 导入Swing GUI组件
importClass(javax.swing.border.EmptyBorder) // 该类提供了一个占用空间但不执行绘制的空透明边框。
importClass(java.awt.event.ActionListener) // 用于接收操作事件的侦听器接口
importClass(java.net.URL) // 丰富的URL构建方式，通过其来获取资源
importClass(java.io.FileOutputStream) // 用于往文件中写入字节流
importClass(java.lang.Thread) // 用于创建线程

// 创建一些 GUI 小部件（widget）
var frame = new JFrame("Rhino URL Fetcher") // 应用窗体
var urlField = new JTextField(30) // URL 输入框
var button = new JButton("Download") // 开始下载按钮
var filechooser = new JFileChooser() // 文件选择对话框
var row = Box.createHorizontalBox() // 用于放置字段和按钮的方框
var col = Box.createVerticalBox() // 用于放置数据行和进度条
var padding = new EmptyBorder(3, 3, 3, 3) // 填充数据行和空白（边框）

// 组装 GUI 部件
row.add(urlField) // 把输入框放入 row 中
row.add(button) // 把按钮放入 row 中
col.add(row) // 把 row 放入 col
frame.add(col) // 把 col 放入 frame 窗体内
row.setBorder(padding) // 给 row 增加 padding 边框
frame.pack() // 设置为最小值
frame.visible = true // 设置 frame 窗体可见


/**
 * 当窗体中发生任何事件都会调用这个函数
 * 本 demo 中我们只需要用到 windowClosing（窗体关闭）事件
 */

// 这种方式在新的Rhino1.7R4中由于某种原因不再起作用
// frame.addWindowListener(function (e, name) {
//   print(name)
//   if (name === "windowClosing") {
//     print("window closed")
//     java.lang.System.exit(0)
//   }
// })
var listener = new java.awt.event.WindowListener({
  // 用户关闭窗体
  windowClosing: function (event) {
    print("window closed")
    java.lang.System.exit(0) // 退出应用（关闭 java 虚拟机，参数非0为不正常关闭）
  }
})
frame.addWindowListener(listener)

/**
 * 当用户点击按钮时
 */
button.addActionListener(function () {
  try {
    // 创建 java.net.URL 表示源UR 
    // 检查用户输入的是否合法
    var url = new URL(urlField.text)
    // 告诉用户选择保存 URL 内容的文件
    var response = filechooser.showSaveDialog(frame)
    // 如果点击 cancel 按钮，立即退出
    if (response != JFileChooser.APPROVE_OPTION) {
      return
    }
    // 获取 java.io.File 表示目标文件
    var file = filechooser.getSelectedFile()
    // 启动一个新线程下载 URL
    var thread = new java.lang.Thread(function () {
      download(url, file)
    })
    thread.start()
  } catch (error) {
    // 错误则显示对话框
    print("*******" + error.message)
    JOptionPane.showMessageDialog(frame, error.message, "Exception", JOptionPane.ERROR_MESSAGE)
  }
})

/**
 * 1、使用 java.net.URL 等下载 URL 内容，使用 java.io.File等把内容保存到一个文件中
 * 2、在 JProgressBar 组件中显示下载进度
 * 这个方法将在一个新的线程中调用
 */
function download(url, file) {
  try {
    // 每次下载一个 URL 时，我们会添加一个新的数据行到 row 窗体中
    // 新的数据行包括URL、文件名和下载进度
    var row = Box.createHorizontalBox() // 创建数据行
    row.setBorder(padding)
    var label = url.toString() + ":" // label 用于显示 URL
    var labelBox = new JLabel(label)
    row.add(labelBox)
    var bar = new JProgressBar(0, 100) // 进度条
    bar.stringPainted = true // 显示文件名
    bar.string = file.toString()
    row.add(bar)
    col.add(row)
    frame.pack() // 重置窗体大小

    bar.indeterminate = true // 进度条是一个动画

    var conn = url.openConnection()
    conn.connect() // 建立 java.net.URLConnect 链接，用来获取 URL 文件大小
    var len = conn.contentLength
    if (len) {
      // 如果长度已知，则设置进度条
      bar.maximum = len
      bar.indeterminate = false
    }

    // 输入和输出流
    var input = conn.inputStream // 从服务器读取字节
    var output = new FileOutputStream(file) // 把字节写入文件

    // 创建 4kb 的数组作为输入缓冲区
    var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096)
    var num
    while ((num = input.read(buffer)) != -1) { //循环读取
      output.write(buffer, 0, num) // 把字节写入文件
      bar.value += num // 更新进度条
      // print("_____________" + num)
    }

    output.close() // 关闭流
    input.close()
  } catch (error) {
    print(">>>>>>>" + error.message)
    // 如果发生错误，在进度条上显示错误
    if (bar) {
      bar.indeterminate = false // 停止动画
      bar.string = error.toString() // 用错误取代文件名称
    }
  }
}

// test download url:
// http://simlove-wx-test.oss-cn-hangzhou.aliyuncs.com/weixiangmu/admin/2019/07/16/20190716165709En82FmTFFQdKhky.zip