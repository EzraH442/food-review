import { IItem } from '@/lib/types/Item';
import { getImage } from '@/lib/utils';
import ReviewModal from './ReviewModal';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from './ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import StarMeter from './StarMeter';
import { Button } from './ui/button';
import { PlusIcon } from '@heroicons/react/24/solid';
import { store } from '@/lib/types';
interface IItemCardProps {
  item: IItem;
  onReviewClick: (item: IItem) => void;
}

const ItemCard: React.FC<IItemCardProps> = observer(
  ({ item, onReviewClick }) => {
    const { tags, diningHalls } = store;
    return (
      <Card key={item.id} className='group hover:bg-muted w-full h-full'>
        <Link href={`/${item.slug}`} className='group' key={item.id}>
          <CardContent className='bg-muted flex items-center justify-center h-64'>
            <div className='relative w-full h-full'>
              <Image src={getImage(item.getTopRated().imageUrl)} fill alt='' className='aspect-auto object-cover' />
            </div>
          </CardContent>
          <CardHeader className='flex flex-row justify-between'>
            <div>
              <CardTitle className='group-hover:underline'>
                {item.name}
              </CardTitle>
              <CardDescription>
                {`${item.reviews.reviews.length} total reviews`}
              </CardDescription>
            </div>
            <div className='flex flex-row items-center'>
              {/* {[...Array(r.score)].map((s) => {
                    return (
                      <StarSolidIcon key={s} className="w-4 h-4" />
                    );
                  })
                  }
                  {[...Array(10 - r.score)].map((s) => {
                    return (
                      <StarOutlineIcon key={s} className="w-4 h-4" />
                    );
                  })
                  } */}
              {/* <StarIcon className='w-4 h-4' /> */}
              {/* <p className='align-middle'>
              {Math.round((item.rating + Number.EPSILON) * 10) / 10}/10
            </p> */}
            </div>
          </CardHeader>
        </Link>

        <CardContent className='mx-6 pb-2'>
          <StarMeter stars={item.rating} />
          <p className='inline'>
            {Math.round((item.rating + Number.EPSILON) * 10) / 10}/10
          </p>
        </CardContent>
        <CardFooter className='flex flex-col justify-between items-start h-32'>
          <div className='flex flex-wrap items-center overflow-y-hidden gap-2'>
            <Badge variant='default'>
              {diningHalls.halls.get(item.diningHall)?.name}
            </Badge>
            {item.tags.map((tagId) => {
              return (
                <Badge variant='outline' key={tagId}>
                  {tags.tags.get(tagId)?.value}
                </Badge>
              );
            })}
          </div>

          <Button
            className=''
            variant={'secondary'}
            onClick={() => onReviewClick(item)}
          >
            <PlusIcon className='w-4 h-4 mr-2' /> Review
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

export default ItemCard;
