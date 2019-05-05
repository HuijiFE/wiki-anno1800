using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {

  [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
  class NullableAttribute : Attribute { }

  class TypeScript {
    public static string GetTypeScriptTypeName(Type type) {
      if (type.IsGenericType) {
        var def = type.GetGenericTypeDefinition();
        if (def == typeof(List<>)) {
          return $"{TypeScript.GetTypeScriptTypeName(type.GetGenericArguments()[0])}[]";
        }
        if (def == typeof(Dictionary<,>)) {
          return $"Record<{TypeScript.GetTypeScriptTypeName(type.GetGenericArguments()[0])},{TypeScript.GetTypeScriptTypeName(type.GetGenericArguments()[1])}>";
        }
      }
      switch (type.Name) {
        case "String":
          return "string";
        case "Boolean":
          return "boolean";
        case "Int32":
        case "Double":
          return "number";
      }
      return type.Name;
    }

    class PropertyInfo {
      public string name;
      public bool optional;
      public string type;

      public PropertyInfo(FieldInfo info) {
        this.name = info.Name;
        this.optional = Nullable.GetUnderlyingType(info.FieldType) != null;
        this.type = TypeScript.GetTypeScriptTypeName(this.optional
          ? info.FieldType.GetGenericArguments()[0]
          : info.FieldType);
        if (info.GetCustomAttributes().Any(a => (a as NullableAttribute) != null)) {
          this.optional = true;
        }
      }

      public StringBuilder ToTypeDefinition() {
        var sb = new StringBuilder();

        sb.Append(this.name);
        if (this.optional) {
          sb.Append("?");
        }
        sb.Append(": ");
        sb.Append(this.type);
        sb.Append(';');

        return sb;
      }
    }

    class InterfaceInfo {
      public string? baseInterface;
      public string name;
      public List<PropertyInfo> properties;

      public InterfaceInfo(Type type) {
        this.name = type.Name;
        this.baseInterface = type.BaseType.Name == "Object" ? null : type.BaseType.Name;
        this.properties = type
          .GetFields(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public)
          .Select(f => new PropertyInfo(f))
          .ToList();
      }

      public StringBuilder ToTypeDefinition(bool export = false) {
        var sb = new StringBuilder();
        if (export) {
          sb.Append("export ");
        }
        sb.Append("interface ");
        sb.Append(this.name);
        if (this.baseInterface != null) {
          sb.Append(" extends ");
          sb.Append(this.baseInterface);
        }
        sb.AppendLine(" {");
        foreach (var prop in this.properties) {
          sb.Append("  ");
          sb.AppendLine(prop.ToTypeDefinition().ToString());
        }
        sb.AppendLine("}");

        return sb;
      }
    }

    public static string GetAll(params Type[] baseTypes) {
      var result = new List<string> { "/* eslint-disable */\n" };

      foreach (var type in baseTypes) {
        var types = new List<Type> { type };
        types = types.Concat(type.Assembly.GetTypes().Where(t => t.IsSubclassOf(type))).ToList();
        var interfaces = types.Select(t => new InterfaceInfo(t));
        result = result
          .Concat(interfaces.Select(i => i.ToTypeDefinition(true).ToString()))
          .ToList();
      }

      return String.Join("\n", result);
    }
  }
}
