interface SubmitButtonProps {
  title: string;
  loadingTitle?: string;
  isLoading?: boolean;
}

const SubmitButton = ({ title, loadingTitle, isLoading }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? loadingTitle : title}
    </button>
  );
};

export default SubmitButton;
