/**
 * URL로부터 파일 갖고와서 생성
 * @param url 파일 경로 URL
 * @param name 파일 이름
 * @param contentType 파일 타입 (예, 'image/jpeg')
 * @returns
 */
export const createFile = async (
  url: string,
  name: string,
  contentType: string
) => {
  let data: string | Blob = "";
  if (url) {
    const response = await fetch(url);
    data = await response.blob();
  }

  const file = new File([data], name, { type: contentType });
  return file;
};

/**
 * 폼 유효성 체크
 */
export const validation = {
  image: (image: File, isChanged: boolean = false) => {
    if (image.size === 0 && image.name === "" && isChanged) return false;
    return true;
  },
  array: (arr: object[]) => {
    if (arr.length === 0) return false;
    else return true;
  },
};
