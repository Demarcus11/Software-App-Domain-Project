import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const securityQuestions = [
    { question: "What is your favorite color?" },
    { question: "What is your favorite food?" },
    { question: "What is your favorite animal?" },
    { question: "What is your favorite planet?" },
    { question: "What is your favorite school subject?" },
    { question: "What is your favorite sport?" },
    { question: "What is your favorite movie?" },
  ];

  await prisma.securityQuestion.createMany({
    data: securityQuestions,
    skipDuplicates: true,
  });

  console.log("Security questions seeded successfully");

  const errorMessages = [
    {
      errorCode: "1",
      httpStatusCode: 404,
      message: "Security question with id {securityQuestionId} not found",
    },
    {
      errorCode: "2",
      httpStatusCode: 404,
      message: "Role with id {roleId} not found",
    },
    {
      errorCode: "3",
      httpStatusCode: 400,
      message: "Email is already in use. Please try another one",
    },
    {
      errorCode: "4",
      httpStatusCode: 500,
      message: "Server error, please try again later",
    },
    {
      errorCode: "5",
      httpStatusCode: 404,
      message: "Couldn't find your account",
    },
    {
      errorCode: "6",
      httpStatusCode: 403,
      message: "Your password has expired. Please reset your password",
    },
    {
      errorCode: "7",
      httpStatusCode: 403,
      message:
        "This account is not active. Please send a request to admin to activate your account",
    },
    {
      errorCode: "8",
      httpStatusCode: 403,
      message:
        "Invalid credentials, you have {remainingAttempts} remaining attempt(s)",
    },
    {
      errorCode: "9",
      httpStatusCode: 400,
      message: "Incorrect security question answer(s)",
    },
    {
      errorCode: "10",
      httpStatusCode: 400,
      message: "Invalid or expired password reset token",
    },
    {
      errorCode: "11",
      httpStatusCode: 400,
      message: "Cannot use previously used passwords",
    },
    {
      errorCode: "12",
      httpStatusCode: 400,
      message: "This account has already been approved",
    },
    {
      errorCode: "13",
      httpStatusCode: 404,
      message: "No pending access requests for this user",
    },
    {
      errorCode: "14",
      httpStatusCode: 403,
      message: "This account has already been rejected",
    },
    {
      errorCode: "15",
      httpStatusCode: 404,
      message: "No security questions found",
    },
    {
      errorCode: "16",
      httpStatusCode: 404,
      message: "No roles found",
    },
    {
      errorCode: "17",
      httpStatusCode: 400,
      message: "Duplicate security questions",
    },
  ];

  await prisma.errorMessage.createMany({
    data: errorMessages,
    skipDuplicates: true,
  });

  console.log("Error messages seeded successfully");

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "Demo",
      username: "demoAdmin",
      email: "ksuappdomainmanager@gmail.com",
      dateOfHire: new Date(),
      hiredById: null,
      role: "ADMIN",
      address: "123 Admin St",
      dateOfBirth: new Date("1990-01-01"),
      isActive: true,
      password: bcrypt.hashSync("demoPassword", 10),
      passwordExpiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      securityQuestions: {
        create: [
          {
            questionId: 1,
            answerHash: bcrypt.hashSync("blue", 10),
          },
          {
            questionId: 2,
            answerHash: bcrypt.hashSync("pizza", 10),
          },
          {
            questionId: 3,
            answerHash: bcrypt.hashSync("dog", 10),
          },
        ],
      },
    },
  });

  await prisma.passwordHistory.create({
    data: {
      userId: admin.id,
      oldPassword: admin.password,
    },
  });

  console.log("Admin seeded successfully");

  const demoUser = await prisma.user.create({
    data: {
      firstName: "Demo",
      lastName: "User",
      username: "demoUser",
      email: "demo@example.com",
      dateOfHire: new Date(),
      hiredById: admin.id,
      role: "USER",
      address: "456 Demo St",
      dateOfBirth: new Date("1995-01-01"),
      isActive: true,
      password: bcrypt.hashSync("demoPassword", 10),
      passwordExpiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      securityQuestions: {
        create: [
          {
            questionId: 1,
            answerHash: bcrypt.hashSync("blue", 10),
          },
          {
            questionId: 2,
            answerHash: bcrypt.hashSync("pizza", 10),
          },
          {
            questionId: 3,
            answerHash: bcrypt.hashSync("dog", 10),
          },
        ],
      },
    },
  });

  await prisma.passwordHistory.create({
    data: {
      userId: demoUser.id,
      oldPassword: demoUser.password,
    },
  });

  console.log("Demo user seeded successfully");

  const demoManager = await prisma.user.create({
    data: {
      firstName: "Demo",
      lastName: "Manager",
      username: "demoManager",
      email: "manager@example.com",
      dateOfHire: new Date(),
      hiredById: admin.id,
      role: "MANAGER",
      address: "789 Manager St",
      dateOfBirth: new Date("1985-01-01"),
      isActive: true,
      password: bcrypt.hashSync("demoPassword", 10),
      passwordExpiresAt: new Date(),
      securityQuestions: {
        create: [
          {
            questionId: 1,
            answerHash: bcrypt.hashSync("blue", 10),
          },
          {
            questionId: 2,
            answerHash: bcrypt.hashSync("pizza", 10),
          },
          {
            questionId: 3,
            answerHash: bcrypt.hashSync("dog", 10),
          },
        ],
      },
    },
  });

  await prisma.passwordHistory.create({
    data: {
      userId: demoManager.id,
      oldPassword: demoManager.password,
    },
  });

  console.log("Demo manager seeded successfully");
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
