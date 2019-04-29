using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  class Program {
    static void Main(string[] args) {
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
      if (Directory.Exists(output)) {
        Directory.Delete(output, true);
        // sleep 2 seconds
        Thread.Sleep(2000);
        Directory.CreateDirectory(output);
      }

      Console.WriteLine($"input: {input}");
      Console.WriteLine($"output: {output}");

      var (assetsMap, dataDict) = Asset.Convert(Path.Combine(input, "config/export/main/asset"), Path.Combine(output, "data"));
      var localDictMap = Localization.Convert(Path.Combine(input, "config/gui"), Path.Combine(output, "localization"));
      Tracker.Track(assetsMap, dataDict, localDictMap["chinese"], output);
    }
  }
}
