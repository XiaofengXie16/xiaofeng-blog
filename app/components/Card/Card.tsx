import { CATEGORY } from "~/constants/name";

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
    [CATEGORY.TEST_FRAMEWORK]: "text-yellow-200",
    [CATEGORY.JAVASCRIPT_FRAMEWORK]: "text-red-200",
    [CATEGORY.TERMINAL_UTILITY]: "text-green-200",
    [CATEGORY.TERMINAL_THEME]: "text-orange-200",
    [CATEGORY.CSS_FRAMEWORK]: "text-blue-200",
    [CATEGORY.DEVELOPMENT_TOOL]: "text-red-400",
  };
  return colorMap[category];
};
const Card = ({ icon, name, description, category, link }: CardParams) => {
  return (
    <div className={"flex w-full flex-col gap-1 rounded-2xl hover:bg-gray-600"}>
      <a
        href={link}
        className={
          "flex p-5 rounded gap-1 border-2 border-transparent hover:border-cyan-200"
        }
        rel="prefetch"
      >
        <div className={"h-100 mr-5 flex items-center"}>
          <img className={"h-12 w-12 rounded-2xl"} src={icon} alt={name} />
        </div>
        <div className={"w-2/3"}>
          <h1 className={"text-2xl text-pink-200"}>{name}</h1>
          <h2 className={"text-white break-words"}>
            {description}
          </h2>
        </div>
        <div className={"grow hidden sm:block"}>
          <h6
            className={`whitespace-nowrap text-right text-sm ${selectLabelColor(
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

export default Card;
