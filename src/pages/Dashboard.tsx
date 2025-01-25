import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { BarChart2, Calendar, CreditCard, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockSubscriptions = [
  { name: "Netflix", amount: 1490, cycle: "月額", nextPayment: "2024/03/15" },
  { name: "Amazon Prime", amount: 4900, cycle: "年額", nextPayment: "2024/06/20" },
  { name: "Spotify", amount: 980, cycle: "月額", nextPayment: "2024/03/01" },
];

export default function Dashboard() {
  const monthlyTotal = mockSubscriptions
    .filter(sub => sub.cycle === "月額")
    .reduce((acc, sub) => acc + sub.amount, 0);
  
  const yearlyTotal = mockSubscriptions
    .filter(sub => sub.cycle === "年額")
    .reduce((acc, sub) => acc + sub.amount, 0);

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
              <div className="text-2xl font-bold">{mockSubscriptions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">次回支払い</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/1</div>
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
                {mockSubscriptions.map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>¥{sub.amount.toLocaleString()}</TableCell>
                    <TableCell>{sub.cycle}</TableCell>
                    <TableCell>{sub.nextPayment}</TableCell>
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