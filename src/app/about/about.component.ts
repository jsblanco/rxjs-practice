import { Component, OnInit } from '@angular/core';
import { concat, of } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const source1 = of(1, 2, 3);
    const source2 = of(3, 4, 5, 6);
    const source3 = of(6, 7, 8, 9);

    const result$ = concat(source1, source2, source3);

    result$.subscribe(console.log);



    // const insterval$ = timer(3000, 5000);
    // insterval$.subscribe(event => console.log(event + ' interval'));
    // const click$ = fromEvent(document, 'click');
    // click$.subscribe(
    //   event => { console.log(event); },
    //   err => { console.error(err); },
    //   () => { console.log('Completed stream'); },
    // );


  }

}
