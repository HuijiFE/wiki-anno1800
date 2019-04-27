using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  class Program {
    static void Main(string[] args) {
      const string input = @"W:\huiji\anno\data";
      const string output = @"W:\huiji\anno\jsonify";

      Asset.Convert(Path.Combine(input, "config/export/main/asset"), Path.Combine(output, "data"));
      Localization.Convert(Path.Combine(input, "config/gui"), Path.Combine(output, "localization"));
    }
  }
}
