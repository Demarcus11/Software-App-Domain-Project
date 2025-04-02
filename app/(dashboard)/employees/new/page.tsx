import { BackButton } from "@/components/back-button";
import CreateEmployeeForm from "@/components/forms/create-employee";

const CreateNewUserEmployeePage = () => {
  return (
    <>
      <BackButton>Back</BackButton>
      <div className="grid gap-4">
        <h1 className="text-xl font-bold">Create Employee</h1>

        <CreateEmployeeForm />
      </div>
    </>
  );
};

export default CreateNewUserEmployeePage;
