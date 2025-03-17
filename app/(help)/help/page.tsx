"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const HelpPage = () => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Help Center</h1>

      {/* New Section: Email Approval Process */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Email Approval Process
        </h2>
        <p className="text-gray-600 mb-4">
          When registering for an account, an email is sent to the admin for
          approval. Once approved, you will receive an email with your login
          credentials.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-2 text-gray-700">
            How It Works
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Fill out the registration form with your details (e.g., name,
              email, role).
            </li>
            <li>
              After submitting the form, an email is sent to the admin for
              approval.
            </li>
            <li>
              The admin will review your request and either approve or deny it.
            </li>
            <li>
              If approved, you will receive an email with your login credentials
              (username and password).
            </li>
            <li>Use the provided credentials to log in to your account.</li>
          </ul>
        </div>
      </div>

      {/* Section: View Employees */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          View Employees
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>View Employees</strong> section allows you to see a list
          of all employees in your organization. You can filter, sort, and
          search for specific employees.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-2 text-gray-700">
            Example Instructions
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Navigate to the <strong>View Employees</strong> page from the
              sidebar.
            </li>
            <li>
              Use the search bar to find a specific employee by name or ID.
            </li>
            <li>Click on an employee's name to view their details.</li>
          </ul>
        </div>
      </div>

      {/* Section: Create Employees */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Create Employees
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>Create Employees</strong> section allows you to add new
          employees to your organization. Fill out the required fields to create
          a new employee profile.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-2 text-gray-700">
            Example Instructions
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Go to the <strong>Create Employees</strong> page from the sidebar.
            </li>
            <li>
              Fill in the employee's details, such as name, email, and role.
            </li>
            <li>
              Click <strong>Save</strong> to add the employee to the system.
            </li>
          </ul>
        </div>
      </div>

      {/* Section: Employee Expired Passwords Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Employee Expired Passwords Table
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>Employee Expired Passwords Table</strong> displays a list
          of employees whose passwords have expired. You can reset passwords or
          notify employees from this section.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-2 text-gray-700">
            Example Instructions
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Navigate to the <strong>Employee Expired Passwords Table</strong>{" "}
              page.
            </li>
            <li>Review the list of employees with expired passwords.</li>
            <li>
              Click <strong>Reset Password</strong> to generate a new password
              for an employee.
            </li>
          </ul>
        </div>
      </div>

      {/* Section: Chart of Accounts */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Chart of Accounts
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>Chart of Accounts</strong> section provides an overview of
          all accounts in your accounting system. You can view, edit, or delete
          accounts as needed.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-2 text-gray-700">
            Example Instructions
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Go to the <strong>Chart of Accounts</strong> page from the
              sidebar.
            </li>
            <li>Use the search bar to find a specific account.</li>
            <li>Click on an account to view or edit its details.</li>
          </ul>
        </div>
      </div>

      {/* Section: Creating an Account in the Chart of Accounts */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Creating an Account in the Chart of Accounts
        </h2>
        <p className="text-gray-600 mb-4">
          The <strong>Creating an Account</strong> section allows you to add new
          accounts to your Chart of Accounts. Specify the account type, name,
          and other details to create a new account.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-2 text-gray-700">
            Example Instructions
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Navigate to the <strong>Chart of Accounts</strong> page.
            </li>
            <li>
              Click the <strong>Create Account</strong> button.
            </li>
            <li>
              Fill in the required fields, such as account name, type, and
              description.
            </li>
            <li>
              Click <strong>Save</strong> to add the account to the Chart of
              Accounts.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
