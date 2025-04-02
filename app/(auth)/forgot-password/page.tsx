import ForgotPasswordForm from "@/components/forms/forgot-password";
import { BackButton } from "@/components/back-button";

const ForgotPasswordPage = () => {
  return (
    <>
      <BackButton>Back</BackButton>

      <div className="max-w-[40rem] mx-auto px-[1rem]">
        <ForgotPasswordForm />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
