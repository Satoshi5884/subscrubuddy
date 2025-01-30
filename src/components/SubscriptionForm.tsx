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
import { collection, addDoc } from "firebase/firestore";

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
}

export function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
                  <SelectItem value="entertainment" className="select-item">エンターテイメント</SelectItem>
                  <SelectItem value="shopping" className="select-item">ショッピング</SelectItem>
                  <SelectItem value="music" className="select-item">音楽</SelectItem>
                  <SelectItem value="utility" className="select-item">ユーティリティ</SelectItem>
                  <SelectItem value="other" className="select-item">その他</SelectItem>
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

        <Button type="submit">登録する</Button>
      </form>
    </Form>
  );
}