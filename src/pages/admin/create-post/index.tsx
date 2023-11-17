import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import { formatDate, getImage } from '@/lib/utils';
import StarMeter from '@/components/StarMeter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';

import Spinner from '@/components/Spinner';
import { observer } from 'mobx-react-lite';
import { store } from '@/lib/types';
import { useState } from 'react';
import ReviewModal from '@/components/ReviewModal';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const CreatePost = observer(() => {
  const handleCaptureClick = async () => {
    const slide1Element = document.querySelector<HTMLElement>('.slide1');
    if (!slide1Element) return;

    const canvas1 = await html2canvas(slide1Element, {
      allowTaint: true,
      removeContainer: true,
      useCORS: true,
      windowWidth: 3840,
      windowHeight: 3840,
    });
    const dataURL1 = canvas1.toDataURL('image/png', 1.0);
    downloadjs(dataURL1, 'slide1.png', 'image/png');

    const slide2Element = document.querySelector<HTMLElement>('.slide2');
    if (!slide2Element) return;

    const canvas2 = await html2canvas(slide2Element);
    const dataURL2 = canvas2.toDataURL('image/png');
    downloadjs(dataURL2, 'slide2.png', 'image/png');

    // const slide3Element =
    //     document.querySelector<HTMLElement>('.slide3');
    // if (!slide3Element) return;

    // const canvas3 = await html2canvas(slide3Element);
    // const dataURL3 = canvas3.toDataURL('image/png');
    // downloadjs(dataURL3, 'slide3.png', 'image/png');
  };

  const { items, itemsInitialized, diningHalls, settings } = store;

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewItemId, setReviewItemId] = useState('');

  return (
    <div className='flex flex-col items-center gap-y-4 mx-12 md:mx-48'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center'>
        Post Generator!
      </h1>
      <Button onClick={handleCaptureClick}>Download Post Image</Button>
      {!itemsInitialized ? (
        <Spinner />
      ) : (
        <>
          <div className='grid w-full grid-cols-1 gap-20'>
            {items.map((i) => (
              <div className='flex flex-row gap-20 mx-auto' key={i.id}>
                {/* <Card className='w-96 h-96 slide1'>
                                        <CardContent className='relative flex items-center justify-center w-96 h-64 z-0'>
                                            <Image src={getImage(i.imageUrl)} fill alt='' className='' />
                                        </CardContent>
                                        <div className='h-fit bg-white z-10'>
                                            <CardHeader className='flex flex-row justify-between'>
                                                <div>
                                                    <CardTitle className=''>
                                                        {i.name}
                                                    </CardTitle>
                                                </div>
                                                <div className='flex flex-row items-center'>
                                                </div>
                                            </CardHeader>
                                            <CardContent className='mx-6 pb-6'>
                                                <StarMeter stars={i.rating} />
                                                <p className='inline'>
                                                    {Math.round((i.rating + Number.EPSILON) * 10) / 10}/10
                                                </p>
                                            </CardContent>
                                        </div>
                                    </Card> */}

                <Card className='w-96 h-96 slide1'>
                  <CardContent className='relative flex items-center justify-center w-96 h-96 z-0'>
                    <Image
                      src={getImage(i.getTopRated().imageUrl)}
                      fill
                      alt=''
                      className=''
                    />
                    <div className='h-fit w-full absolute bottom-0 bg-white z-10'>
                      <CardHeader className='flex flex-row justify-between'>
                        <div>
                          <CardTitle className=''>{i.name}</CardTitle>
                          {/* <CardDescription>
                                                            {`${i.reviews.reviews.length} total reviews`}
                                                        </CardDescription> */}
                        </div>
                        <div className='flex flex-row items-center'></div>
                      </CardHeader>
                      <CardContent className='mx-6 pb-6 bg-white z-10'>
                        <StarMeter stars={i.rating} />
                        <p className='inline'>
                          {Math.round((i.rating + Number.EPSILON) * 10) / 10}/10
                        </p>
                      </CardContent>
                      {/* <CardFooter className='flex flex-col justify-between items-start h-32 bg-green-500'>
                                                <div className='flex flex-wrap items-center overflow-y-hidden'>
                                                    <Badge variant="default">
                                                        {diningHalls.halls.get(i.diningHall)?.name}
                                                    </Badge>
                                                    {i.tags.map((tagId) => {
                                                        return (
                                                            <Badge
                                                                variant="outline"
                                                                key={tagId}
                                                            >
                                                                {tags.tags.get(tagId)?.value}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </CardFooter> */}
                    </div>
                  </CardContent>
                </Card>

                <Card className='w-96 h-96 aspect-square overflow-hidden slide2'>
                  <div className='flex flex-col h-full m-10'>
                    <CardHeader>
                      <div>
                        <CardTitle>{i.reviews.getItems()[0].title}</CardTitle>
                        <CardDescription>
                          {formatDate(
                            new Date(i.reviews.getItems()[0].createdAt)
                          )}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className='m-auto'>
                      <p className='ml-6 my-2'>
                        {i.reviews.getItems()[0].comment}
                      </p>
                      <div className='flex flex-row items-center justify-center w-full mb-10'>
                        {[...Array(i.reviews.getItems()[0].rating)].map(
                          (s, i) => {
                            return (
                              <StarSolidIcon key={i} className='w-8 h-8' />
                            );
                          }
                        )}
                        {[...Array(10 - i.reviews.getItems()[0].rating)].map(
                          (s, i) => {
                            return (
                              <StarOutlineIcon key={i} className='w-8 h-8' />
                            );
                          }
                        )}
                        {/* <p className='align-middle'>{i.reviews.getItems()[0].rating}/10</p> */}
                      </div>
                    </CardContent>
                    <CardFooter></CardFooter>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        itemId={reviewItemId}
      />
    </div>
  );
});
export default CreatePost;
