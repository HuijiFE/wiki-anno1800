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

    static Dictionary<string, string> XmlToDict(string input) {
      var xml = XDocument.Load(input);

      var dict = new Dictionary<string, string>();
      foreach (var text in xml.Root.Element("Texts").Elements()) {
        dict.Add(text.String("GUID") ?? "0", text.String("Text") ?? "");
      }

      return dict;
    }

    /// <summary>
    /// Covert XML document for localization to JSON.
    /// </summary>
    /// <param name="input">The directory for loading xml files.</param>
    /// <param name="output">The directory for saving json files.</param>
    static public Dictionary<string, Dictionary<string, string>> Convert(string input, string output) {
      if (!Directory.Exists(output)) {
        Directory.CreateDirectory(output);
      }
      var map = new Dictionary<string, Dictionary<string, string>>();
      foreach (var source in Directory.EnumerateFiles(input, "texts_*.xml")) {
        var language = Path.GetFileNameWithoutExtension(source).Replace("texts_", "");
        var dict = Localization.XmlToDict(source);
        var dest = Path.Combine(output, $"{language}.json");
        IO.Save(JsonConvert.SerializeObject(dict, Formatting.Indented), dest);
        Console.WriteLine($"{source} => {dest}");
        map.Add(language, dict);
      }
      return map;
    }
  }
}
