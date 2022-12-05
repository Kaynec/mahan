import { store } from '@/store';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { StudentBasketApi } from './services/student/student-basket-service';

export const getBasketInfo = async () => {
  try {
    const resPromise = await StudentBasketApi.get();

    return resPromise.data;
  } catch (error) {}
};

export const updateCount = async () => {
  const res = await getBasketInfo();

  let quantity = 0;

  res.data.items.forEach((item) => {
    if (item) {
      quantity += 1;
    }
  });
  res.data.bundles.forEach((item) => {
    if (item) {
      quantity += 1;
    }
  });
  res.data.sessions.forEach((item) => {
    if (item) {
      quantity += 1;
    }
  });

  store.commit(StudentMutationTypes.SET_BASKET_COUNT, quantity);
};

export const addSessionToBasket = async (session, DELETE_REQUEST = false) => {
  const objectToSend = { session: { _id: session._id } };

  //   remove
  if (session.exists || DELETE_REQUEST) {
    try {
      await StudentBasketApi.removeSession(session._id);

      session.exists = false;
      store.commit(
        StudentMutationTypes.SET_BASKET_COUNT,
        store.state.students.BasketCount - 1
      );
      return;
    } catch (error) {
      console.log(error);
    }
  }

  //   add

  try {
    await StudentBasketApi.addSession(objectToSend);

    store.commit(
      StudentMutationTypes.SET_BASKET_COUNT,
      store.state.students.BasketCount + 1
    );

    session.exists = true;
  } catch (error) {
    console.log(error);
  }
};

export const itemExistsInBasket = async (
  allItems: any[],
  productType: 'session' | 'productbundle' | 'product'
) => {
  const res = await getBasketInfo();
  const convertedItems = allItems;

  let listType = '';

  if (productType === 'productbundle') listType = 'bundles';
  if (productType === 'session') listType = 'sessions';
  if (productType === 'product') listType = 'items';

  res.data[listType].forEach((element) => {
    const Index = convertedItems.findIndex(
      (el) => el._id === element[productType]._id
    );
    if (Index < 0) return;
    convertedItems[Index].exists = true;
  });
  return convertedItems;
};
