import { BackButton } from "@/components/back-button";
import ResetPasswordForm from "@/components/forms/reset-password";

const ResetPasswordPage = () => {
  return (
    <>
      <BackButton className="pl-[5rem] mb-0">Back</BackButton>
      <div className="max-w-[40rem] mx-auto px-[1rem]">
        <ResetPasswordForm />
      </div>
    </>
  );
};

export default ResetPasswordPage;
