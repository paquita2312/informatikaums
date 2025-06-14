export default function PopupWrapper({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold">
                    ×
                </button>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
