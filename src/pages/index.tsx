'use client';

import Spinner from '@/components/Spinner';
import { observer } from 'mobx-react-lite';
import { store } from '@/lib/types';
import ItemCard from '@/components/ItemCard';
import { useState } from 'react';
import ReviewModal from '@/components/ReviewModal';
import SiteHeader from '@/components/SiteHeader';
import { IItem } from '@/lib/types/Item';

const Home = observer(() => {
  const { items, itemsInitialized, diningHalls, settings } = store;

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState({} as IItem);

  const onItemReviewClick = (item: IItem) => {
    setReviewItem(item);
    setReviewModalOpen(true);
  };

  console.log('items initialized? ', itemsInitialized);

  const getTitle = () => {
    if (settings.selectedDiningHallId === 'all') return 'All Dishes';
    else {
      return `${diningHalls.halls.get(settings.selectedDiningHallId)?.name
        }'s dishes`;
    }
  };

  return (
    <div className='flex flex-col items-center gap-y-4 mx-3 md:mx-48'>
      <SiteHeader />
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center'>
        {getTitle()}
      </h1>
      {!itemsInitialized ? (
        <Spinner />
      ) : (
        <>
          <div className='grid w-full grid-cols-1 lg:grid-cols-3 gap-4'>
            {items
              .filter(
                (item) =>
                  settings.selectedDiningHallId === 'all' ||
                  item.diningHall === settings.selectedDiningHallId
              )
              .filter(
                (item) =>
                  settings.selectedTags.tags.size === 0 ||
                  item.hasSomeTags(settings.selectedTags.toIdArray())
              )
              .map((i) => (
                <div className='h-[32rem]' key={i.id}>
                  <ItemCard
                    item={i}
                    onReviewClick={(item) => onItemReviewClick(item)}
                  />
                </div>
              ))}
          </div>
        </>
      )}
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        item={reviewItem}
      />
    </div>
  );
});

export default Home;
