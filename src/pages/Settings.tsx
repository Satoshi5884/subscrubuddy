import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where } from "firebase/firestore";

interface Category {
  id: string;
  name: string;
  userId: string;
}

export function Settings() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "categories"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      setCategories(categoriesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !auth.currentUser) return;
    
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });
      
      setNewCategory("");
      toast({
        title: "カテゴリを追加しました",
        description: `${newCategory}を追加しました。`
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "カテゴリの追加に失敗しました。",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      toast({
        title: "カテゴリを削除しました",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "カテゴリの削除に失敗しました。",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategory.trim() || !auth.currentUser) return;
    
    try {
      await updateDoc(doc(db, "categories", editingCategory.id), {
        name: newCategory.trim(),
        updatedAt: new Date()
      });
      
      setEditingCategory(null);
      setNewCategory("");
      toast({
        title: "カテゴリを更新しました",
        description: `カテゴリ名を更新しました。`
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "カテゴリの更新に失敗しました。",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">設定</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">カテゴリ管理</h2>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="新しいカテゴリ名"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          {editingCategory ? (
            <Button onClick={handleUpdateCategory}>更新</Button>
          ) : (
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              追加
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-2 bg-secondary rounded">
              <span>{category.name}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 