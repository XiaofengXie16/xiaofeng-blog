import { Link } from "@remix-run/react";
import { ToolCard } from "~/components/Card";
import { TOOLS } from "~/constants/tool";

const Tool = () => {
  return (
    <main
      className={
        "flex h-screen w-screen flex-col items-center overflow-auto overflow-x-hidden bg-gray-700 pt-20 pr-5 pl-5"
      }
    >
      <section className={"md:ml-40 md:mr-40"}>
        <Link
          to={"/"}
          className={
            "mb-10 block items-start text-2xl font-extrabold text-white hover:underline text-center sm:text-left"
          }
        >
          Read, Think and Code
        </Link>
        <h1
          className={
            "mb-10 text-4xl font-extrabold text-pink-200 text-center sm:text-left"
          }
        >
          Development tools
        </h1>
        <ul className={"flex list-none flex-col items-start gap-5 pb-20"}>
          {TOOLS.map(({ description, icon, name, category, link }) => (
            <ToolCard
              key={name}
              description={description}
              icon={icon}
              category={category}
              name={name}
              link={link}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Tool;
