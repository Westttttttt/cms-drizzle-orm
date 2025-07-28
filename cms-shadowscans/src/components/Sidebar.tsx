import { Link } from "react-router-dom";
import { sidebarLinks } from "../constants/constants";

export default function Sidebar() {
    return (
        <aside className="min-w-fit border-r border-[#dadada23]">
            <ul>
                {sidebarLinks.map((item, idx) => (
                    <li key={idx}>
                        <Link
                            to={item.link}
                            className="flex items-center justify-start gap-2 py-2 px-4 border-b border-[#dadada34] hover:opacity-80 transition-all"
                        >
                            {item.icon && <item.icon />}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
