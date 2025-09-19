export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          Copyright © 2025{" "}
          <a 
            href="https://plantree.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Plantree
          </a>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};