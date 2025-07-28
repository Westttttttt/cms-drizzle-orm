import React, { useRef, useState } from "react";
import { seriesGenres } from "../constants/constants";
import { BiUpload } from "react-icons/bi";

export default function AddSeriesPage() {
    const [uploadType, setUploadType] = useState<"device" | "link">("device");
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    function handleImageInput(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="w-full min-h-screen overflow-hidden">
            <h1 className="font-bold text-2xl pl-4">Add New Series</h1>
            <form className=" p-4 flex w-full gap-6 flex-col">
                <div className="flex w-full gap-6">
                    <section className="bg-[#2f2e2e] flex-1 p-6 space-y-6 rounded-md">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm">
                                Series Title *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter series title"
                                className="border border-gray-700 py-2 px-4 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm">
                                Alternative Titles
                            </label>
                            <input
                                type="text"
                                placeholder="Enter series title"
                                className="border border-gray-700 py-2 px-4 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm">
                                Description
                            </label>
                            <textarea
                                placeholder="Enter series title"
                                className="border border-gray-700 py-2 px-4 focus:outline-none text-sm resize-none h-36"
                            />
                        </div>
                        <div className="flex justify-between gap-4 items-center">
                            <div className="flex flex-col gap-2 flex-1">
                                <label htmlFor="" className="text-sm">
                                    Alternative Titles
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter series title"
                                    className="border border-gray-700 py-2 px-4 focus:outline-none text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label htmlFor="" className="text-sm">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    className="bg-[#2f2e2e] border border-gray-700 py-2 text-sm px-2 focus:outline-none"
                                >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="hiatus">Hiatus</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-col">
                            <label htmlFor="" className="text-sm">
                                Genres
                            </label>
                            <div
                                flex-wrap
                                gap-2
                                p-2
                                flex-colv
                                className="flex flex-wrap gap-2"
                            >
                                {seriesGenres.map((genre) => (
                                    <div className="border border-gray-700 p-1 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="genre"
                                            id={genre}
                                        />
                                        <label
                                            className="text-xs"
                                            htmlFor={genre}
                                        >
                                            {genre}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="toggle toggle-xs"
                                id="isFeatured"
                            />
                            <label htmlFor="isFeatured" className="text-xs">
                                Feature on Poster?
                            </label>
                        </div>
                    </section>
                    <section className="w-[24rem] bg-[#2f2e2e] p-4 space-y-4">
                        <h1 className="text-left">Cover Image</h1>
                        <div
                            className="max-w-[96%] border border-dashed border-[#dadada5a] h-54 rounded-md flex items-center justify-center flex-col mx-auto hover:opacity-80 cursor-pointer"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <BiUpload className="text-3xl text-gray-400" />
                            <span className="text-gray-400">
                                Click to upload
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                ref={imageInputRef}
                                onChange={handleImageInput}
                            />
                        </div>
                        <div className="w-full space-y-4">
                            <h1>Cover Preview</h1>
                            <div className="w-[90%] h-auto bg-[#272626a8] mx-auto overflow-hidden">
                                {coverImage && (
                                    <img
                                        src={coverImage}
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                </div>
                <button className="bg-red-600 py-2 flex items-center justify-center cursor-pointer text-black transition-all hover:opacity-85">
                    Add Series
                </button>
            </form>
        </div>
    );
}
