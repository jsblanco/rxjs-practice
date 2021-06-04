import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttp$ } from '../common/util';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {

  }

  ngOnInit() {
    const http$ = createHttp$('/api/courses');

    const courses$ = http$
      .pipe(
        tap(),
        map(res => Object.values(res['payload'])),
        shareReplay()
      );

    this.beginnerCourses$ = courses$
      .pipe(
        map((courses: Course[]) => courses.filter(course => course.category === 'BEGINNER'))
      );

    this.advancedCourses$ = courses$
      .pipe(
        map((courses: Course[]) => courses.filter(course => course.category === 'ADVANCED'))
      );

    // courses$.subscribe(
    //   courses => {
    //     this.beginnerCourses = courses.filter(course => course.category == 'BEGINNER');
    //     this.advancedCourses = courses.filter(course => course.category == 'ADVANCED');
    //   },
    //   noop,
    //   () => console.log('Completed')
    // );
  }

}
