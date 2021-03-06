import qs from 'qs';
import { isEmpty } from 'lodash/fp';
import HttpStatus from 'http-status-codes';

export const apiRequest = ({
  url,
  method,
  data,
  onSuccess,
  onError,
  onFinish
}) => {
  let request = null;

  if (method === 'GET') {
    let path = url;
    if (!isEmpty(data)) {
      path += '?' + qs.stringify(data);
    }
    request = fetch(path);
  }

  if (!request) {
    return;
  }

  request.then(response => {
    if (response.ok) {
      return response.json().then(json => {
        onSuccess(json);
        onFinish();
      });
    } else {
      const text = HttpStatus.getStatusText(response.status);
      throw new Error(text);
    }
  }).catch(error => {
    console.log(url, error);
    onError(error.message);
    onFinish();
  });
}