import React from 'react'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { MotionConfig } from 'motion/react'
import App from './App.jsx'

export function render(url) {
  return new Promise((resolve, reject) => {
    let renderError
    let markup = ''
    const output = new PassThrough()
    let renderer

    output.setEncoding('utf8')
    output.on('data', (chunk) => {
      markup += chunk
    })
    output.on('end', () => {
      if (renderError) reject(renderError)
      else resolve(markup)
    })
    output.on('error', reject)

    renderer = renderToPipeableStream(
      <StaticRouter location={url}>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </StaticRouter>,
      {
        onAllReady() {
          renderer.pipe(output)
        },
        onShellError: reject,
        onError(error) {
          renderError ??= error
        },
      },
    )
  })
}
