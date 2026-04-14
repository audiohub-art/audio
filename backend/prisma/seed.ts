import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// --- Fonction utilitaire pour générer du texte de longueur variable ---
const sampleWords = [
  'projet',
  'code',
  'dev',
  'prisma',
  'base',
  'données',
  'utilisateur',
  'post',
  'génial',
  'rapide',
  'efficace',
  'nouveau',
  'système',
  'web',
  'application',
  'test',
  'seed',
  'aléatoire',
  'fonction',
  'javascript',
  'typescript',
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
];

function generateRandomText(minWords: number, maxWords: number) {
  const numWords =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const result: string[] = []; // <-- LA CORRECTION EST ICI

  for (let i = 0; i < numWords; i++) {
    result.push(sampleWords[Math.floor(Math.random() * sampleWords.length)]);
  }

  const text = result.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
// ---------------------------------------------------------------------

async function main() {
  await prisma.posts.deleteMany();
  await prisma.users.deleteMany();

  const usersData = Array.from({ length: 10 }).map((_, index) => ({
    name: `Utilisateur ${index + 1}`,
    password: '123',
  }));

  await prisma.users.createMany({
    data: usersData,
  });

  const createdUsers = await prisma.users.findMany();

  const postsData = Array.from({ length: 100 }).map((_, index) => {
    const randomUser =
      createdUsers[Math.floor(Math.random() * createdUsers.length)];

    return {
      // Titre généré : entre 2 et 8 mots
      title: `[${index + 1}] ` + generateRandomText(2, 8),

      // Description générée : entre 10 et 40 mots
      description: generateRandomText(10, 40) + '.',

      usersId: randomUser.id,
    };
  });

  await prisma.posts.createMany({
    data: postsData,
  });

  console.log(
    '✅ Seed terminé avec succès : 10 utilisateurs et 100 posts (avec textes variables) créés.',
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
