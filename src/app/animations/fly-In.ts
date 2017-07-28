import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const flyIn = trigger('flyIn', [
  state('in', style({
    'transform': 'translateX(0)',
    '-webkit-transform': 'translateX(0)',
    '-moz-transform': 'translateX(0)',
    '-ms-transform': 'translateX(0)',
    '-o-transform': 'translateX(0)',

  })),
  transition('void => *', [
    animate(500, keyframes([
      style({
        opacity: 0,
        transform: 'translateX(20%)',
        offset: 0,
        '-webkit-transform': 'translateX(20%)',
        '-moz-transform': 'translateX(20%)',
        '-ms-transform': 'translateX(20%)',
        '-o-transform': 'translateX(20%)',
      }),
      style({
        opacity: 1,
        transform: 'translateX(-25px)',
        offset: 0.3,
        '-webkit-transform': 'translateX(-25px)',
        '-moz-transform': 'translateX(-25px)',
        '-ms-transform': 'translateX(-25px)',
        '-o-transform': 'translateX(-25px)',
      }),
      style({
        opacity: 1,
        transform: 'translateX(0)',
        offset: 1.0,
        '-webkit-transform': 'translateX(0)',
        '-moz-transform':'translateX(0)',
        '-ms-transform': 'translateX(0)',
        '-o-transform': 'translateX(0)',
      })
    ]))
  ]),
  transition('* => void', [
    animate(800, keyframes([
      style({ 
        opacity: 1,
        transform: 'translateX(0)', 
        offset: 0 ,
        '-webkit-transform': 'translateX(0)',
        '-moz-transform':'translateX(0)',
        '-ms-transform': 'translateX(0)',
        '-o-transform': 'translateX(0)',
      }),
      style({ 
        opacity: 1,
        transform: 'translateX(25px)', 
        offset: 0.7 ,
        '-webkit-transform': 'translateX(25px)',
        '-moz-transform':'translateX(25px)',
        '-ms-transform': 'translateX(25px)',
        '-o-transform': 'translateX(25px)',
      }),
      style({ 
        opacity: 0, 
        transform: 'translateX(20%)', 
        offset: 1.0 
        ,'-webkit-transform': 'translateX(20%)',
        '-moz-transform':'translateX(20%)',
        '-ms-transform': 'translateX(20%)',
        '-o-transform': 'translateX(20%)',
      })
    ]))
  ])
]);