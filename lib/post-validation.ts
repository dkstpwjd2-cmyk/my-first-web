export type PostFormErrors = {
  title?: string;
  content?: string;
};

export function validatePostForm(title: string, content: string) {
  const errors: PostFormErrors = {};
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    errors.title = "제목을 입력해주세요.";
  } else if (trimmedTitle.length < 2) {
    errors.title = "제목을 2자 이상 입력해주세요.";
  }

  if (!trimmedContent) {
    errors.content = "내용을 입력해주세요.";
  } else if (trimmedContent.length < 10) {
    errors.content = "내용을 10자 이상 입력해주세요.";
  }

  return errors;
}

export function hasPostFormErrors(errors: PostFormErrors) {
  return Boolean(errors.title || errors.content);
}
