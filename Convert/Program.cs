using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading;

namespace Convert {
  class Program {

    static void Main(string[] args) {
      var cwd = Directory.GetCurrentDirectory();
      var texconv = Path.GetFullPath(Path.Combine(cwd, "scripts", "texconv.exe"));
      var input = Path.GetFullPath(Path.Combine(cwd, "..", "data"));
      var output = Path.GetFullPath(Path.Combine(cwd, "data"));

      Console.WriteLine(cwd);
      Console.WriteLine(texconv);
      Console.WriteLine(input);
      Console.WriteLine(output);

      var start = input.Length + 1;
      var allSubdirs = new List<string> { "ui" };

      var ddsToPng = true;

      if (ddsToPng) {
        foreach (var subdir in Directory.GetDirectories(output)) {
          Directory.Delete(subdir, true);
        }

        foreach (var subdir in allSubdirs) {
          foreach (var dds in Directory.GetFiles(Path.Combine(input, subdir), "*.dds", SearchOption.AllDirectories)) {
            var dest = Path.Combine(output, Path.GetDirectoryName(dds).Substring(start));
            if (!Directory.Exists(dest)) {
              Directory.CreateDirectory(dest);
            }
            var arguments = $"-r {dds} -o {dest} -ft png -y";
            Process.Start(texconv, arguments).WaitForExit();
          }
        }
      }

      Thread.Sleep(1000);

      foreach (var subdir in allSubdirs) {
        foreach (var png in Directory.GetFiles(Path.Combine(output, subdir), "*.PNG", SearchOption.AllDirectories)) {
          if (png.EndsWith(".PNG")) {
            var dest = png.Replace("_0.PNG", ".png");
            using (var fs = new FileStream(png, FileMode.Open)) {
              using (var bm = new Bitmap(Image.FromStream(fs))) {
                bm.Save(dest, ImageFormat.Png);
              }
            }
            File.Delete(png);
            Console.WriteLine(dest);
          }
        }
      }
    }
  }
}
