import { Item } from '@prisma/client';
import { useEffect, useState } from 'react';
import { UseItemsItem } from './useItems';

type _S = { slug: string };
type _I = { itemId: string };
type UseItemParams = _S | _I;

const emptyItem: UseItemsItem = {
  id: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '',
  rating: 0,
  slug: '',
  verified: false,
  diningHallId: '',
  reviews: [],
  tags: [],
  diningHall: { id: '', name: '' },
};

const useItem = (params: UseItemParams) => {
  const [loading, setLoading] = useState(false);
  const [item, setItems] = useState<UseItemsItem>(emptyItem);
  const [error, setError] = useState('');

  const refetch = () => {
    setLoading(true);
    setError('');

    const queryParams = new URLSearchParams(params);

    fetch(`/api/item/get?${queryParams}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refetch, [params.slug, params.itemId]);

  return { loading, item, error, refetch };
};

export default useItem;
