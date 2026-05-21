<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DUEL — Library full · print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Architects+Daughter&family=Caveat:wght@400;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    /* Print-friendly screen layout */
    body { background: #fff; }
    .page { max-width: 1640px; padding: 24px 24px 48px; }
    .var-grid.four { grid-template-columns: 1fr; gap: 36px; }
    .variation { page-break-inside: avoid; break-inside: avoid; }
    .frame { box-shadow: none; }
    .note { position: static !important; margin: 8px 0 0 !important; max-width: none !important; display: block; }
    .note.left, .note.right { text-align: left; margin-left: 0 !important; margin-right: 0 !important; }

    @page { size: A3 landscape; margin: 1cm; }

    @media print {
      html, body {
        background: #fff !important;
        background-image: none !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body { font-size: 14px; }
      .page { padding: 0; max-width: none; }
      .page-header { margin-bottom: 16px; padding-bottom: 8px; }
      .var-grid, .var-grid.four { grid-template-columns: 1fr 1fr; gap: 18px; }
      .variation { break-inside: avoid; page-break-inside: avoid; }
      .variation:nth-child(2n+1) { break-before: page; page-break-before: page; }
      .variation:first-child { break-before: auto; page-break-before: auto; }
      .frame { box-shadow: none; }
      .note { color: #1d4ed8 !important; font-size: 11px; }
      .tag.live::before, .pulse, .btn.live::before { animation: none !important; }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <script type="text/babel" src="primitives.jsx"></script>
  <script type="text/babel" src="page-library-full.jsx"></script>

  <script type="text/babel" data-presets="env,react">
    ReactDOM.createRoot(document.getElementById('root')).render(<PageLibraryFull />);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => window.print(), 600);
      });
    } else {
      setTimeout(() => window.print(), 1200);
    }
  </script>
</body>
</html>
