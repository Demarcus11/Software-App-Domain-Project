import CreateTransactionForm from "@/components/forms/create-transaction-form";

const CreateTransactionPage = () => {
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-bold">Create Transaction</h1>

      <CreateTransactionForm />
    </div>
  );
};

export default CreateTransactionPage;
