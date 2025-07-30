import React, { useRef, useState } from "react";
import { seriesGenres } from "../constants/constants";
import { BiUpload } from "react-icons/bi";
import { CiImageOn } from "react-icons/ci";
import { convertToBase64 } from "../lib/handle-image-input";

export default function AddSeriesPage() {
    const [uploadType, setUploadType] = useState<"device" | "link">("device");
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const [loading, setIsLoading] = useState(false);

    async function handleImageInput(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setCoverImage(base64 as string);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent default form reset/refresh
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const title = formData.get("series-title");
        const description = formData.get("description");
        const alternativeTitles =
            (formData.get("alternative-titles") as string).split(",") || [];
        const author = formData.get("author");
        const status = formData.get("status");
        const genres = formData.getAll("genre");
        const isFeatured = formData.get("is-featured") === "on";

        try {
            const res = await fetch(
                "http://localhost:9000/api/series/add-series",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        alternativeTitles,
                        author,
                        genres,
                        status,
                        coverImageUrl: coverImage,
                        deleteImageUrl: " ",
                        isFeatured,
                    }),
                }
            );

            const data: { success: boolean; message: string } =
                await res.json();

            if (data.success) {
                alert(data.message);
                formRef.current?.reset();
                setCoverImage(null); // clear cover image preview
            } else {
                alert("Failed: " + data.message);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong when adding series"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen overflow-hidden">
            <h1 className="font-bold text-2xl pl-4">Add New Series</h1>
            <form
                className=" p-4 flex w-full gap-6 flex-col"
                onSubmit={handleFormSubmit}
                ref={formRef}
            >
                <div className="flex w-full gap-6 max-lg:flex-col">
                    <section className="bg-[#2f2e2e] flex-1 p-6 space-y-6 rounded-md">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm">
                                Series Title *
                            </label>
                            <input
                                name="series-title"
                                type="text"
                                required
                                placeholder="Enter series title"
                                className="border border-gray-700 py-2 px-4 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm">
                                Alternative Titles
                            </label>
                            <input
                                name="alternative-titles"
                                type="text"
                                placeholder="Enter alternative titles"
                                className="border border-gray-700 py-2 px-4 focus:outline-none text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-sm">
                                Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Enter description"
                                className="border border-gray-700 py-2 px-4 focus:outline-none text-sm resize-none h-36"
                            />
                        </div>
                        <div className="flex justify-between gap-4 items-center">
                            <div className="flex flex-col gap-2 flex-1">
                                <label htmlFor="" className="text-sm">
                                    Author
                                </label>
                                <input
                                    name="author"
                                    type="text"
                                    placeholder="Enter author name"
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
                            <div className="flex flex-wrap gap-2">
                                {seriesGenres.map((genre) => (
                                    <div
                                        className="border border-gray-700 p-1 flex items-center gap-2"
                                        key={genre}
                                    >
                                        <input
                                            type="checkbox"
                                            name="genre"
                                            id={genre}
                                            value={genre}
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
                                className="toggle toggle-xs"
                                id="isFeatured"
                                name="is-featured"
                            />
                            <label htmlFor="isFeatured" className="text-xs">
                                Feature on Poster?
                            </label>
                        </div>
                    </section>
                    {/* right section */}
                    <section className="w-[24rem] bg-[#2f2e2e] p-4 space-y-4 max-lg:w-full">
                        <h1 className="text-left">Cover Image</h1>
                        <div className="flex justify-between border border-gray-700 rounded-md p-[3px] ">
                            <div
                                className={`flex justify-center flex-1 text-sm py-1 rounded-md cursor-pointer ${
                                    uploadType === "device" && "bg-blue-500"
                                }`}
                                onClick={() => setUploadType("device")}
                            >
                                Upload File
                            </div>
                            <div
                                className={`flex justify-center flex-1 text-sm py-1 rounded-md cursor-pointer ${
                                    uploadType === "link" && "bg-blue-500"
                                }`}
                                onClick={() => setUploadType("link")}
                            >
                                Image Link
                            </div>
                        </div>
                        {uploadType === "device" ? (
                            <>
                                <div
                                    className="max-w-[96%] border border-dashed border-[#dadada5a] h-44 rounded-md flex items-center justify-center flex-col mx-auto hover:opacity-80 cursor-pointer"
                                    onClick={() =>
                                        imageInputRef.current?.click()
                                    }
                                >
                                    <BiUpload className="text-3xl text-gray-500" />
                                    <span className="text-gray-500">
                                        Click to upload
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={imageInputRef}
                                        onChange={handleImageInput}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col w-full gap-2">
                                <span>Image URL</span>
                                <input
                                    placeholder="https://example.com"
                                    className="py-2 rounded-md border border-gray-700 px-4 hover:outline-none"
                                    onChange={(e) =>
                                        setCoverImage(e.target.value)
                                    }
                                />
                                <span className="text-xs text-gray-500">
                                    Enter a direct link to an image (JPG, PNG,
                                    GIF, WebP)
                                </span>
                            </div>
                        )}
                        <div className="w-full space-y-4">
                            <h1>Cover Preview</h1>
                            {coverImage && (
                                <img
                                    src={coverImage}
                                    className="object-cover"
                                />
                            )}
                            {!coverImage && (
                                <div className="w-[95%] h-[30rem] bg-[#272626a8] mx-auto overflow-hidden flex items-center justify-center flex-col text-gray-500">
                                    <CiImageOn className="text-5xl" />
                                    <span>No Image uploaded</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <button
                    className="bg-blue-600 py-2 rounded-md flex items-center justify-center cursor-pointer transition-all hover:opacity-85"
                    type="submit"
                >
                    {loading ? "Uploading" : "Add Series"}
                </button>
            </form>
        </div>
    );
}
