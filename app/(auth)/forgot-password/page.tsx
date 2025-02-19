import ForgotPasswordForm from "@/components/forms/forgot-password";
import BackButton from "@/components/back-button";

const ForgotPasswordPage = () => {
  return (
    <>
      <BackButton
        className="pl-[5rem] mb-0"
        text="Back to login"
        link="/login"
      />
      <div className="max-w-[40rem] mx-auto px-[1rem]">
        <ForgotPasswordForm />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
