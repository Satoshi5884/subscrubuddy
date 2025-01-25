import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock subscription data - this would come from your backend in a real app
  const subscriptions = [
    { name: "Netflix", amount: 1490, dueDate: new Date(2024, 2, 15) },
    { name: "Amazon Prime", amount: 4900, dueDate: new Date(2024, 5, 20) },
    { name: "Spotify", amount: 980, dueDate: new Date(2024, 2, 1) },
  ];

  // Highlight dates with payments
  const isDayWithPayment = (day: Date) => {
    return subscriptions.some(
      (sub) =>
        sub.dueDate.getDate() === day.getDate() &&
        sub.dueDate.getMonth() === day.getMonth()
    );
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>支払いカレンダー</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  payment: (date) => isDayWithPayment(date),
                }}
                modifiersStyles={{
                  payment: {
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    color: "rgb(220, 38, 38)",
                    fontWeight: "bold",
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>今月の支払い予定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <h4 className="font-medium">{sub.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {sub.dueDate.toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <p className="font-medium">¥{sub.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}