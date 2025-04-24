import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  // Seed Security Questions
  const securityQuestions = [
    { question: "What is your favorite color?" },
    { question: "What is your favorite food?" },
    { question: "What is your favorite animal?" },
    { question: "What is your favorite planet?" },
    { question: "What is your favorite school subject?" },
    { question: "What is your favorite sport?" },
    { question: "What is your favorite movie?" },
  ];

  for (const question of securityQuestions) {
    await prisma.securityQuestion.upsert({
      where: { question: question.question },
      update: {},
      create: question,
    });
  }

  console.log("Security questions seeded successfully");

  // Seed Error Messages
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

  for (const error of errorMessages) {
    await prisma.errorMessage.upsert({
      where: { errorCode: error.errorCode },
      update: {},
      create: error,
    });
  }

  console.log("Error messages seeded successfully");

  // Seed Admin User
  const adminEmail = "ksuappdomainmanager@gmail.com";
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        firstName: "Demo",
        lastName: "Admin",
        username: "demoAdmin",
        email: adminEmail,
        dateOfHire: new Date(),
        hiredById: null,
        role: "ADMIN",
        address: "123 Admin St",
        dateOfBirth: new Date("1990-01-01"),
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

    await prisma.passwordHistory.upsert({
      where: { id: admin.id },
      update: { oldPassword: admin.password },
      create: {
        userId: admin.id,
        oldPassword: admin.password,
      },
    });

    console.log("Admin seeded successfully");
  } else {
    console.log("Admin already exists");
  }

  // Seed Demo User
  const demoUserEmail = "demo@example.com";
  let demoUser = await prisma.user.findUnique({
    where: { email: demoUserEmail },
  });

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        firstName: "Demo",
        lastName: "User",
        username: "demoUser",
        email: demoUserEmail,
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

    await prisma.passwordHistory.upsert({
      where: { id: demoUser.id },
      update: { oldPassword: demoUser.password },
      create: {
        userId: demoUser.id,
        oldPassword: demoUser.password,
      },
    });

    console.log("Demo user seeded successfully");
  } else {
    console.log("Demo user already exists");
  }

  // Seed Demo Manager
  const demoManagerEmail = "manager@example.com";
  let demoManager = await prisma.user.findUnique({
    where: { email: demoManagerEmail },
  });

  if (!demoManager) {
    demoManager = await prisma.user.create({
      data: {
        firstName: "Demo",
        lastName: "Manager",
        username: "demoManager",
        email: demoManagerEmail,
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

    await prisma.passwordHistory.upsert({
      where: { id: demoManager.id },
      update: { oldPassword: demoManager.password },
      create: {
        userId: demoManager.id,
        oldPassword: demoManager.password,
      },
    });

    console.log("Demo manager seeded successfully");
  } else {
    console.log("Demo manager already exists");
  }

  // Seed Expired User
  const expiredUserEmail = "expired@example.com";
  let expiredUser = await prisma.user.findUnique({
    where: { email: expiredUserEmail },
  });

  if (!expiredUser) {
    expiredUser = await prisma.user.create({
      data: {
        firstName: "Expired",
        lastName: "User",
        username: "expiredUser",
        email: expiredUserEmail,
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

    await prisma.passwordHistory.upsert({
      where: { id: expiredUser.id },
      update: { oldPassword: expiredUser.password },
      create: {
        userId: expiredUser.id,
        oldPassword: expiredUser.password,
      },
    });

    console.log("Expired user seeded successfully");
  } else {
    console.log("Expired user already exists");
  }

  // Seed Categories
  const categoryNames = [
    "Current Asset",
    "Non-Current Asset",
    "Current Liability",
    "Non-Current Liability",
    "Owner's Equity",
    "Operating Revenue",
    "Operating Expense",
  ];

  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  const [
    currentAssetCategory,
    nonCurrentAssetCategory,
    currentLiabilityCategory,
    nonCurrentLiabilityCategory,
    ownersEquityCategory,
    operatingRevenueCategory,
    operatingExpenseCategory,
  ] = categories;

  console.log("Categories seeded successfully");

  // Seed Subcategories
  const subcategoryData = [
    { name: "Cash", categoryId: currentAssetCategory.id },
    { name: "Accounts Receivable", categoryId: currentAssetCategory.id },
    { name: "Supplies", categoryId: currentAssetCategory.id },
    { name: "Prepaid Rent", categoryId: currentAssetCategory.id },
    { name: "Prepaid Insurance", categoryId: currentAssetCategory.id },
    { name: "Property", categoryId: nonCurrentAssetCategory.id },
    { name: "Equipment", categoryId: nonCurrentAssetCategory.id },
    {
      name: "Accumulated Depreciation",
      categoryId: nonCurrentAssetCategory.id,
    },
    { name: "Accounts Payable", categoryId: currentLiabilityCategory.id },
    { name: "Unearned Revenue", categoryId: currentLiabilityCategory.id },
    { name: "Salaries Payable", categoryId: currentLiabilityCategory.id },
    { name: "Long-Term Debt", categoryId: nonCurrentLiabilityCategory.id },
    { name: "Owner's Capital", categoryId: ownersEquityCategory.id },
    { name: "Service Revenue", categoryId: operatingRevenueCategory.id },
    { name: "Sales Revenue", categoryId: operatingRevenueCategory.id },
    { name: "Utilities", categoryId: operatingExpenseCategory.id },
    { name: "Rent Expense", categoryId: operatingExpenseCategory.id },
    { name: "Salaries Expense", categoryId: operatingExpenseCategory.id },
    { name: "Supplies Expense", categoryId: operatingExpenseCategory.id },
  ];

  const subcategories = [];
  for (const data of subcategoryData) {
    const subcategory = await prisma.subcategory.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    subcategories.push(subcategory);
  }

  const [
    cashSubcategory,
    accountsReceivableSubcategory,
    propertySubcategory,
    equipmentSubcategory,
    accountsPayableSubcategory,
    longTermDebtSubcategory,
    ownersCapitalSubcategory,
    salesRevenueSubcategory,
    utilitiesSubcategory,
  ] = subcategories;

  console.log("Subcategories seeded successfully");

  // Seed Statements
  const statementNames = ["Asset", "Liability", "Equity", "Revenue", "Expense"];

  const statements = [];
  for (const name of statementNames) {
    const statement = await prisma.statement.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    statements.push(statement);
  }

  const [
    assetStatement,
    liabilityStatement,
    equityStatement,
    revenueStatement,
    expenseStatement,
  ] = statements;

  console.log("Statements seeded successfully");

  // Seed Orders
  const orderNames = [
    "01 - Cash",
    "02 - Accounts Receivable",
    "03 - Supplies",
    "04 - Office Equipment",
    "05 - Contributed Capital",
    "06 - Prepaid Rent",
    "07 - Prepaid Insurance",
    "08 - Unearned Revenue",
    "09 - Accounts Payable",
    "10 - Service Revenue",
    "11 - Salaries Expense",
    "12 - Utilities Expense",
    "13 - Supplies Expense",
    "14 - Salaries Payable",
    "15 - Rent Expense",
    "16 - Accumulated Dep.",
  ];

  const orders = [];
  for (const name of orderNames) {
    const order = await prisma.order.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    orders.push(order);
  }

  const [
    cashOrder,
    accountsReceivableOrder,
    accountsPayableOrder,
    ownersEquityOrder,
    salesRevenueOrder,
    rentExpensesOrder,
  ] = orders;

  console.log("Orders seeded successfully");
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
