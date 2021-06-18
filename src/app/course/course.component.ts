import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { concat, fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttp$ } from '../common/util';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;


  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = createHttp$(`/api/courses/${this.courseId}`) as Observable<Course>;

  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    const initialLessons$ = this.loadLessons();
    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return ( createHttp$(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`) as Observable<Lesson[]> )
      .pipe(map(res => res['payload']));
  }


}
