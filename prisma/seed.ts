import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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
      firstName: "Demo",
      lastName: "Admin",
      username: "demoAdmin",
      email: "ksuappdomainmanager@gmail.com",
      dateOfHire: new Date(),
      hiredById: null,
      role: "ADMIN",
      address: "123 Admin St",
      dateOfBirth: new Date("1990-01-01"),
      isActive: true,
      password: bcrypt.hashSync("demoPassword123!", 10),
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
      password: bcrypt.hashSync("demoPassword123!", 10),
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
      password: bcrypt.hashSync("demoPassword123!", 10),
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
      userId: demoManager.id,
      oldPassword: demoManager.password,
    },
  });

  console.log("Demo manager seeded successfully");

  const expiredUser = await prisma.user.create({
    data: {
      firstName: "Expired",
      lastName: "User",
      username: "expiredUser",
      email: "expired@example.com",
      dateOfHire: new Date(),
      hiredById: admin.id,
      role: "USER",
      address: "789 Manager St",
      dateOfBirth: new Date("1985-01-01"),
      isActive: false,
      password: bcrypt.hashSync("demoPassword123!", 10),
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

  console.log("Expired user seeded successfully");

  const assetCategory = await prisma.category.create({
    data: {
      name: "Asset",
    },
  });

  const liabilitesCategory = await prisma.category.create({
    data: {
      name: "Liability",
    },
  });

  const equityCategory = await prisma.category.create({
    data: {
      name: "Equity",
    },
  });

  const revenueCategory = await prisma.category.create({
    data: {
      name: "Revenue",
    },
  });

  const expensesCategory = await prisma.category.create({
    data: {
      name: "Expenses",
    },
  });

  console.log("Categories seeded successfully");

  const currentAssetSubcategory = await prisma.subcategory.create({
    data: {
      name: "Current Asset",
      categoryId: assetCategory.id, // Links to Asset category
    },
  });

  const currentLiabilitiesSubcategory = await prisma.subcategory.create({
    data: {
      name: "Current Liabilities",
      categoryId: liabilitesCategory.id, // Links to Liabilities category
    },
  });

  const ownersEquitySubcategory = await prisma.subcategory.create({
    data: {
      name: "Owner's Equity",
      categoryId: equityCategory.id, // Links to Equity category
    },
  });

  const salesRevenueSubcategory = await prisma.subcategory.create({
    data: {
      name: "Sales Revenue",
      categoryId: revenueCategory.id, // Links to Revenue category
    },
  });

  const operatingExpensesSubcategory = await prisma.subcategory.create({
    data: {
      name: "Operating Expenses",
      categoryId: expensesCategory.id, // Links to Expenses category
    },
  });

  console.log("Subcategories seeded successfully");

  const balanceSheetStatement = await prisma.statement.create({
    data: {
      name: "Balance Sheet",
    },
  });

  const incomeStatement = await prisma.statement.create({
    data: {
      name: "Income Statement",
    },
  });

  console.log("Statements seeded successfully");

  const cashOrder = await prisma.order.create({
    data: {
      name: "01 - Cash",
    },
  });

  const accountsReceivableOrder = await prisma.order.create({
    data: {
      name: "02 - Accounts Receivable",
    },
  });

  const accountsPayableOrder = await prisma.order.create({
    data: {
      name: "03 - Accounts Payable",
    },
  });

  const ownersEquityOrder = await prisma.order.create({
    data: {
      name: "04 - Owner's Equity",
    },
  });

  const salesRevenueOrder = await prisma.order.create({
    data: {
      name: "05 - Sales Revenue",
    },
  });

  const rentExpensesOrder = await prisma.order.create({
    data: {
      name: "06 - Rent Expenses",
    },
  });

  console.log("Orders seeded successfully");

  const cashAccount = await prisma.account.create({
    data: {
      name: "Cash",
      number: "100",
      description: "Cash account for daily transactions",
      initialBalance: 500.0,
      userId: demoUser.id,
      orderId: cashOrder.id, // Links to "01 - Cash" order
      comment: "Main cash account",
      isActive: true,
      categoryId: assetCategory.id,
      subcategoryId: currentAssetSubcategory.id, // Links to Current Asset subcategory
      statementId: balanceSheetStatement.id,
      normalSide: "Debit",
      totalDebits: 500.0,
      totalCredits: 0.0,
      balance: 500.0,
    },
  });
  console.log("Demo cash account seeded successfully");

  await prisma.eventLog.create({
    data: {
      eventType: "CREATE",
      tableName: "Account",
      recordId: cashAccount.id,
      beforeState: Prisma.JsonNull, // No before state for creation
      afterState: cashAccount, // After state is the newly created account
      userId: demoUser.id,
    },
  });

  console.log("Event log for Cash Account created");

  const revenueAccount = await prisma.account.create({
    data: {
      name: "Sales Revenue",
      number: "400",
      description: "Revenue from services",
      initialBalance: 500.0,
      userId: demoUser.id,
      orderId: salesRevenueOrder.id, // Links to "05 - Sales Revenue" order
      comment: "Main revenue account",
      isActive: true,
      categoryId: revenueCategory.id,
      subcategoryId: salesRevenueSubcategory.id, // Links to Sales Revenue subcategory
      statementId: incomeStatement.id,
      normalSide: "Credit",
      totalDebits: 0.0,
      totalCredits: 500.0,
      balance: 500.0,
    },
  });

  console.log("Demo revenue account seeded successfully");

  await prisma.eventLog.create({
    data: {
      eventType: "CREATE",
      tableName: "Account",
      recordId: revenueAccount.id,
      beforeState: Prisma.JsonNull, // No before state for creation
      afterState: revenueAccount, // After state is the newly created account
      userId: demoUser.id,
    },
  });

  const debitAssetAccount = await prisma.transaction.create({
    data: {
      date: new Date(),
      description: "Service Revenue",
      amount: 500.0, // normal side for cash account is debit so 500 will be debited
      accountId: cashAccount.id,
      userId: demoUser.id,
      balance: 500.0,
    },
  });

  await prisma.eventLog.create({
    data: {
      eventType: "CREATE",
      tableName: "Transaction",
      recordId: debitAssetAccount.id,
      beforeState: Prisma.JsonNull, // No before state for creation
      afterState: debitAssetAccount, // After state is the newly created transaction
      userId: demoUser.id,
    },
  });

  const creditRevenueAccount = await prisma.transaction.create({
    data: {
      date: new Date(),
      description: "Service Revenue",
      amount: 500.0,
      accountId: revenueAccount.id, // normal side for revenue account is credit so 500 will be credited
      userId: demoUser.id,
      balance: 500.0,
    },
  });

  console.log("Transaction seeded successfully");

  await prisma.eventLog.create({
    data: {
      eventType: "CREATE",
      tableName: "Transaction",
      recordId: creditRevenueAccount.id,
      beforeState: Prisma.JsonNull, // No before state for creation
      afterState: creditRevenueAccount, // After state is the newly created transaction
      userId: demoUser.id,
    },
  });

  console.log("Event log for Transaction created");
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
