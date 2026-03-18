import {prisma} from './lib/prisma';


async function main() {
  await prisma.logEntry.create({
    data: {
      department: "IT",
      personWithProblem: "Bob",
      problem: "Internet problem",
      solution: "Rebooted router",
      solvedBy: "Alice",
      status: "SOLVED"
    }
  });

  console.log("Inserted ✅");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

