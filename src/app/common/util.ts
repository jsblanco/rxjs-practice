import { Observable } from 'rxjs';

export const createHttp$ = (route: string) => new Observable(observer => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch(route, {signal})
    .then(response => response.json())
    .then(body => {
      observer.next(body);
      observer.complete();
    })
    .catch(err => observer.error(err));

  return (() => controller.abort());
});

