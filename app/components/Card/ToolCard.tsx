import {CATEGORY} from "~/constants/name";

type CardParams = {
  icon: string;
  name: string;
  description: string;
  category: string;
  link: string;
};

const selectLabelColor = (category: string) => {
    const colorMap = {
        [CATEGORY.JAVASCRIPT_RUNTIME]: "text-teal-200",
        [CATEGORY.TEST_FRAMEWORK]: "text-purple-200",
        [CATEGORY.JAVASCRIPT_FRAMEWORK]: "text-red-200",
        [CATEGORY.TERMINAL_UTILITY]: "text-green-200",
        [CATEGORY.TERMINAL_THEME]: "text-orange-200",
        [CATEGORY.CSS_FRAMEWORK]: "text-blue-200",
        [CATEGORY.DEVELOPMENT_TOOL]: "text-pink-200",
        [CATEGORY.PRODUCTIVITY_TOOL]: "text-emerald-200",
    };
    return colorMap[category] || "text-gray-200";
};

export const ToolCard = ({ icon, name, description, category, link }: CardParams) => {
  return (
    <div className="group w-full rounded-2xl transition-all duration-200 hover:bg-gray-800/50">
      <a
        href={link}
        className="flex flex-col sm:flex-row p-6 gap-4 rounded-2xl border-2 border-transparent transition-all duration-200 hover:border-cyan-200/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center justify-center sm:justify-start">
          <img 
            className="h-12 w-12 rounded-xl transition-transform duration-200 group-hover:scale-110" 
            src={icon} 
            alt={name}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-pink-200 mb-1">{name}</h1>
          <h2 className="text-gray-200 break-words leading-relaxed">{description}</h2>
        </div>
        <div className="hidden sm:flex items-start">
          <h6
            className={`whitespace-nowrap text-sm font-medium px-3 py-1 rounded-full bg-gray-700/50 ${selectLabelColor(
              category,
            )}`}
          >
            {category}
          </h6>
        </div>
      </a>
    </div>
  );
};
