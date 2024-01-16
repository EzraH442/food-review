'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { observer } from 'mobx-react-lite';
import { store } from '@/lib/types';

interface IF {
  diningHall: string;
}

const DiningHallSelect = observer(() => {
  const form = useFormContext<IF>();
  const { diningHalls } = store;

  return (
    <>
      <FormField
        control={form.control}
        name='diningHall'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormLabel>Which dining hall is this item found in?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='flex flex-col space-y-1'
              >
                <FormItem
                  className='flex items-center space-x-3 space-y-0'
                  key={0}
                >
                  <FormControl>
                    <RadioGroupItem value={'all'} />
                  </FormControl>
                  <FormLabel className='font-normal'>All</FormLabel>
                </FormItem>
                {Array.from(diningHalls.halls.entries()).map(
                  ([id, { name }]) => {
                    return (
                      <FormItem
                        className='flex items-center space-x-3 space-y-0'
                        key={id}
                      >
                        <FormControl>
                          <RadioGroupItem value={id} />
                        </FormControl>
                        <FormLabel className='font-normal'>{name}</FormLabel>
                      </FormItem>
                    );
                  }
                )}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
});

export default DiningHallSelect;
