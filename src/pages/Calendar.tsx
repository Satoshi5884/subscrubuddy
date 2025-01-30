import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useSubscriptionStore, type Subscription } from "@/lib/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface DisplaySubscription extends Subscription {
  isEndOfMonth?: boolean;
}

interface PaymentDay {
  date: Date;
  subscriptions: DisplaySubscription[];
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
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

  // 今後12ヶ月分の支払い予定日を生成
  const generateFuturePayments = () => {
    const futurePayments: PaymentDay[] = [];
    const today = new Date();
    
    subscriptions.forEach((sub) => {
      let baseDate = new Date(sub.nextPayment);
      const originalDay = baseDate.getDate(); // 元の支払日を保存
      
      // 支払いサイクルに基づいて生成する回数を決定
      const cycles = sub.cycle === 'monthly' ? 12 : 1;
      
      // 支払い日を生成
      for (let i = 0; i < cycles; i++) {
        const paymentDate = new Date(baseDate);
        paymentDate.setDate(1); // 一時的に1日に設定
        
        // 月額の場合は毎月、年額の場合は1年後
        if (sub.cycle === 'monthly') {
          paymentDate.setMonth(baseDate.getMonth() + i);
        } else {
          paymentDate.setFullYear(baseDate.getFullYear() + i);
          paymentDate.setMonth(baseDate.getMonth());
        }
        
        // 月末の日付調整
        const lastDayOfMonth = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0).getDate();
        
        // 元の支払日が31日の場合のみ処理
        if (originalDay === 31) {
          // その月の最終日を設定
          paymentDate.setDate(lastDayOfMonth);
        } else {
          // 通常の日付を設定（ただし、その月の最終日を超える場合は最終日に設定）
          paymentDate.setDate(Math.min(originalDay, lastDayOfMonth));
        }

        // 今日以降の支払いのみを追加
        if (paymentDate >= today) {
          const existingPayment = futurePayments.find(
            (p) => p.date.toDateString() === paymentDate.toDateString()
          );

          const subscriptionWithFlags: DisplaySubscription = {
            ...sub,
            isEndOfMonth: originalDay === 31 && paymentDate.getDate() !== originalDay,
          };

          if (existingPayment) {
            existingPayment.subscriptions.push(subscriptionWithFlags);
          } else {
            futurePayments.push({
              date: paymentDate,
              subscriptions: [subscriptionWithFlags],
            });
          }
        }
      }
    });

    return futurePayments.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Highlight dates with payments
  const isDayWithPayment = (day: Date) => {
    return generateFuturePayments().some(
      (payment) => payment.date.toDateString() === day.toDateString()
    );
  };

  const futurePayments = generateFuturePayments();

  // 特定の日付の支払い情報を取得する関数
  const getPaymentInfo = (day: Date) => {
    return futurePayments.find(
      (payment) => payment.date.toDateString() === day.toDateString()
    );
  };

  // ツールチップの内容を生成する関数
  const generateTooltipContent = (day: Date) => {
    const paymentInfo = getPaymentInfo(day);
    if (!paymentInfo) return null;

    const total = paymentInfo.subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    return (
      <div className="p-2">
        <p className="font-bold mb-2">支払い予定: ¥{total.toLocaleString()}</p>
        {paymentInfo.subscriptions.map((sub, index) => (
          <div key={index} className="text-sm">
            <span>{sub.name}</span>
            <span className="ml-2">¥{sub.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  // 日付選択時の処理を追加
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const paymentInfo = getPaymentInfo(selectedDate);
      if (paymentInfo) {
        const total = paymentInfo.subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
        const subscriptionList = paymentInfo.subscriptions
          .map(sub => `${sub.name}: ¥${sub.amount.toLocaleString()}`)
          .join('\n');
        
        toast({
          title: `${selectedDate.toLocaleDateString('ja-JP')}の支払い予定`,
          description: `合計: ¥${total.toLocaleString()}\n${subscriptionList}`,
        });
      }
    }
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
              <TooltipProvider>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
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
                  components={{
                    DayContent: (props) => {
                      const tooltipContent = generateTooltipContent(props.date);
                      if (!tooltipContent) {
                        return <div>{props.date.getDate()}</div>;
                      }
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>{props.date.getDate()}</div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black text-white border-black">
                            {tooltipContent}
                          </TooltipContent>
                        </Tooltip>
                      );
                    },
                  }}
                />
              </TooltipProvider>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>今後12ヶ月の支払い予定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {futurePayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-2 border-b pb-4 last:border-0"
                  >
                    <div className="font-medium text-sm text-muted-foreground">
                      {payment.date.toLocaleDateString("ja-JP")}
                    </div>
                    {payment.subscriptions.map((sub, subIndex) => (
                      <div
                        key={`${index}-${subIndex}`}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-medium">{sub.name}</h4>
                          <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                              {sub.cycle === "monthly" ? "月額" : "年額"}
                            </p>
                            {sub.isEndOfMonth && (
                              <p className="text-xs text-muted-foreground">
                                ※月末日に調整されました
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">¥{sub.amount.toLocaleString()}</p>
                      </div>
                    ))}
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