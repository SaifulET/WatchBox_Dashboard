import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/Routes'
import { RouterProvider } from 'react-router-dom'
import appLogo from './assets/image/modevin-wordmark.png'

const setFavicon = (href) => {
  const rels = ['icon', 'shortcut icon']
  rels.forEach((rel) => {
    let link = document.querySelector(`link[rel='${rel}']`)
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      document.head.appendChild(link)
    }
    link.type = 'image/png'
    link.href = href
  })
}

setFavicon(appLogo)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
