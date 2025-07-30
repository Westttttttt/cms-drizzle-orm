import type { IconType } from "react-icons";
import { DiAptana } from "react-icons/di";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";

export const sidebarLinks = [
    {
        name: "Dashboard",
        link: "/",
        icon: MdOutlineDashboard as IconType,
    },
    {
        name: "Add Series",
        link: "/add_series",
        icon: IoMdAdd as IconType,
    },
    {
        name: "Manage Series",
        link: "/manage_series",
        icon: DiAptana as IconType,
    },
];

export const seriesGenres = [
  "Action",
  "Adventure",
  "Fantasy",
  "Martial Arts",
  "Cultivation (Xianxia)",
  "Eastern Fantasy (Xuanhuan)",
  "Historical",
  "Romance",
  "Drama",
  "Comedy",
  "School Life",
  "Harem",
  "Reverse Harem",
  "Supernatural",
  "Reincarnation",
  "System",
  "Game",
  "Urban",
  "Modern Life",
  "Horror",
  "Mystery",
  "Sci-Fi",
  "Thriller",
  "Psychological",
  "Tragedy",
  "Slice of Life",
  "Seinen",
  "Shounen",
  "Shoujo",
  "Isekai",
  "Apocalypse",
  "Mecha",
  "Sports",
  "Magic",
  "Revenge",
  "Military"
];
