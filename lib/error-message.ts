const allowedUserMessages = new Set([
  "이 작업을 수행할 권한이 없습니다.",
  "인터넷 연결을 확인해주세요.",
  "요청한 게시글을 찾을 수 없습니다.",
  "이메일 또는 비밀번호를 확인해주세요.",
  "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
  "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  "제목을 입력해주세요.",
  "제목을 2자 이상 입력해주세요.",
  "내용을 입력해주세요.",
  "내용을 10자 이상 입력해주세요.",
  "입력값을 확인해주세요.",
]);

export function getFriendlyErrorMessage(error: unknown) {
  const message = getErrorText(error).toLowerCase();

  if (
    message.includes("42501") ||
    message.includes("row-level security") ||
    message.includes("rls") ||
    message.includes("permission denied")
  ) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("network")
  ) {
    return "인터넷 연결을 확인해주세요.";
  }

  if (
    message.includes("not found") ||
    message.includes("not_found") ||
    message.includes("no rows") ||
    message.includes("pgrst116")
  ) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return "이메일 또는 비밀번호를 확인해주세요.";
  }

  if (message.includes("jwt") || message.includes("session")) {
    return "로그인 세션이 만료되었습니다. 다시 로그인해주세요.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

export function getSafeUserMessage(message: string | null | undefined) {
  if (!message) {
    return null;
  }

  const decodedMessage = safeDecode(message);

  if (allowedUserMessages.has(decodedMessage)) {
    return decodedMessage;
  }

  return getFriendlyErrorMessage(decodedMessage);
}

function getErrorText(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeMessage = "message" in error ? error.message : null;
    const maybeCode = "code" in error ? error.code : null;
    return [maybeCode, maybeMessage].filter(Boolean).join(" ");
  }

  return "";
}

function safeDecode(message: string) {
  try {
    return decodeURIComponent(message);
  } catch {
    return message;
  }
}
