"use client";

import "@uploadthing/react/styles.css"
import Image from "next/image";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage"
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {

    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    priority
                    className="rounded-full"
                />

                <button
                    className="bg-rose-500 text-white p-1 absolute top-0 right-0 rounded-full shadow-sm"
                    type="button"
                    onClick={() => onChange('')}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        );
    };

    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon 
                    className="h-10 w-10 fill-indigo-200 stroke-indigo-500"
                />

                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>

                <button
                    className="bg-rose-500 text-white p-1 absolute -top-2 -right-2 rounded-full shadow-sm"
                    type="button"
                    onClick={() => onChange('')}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        );
    };

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                // toast({
                //     variant: 'default',
                //     description: 'Image Uploaded',
                //     className: 'bg-green-700 text-white'
                // });
            }}
            onUploadError={(error: Error) => {
                console.log(error)
                // toast({
                //     variant: 'destructive',
                //     title: "Uh oh! Something went wrong with the image upload.",
                //     description: 'Check network connection or File size and try again.'
                // });
            }}
        />
    );
};

export default FileUpload;