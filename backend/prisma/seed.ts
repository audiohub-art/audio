import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

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
  'audio',
  'podcast',
  'son',
  'enregistrement',
];

function generateRandomText(minWords: number, maxWords: number) {
  const numWords =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const result: string[] = []; // Le type est bien défini ici pour éviter l'erreur "never"

  for (let i = 0; i < numWords; i++) {
    result.push(sampleWords[Math.floor(Math.random() * sampleWords.length)]);
  }

  const text = result.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
// ---------------------------------------------------------------------

async function main() {
  // 1. Nettoyage dans le bon ordre (les posts d'abord car ils dépendent des audios et users)
  await prisma.posts.deleteMany();
  await prisma.audios.deleteMany();
  await prisma.users.deleteMany();

  // 2. Création des 10 utilisateurs
  const usersData = Array.from({ length: 10 }).map((_, index) => ({
    email: `utilisateur${index + 1}@example.com`,
    name: `Utilisateur ${index + 1}`,
    password: '123',
  }));

  await prisma.users.createMany({
    data: usersData,
  });

  const createdUsers = await prisma.users.findMany();

  // 3. Création des 100 posts + audios via la même procédure que votre AudioService
  console.log('Création des posts et audios en cours...');

  for (let i = 0; i < 100; i++) {
    const randomUser =
      createdUsers[Math.floor(Math.random() * createdUsers.length)];

    // Utilisation de la transaction pour mimer la logique de votre service
    await prisma.$transaction(async (tx) => {
      // a. On crée l'audio avec des fausses données cohérentes
      const newAudio = await tx.audios.create({
        data: {
          key: `fake-s3-key-${Date.now()}-${i}.mp3`, // Clé unique obligatoire
          mimeType: 'audio/mpeg',
          originalName: `maquette_audio_${i + 1}.mp3`,
          size: Math.floor(Math.random() * 5000000) + 1000000, // Taille aléatoire entre 1 et 6 Mo
          status: 'ATTACHED',
        },
      });

      // b. On crée le post lié à l'audio et à l'utilisateur
      await tx.posts.create({
        data: {
          title: `[${i + 1}] ` + generateRandomText(2, 8),
          description: generateRandomText(10, 40) + '.',
          status: 'DRAFT', // Comme dans votre service
          users: {
            connect: { id: randomUser.id },
          },
          audioFile: {
            connect: { id: newAudio.id },
          },
        },
      });
    });
  }

  console.log(
    '✅ Seed terminé avec succès : 10 utilisateurs, 100 audios et 100 posts liés créés.',
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
