import EngineeringManagementForTheRestOfUs from "~/assets/images/engineering_management_for_the_rest_of_us.jpg";
import TheStaffEngineerPath from "~/assets/images/the_staff_engineer_path.jpg";
import APhilosophyOfSoftwareDesign from "~/assets/images/a_philosophy_of_software_design.jpg";
import SimplySaid from "~/assets/images/simply_said.jpg";
import DesigningDataIntensiveApplications from "~/assets/images/designing_data_intensive_applications.jpg";
import WhyNationsFail from "~/assets/images/why_nations_fail.jpg";

export type Book = { name: string; icon: string; link: string };

export const BOOKS = [
  {
    name: "Why Nations Fail: The Origins of Power, Prosperity, and Poverty",
    icon: WhyNationsFail,
    link: "https://ia801506.us.archive.org/27/items/WhyNationsFailTheOriginsODaronAcemoglu/Why-Nations-Fail_-The-Origins-o-Daron-Acemoglu.pdf",
  },
  {
    name: "The Staff Engineer's Path",
    icon: TheStaffEngineerPath,
    link: "https://noidea.dog/staff",
  },
  {
    name: "Engineering Management For the Rest of Us",
    icon: EngineeringManagementForTheRestOfUs,
    link: "https://www.engmanagement.dev/",
  },
  {
    name: "A Philosophy of Software Design",
    icon: APhilosophyOfSoftwareDesign,
    link: "https://web.stanford.edu/~ouster/cgi-bin/book.php",
  },
  {
    name: "Simply Said: Communicating Better at Work and Beyond",
    icon: SimplySaid,
    link: "https://www.exec-comm.com/product/simply-said/",
  },
  {
    name: "Designing Data-Intensive Applications",
    icon: DesigningDataIntensiveApplications,
    link: "https://dataintensive.net/",
  },
] as const satisfies readonly Book[];

/** Handwritten labels shown under each book, in the same order as BOOKS. */
export const BOOK_TAGS = ["history", "career", "leadership", "design", "craft", "systems"] as const;
