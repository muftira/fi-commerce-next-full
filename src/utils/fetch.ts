import axios from 'axios';
import { Login, Header } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchData<T>(
  fetchType: string,
  constApiUrl: string,
  objData?: T,
  formData: boolean = false
) {
  let header: Header = {
    'Content-Type': formData ? 'multipart/form-data' : 'application/json',
    AllowedOrigin: '*',
  };
  const fiCommerce = JSON.parse(localStorage.getItem('fiCommerce') ?? '{}');

  if (fiCommerce) {
    header = {
      'Content-Type': formData ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${fiCommerce.token}`,
      AllowedOrigin: '*',
    };
  }

  try {
    const response = await axios({
      url: baseUrl + constApiUrl,
      method: fetchType.toUpperCase(),
      headers: header,
      data: objData,
    });

    return {
      success: true,
      message: 'Success',
      data: response,
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'An unknown error occurred',
    };
  }
}
