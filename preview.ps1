# Local preview server for this site - used by preview.bat when Python is not installed.
# Serves the folder this file is in at http://localhost:8000/ . Close the window to stop it.
param([int]$Port = 8000)

$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path.TrimEnd('\')
$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() }
catch {
  Write-Host ""
  Write-Host "Could not start the preview on port $Port."
  Write-Host "Is another preview window already open? Close it and run preview.bat again."
  Write-Host ("Details: " + $_.Exception.Message)
  exit 1
}

$types = @{
  '.html' = 'text/html; charset=utf-8'; '.htm' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8';  '.js'  = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.yml' = 'text/yaml; charset=utf-8'; '.yaml' = 'text/yaml; charset=utf-8'
  '.txt'  = 'text/plain; charset=utf-8'; '.md' = 'text/plain; charset=utf-8'; '.xml' = 'application/xml'
  '.jpg'  = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.png' = 'image/png'; '.gif' = 'image/gif'
  '.webp' = 'image/webp'; '.avif' = 'image/avif'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'
  '.woff' = 'font/woff'; '.woff2' = 'font/woff2'; '.pdf' = 'application/pdf'
}

Write-Host ""
Write-Host "Betul's site is running at $prefix"
Write-Host "Leave this window open while you look at the site. Close it to stop."
Write-Host ""
Start-Process $prefix

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $urlPath = $req.Url.AbsolutePath
    $rel = [Uri]::UnescapeDataString($urlPath).TrimStart('/').Replace('/', '\')
    $path = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $rel))
    if (-not ($path -eq $root -or $path.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase))) {
      $res.StatusCode = 403
    }
    elseif ((Test-Path -LiteralPath $path -PathType Container) -and -not $urlPath.EndsWith('/')) {
      $res.StatusCode = 301
      $res.RedirectLocation = $urlPath + '/' + $req.Url.Query
    }
    else {
      if (Test-Path -LiteralPath $path -PathType Container) { $path = Join-Path $path 'index.html' }
      if (Test-Path -LiteralPath $path -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($path).ToLower()
        if ($types.ContainsKey($ext)) { $res.ContentType = $types[$ext] } else { $res.ContentType = 'application/octet-stream' }
        $res.AddHeader('Cache-Control', 'no-store')
        $bytes = [IO.File]::ReadAllBytes($path)
        $res.ContentLength64 = $bytes.Length
        if ($req.HttpMethod -ne 'HEAD') { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      }
      else {
        $res.StatusCode = 404
        Write-Host ("Not found: " + $urlPath)
      }
    }
  }
  catch { try { $res.StatusCode = 500 } catch {} }
  finally { try { $res.Close() } catch {} }
}
