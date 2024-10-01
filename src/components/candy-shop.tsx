"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";

// お菓子のデータ型
type Candy = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function CandyShop() {
  const [candies, setCandies] = useState<Candy[]>([]);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCandies = async () => {
      const response = await fetch(`${apiUrl}/candies`);
      const data = await response.json();
      setCandies(data);
    };

    fetchCandies();
  }, [apiUrl]);

  const addToCart = (id: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { id, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const candy = candies.find((c) => c.id === item.id);
      return total + (candy ? candy.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">お菓子ショップ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candies.map((candy) => (
          <Card key={candy.id} className="flex flex-col">
            <CardHeader>
              <Image
                src={candy.image}
                alt={candy.name}
                width={200}
                height={200}
                className="mx-auto"
              />
              <CardTitle>{candy.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {candy.description}
              </p>
              <p className="font-bold">¥{candy.price}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-20"
                  id={`quantity-${candy.id}`}
                />
                <Button
                  onClick={() => {
                    const quantity = parseInt(
                      (
                        document.getElementById(
                          `quantity-${candy.id}`
                        ) as HTMLInputElement
                      ).value
                    );
                    addToCart(candy.id, quantity);
                  }}
                >
                  カートに追加
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" />
          カート
        </h2>
        {cart.map((item) => {
          const candy = candies.find((c) => c.id === item.id);
          return candy ? (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {candy.name} x {item.quantity}
              </span>
              <span>¥{candy.price * item.quantity}</span>
              <Button
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                削除
              </Button>
            </div>
          ) : null;
        })}
        <div className="text-xl font-bold mt-4">合計: ¥{getTotalPrice()}</div>
      </div>
    </div>
  );
}
