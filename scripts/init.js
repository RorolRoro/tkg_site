const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Initialisation du projet Tokyo Ghoul RP...\n');

// Vérifier si .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Création du fichier .env.local...');
  const envExample = `# Discord OAuth2
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_$(Math.random().toString(36).substring(2, 15))

# Database
DATABASE_URL="file:./dev.db"`;

  fs.writeFileSync(envPath, envExample);
  console.log('✅ Fichier .env.local créé. Veuillez le configurer avec vos clés Discord.\n');
}

// Générer le client Prisma
console.log('🔧 Génération du client Prisma...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Client Prisma généré.\n');
} catch (error) {
  console.error('❌ Erreur lors de la génération du client Prisma:', error.message);
  process.exit(1);
}

// Pousser le schéma vers la base de données
console.log('🗄️ Initialisation de la base de données...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Base de données initialisée.\n');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
  process.exit(1);
}

console.log('🎉 Initialisation terminée !\n');
console.log('📋 Prochaines étapes :');
console.log('1. Configurez vos clés Discord dans .env.local');
console.log('2. Lancez le serveur de développement : npm run dev');
console.log('3. Ouvrez http://localhost:3000 dans votre navigateur\n');
console.log('📚 Consultez le README.md pour plus d\'informations.');

