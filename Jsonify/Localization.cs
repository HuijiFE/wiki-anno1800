using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {
  class Localization {

    static void XmlToJson(string input, string output) {
      var xml = XDocument.Load(input);

      var dict = new Dictionary<string, string>();
      foreach (var text in xml.Root.Element("Texts").Elements()) {
        dict.Add(text.String("GUID") ?? "0", text.String("Text") ?? "");
      }
      var json = JsonConvert.SerializeObject(dict, Formatting.Indented);

      using (var sw = File.CreateText(output)) {
        sw.Write(json);
      }

      Console.WriteLine($"{input} => {output}");
    }

    /// <summary>
    /// Covert XML document for localization to JSON.
    /// </summary>
    /// <param name="input">The directory for loading xml files.</param>
    /// <param name="output">The directory for saving json files.</param>
    static public void Convert(string input, string output) {
      if (!Directory.Exists(output)) {
        Directory.CreateDirectory(output);
      }
      foreach (var file in Directory.EnumerateFiles(input, "texts_*.xml")) {
        Localization.XmlToJson(file, Path.Combine(output, $"{Path.GetFileNameWithoutExtension(file).Replace("texts_", "")}.json"));
      }
    }
  }
}
