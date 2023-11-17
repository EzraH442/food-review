import { Instance, types } from 'mobx-state-tree';
import { ReviewArray } from './Review';
import { Item, Review as PrismaReview } from '@prisma/client';

const Item = types
  .model('Item', {
    id: '',
    slug: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: '',
    rating: 0.0,
    reviews: ReviewArray,
    tags: types.array(types.string),
    diningHall: '',
    verified: types.boolean,
  })
  .views((self) => ({
    hasAllTags(ids: string[]) {
      const isMissingTag = ids.some((id) => {
        const found = self.tags.findIndex((t) => t === id) !== -1;
        return !found;
      });
      return !isMissingTag;
    },
    hasSomeTags(ids: string[]) {
      const hasATag = ids.some((id) => {
        const found = self.tags.findIndex((t) => t === id) !== -1;
        return found;
      });
      return hasATag;
    },
    getTopRated() {
      let topRated = self.reviews.reviews[0];

      self.reviews.reviews.forEach((r) => {
        if (
          r.helpfulVotes > topRated.helpfulVotes ||
          (r.helpfulVotes === topRated.helpfulVotes &&
            !topRated.imageUrl &&
            !!r.imageUrl)
        ) {
          topRated = r;
        }
      });

      return topRated;
    },
  }))
  .actions((self) => ({
    addReview(review: PrismaReview) {
      const numReviews = self.reviews.reviews.length;
      self.rating =
        (self.rating * numReviews + review.rating) / (numReviews + 1);
      self.reviews.addReview(review);
    },
    setVerified(verified: boolean) {
      self.verified = verified;
    },
  }));

type IItem = Instance<typeof Item>;

export { Item };
export type { IItem };
