"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>문제가 발생했습니다</CardTitle>
        <CardDescription>
          화면을 불러오는 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해
          주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" onClick={reset}>
          다시 시도
        </Button>
      </CardContent>
    </Card>
  );
}
