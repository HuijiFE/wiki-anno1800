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

  interface IBaseAssetObject { }

  abstract class BaseAssetObject : IBaseAssetObject {
    public BaseAssetObject(IEnumerable<XElement> elements) {
      Adapter.Deserialize(this, elements);
    }
    public BaseAssetObject(XElement element) : this(element.Elements()) { }
  }

  static class Adapter {
    public static XElement? ElementByPath(this IEnumerable<XElement> elements, string path) {
      if (elements == null) {
        throw new ArgumentNullException("elements", "this 'elements' can't be null");
      }
      if (string.IsNullOrWhiteSpace(path)) {
        throw new ArgumentNullException("path", "'path' can't be null or empty or whitespace.");
      }
      var pathNodes = path.Split('/');
      var inter = elements.Where(el => el != null);
      XElement? element = null;
      foreach (var name in pathNodes) {
        element = inter?.Where(el => el.Name == name).FirstOrDefault();
        inter = element?.Elements();
        if (element == null) {
          break;
        }
      }
      return element;
    }
    public static XElement? ElementByPath(this XElement wrapper, string path) {
      return wrapper.Elements().ElementByPath(path);
    }

    public static string String(this IEnumerable<XElement> elements, string path, string? defaultValue = "") {
      return elements.ElementByPath(path)?.Value ?? defaultValue ?? "";
    }
    public static string String(this XElement wrapper, string path, string? defaultValue = "") {
      return wrapper.Elements().String(path, defaultValue);
    }

    public static int Int(this IEnumerable<XElement> elements, string path, int? defaultValue = 0) {
      var content = elements.String(path);
      if (!string.IsNullOrWhiteSpace(content)) {
        return int.Parse(content);
      }
      return defaultValue ?? 0;
    }
    public static int Int(this XElement wrapper, string path, int? defaultValue = 0) {
      return wrapper.Elements().Int(path, defaultValue);
    }

    public static double Double(this IEnumerable<XElement> elements, string path, double? defaultValue = 0.0) {
      var content = elements.String(path);
      if (!string.IsNullOrWhiteSpace(content)) {
        return double.Parse(content);
      }
      return defaultValue ?? 0.0;
    }
    public static double Double(this XElement wrapper, string path, double? defaultValue = 0.0) {
      return wrapper.Elements().Double(path, defaultValue);
    }

    public static bool Boolean(this IEnumerable<XElement> elements, string path, bool? defaultValue = false) {
      var content = elements.String(path);
      if (content == "1") {
        return true;
      }
      return defaultValue ?? false;
    }
    public static bool Boolean(this XElement wrapper, string path, bool? defaultValue = false) {
      return wrapper.Elements().Boolean(path, defaultValue);
    }

    /// <summary>
    /// Convert a number text to css hex color value.
    /// </summary>
    public static string Color(this IEnumerable<XElement> elements, string path, string? defaultValue = "ffffff") {
      var content = elements.String(path);
      if (!string.IsNullOrWhiteSpace(content)) {
        var value = int.Parse(content);
        return value.ToString("x8").Substring(2, 6);
      }
      return defaultValue ?? "ffffff";
    }
    /// <summary>
    /// Convert a number text to css hex color value.
    /// </summary>
    public static string Color(this XElement wrapper, string path, string? defaultValue = "ffffff") {
      return wrapper.Elements().Color(path, defaultValue);
    }

    public static object? Object(this IEnumerable<XElement> elements, string path, Type objType) {
      var element = elements.ElementByPath(path);
      if (element != null) {
        return Activator.CreateInstance(objType, element);
      }
      return null;
    }
    public static object? Object(this XElement wrapper, string path, Type objType) {
      return wrapper.Elements().Object(path, objType);
    }

    public static object? ObjectNonEmpty(this IEnumerable<XElement> elements, string path, Type objType) {
      var element = elements.ElementByPath(path);
      if (element != null && element.HasElements) {
        return Activator.CreateInstance(objType, element);
      }
      return null;
    }
    public static object? ObjectNonEmpty(this XElement wrapper, string path, Type objType) {
      return wrapper.Elements().ObjectNonEmpty(path, objType);
    }

    public static T? Object<T>(this IEnumerable<XElement> elements, string path) where T : BaseAssetObject {
      return (T?)elements.Object(path, typeof(T));
    }
    public static T? Object<T>(this XElement wrapper, string path) where T : BaseAssetObject {
      return wrapper.Elements().Object<T>(path);
    }

    public static T? ObjectNonEmpty<T>(this IEnumerable<XElement> elements, string path) where T : BaseAssetObject {
      return (T?)elements.ObjectNonEmpty(path, typeof(T));
    }
    public static T? ObjectNonEmpty<T>(this XElement wrapper, string path) where T : BaseAssetObject {
      return wrapper.Elements().ObjectNonEmpty<T>(path);
    }

    public static List<T> ListOf<T>(this IEnumerable<XElement> elements, string path, Func<XElement, T> selector) {
      return elements.ElementByPath(path)?.Elements().Select(selector).ToList() ?? new List<T>();
    }
    public static List<T> ListOf<T>(this XElement wrapper, string path, Func<XElement, T> selector) {
      return wrapper.Elements().ListOf(path, selector);
    }

    public static Dictionary<TKey, TElement> DictionaryOf<TKey, TElement>(this IEnumerable<XElement> elements, string path, Func<XElement, TKey> keySelector, Func<XElement, TElement> elementSelector) {
      return elements.ElementByPath(path)?.Elements().ToDictionary(keySelector, elementSelector) ?? new Dictionary<TKey, TElement>();
    }
    public static Dictionary<TKey, TElement> DictionaryOf<TKey, TElement>(this XElement wrapper, string path, Func<XElement, TKey> keySelector, Func<XElement, TElement> elementSelector) {
      return wrapper.Elements().DictionaryOf(path, keySelector, elementSelector);
    }

    readonly static Type TYPE_STRING = typeof(string);
    readonly static Type TYPE_INT = typeof(int);
    readonly static Type TYPE_DOUBLE = typeof(double);
    readonly static Type TYPE_BOOLEAN = typeof(bool);

    public static void Deserialize(object obj, IEnumerable<XElement> elements) {
      foreach (var field in obj.GetType().GetFields(BindingFlags.Instance | BindingFlags.Public)) {
        var elemAttr = field.GetCustomAttribute<ElementAttribute>();
        var path = elemAttr?.path;
        var isColor = field.GetCustomAttribute<ColorAttribute>() != null;
        var isNonEmpty = field.GetCustomAttribute<NonEmptyElementAttribute>() != null;
        var fieldType = Nullable.GetUnderlyingType(field.FieldType) != null
          ? field.FieldType.GetGenericArguments()[0]
          : field.FieldType;
        if (path != null) {
          if (fieldType == typeof(List<string>)) {
            var content = elements.String(path);
            field.SetValue(obj, string.IsNullOrWhiteSpace(content) ? new List<string>() : content.Split(';').ToList());
          } else if (fieldType == TYPE_STRING) {
            if (isColor) {
              field.SetValue(obj, elements.Color(path, elemAttr.defaultValue as string));
            } else {
              field.SetValue(obj, elements.String(path, elemAttr.defaultValue as string));
            }
          } else if (fieldType == TYPE_INT) {
            field.SetValue(obj, elements.Int(path, elemAttr.defaultValue as int?));
          } else if (fieldType == TYPE_DOUBLE) {
            field.SetValue(obj, elements.Double(path, elemAttr.defaultValue as double?));
          } else if (fieldType == TYPE_BOOLEAN) {
            field.SetValue(obj, elements.Boolean(path));
          } else if (fieldType.IsSubclassOf(typeof(BaseAssetObject))) {
            field.SetValue(obj, isNonEmpty ? elements.ObjectNonEmpty(path, fieldType) : elements.Object(path, fieldType));
          } else {
            throw new Exception($"unsupported type '{fieldType.FullName}' for deserializing");
          }
        }
      }
    }
    public static void Deserialize(object obj, XElement element) {
      Deserialize(obj, element.Elements());
    }
  }
}
