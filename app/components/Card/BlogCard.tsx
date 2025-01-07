type CardParams = {
  name: string;
  description: string;
  link: string;
};

export const BlogCard = ({  name, description, link }: CardParams) => {
  return (
    <div className={"flex w-full flex-col gap-1 rounded-2xl"}>
      <a
        href={link}
        className={
          "flex rounded gap-1 pr-6 pt-6 pb-6"
        }
        rel="prefetch"
      >
        <div className={"sm:w-2/3 "}>
          <h1 className={"text-2xl text-pink-200 pb-2.5 hover:underline"}>{name}</h1>
          <h2 className={"text-white break-words"}>{description}</h2>
        </div>
      </a>
    </div>
  );
};

