import { Item } from '@prisma/client';

const makeItem = async (data: {
  name: string;
  diningHall: string;
  tags: string[];
}): Promise<Item> => {
  const { name, diningHall, tags } = data;
  const body = { name, diningHall };
  const params = new URLSearchParams(body);

  tags.forEach((t) => {
    params.append('tags', t);
  });

  return fetch('/api/item/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  }).then((res) => res.json());
};

export { makeItem };
