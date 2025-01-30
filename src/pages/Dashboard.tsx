import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar } from "lucide-react";
import { useSubscriptionStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("monthly");
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

  const monthlyData = subscriptions
    .filter(sub => sub.cycle === "monthly")
    .map(sub => ({
      name: sub.name,
      value: sub.amount
    }));

  const yearlyData = subscriptions
    .filter(sub => sub.cycle === "yearly")
    .map(sub => ({
      name: sub.name,
      value: sub.amount
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <main className="container py-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2">
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

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>支出分布</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">月額</TabsTrigger>
                <TabsTrigger value="yearly">年額</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <div className="h-[300px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={monthlyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name}) => name}
                      >
                        {monthlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-sm text-muted-foreground">月額合計</div>
                    <div className="text-xl font-bold">¥{monthlyTotal.toLocaleString()}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="yearly">
                <div className="h-[300px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={yearlyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name}) => name}
                      >
                        {yearlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-sm text-muted-foreground">年額合計</div>
                    <div className="text-xl font-bold">¥{yearlyTotal.toLocaleString()}</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>サブスクリプション一覧</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-w-[calc(100vw-3rem)] md:max-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">サービス名</TableHead>
                    <TableHead className="whitespace-nowrap">金額</TableHead>
                    <TableHead className="whitespace-nowrap">支払いサイクル</TableHead>
                    <TableHead className="whitespace-nowrap">次回支払日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium whitespace-nowrap">{sub.name}</TableCell>
                      <TableCell className="whitespace-nowrap">¥{sub.amount.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap">{sub.cycle === "monthly" ? "月額" : "年額"}</TableCell>
                      <TableCell className="whitespace-nowrap">{new Date(sub.nextPayment).toLocaleDateString('ja-JP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}