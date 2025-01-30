import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import '../styles/select-override.css';
import { useSubscriptionStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "サービス名を入力してください"),
  amount: z.string().min(1, "金額を入力してください"),
  cycle: z.enum(["monthly", "yearly"], {
    required_error: "支払いサイクルを選択してください",
  }),
  category: z.string({
    required_error: "カテゴリーを選択してください",
  }),
  nextPayment: z.string().min(1, "次回支払日を入力してください"),
});

interface SubscriptionFormProps {
  onSubmit?: (subscription: any) => Promise<void>;
  initialData?: {
    name: string;
    amount: number;
    cycle: "monthly" | "yearly";
    category: string;
    nextPayment: string;
  };
}

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

export function SubscriptionForm({ onSubmit, initialData }: SubscriptionFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      amount: String(initialData.amount),
      cycle: initialData.cycle,
      category: initialData.category,
      nextPayment: initialData.nextPayment,
    } : {
      name: "",
      amount: "",
      cycle: "monthly",
      category: "",
      nextPayment: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!auth.currentUser) {
        toast({
          title: "エラーが発生しました",
          description: "ログインが必要です",
          variant: "destructive",
        });
        return;
      }

      const subscription = {
        name: values.name,
        amount: Number(values.amount),
        cycle: values.cycle,
        category: values.category,
        nextPayment: values.nextPayment,
      };

      if (onSubmit) {
        await onSubmit(subscription);
      } else {
        const subscriptionData = {
          ...subscription,
          userId: auth.currentUser.uid,
          createdAt: new Date(),
        };
        await addDoc(collection(db, "subscriptions"), subscriptionData);
        addSubscription(subscriptionData);
      }

      toast({
        title: "サブスクリプションを登録しました",
        description: `${values.name}を登録しました`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast({
        title: "エラーが発生しました",
        description: "サブスクリプションの登録に失敗しました",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サービス名</FormLabel>
              <FormControl>
                <Input placeholder="Netflix" {...field} />
              </FormControl>
              <FormDescription>
                登録するサブスクリプションサービスの名前
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>金額</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1490" {...field} />
              </FormControl>
              <FormDescription>月額または年額の金額</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cycle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>支払いサイクル</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="monthly" />
                    </FormControl>
                    <FormLabel className="font-normal">月額</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yearly" />
                    </FormControl>
                    <FormLabel className="font-normal">年額</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリー</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="select-content">
                  <SelectItem value="_header" disabled>カテゴリーを選択</SelectItem>
                  <SelectItem value="_default_header" disabled className="select-item font-semibold">
                    デフォルトカテゴリー
                  </SelectItem>
                  {categories
                    .filter(category => category.isDefault)
                    .map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id} 
                        className="select-item pl-6"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  
                  {categories.filter(category => !category.isDefault).length > 0 && (
                    <>
                      <SelectItem value="_custom_header" disabled className="select-item font-semibold">
                        カスタムカテゴリー
                      </SelectItem>
                      {categories
                        .filter(category => !category.isDefault)
                        .map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id} 
                            className="select-item pl-6"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                サブスクリプションのカテゴリーを選択
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nextPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>次回支払日</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>次回の支払予定日</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{initialData ? "更新する" : "登録する"}</Button>
      </form>
    </Form>
  );
}