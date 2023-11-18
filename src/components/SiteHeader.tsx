'use client';
import React, { useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { store } from '@/lib/types';
import { Button } from './ui/button';
import { PlusIcon } from '@heroicons/react/24/solid';
import AddItemModal from './AddItemModal';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useForm } from 'react-hook-form';
import DiningHallSelect from './DiningHallSelect';
import TagsCheckbox from './TagsCheckbox';
import { DialogHeader, DialogFooter } from './ui/dialog';
import { Form } from '@/components/ui/form';
import { Toaster } from './ui/toaster';
import { toast } from './ui/use-toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { Input } from './ui/input';

const FormSchema = z.object({
  diningHall: z.string().optional(),
  tags: z.record(z.string().optional(), z.boolean().optional()),
});

type IFormData = z.infer<typeof FormSchema>;

interface SiteHeader { }

const SiteHeader: React.FC<SiteHeader> = observer(() => {
  const { settings } = store;
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const form = useForm<IFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: FormSchema.parse({
      diningHall: settings.selectedDiningHallId,
      tags: settings.selectedTags.toRecord(),
    }),
  });

  const reset = () => {
    form.setValue('diningHall', 'all');
    form.reset(
      FormSchema.parse({
        // diningHall: settings.selectedDiningHallId,    by default select all dining halls
        tags: settings.selectedTags.toRecord(),
      })
    );
  };

  const onCancel = () => {
    reset();
    setFilterModalOpen(false);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });

    const { tags: _tags, diningHall } = data;
    const tags = Object.entries(_tags)
      .filter(([id, checked]) => !!checked)
      .map(([id, checked]) => id);

    settings.setSelectedTags(tags);

    if (diningHall) {
      settings.setSelectedDiningHallId(diningHall);
    }

    setFilterModalOpen(false);
    reset();
  };

  return (
    <header>
      <div className='flex flex-col lg:flex-row w-screen justify-center items-center py-2 bg-red-500'>
        {/* <div className='flex flex-row items-center'> */}
        {/* <MainNav /> */}
        <div className='flex items-center' style={{ position: 'absolute', left: '15px' }}> {/* Container for logo */}
          <img src='foodreview_logo.png' alt='Logo' className='w-12 h-12' /> {/* Adjust width and height as needed */}
        </div>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center whitespace-nonwrap'>
          {'McGill Food Reviews'}
        </h1>
               
        <div className='flex items-center space-x-3'>
          <Dialog open={filterModalOpen} modal>
            <Toaster />
            <DialogContent className='overflow-y-scroll max-w-sm md:max-w-l lg:max-w-xl max-h-[36rem]'>
              <DialogHeader>
                <DialogTitle>Filter Items</DialogTitle>
                <DialogDescription>
                  {
                    "Add some filters to narrow down the search to the item you're looking for."
                  }
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <Switch
                      id='airplane-mode'
                      checked={settings.showUnverified}
                      onCheckedChange={(e) => settings.toggleShowUnverified()}
                    />
                    <Label htmlFor='airplane-mode'>Show unverified</Label>
                  </div>
                  <DiningHallSelect />
                  <TagsCheckbox />
                  {/* <FormField
                                        control={form.control}
                                        name='score'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Score</FormLabel>
                                                <StarRating />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}
                  <DialogFooter>
                    <div className='flex justify-between w-full'>
                      <Button onClick={() => onCancel()}>Cancel</Button>
                      <Button onClick={form.handleSubmit(onSubmit)}>
                        Apply
                      </Button>
                    </div>
                  </DialogFooter>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
          <div className='mt-2 flex flex-row gap-3 items-end'>
            <div className='flex flex-row items-center gap-3'>
              <Button onClick={() => setFilterModalOpen(true)}>Filters</Button>
              <Button onClick={() => setAddItemModalOpen(true)} variant={'secondary'}>
                <PlusIcon className='w-4 h-4 mr-2' /> Item
              </Button>
            </div>
            <div className='flex flex-row gap-3'>
              <Input
                placeholder='Search...'
                className='w-64 px-3'
              />
              <Button>Search</Button>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* <div className='w-96 relative '>
                    <Input />
                </div> */}
    
      </div>
      <AddItemModal
        open={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
      />
      
    </header>
  );
});

export default SiteHeader;
