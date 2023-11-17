'use client';

import AddReviewModal from '@/components/ReviewModal';
import { extractSlug, formatDate, getImage } from '@/lib/utils';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  StarIcon as StarOutlineIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { IItem } from '@/lib/types/Item';
import { store } from '@/lib/types';
import Spinner from '@/components/Spinner';
import ReviewCard from '@/components/ReviewCard';
import { PlusIcon } from '@heroicons/react/24/solid';

const Item = observer(() => {
  const route = useRouter();
  const slug = useMemo(() => extractSlug(route.query.slug), [route.query.slug]);
  const [item, setItem] = useState<IItem>();

  const { itemsInitialized } = store;

  if (itemsInitialized && item === undefined) {
    const i = store.findItemBySlug(slug);
    if (i) {
      setItem(i);
    }
  }

  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
    <div className='flex flex-col items-center gap-y-4 mx-12'>
      <Link href={'/'}>
        <Button className='absolute top-2 left-2'>
          <ArrowLeftIcon className='w-4 h-4 mr-2' /> Home
        </Button>
      </Link>
      {item ? (
        <>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center'>
            {`New Rez ${item?.name ?? ''} Reviews`}
          </h1>
          <Image
            src={getImage(item?.getTopRated().imageUrl)}
            width={300}
            height={300}
            alt=''
          />
          <Button onClick={() => setReviewModalOpen(true)}>
            <PlusIcon className='w-4 h-4 mr-2' /> Review
          </Button>
          {/* COULD REMOVE THE REVIEW BUTTON AND JUST ADD THE FORM HERE */}
          <div className='grid grid-cols-1 gap-4 w-full max-w-2xl'>
            {item?.reviews.getItems().map((r) => (
              <ReviewCard review={r} key={r.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <Spinner />
      )}
      <AddReviewModal
        itemId={item?.id ?? ''}
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
});

export default Item;
