type CardParams = {
  name: string;
  description: string;
  link: string;
};

export const BlogCard = ({  name, description, link }: CardParams) => {
  return (
    <div className={"flex w-full flex-col gap-1 rounded-2xl hover:bg-gray-600"}>
      <a
        href={link}
        className={
          "flex rounded gap-1 border-2 border-transparent hover:border-cyan-200 p-6"
        }
        rel="prefetch"
      >
        <div className={"w-2/3"}>
          <h1 className={"text-2xl text-pink-200 pb-2.5"}>{name}</h1>
          <h2 className={"text-white break-words"}>{description}</h2>
        </div>
      </a>
    </div>
  );
};

