import prisma from '@/lib/prisma';
import { transformNameToSlug } from '@/lib/utils-backend';
import { NextApiHandler } from 'next';
import { Prisma } from '@prisma/client';

// api request to create an item
const handle: NextApiHandler = async (req, res) => {
  const { name, tags, diningHall } = req.body;
  const data: Prisma.Args<typeof prisma.item, 'create'>['data'] = {
    name,
    slug: await transformNameToSlug(name),
    diningHallId: diningHall,
  };

  if (tags && Array.isArray(tags)) {
    data.tags = {
      create: tags.map((t) => {
        return { tagId: t };
      }),
    };
  }

  const result = await prisma.item.create({
    data,
    include: {
      tags: true,
      _count: { select: { reviews: true } },
      diningHall: true,
      reviews: true,
    },
  });

  res.json(result);
};

export default handle;
