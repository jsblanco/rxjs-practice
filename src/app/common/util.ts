import { Observable } from 'rxjs';

export const createHttp$ = (route: string) => new Observable(observer => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch(route, {signal})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        observer.error('Request failed with status code: ' + response.status);
      }
    })
    .then(body => {
      observer.next(body);
      observer.complete();
    })
    .catch(err => observer.error(err));

  return ( () => controller.abort() );
});
