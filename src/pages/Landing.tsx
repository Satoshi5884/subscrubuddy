import { Link } from "react-router-dom";
import { ArrowRight, Calendar, DollarSign, BarChart2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <span className="font-bold">SubsManager</span>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            ダッシュボードへ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              サブスクリプション管理を、
              <span className="text-primary">シンプル</span>に。
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              月額・年額の支払いをスマートに管理。カレンダーとダッシュボードで一目瞭然に。
            </p>
          </div>
        </section>

        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Calendar className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">カレンダービュー</h3>
                  <p className="text-sm text-muted-foreground">支払日を色分けして表示</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <DollarSign className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">支払い管理</h3>
                  <p className="text-sm text-muted-foreground">月額・年額を自動集計</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BarChart2 className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">ダッシュボード</h3>
                  <p className="text-sm text-muted-foreground">支払い予定を可視化</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}