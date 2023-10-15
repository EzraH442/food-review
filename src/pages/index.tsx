import ReviewButton from '@/components/ReviewButton';
import useItems from '@/hooks/useItems';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getImage } from '@/lib/utils';
import Spinner from '@/components/Spinner';
import AddItemButton from '@/components/AddItemButton';

export default function Home() {
  const { items, refetch, loading } = useItems();

  //can remove this when we make a component for the AddItemButton

  // REMOVE TO HERE

  return (
    <div className='flex flex-col items-center gap-y-4 mx-12 md:mx-48'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center'>
        {"New Rez's Dishes"}
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <AddItemButton
            onSuccess={refetch}
            onFail={() => { }}
          />          <div className='grid w-full grid-colc-1 lg:grid-cols-3 gap-4'>
            {items.map((i) => {
              return (
                <Card key={i.id} className='group-hover:bg-slate-50'>
                  <Link href={`/${i.slug}`} className='group' key={i.id}>
                    <CardContent className='bg-slate-100 flex items-center justify-center h-64'>
                      <div className='relative w-full h-full'>
                        <Image src={getImage(i.imageUrl)} fill alt='' />
                      </div>
                    </CardContent>
                    <CardHeader className='flex flex-row justify-between'>
                      <div>
                        <CardTitle className='group-hover:underline'>
                          {i.name}
                        </CardTitle>
                        <CardDescription>
                          {`${i.totalReviews} total reviews`}
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
                        <StarSolidIcon className='w-4 h-4' />
                        <p className='align-middle'>{Math.round((i.rating + Number.EPSILON) * 10) / 10}/10</p>
                      </div>
                    </CardHeader>
                  </Link>
                  <CardFooter>
                    <ReviewButton
                      itemId={i.id}
                      onSuccess={() => refetch()}
                      onFail={() => { }}
                    />
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
