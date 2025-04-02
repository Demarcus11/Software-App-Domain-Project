import { BackButton } from "@/components/back-button";
import CreateJournalEntryForm from "@/components/forms/create-journal-entry-form";

const CreateJournalEntryPage = () => {
  return (
    <>
      <BackButton>Back</BackButton>

      <div className="grid gap-4">
        <h1 className="text-xl font-bold">Create Journal Entry</h1>

        <CreateJournalEntryForm />
      </div>
    </>
  );
};

export default CreateJournalEntryPage;
