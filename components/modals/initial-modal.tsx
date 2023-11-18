"use client";

import * as z from 'zod';
import axios from 'axios';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';


const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required'
    }),
    imgUrl: z.string().min(1, {
        message: 'Server image is required'
    })
});

type ServerFormValues = z.infer<typeof formSchema>

export const InitialModal = () => {

    const router = useRouter();

    const [isMounted, setIsMounted] = useState<boolean>(false);

    const form = useForm<ServerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imgUrl: ''
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: ServerFormValues) => {
        try {
            await axios.post("/api/servers", values);

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {

        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null
    };

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. you can always change it later.
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
                                    name='imgUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className=' text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                                Image Upload
                                            </FormLabel>

                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Server name
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className='bg-zinc-300/50 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                                placeholder='Enter server name'
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button
                                type='submit'
                                variant={'primary'}
                                disabled={isLoading}
                                className='gap-x-2'
                            >
                                {isLoading && <Loader className='w-4 h-4 animate-spin' />}
                                {isLoading ? 'Creating' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}