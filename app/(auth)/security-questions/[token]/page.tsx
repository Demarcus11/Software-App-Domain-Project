import SecurityQuestionsForm from "@/components/forms/security-questions";
import BackButton from "@/components/back-button";

const SecurityQuestionsPage = () => {
  return (
    <>
      <BackButton
        className="pl-[5rem] mb-0"
        text="Back to forgot password"
        link="/forgot-password"
      />
      <div className="max-w-[40rem] mx-auto px-[1rem]">
        <SecurityQuestionsForm />
      </div>
    </>
  );
};

export default SecurityQuestionsPage;
