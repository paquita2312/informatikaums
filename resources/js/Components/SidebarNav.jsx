import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

export default function SidebarNav({ items }) {
    const { collapsed } = useSidebar();
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (title) => {
        setOpenDropdown((prev) => (prev === title ? null : title));
    };

    return (
        <div className="space-y-2 px-4">
            {items.map((item, idx) => (
                <div key={idx}>
                    {/* Dropdown parent */}
                    {item.children ? (
                        <div>
                            <button
                                onClick={() => toggleDropdown(item.title)}
                                className="flex items-center justify-between w-full rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5">{item.icon}</span>
                                    {!collapsed && <span>{item.title}</span>}
                                </div>
                                {!collapsed && (
                                    openDropdown === item.title ? (
                                        <ChevronUp size={16} />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )
                                )}
                            </button>

                            {!collapsed && openDropdown === item.title && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {item.children.map((child, cidx) => (
                                        <Link
                                            key={cidx}
                                            href={child.href}
                                            className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Item biasa
                        <Link
                            href={item.href}
                            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                            <span className="w-5 h-5">{item.icon}</span>
                            {!collapsed && <span>{item.title}</span>}
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}
