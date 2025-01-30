import { create } from 'zustand';
import { collection, query, where, onSnapshot, deleteDoc, doc, Unsubscribe } from 'firebase/firestore';
import { db, auth } from './firebase';

export type Subscription = {
  id?: string;
  name: string;
  amount: number;
  cycle: "monthly" | "yearly";
  category: string;
  nextPayment: string;
  userId: string;
  createdAt: Date;
};

type SubscriptionStore = {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  setSubscriptions: (subscriptions: Subscription[]) => void;
  deleteSubscription: (id: string) => Promise<void>;
  initializeSubscriptionsListener: () => Unsubscribe | undefined;
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: [],
  addSubscription: (subscription) =>
    set((state) => ({
      subscriptions: [...state.subscriptions, subscription],
    })),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  deleteSubscription: async (id: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, "subscriptions", id));
  },
  initializeSubscriptionsListener: () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "subscriptions"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscriptions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Subscription[];
      
      set({ subscriptions });
    });

    return unsubscribe;
  },
})); 