type CardParams = {
  name: string;
  description: string;
  link: string;
};

export const BlogCard = ({ name, description, link }: CardParams) => {
  return (
    <div className="group rounded-2xl bg-gray-800/50 transition-all duration-200 hover:bg-gray-700/50">
      <a
        href={link}
        className="block p-6 sm:p-8"
        rel="prefetch"
      >
        <article>
          <h2 className="mb-3 text-2xl font-semibold text-pink-200 transition-colors duration-200 group-hover:text-pink-300">
            {name}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {description}
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-400">
            <span className="group-hover:text-pink-200 transition-colors duration-200">
              Read more
              <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </article>
      </a>
    </div>
  );
};
