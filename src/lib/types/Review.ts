import { Instance, types } from 'mobx-state-tree';
import { Review as PrismaReview } from '@prisma/client';

const Review = types
  .model('Review', {
    id: '',
    createdAt: types.Date,
    rating: 0,
    title: '',
    comment: '',
    helpfulVotes: 0,
    downvotes: 0,
    imageUrl: '',
  })
  .actions((self) => ({
    addHelpful() {
      self.helpfulVotes++;
    },
  }));

const ReviewArray = types
  .model('ReviewArray', {
    reviews: types.array(Review),
  })
  .actions((self) => ({
    getItems() {
      return self.reviews;
    },
    init(reviews: PrismaReview[]) {
      self.reviews.replace([
        ...reviews.map((review) => {
          const { createdAt: _createdAt, ...rest } = review;
          return Review.create({
            ...rest,
            createdAt: new Date(_createdAt),
          });
        }),
      ]);
      return self;
    },
    addReview(review: PrismaReview) {
      const { createdAt: _createdAt, ...rest } = review;
      self.reviews.push(
        Review.create({
          ...rest,
          createdAt: new Date(_createdAt),
        })
      );
    },
    findReviewById(id: string) {
      return self.reviews.find((r) => r.id === id);
    },
  }));

type IReview = Instance<typeof Review>;
type IReviewArray = Instance<typeof ReviewArray>;
export { Review, ReviewArray };
export type { IReview, IReviewArray };
