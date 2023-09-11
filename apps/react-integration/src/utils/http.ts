const BASE_URL = 'http://localhost:3000/api';

export const httpPromise = (input: string, method: string, body?: any) => {
  return fetch(BASE_URL + input, {
    method,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error('Something went wrong');
  });
};
