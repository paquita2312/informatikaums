// components/Breadcrumb.jsx
export default function Breadcrumb({ items }) {
    return (
        <nav className="text-sm mb-6" aria-label="Breadcrumb">
            <ol className="list-reset flex text-gray-600">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index !== 0 && <span className="mx-2">/</span>}
                        {item.href ? (
                            <a href={item.href} className="text-blue-600 hover:underline">{item.label}</a>
                        ) : (
                            <span className="text-gray-500">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
