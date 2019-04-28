using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Anno1800.Jsonify {
  class IO {
    public static void Save(string content, string path) {
      using (var sw = File.CreateText(path)) {
        sw.Write(content.Replace("\r", ""));
      }
    }
  }
}
