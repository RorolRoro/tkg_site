/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.discordapp.com', 'avatars.githubusercontent.com'],
  },
  // Configuration pour éviter les erreurs de build sur Netlify
  // Les routes dynamiques peuvent générer des warnings, mais ne doivent pas faire échouer le build
}

module.exports = nextConfig
