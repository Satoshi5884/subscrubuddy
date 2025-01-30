import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { BarChart2, Calendar, CreditCard, DollarSign } from "lucide-react";
import { useSubscriptionStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

export default function Dashboard() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const initializeSubscriptionsListener = useSubscriptionStore(
    (state) => state.initializeSubscriptionsListener
  );

  useEffect(() => {
    const unsubscribe = initializeSubscriptionsListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeSubscriptionsListener]);

  const monthlyTotal = subscriptions
    .filter(sub => sub.cycle === "monthly")
    .reduce((acc, sub) => acc + sub.amount, 0);
  
  const yearlyTotal = subscriptions
    .filter(sub => sub.cycle === "yearly")
    .reduce((acc, sub) => acc + sub.amount, 0);

  const nextPaymentDate = subscriptions
    .map(sub => new Date(sub.nextPayment))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <>
      <Header />
      <main className="container py-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">月額合計</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{monthlyTotal.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">年額合計</CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{yearlyTotal.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">登録サービス</CardTitle>
              <BarChart2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">次回支払い</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextPaymentDate ? nextPaymentDate.toLocaleDateString('ja-JP') : '-'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>サブスクリプション一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サービス名</TableHead>
                  <TableHead>金額</TableHead>
                  <TableHead>支払いサイクル</TableHead>
                  <TableHead>次回支払日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>¥{sub.amount.toLocaleString()}</TableCell>
                    <TableCell>{sub.cycle === "monthly" ? "月額" : "年額"}</TableCell>
                    <TableCell>{new Date(sub.nextPayment).toLocaleDateString('ja-JP')}</TableCell>
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