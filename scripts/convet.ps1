$dirname = Split-Path $PSCommandPath -Parent
$texconv = [IO.Path]::Combine($dirname, "texconv.exe")
$workdir = [IO.Path]::GetFullPath([IO.Path]::Combine($dirname, ".."))
$input = [IO.Path]::GetFullPath([IO.Path]::Combine($workdir, "../data"))
$output = [IO.Path]::GetFullPath([IO.Path]::Combine($workdir, "data"))

# $PSCommandPath
# $texconv
# $dirname
# $workdir
# $input
# $output

if ([IO.Directory]::Exists($output)) {
  [IO.Directory]::Delete($output, $true)
  [IO.Directory]::CreateDirectory($output)
}
else {
  [IO.Directory]::CreateDirectory($output)
}

$start = $input.Length + 1

function ConvertDDSToPNG([string]$path) {
  $r = $path
  $o = [IO.Path]::Combine($output, (Split-Path $path -Parent).Substring($start))
  if (![IO.Directory]::Exists($o)) {
    [IO.Directory]::CreateDirectory($o)
  }
  & $texconv -r $r -o $o -ft png -y
}

foreach ($subdir in @("ui")) {
  Get-ChildItem -Path ([IO.Path]::Combine($input, $subdir)) -Include "*.dds" -Recurse -File | ForEach-Object {
    ConvertDDSToPNG($_.FullName)
  }
}
