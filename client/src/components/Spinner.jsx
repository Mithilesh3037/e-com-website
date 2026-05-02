const Spinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className={`${sizes[size]} border-4 border-dark-600 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="text-gray-400 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Spinner;
