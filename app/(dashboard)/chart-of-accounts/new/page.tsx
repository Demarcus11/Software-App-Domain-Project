import CreateAccountForm from "@/components/forms/create-account";

const CreateAccountPage = () => {
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-bold">Create Account</h1>

      <CreateAccountForm />
    </div>
  );
};

export default CreateAccountPage;
