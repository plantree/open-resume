export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-screen-2xl px-8 py-8 lg:px-12">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://plantree.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            Plantree
          </a>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};