"use client";

import { useState, useRef } from "react";
import ObsidianFileBadge from "~/components/ObsidianFileBadge";
import { useDashboardStore } from "~/store/dashboard-store";
import { api } from "~/trpc/react";

export default function NotesHome() {
    const [selectedFiles, setSelectedFiles] = useState<{
        name: string;
        content: string;
    }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending } = api.notes.uploadMultipleNotes.useMutation();
    const addNote = useDashboardStore(state => state.addNote);

    const existingNotes = useDashboardStore(state => state.notes);
    const activeVault = useDashboardStore(state => state.activeVault);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && typeof event.target.result === "string") {
                        setSelectedFiles((prevFiles) => [...prevFiles, {
                            name: file.name,
                            content: event.target?.result as string,
                        }]);
                    }
                };
                reader.readAsText(file);
            });
        };
    };


    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearFiles = () => {
        setSelectedFiles([]);
    };

    const handleUploadFiles = () => {
        if (selectedFiles.length <= 0) return;
        if (!activeVault) return;

        mutate(
            {
                notes: selectedFiles,
                vaultId: activeVault.id,
            },
            {
                onSuccess: (data) => {
                    const newNotes = existingNotes
                        ? data.filter(note => !existingNotes.find(existingNote => existingNote.name === note.name))
                        : data;

                    newNotes.forEach(note => addNote(note));

                    setSelectedFiles([]);
                },
            }
        );
    };

    if (!activeVault) return (
        <p>no active vault</p>
    )

    return (
        <div className="flex flex-col h-full p-16 overflow-y-scroll">
            <h1 className="text-3xl font-bold">Upload Notes for vault {activeVault.name}</h1>
            <button
                className="h-[200px] min-h-[200px] mt-8 font-bold border border-[#c3c3ff33] border-dashed rounded-md"
                onClick={handleUploadButtonClick}
            >
                + Add Markdown Files
            </button>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-semibold">Selected Files:</h2>
                    <div className="flex flex-wrap mt-4">
                        {selectedFiles.map((file, index) => (
                            <ObsidianFileBadge
                                noteName={file.name}
                                key={index}
                            />
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-row mt-4">
                <button
                    className="w-full py-2 bg-[#635BFF] font-bold rounded-md disabled:opacity-50"
                    onClick={handleUploadFiles}
                    disabled={selectedFiles.length <= 0 || isPending}
                >
                    Upload {selectedFiles.length} Files
                </button>
                <button
                    className="w-full ml-4 py-2 bg-gray-600 font-bold rounded-md disabled:opacity-50"
                    onClick={handleClearFiles}
                    disabled={selectedFiles.length <= 0 || isPending}
                >
                    Clear Files
                </button>
            </div>
        </div>
    );
}