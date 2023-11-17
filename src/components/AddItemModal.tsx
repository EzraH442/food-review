'use client';

import React, { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import StarRating from '@/components/StarRating';
import { store } from '@/lib/types';
import { makeItem } from '@/lib/review/make-item';
import { makeReview } from '@/lib/review/make-review';
import { getItem } from '@/lib/review/get-item';
import DiningHallSelect from './DiningHallSelect';
import TagsCheckbox from './TagsCheckbox';
import useImageUpload from '@/hooks/useImageUpload';
import Spinner from './Spinner';
// import { toast } from "@/components/ui/use-toast"

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Dish name must be at least 2 characters long.',
    })
    .max(20, {
      message: 'Dish name must not be longer than 20 characters.',
    }),
  review: z
    .string()
    .min(0, {
      message: 'Review must be at least 10 characters long.',
    })
    .max(160, {
      message: 'Review must not be longer than 160 characters.',
    })
    .default(''),
  title: z
    .string()
    .min(0, {
      message: 'Review title must be at least 1 character long',
    })
    .max(30, { message: 'Review title must not be longer than 30 characters' })
    .default(''),
  score: z
    .number()
    .min(1, { message: 'min is 1' })
    .max(10, { message: 'max is 10' })
    .default(0),
  diningHall: z.string(),
  tags: z.record(z.string().optional(), z.boolean().optional()),
  fileId: z.string().optional(),
});

type IFormData = z.infer<typeof FormSchema>;

interface IAddItemModal {
  open: boolean;
  onClose: VoidFunction;
}

export const isValidMimeType = (type: string) => {
  return type === 'image/png' || type === 'image/jpeg';
};

const AddItemModal: React.FC<IAddItemModal> = ({ open, onClose }) => {
  const form = useForm<IFormData>({
    resolver: zodResolver(FormSchema),
  });

  const { upload, pending, error } = useImageUpload();

  const reset = () => {
    form.setValue('score', 0);
    form.setValue('name', '');
    form.setValue('review', '');
    form.setValue('title', '');
    form.setValue('diningHall', '');
    form.setValue('fileId', '');
    form.clearErrors();
    //reset the tags
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // toast({
    //   title: 'Item Added!',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });

    const { tags: _tags, fileId, ...rest } = data;
    const tags = Object.entries(_tags)
      .filter(([id, checked]) => !!checked)
      .map(([id, checked]) => id);

    let imageUrl;
    if (fileId) {
      imageUrl = `https://static.ezrahuang.com/file/new-res-meal-review/${fileId}`;
    }
    const _item = await makeItem({ ...rest, tags });
    const review = await makeReview({ ...data, itemId: _item.id, imageUrl });
    const item = await getItem(_item.id); // necessary because this will have the correct score

    store.addItem(item);
    reset();
    onClose();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    form.clearErrors('fileId');
    let file = e.target.files?.item(0);

    if (!file) {
      form.setError('fileId', { message: 'No file selected' });
      return;
      // set error
    }

    if (!isValidMimeType(file.type)) {
      form.setError('fileId', {
        message: 'Invalid file type: only png and jpegs are accepted',
      });
      return;
    }

    const res = await upload(file);

    console.log(error);
    if (error) {
      form.setError('fileId', {
        message: `An error occured when uploading file: ${error}`,
      });

      return;
    }

    console.log('set id', res);
    form.setValue('fileId', res);
  };

  return (
    <Dialog open={open} modal>
      <Toaster />
      <DialogContent className='overflow-y-scroll max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[36rem]'>
        <DialogHeader>
          <DialogTitle>Add a Food Item</DialogTitle>
          <DialogDescription>
            {
              "Add a food item that doesn't have any reviews yet. Click submit when you're done."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dish Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='The dishes name'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-3'>
              <DiningHallSelect />
              <TagsCheckbox />
            </div>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Your review title'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='review'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='What did you think of this dish?'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='score'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <StarRating />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='fileId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <Input
                    type='file'
                    accept='.png,.jpeg,.jpg'
                    className=''
                    multiple={false}
                    onChange={handleFileChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <DialogFooter>
              <div className='flex justify-between w-full'>
                <Button onClick={() => onCancel()}>Cancel</Button>
                <Button type='submit' disabled={pending}>
                  {pending ? <Spinner /> : 'Submit'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
