"use client";

import * as z from 'zod';
import axios from 'axios';
import qs from "query-string";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { useModal } from '@/hooks/use-modal-store';


const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'File Attachment is required'
    })
});

type MessageFileFormValues = z.infer<typeof formSchema>

export const MessageFileModal = () => {

    const router = useRouter();

    const { isOpen, onClose, type, data } = useModal();

    const { apiUrl, query } = data;

    const isModalOpen = isOpen && type === "messageFile";

    const form = useForm<MessageFileFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    });

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const onSubmit = async (values: MessageFileFormValues) => {
        try {

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query
            });

            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button
                                type='submit'
                                variant={'primary'}
                                disabled={isLoading}
                                className='gap-x-2'
                            >
                                {isLoading && <Loader className='w-4 h-4 animate-spin' />}
                                {isLoading ? 'Sending' : 'Send'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}