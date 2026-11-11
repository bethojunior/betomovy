$path = "D:\APLICATIVO MOVY\mobilidade-monitor-master\src\views\menu\index.php"
$content = Get-Content -Raw -Path $path
$routes = [System.Collections.Generic.HashSet[string]]::new()
foreach ($m in [regex]::Matches($content, 'Host::getLocal\(\)\s*\?>?\s*([a-zA-Z0-9_/\.\-]+)')) {
  [void]$routes.Add($m.Groups[1].Value.TrimEnd('/'))
}
foreach ($m in [regex]::Matches($content, 'href="/([a-zA-Z0-9_/\.\-]+)"')) {
  [void]$routes.Add($m.Groups[1].Value.TrimEnd('/'))
}
$routes | Sort-Object | ForEach-Object { $_ }
