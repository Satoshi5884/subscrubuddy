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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2, Edit, ArrowUpDown, Search } from "lucide-react";
import { useSubscriptionStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { addDoc, collection, updateDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import "../styles/dropdown-override.css";

interface Category {
  id: string;
  name: string;
  isDefault?: boolean;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "entertainment", name: "エンターテイメント", isDefault: true },
  { id: "shopping", name: "ショッピング", isDefault: true },
  { id: "music", name: "音楽", isDefault: true },
  { id: "utility", name: "ユーティリティ", isDefault: true },
  { id: "other", name: "その他", isDefault: true },
];

export default function Subscriptions() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const initializeSubscriptionsListener = useSubscriptionStore(
    (state) => state.initializeSubscriptionsListener
  );
  const deleteSubscription = useSubscriptionStore((state) => state.deleteSubscription);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "categories"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      setCategories([...DEFAULT_CATEGORIES, ...userCategories]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = initializeSubscriptionsListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeSubscriptionsListener]);

  // カテゴリー名を取得する関数
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "不明";
  };

  const filteredAndSortedSubscriptions = subscriptions
    .filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || sub.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (sortDirection === "asc") {
        return String(aValue).localeCompare(String(bValue));
      }
      return String(bValue).localeCompare(String(aValue));
    });

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
    
    if (editingSubscription) {
      await updateDoc(doc(db, "subscriptions", editingSubscription.id), {
        ...subscription,
        updatedAt: new Date(),
      });
      setEditingSubscription(null);
    } else {
      await addDoc(collection(db, "subscriptions"), {
        ...subscription,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
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
              <CardTitle>
                <span className="hidden md:inline">サブスクリプション一覧</span>
                <span className="md:hidden">サブスク一覧</span>
              </CardTitle>
              <CardDescription>
                <span className="hidden md:inline">登録済みのサブスクリプションサービス</span>
                <span className="md:hidden">登録済みサービス</span>
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新規登録
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingSubscription ? "サブスクリプション編集" : "サブスクリプション登録"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSubscription
                      ? "サブスクリプションサービスを編集します。"
                      : "新しいサブスクリプションサービスを登録します。"}
                  </DialogDescription>
                </DialogHeader>
                <SubscriptionForm
                  onSubmit={handleSubscriptionSubmit}
                  initialData={editingSubscription}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="サービス名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                prefix={<Search className="h-4 w-4" />}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  カテゴリーフィルター
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dropdown-content">
                <DropdownMenuItem onClick={() => setSelectedCategory("all")} className="dropdown-item">
                  すべて
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="dropdown-item font-semibold">
                  デフォルトカテゴリー
                </DropdownMenuItem>
                {categories
                  .filter(category => category.isDefault)
                  .map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="dropdown-item pl-6"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                
                {categories.filter(category => !category.isDefault).length > 0 && (
                  <>
                    <DropdownMenuItem disabled className="dropdown-item font-semibold">
                      カスタムカテゴリー
                    </DropdownMenuItem>
                    {categories
                      .filter(category => !category.isDefault)
                      .map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className="dropdown-item pl-6"
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer whitespace-nowrap">
                    サービス名 <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead onClick={() => handleSort("amount")} className="cursor-pointer whitespace-nowrap">
                    金額 <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead onClick={() => handleSort("cycle")} className="cursor-pointer whitespace-nowrap">
                    支払いサイクル <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead onClick={() => handleSort("category")} className="cursor-pointer whitespace-nowrap">
                    カテゴリー <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead onClick={() => handleSort("nextPayment")} className="cursor-pointer whitespace-nowrap">
                    次回支払日 <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSubscriptions.map((subscription, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {subscription.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">¥{subscription.amount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap">{subscription.cycle === "monthly" ? "月額" : "年額"}</TableCell>
                    <TableCell className="whitespace-nowrap">{getCategoryName(subscription.category)}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(subscription.nextPayment).toLocaleDateString('ja-JP')}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingSubscription(subscription)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>サブスクリプション編集</DialogTitle>
                              <DialogDescription>
                                サブスクリプションサービスを編集します。
                              </DialogDescription>
                            </DialogHeader>
                            <SubscriptionForm
                              onSubmit={handleSubscriptionSubmit}
                              initialData={subscription}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(subscription.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}