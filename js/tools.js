var tools = {};
var f = new java.io.File("../js/test")
var out = new java.io.FileWriter(f)

tools.testPlus = function (num1, num2) {
     return num1 + num2;
}
tools.test1 = function () {
     print(f instanceof java.io.File)
     print(out instanceof java.io.Reader)
     print(out instanceof java.io.Closeable)

     java.lang.System.getProperty("java.version")
     var isDigit = java.lang.Character.isDigit
     print(isDigit("2"))

     out.write("Hello World\n")
     out.close()
     var len = f.length()
     print(len)

     var stdout = java.lang.System.out
     print(stdout)
     print(f.name)
     print(f.directory)
}

tools.test2 = function () {
     importClass(java.lang.System)
     for (var m in System) {
          print(m)
     }
     print("\n=======================\n")
     for (m in f) {
          print(m)
     }
}

tools.testArray = function () {
     var words = java.lang.reflect.Array.newInstance(java.lang.String, 10)
     print(words)

     var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 128)
     for (var i = 0; i < bytes.length; i++) {
          bytes[i] = i;
     }
     print(bytes)
}

tools.testTry = function () {
     try {
          java.lang.System.getProperty(null)
     } catch (e) {
          print(e.javaException) // java.lang.NullPointerException: key can't be null
     }
}

tools.testType = function () {
     var version1 = java.lang.System.getProperty("java.version")
     var version2 = String(java.lang.System.getProperty("java.version"))
     print(typeof (version1)) //object
     print(typeof (version2)) //string
}