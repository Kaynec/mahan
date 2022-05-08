import { store } from '@/store';
import axios from 'axios';
// import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';

const fetchWithAuthentication = (url) => {
  const headers = new Headers();
  if (store.getters.getMentorToken) {
    headers.set('token', store.getters.getMentorToken);
  } else if (store.getters.getStudentToken) {
    headers.set('token', store.getters.getStudentToken);
  }
  return fetch(url, { headers });
};

const fetchForAdmin = (url) => {
  const headers = new Headers();
  if (store.getters.getUserToken) {
    headers.set('token', store.getters.getUserToken);
  }
  return fetch(url, { headers });
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
};
const displayProtectedImage = async (imageUrl, imgRef) => {
  // Fetch the image.
  const response = await fetchWithAuthentication(imageUrl);
  // Convert the data to Base64 and build a data URL.
  const binaryData = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(binaryData);
  const dataUrl = `data:image/png;base64,${base64}`;
  imgRef.src = dataUrl;
  return dataUrl;
};

export const displayProtectedVideo = async (imageUrl) => {
  // Fetch the image.
  const response = await fetchWithAuthentication(imageUrl);
  // Convert the data to Base64 and build a data URL.
  const binaryData = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(binaryData);
  const dataUrl = `data:video/mp4;base64,${base64}`;
  return dataUrl;
};

export const returnProtectedImage = async (imageUrl: string) => {
  // Fetch the image.
  const response = await fetchWithAuthentication(imageUrl);
  // Convert the data to Base64 and build a data URL.
  const binaryData = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(binaryData);
  const dataUrl = `data:image/png;base64,${base64}`;
  return dataUrl;
};

export const returnAProtectedUrl = async (imageUrl: string) => {
  // Fetch the image.
  const response = await fetchWithAuthentication(imageUrl);
  // Create an object URL from the data.
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  return objectUrl;
};

export const returnAProtectedUrlAdmin = async (imageUrl: string) => {
  // Fetch the image.
  const response = await fetchForAdmin(imageUrl);
  // Create an object URL from the data.
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  return objectUrl;
};

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}
export const resizeImage = (settings: IResizeImageOptions) => {
  const file = settings.file;
  const maxSize = settings.maxSize;
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement('canvas') as any;
  const dataURItoBlob = (dataURI: string) => {
    const bytes =
      dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };
  const resize = () => {
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    return {
      base64: dataUrl,
      blob: dataURItoBlob(dataUrl)
    };
  };

  return new Promise((ok, no) => {
    if (!file.type.match(/image.*/)) {
      no(new Error('Not an image'));
      return;
    }

    reader.onload = (readerEvent: any) => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default displayProtectedImage;
