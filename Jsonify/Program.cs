using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  class Program {
    static void Main(string[] args) {
      var currentDirectory = Directory.GetCurrentDirectory();
      string input = args[0];
      string output = args[1];

      if (String.IsNullOrWhiteSpace(input)) {
        throw new ArgumentNullException("args[0]", "Directory input can not be null or empty.");
      }
      if (String.IsNullOrWhiteSpace(output)) {
        throw new ArgumentNullException("args[1]", "Directory output can not be null or empty.");
      }

      input = Path.GetFullPath(input);
      output = Path.GetFullPath(output);

      if (!Directory.Exists(input)) {
        throw new DirectoryNotFoundException($"Directory input '${input}' no found.");
      }
      if (!Directory.Exists(output)) {
        Directory.CreateDirectory(output);
      }

      Console.WriteLine($"input: {input}");
      Console.WriteLine($"output: {output}");

      Asset.Convert(Path.Combine(input, "config/export/main/asset"), Path.Combine(output, "data"));
      Localization.Convert(Path.Combine(input, "config/gui"), Path.Combine(output, "localization"));
    }
  }
}
