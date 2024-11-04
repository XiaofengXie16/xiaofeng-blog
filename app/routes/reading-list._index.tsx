import { Link } from "@remix-run/react";
import { BOOKS } from "~/constants/book";

const ReadingList = () => {
  return (
    <main
      className={
        "flex h-screen w-screen flex-col items-center overflow-auto overflow-x-hidden bg-gray-700 pt-20 pr-5 pl-5"
      }
    >
      <section className={"ml-40 mr-40"}>
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
          Reading List
        </h1>
        <ul
          className={
            "flex flex-col flex-wrap items-center min-w-[600px] list-none gap-14 pb-20 sm:flex-row sm:items-start"
          }
        >
          {BOOKS.map(({ name, icon, link }) => {
            return (
              <li key={name} className={"hover:scale-105"}>
                <Link
                  to={link}
                  className={"flex flex-col items-center gap-y-4 w-80"}
                >
                  <img src={icon} alt={name} className={"w-60 h-80"} />
                  <h1 className={"text-white text-center text-2xl"}>{name}</h1>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
};

export default ReadingList;
