import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';

// api request to create a review
const handle: NextApiHandler = async (req, res) => {
  const { score, comment, title, itemId, imageUrl } = req.body;
  const result = await prisma.review.create({
    data: {
      title,
      rating: parseInt(score),
      comment,
      itemId,
      imageUrl,
    },
  });

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { _count: { select: { reviews: true } } },
  });

  if (item == null) {
    return res.json({});
  }

  const count = item._count.reviews - 1;
  const newRating = (count * item.rating + parseInt(score)) / (count + 1);

  await prisma.item.update({
    where: { id: itemId },
    data: { rating: newRating },
  });

  res.json(result);
};

export default handle;
