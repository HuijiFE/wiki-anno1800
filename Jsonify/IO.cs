using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  static class IO {
    public static void SaveXML(this XDocument doc, string path) {
      using (var r = XmlWriter.Create(path, new XmlWriterSettings {
        Indent = true,
        Encoding = new UTF8Encoding(false),
        NewLineChars = "\n"
      })) {
        doc.Save(r);
      }
    }

    public static void Save(string content, string path) {
      using (var sw = File.CreateText(path)) {
        sw.Write(content.Replace("\r", ""));
      }
    }
  }
}
