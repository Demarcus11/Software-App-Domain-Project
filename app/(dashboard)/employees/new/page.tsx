import CreateEmployeeForm from "@/components/forms/create-employee";

const CreateNewUserEmployeePage = () => {
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-bold">Create Employee</h1>

      <CreateEmployeeForm />
    </div>
  );
};

export default CreateNewUserEmployeePage;
