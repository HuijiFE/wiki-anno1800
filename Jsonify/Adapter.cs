using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {

  [AttributeUsage(AttributeTargets.Class)]
  class AdapterAttribute : Attribute { }

  [AttributeUsage(AttributeTargets.Field)]
  class ElementAttribute : Attribute {
    public string path;
    public object? defaultValue;
    public ElementAttribute(string path, object? defaultValue = null) {
      if (string.IsNullOrWhiteSpace(path)) {
        throw new ArgumentNullException("path", "argument 'path' can't be null or empty or whitespace");
      }
      this.path = path;
      this.defaultValue = defaultValue;
    }
  }

  [AttributeUsage(AttributeTargets.Field)]
  class ColorAttribute : Attribute { }

  [AttributeUsage(AttributeTargets.Field)]
  class NonEmptyElementAttribute : Attribute { }

  abstract class BaseAssetObject {
    public BaseAssetObject(XElement element) {
      Adapter.Deserialize(this, element);
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

    public static string String(this XElement wrapper, string path, string? defaultValue = "") {
      return wrapper.ElementByPath(path)?.Value ?? defaultValue ?? "";
    }

    public static int Int(this XElement wrapper, string path, int? defaultValue = 0) {
      var content = wrapper.String(path);
      if (!string.IsNullOrWhiteSpace(content)) {
        return int.Parse(content);
      }
      return defaultValue ?? 0;
    }

    public static double Double(this XElement wrapper, string path, double? defaultValue = 0.0) {
      var content = wrapper.String(path);
      if (!string.IsNullOrWhiteSpace(content)) {
        return double.Parse(content);
      }
      return defaultValue ?? 0.0;
    }

    public static bool Boolean(this XElement wrapper, string path, bool? defaultValue = false) {
      var content = wrapper.String(path);
      if (content == "1") {
        return true;
      }
      return defaultValue ?? false;
    }

    /// <summary>
    /// Convert a number text to css hex color value.
    /// </summary>
    public static string Color(this XElement wrapper, string path, string? defaultValue = "ffffff") {
      var content = wrapper.String(path);
      if (!string.IsNullOrWhiteSpace(content)) {
        var value = int.Parse(content);
        return value.ToString("x8").Substring(2, 6);
      }
      return defaultValue ?? "ffffff";
    }

    public static object? Object(this XElement wrapper, string path, Type objType) {
      var element = wrapper.ElementByPath(path);
      if (element != null) {
        return Activator.CreateInstance(objType, element);
      }
      return null;
    }

    public static object? ObjectNonEmpty(this XElement wrapper, string path, Type objType) {
      var element = wrapper.ElementByPath(path);
      if (element != null && element.HasElements) {
        return Activator.CreateInstance(objType, element);
      }
      return null;
    }

    public static T? Object<T>(this XElement wrapper, string path) where T : BaseAssetObject {
      return (T?)wrapper.Object(path, typeof(T));
    }

    public static T? ObjectNonEmpty<T>(this XElement wrapper, string path) where T : BaseAssetObject {
      return (T?)wrapper.ObjectNonEmpty(path, typeof(T));
    }

    readonly static Type TYPE_STRING = typeof(string);
    readonly static Type TYPE_INT = typeof(int);
    readonly static Type TYPE_DOUBLE = typeof(double);
    readonly static Type TYPE_BOOLEAN = typeof(bool);

    public static void Deserialize(object obj, XElement element) {
      foreach (var field in obj.GetType().GetFields(BindingFlags.Instance | BindingFlags.Public)) {
        var elemAttr = field.GetCustomAttribute<ElementAttribute>();
        var path = elemAttr?.path;
        var isColor = field.GetCustomAttribute<ColorAttribute>() != null;
        var isNonEmpty = field.GetCustomAttribute<NonEmptyElementAttribute>() != null;
        if (path != null) {
          if (field.FieldType == typeof(List<string>)) {
            var content = element.String(path);
            field.SetValue(obj, string.IsNullOrWhiteSpace(content) ? new List<string>() : content.Split(';').ToList());
          } else if (field.FieldType == TYPE_STRING) {
            if (isColor) {
              field.SetValue(obj, element.Color(path, elemAttr.defaultValue as string));
            } else {
              field.SetValue(obj, element.String(path, elemAttr.defaultValue as string));
            }
          } else if (field.FieldType == TYPE_INT) {
            field.SetValue(obj, element.Int(path, elemAttr.defaultValue as int?));
          } else if (field.FieldType == TYPE_DOUBLE) {
            field.SetValue(obj, element.Double(path, elemAttr.defaultValue as double?));
          } else if (field.FieldType == TYPE_BOOLEAN) {
            field.SetValue(obj, element.Boolean(path));
          } else if (field.FieldType.IsSubclassOf(typeof(BaseAssetObject))) {
            field.SetValue(obj, isNonEmpty ? element.ObjectNonEmpty(path, field.FieldType) : element.Object(path, field.FieldType));
          } else {
            throw new Exception($"unsupported type '{field.FieldType.FullName}' for deserializing");
          }
        }
      }
    }
  }
}
