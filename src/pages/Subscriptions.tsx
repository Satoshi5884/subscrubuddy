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
import { CreditCard, Plus } from "lucide-react";

export default function Subscriptions() {
  // Mock subscription data - this would come from your backend in a real app
  const subscriptions = [
    {
      name: "Netflix",
      amount: 1490,
      cycle: "月額",
      category: "エンターテイメント",
      nextPayment: "2024/03/15",
    },
    {
      name: "Amazon Prime",
      amount: 4900,
      cycle: "年額",
      category: "ショッピング",
      nextPayment: "2024/06/20",
    },
    {
      name: "Spotify",
      amount: 980,
      cycle: "月額",
      category: "音楽",
      nextPayment: "2024/03/01",
    },
  ];

  const totalMonthly = subscriptions
    .filter((sub) => sub.cycle === "月額")
    .reduce((acc, sub) => acc + sub.amount, 0);

  const totalYearly = subscriptions
    .filter((sub) => sub.cycle === "年額")
    .reduce((acc, sub) => acc + sub.amount, 0);

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
                  <SubscriptionForm />
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {subscription.name}
                    </TableCell>
                    <TableCell>¥{subscription.amount.toLocaleString()}</TableCell>
                    <TableCell>{subscription.cycle}</TableCell>
                    <TableCell>{subscription.category}</TableCell>
                    <TableCell>{subscription.nextPayment}</TableCell>
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