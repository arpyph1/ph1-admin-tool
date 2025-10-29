import { NextRequest, NextResponse } from 'next/server'

let previewCode = ''

export async function POST(request: NextRequest) {
  const { code } = await request.json()
  previewCode = code
  return NextResponse.json({ success: true })
}

export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    const { useState, useEffect } = React;
    ${previewCode.replace(/'use client'|"use client"/g, '').replace(/export default /g, '')}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(Page));
  </script>
</body>
</html>`
  
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
