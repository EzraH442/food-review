import prisma from '@/lib/prisma';
import { transformNameToSlug } from '@/lib/utils-backend';
import { NextApiHandler } from 'next';
import { Prisma } from '@prisma/client';

// api request to create an item
const handle: NextApiHandler = async (req, res) => {
  const { name, imageUrl, tags } = req.body;
  const data: Prisma.Args<typeof prisma.item, 'create'>['data'] = {
    name,
    imageUrl: imageUrl ?? '',
    slug: transformNameToSlug(name),
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
  });
  res.json(result);
};

export default handle;
