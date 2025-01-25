import { Link } from "react-router-dom";
import { ArrowRight, Calendar, DollarSign, BarChart2, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
        <div className="container flex h-14 items-center justify-between">
          <span className="font-bold text-xl tracking-tight">SubsManager</span>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105"
          >
            ダッシュボードへ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container space-y-6 py-24 md:py-32 lg:py-40">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center rounded-full bg-accent px-6 py-2 text-sm font-medium text-accent-foreground">
              <Sparkles className="mr-2 h-4 w-4" />
              サブスクリプション管理をシンプルに
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              サブスクリプション管理を、
              <br />
              シンプルに美しく。
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              月額・年額の支払いをスマートに管理。
              <br />
              カレンダーとダッシュボードで一目瞭然に。
            </p>
            <div className="space-x-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105"
              >
                無料で始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-xl bg-gradient-to-b from-white to-gray-50 p-6">
                <Calendar className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">カレンダービュー</h3>
                  <p className="text-muted-foreground">支払日を色分けして表示</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-xl bg-gradient-to-b from-white to-gray-50 p-6">
                <DollarSign className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">支払い管理</h3>
                  <p className="text-muted-foreground">月額・年額を自動集計</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-xl bg-gradient-to-b from-white to-gray-50 p-6">
                <BarChart2 className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">ダッシュボード</h3>
                  <p className="text-muted-foreground">支払い予定を可視化</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}