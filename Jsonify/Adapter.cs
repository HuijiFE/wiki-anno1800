using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  abstract class BaseAssetObject {
    public BaseAssetObject(XElement elem) {
    }
  }

  static class Adapter {
    public static XElement? ElementByPath(this XElement wrapper, string path) {
      var pathNodes = path.Split('/');
      XElement? elem = wrapper;
      foreach (var name in pathNodes) {
        if (elem == null) {
          break;
        }
        elem = elem.Element(name);
      }
      return elem;
    }

    public static string? String(this XElement wrapper, string path) {
      return wrapper.ElementByPath(path)?.Value;
    }

    public static int Int(this XElement wrapper, string path) {
      var content = wrapper.String(path);
      if (content != null) {
        return int.Parse(content);
      }
      return 0;
    }

    public static double Double(this XElement wrapper, string path) {
      var content = wrapper.String(path);
      if (content != null) {
        return double.Parse(content);
      }
      return 0.0;
    }

    public static bool Boolean(this XElement wrapper, string path) {
      var content = wrapper.String(path);
      if (content == "1") {
        return true;
      }
      return false;
    }

    public static T? Object<T>(this XElement wrapper, string path) where T : BaseAssetObject {
      var elem = wrapper.ElementByPath(path);
      if (elem != null) {
        return (T)Activator.CreateInstance(typeof(T), elem);
      }
      return null;
    }
  }
}
