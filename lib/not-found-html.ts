export function notFoundHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Not found · Partovio</title>
<style>
body{margin:0;background:#f4f7fb;color:#172033;font-family:"Segoe UI",sans-serif}
main{max-width:40rem;margin:12vh auto;padding:0 20px}
a{color:#2563eb}
</style>
</head>
<body>
<main>
<h1>Not found</h1>
<p>This address is not a published page.</p>
<p><a href="/">Back to search</a></p>
</main>
</body>
</html>`;
}
