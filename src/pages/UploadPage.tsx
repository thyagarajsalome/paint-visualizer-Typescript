import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wand2,
  Trash2,
  Eraser,
  Upload as UploadIcon,
} from "lucide-react";

export const UploadPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleApplyClick = () => {
    navigate("/apply", { state: { image } });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Upload Photo</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Prepare Image</h2>

        {image ? (
          <div
            className="aspect-[3/4] w-full rounded-xl bg-center bg-no-repeat bg-cover shadow-lg"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="aspect-[3/4] w-full rounded-xl bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-6 bg-primary/10 rounded-full text-primary"
            >
              <UploadIcon size={40} />
            </label>
            <p className="mt-4 text-center">Tap to upload a photo</p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        )}

        {image && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <ToolButton icon={Wand2} label="Select" active />
              <ToolButton icon={Trash2} label="Deselect" />
              <ToolButton icon={Eraser} label="Erase" />
            </div>
            <button
              onClick={handleApplyClick}
              className="mt-8 w-full h-12 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply Paint
            </button>
          </>
        )}
      </main>
    </div>
  );
};

const ToolButton = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) => (
  <div className="flex flex-col items-center gap-2">
    <button
      className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
        active
          ? "bg-primary/20 dark:bg-primary/30 text-primary"
          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      }`}
    >
      <Icon size={28} />
    </button>
    <p className="text-sm font-medium">{label}</p>
  </div>
);
