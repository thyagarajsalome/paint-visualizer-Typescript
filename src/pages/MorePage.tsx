import { ArrowLeft, ChevronRight, Info, Shield } from "lucide-react";

export const MorePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center p-4 border-b border-gray-200">
        <button className="p-2 invisible">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-xl font-bold text-center">More</h1>
      </header>
      <main className="flex-grow p-4 space-y-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <ul className="divide-y divide-gray-200">
            <ListItem icon={Info} label="About This App" />
            <ListItem icon={Shield} label="Privacy Policy" />
          </ul>
        </div>
        <div className="text-center text-gray-400">
          <p>Version 1.0.0</p>
        </div>
      </main>
    </div>
  );
};

const ListItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <li className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <Icon className="text-gray-600" size={24} />
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight className="text-gray-400" size={20} />
  </li>
);
