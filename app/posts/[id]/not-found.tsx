import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PostNotFound() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>게시글을 찾을 수 없습니다</CardTitle>
        <CardDescription>
          주소가 잘못되었거나 삭제된 게시글일 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
