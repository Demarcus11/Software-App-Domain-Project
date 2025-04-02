import { BackButton } from "@/components/back-button";
import CreateAccountForm from "@/components/forms/create-account";

const CreateAccountPage = () => {
  return (
    <>
      <BackButton>Back</BackButton>

      <div className="grid gap-4">
        <h1 className="text-xl font-bold">Create Account</h1>

        <CreateAccountForm />
      </div>
    </>
  );
};

export default CreateAccountPage;
