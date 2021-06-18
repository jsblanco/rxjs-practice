import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttp$ } from '../common/util';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  backupCourses: Course[] = [{
    id: 1,
    description: 'Angular for Beginners',
    iconUrl: 'https://angular-academy.s3.amazonaws.com/thumbnails/angular2-for-beginners-small-v2.png',
    courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
    longDescription: 'Establish a solid layer of fundamentals, learn what\'s under the hood of Angular',
    category: 'BEGINNER',
    lessonsCount: 10
  }, {
    id: 2,
    description: 'Angular Security Course - Web Security Fundamentals',
    longDescription: 'Learn Web Security Fundamentals and apply them to defend an Angular / Node Application from multiple types of attacks.',
    iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/security-cover-small-v2.png',
    courseListIcon: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/lock-v2.png',
    category: 'ADVANCED',
    lessonsCount: 11
  }];

  constructor() {

  }

  ngOnInit() {
    const http$ = createHttp$('/api/courses');

    const courses$ = http$
      .pipe(
        catchError(err => {
          console.log('Error occurred: ' + err);
          // return of(this.backupCourses);
          return throwError(err);
        }),
        finalize(() => console.log('Finalize executed')),
        tap(() => console.log('Receiving HTTP response')),
        map(res => Object.values(res['payload'])),
        shareReplay(),
        // retryWhen(errors => errors.pipe(
        //   delayWhen(() => timer(2000))
        // ))
      )
    ;

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
