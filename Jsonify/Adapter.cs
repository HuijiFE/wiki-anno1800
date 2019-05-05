using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {

  [AttributeUsage(AttributeTargets.Class)]
  class AdapterAttribute : Attribute { }

  abstract class BaseAssetObject {
    public BaseAssetObject(XElement element) {
    }
  }

  static class Adapter {
    public static XElement? ElementByPath(this XElement wrapper, string path) {
      var pathNodes = path.Split('/');
      XElement? element = wrapper;
      foreach (var name in pathNodes) {
        if (element == null) {
          break;
        }
        element = element.Element(name);
      }
      return element;
    }

    public static string? String(this XElement wrapper, string path) {
      return wrapper.ElementByPath(path)?.Value;
    }

    public static int Int(this XElement wrapper, string path, int defaultValue = 0) {
      var content = wrapper.String(path);
      if (content != null) {
        return int.Parse(content);
      }
      return defaultValue;
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

    /// <summary>
    /// Convert a number text to css hex color value.
    /// </summary>
    public static string Color(this XElement wrapper, string path) {
      var content = wrapper.String(path);
      if (content != null) {
        var value = int.Parse(content);
        return value.ToString("x8").Substring(2, 6);
      }
      return "ffffff";
    }

    public static T? Object<T>(this XElement wrapper, string path) where T : BaseAssetObject {
      var element = wrapper.ElementByPath(path);
      if (element != null) {
        return (T)Activator.CreateInstance(typeof(T), element);
      }
      return null;
    }
  }
}
