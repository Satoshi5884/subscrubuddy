import { Header } from "@/components/Header";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useSubscriptionStore } from "@/lib/store";
import { useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function Subscriptions() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const initializeSubscriptionsListener = useSubscriptionStore(
    (state) => state.initializeSubscriptionsListener
  );
  const deleteSubscription = useSubscriptionStore((state) => state.deleteSubscription);

  useEffect(() => {
    const unsubscribe = initializeSubscriptionsListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeSubscriptionsListener]);

  const totalMonthly = subscriptions
    .filter((sub) => sub.cycle === "monthly")
    .reduce((acc, sub) => acc + sub.amount, 0);

  const totalYearly = subscriptions
    .filter((sub) => sub.cycle === "yearly")
    .reduce((acc, sub) => acc + sub.amount, 0);

  const handleDelete = async (id: string) => {
    if (!id) return;
    await deleteSubscription(id);
  };

  const handleSubscriptionSubmit = async (subscription: any) => {
    if (!auth.currentUser) return;
    
    await addDoc(collection(db, "subscriptions"), {
      ...subscription,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">月額合計</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ¥{totalMonthly.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">年額合計</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ¥{totalYearly.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>サブスクリプション一覧</CardTitle>
                <CardDescription>
                  登録済みのサブスクリプションサービス
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    <Plus className="mr-2 h-4 w-4" />
                    新規登録
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>サブスクリプション登録</DialogTitle>
                    <DialogDescription>
                      新しいサブスクリプションサービスを登録します。
                    </DialogDescription>
                  </DialogHeader>
                  <SubscriptionForm onSubmit={handleSubscriptionSubmit} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サービス名</TableHead>
                  <TableHead>金額</TableHead>
                  <TableHead>支払いサイクル</TableHead>
                  <TableHead>カテゴリー</TableHead>
                  <TableHead>次回支払日</TableHead>
                  <TableHead>削除</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {subscription.name}
                    </TableCell>
                    <TableCell>¥{subscription.amount.toLocaleString()}</TableCell>
                    <TableCell>{subscription.cycle === "monthly" ? "月額" : "年額"}</TableCell>
                    <TableCell>{subscription.category === "entertainment" ? "エンターテイメント" :
                              subscription.category === "shopping" ? "ショッピング" :
                              subscription.category === "music" ? "音楽" :
                              subscription.category === "utility" ? "ユーティリティ" : "その他"}</TableCell>
                    <TableCell>{new Date(subscription.nextPayment).toLocaleDateString('ja-JP')}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(subscription.id!)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/90 h-10 px-4 py-2"
                      >
                        <Trash2 className="h-4 w-4 text-destructive-foreground" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}