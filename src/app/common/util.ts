import { Observable } from 'rxjs';

export const createHttp$ = (route: string) => new Observable(observer => {
  fetch(route)
    .then(response => response.json())
    .then(body => {
      observer.next(body);
      observer.complete();
    })
    .catch(err => observer.error(err));
});

