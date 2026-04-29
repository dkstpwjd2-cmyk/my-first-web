import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          이메일로 계정을 만들고 블로그 글을 작성해 보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              사용자 이름
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="홍길동"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="8자 이상"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              비밀번호 확인
            </label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            가입하기
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?&nbsp;
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          로그인
        </Link>
      </CardFooter>
    </Card>
  );
}
