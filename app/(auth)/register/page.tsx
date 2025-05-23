import RegisterForm from "@/components/forms/register";
import { BackButton } from "@/components/back-button";

const RegisterPage = () => {
  return (
    <>
      <BackButton className="pl-[5rem] mb-0">Back</BackButton>
      <div className="max-w-[50rem] mx-auto px-[1rem]">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
